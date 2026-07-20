<template>
    <data-table-page
        ref="dataTablePageRef"
        permissions="ignore"
        title="目前登入的裝置"
        :confirm-delete-message="(row) => `確定要刪除 ${parseDataToDeviceColumnText(row)} (${row.lastActiveIp}) 嗎？`"
        :crud-api="ProfileSecuritySessionApi.use()"
        :disable-row-delete-btn-rule="(row) => row.isCurrent"
        hide-add-data-btn
        hide-edit-btn
        hide-footer
        hide-timestamp-columns
    >
        <template #toolbar-actions-append>
            <el-button @click="isScanLoginQrCodeDialogVisible = true">
                掃描登入QR Code
            </el-button>
            <el-button @click="confirmLogoutAllSessions">
                登出所有裝置
            </el-button>
        </template>
        <template #table>
            <el-table-column
                label="裝置"
                :formatter="(row: AuthenticationSessionListItemData) => parseDataToDeviceColumnText(row)"
            />
            <el-table-column
                label="最後活動IP"
                prop="lastActiveIp"
            />
            <el-table-datetime-column
                field="lastActiveAt"
                label="最後活動時間"
            />
            <el-table-column
                label="登入IP"
                prop="loginIp"
            />
            <el-table-datetime-column
                field="loggedAt"
                label="登入時間"
            />
        </template>
        <el-dialog
            v-model="isScanLoginQrCodeDialogVisible"
            :width="elDialogWidthByWindowSize"
            align-center
            append-to-body
            center
            @closed="stopScanLoginQrCode"
            @open="startScanLoginQrCode"
        >
            <div class="text-center">
                <p class="fs-24px">
                    請掃描登入畫面上的QR Code
                </p>
                <div class="mt-4 flex flex-col items-center">
                    <aspect-ratio
                        class="size-max-[400px] rounded-[10px]"
                        :ratio="1"
                    >
                        <div>
                            <div
                                id="login-qr-code-scanner"
                                class="size-full"
                            />
                            <status-overlay ref="loginQrCodeScannerStatusOverlayRef" />
                        </div>
                    </aspect-ratio>
                    <el-select
                        v-model="loginQrCodeScannerSelectedCameraId"
                        class="mt-1 max-w-[400px]"
                        :disabled="
                            loginQrCodeScannerStatusOverlayRef?.isVisible
                                && loginQrCodeScannerStatusOverlayRef?.status !== 'error'
                        "
                        @change="startScanLoginQrCodeScanner"
                    >
                        <el-option
                            v-for="camera in loginQrCodeScannerCameras"
                            :key="camera.id"
                            :label="camera.label"
                            :value="camera.id"
                        />
                    </el-select>
                </div>
            </div>
        </el-dialog>
    </data-table-page>
</template>

<script lang="ts" setup>
import type {
    AuthenticationSessionListItemData,
    AuthenticationSessionQrCodeLoginApprovalRequestData,
} from '@kiki-core-stack/pack/types/data/authentication-session';
import Bowser from 'bowser';
import {
    Html5Qrcode,
    Html5QrcodeScannerState,
} from 'html5-qrcode';
import type { CameraDevice } from 'html5-qrcode';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
let html5QrCode: Html5Qrcode | undefined;
const isScanLoginQrCodeDialogVisible = ref(false);
let loginQrCodeApprovalRequestAbortController: AbortController | undefined;
const loginQrCodeScannerCameras = useLocalStorage<CameraDevice[]>('loginQrCodeScannerCameras', () => []);
let loginQrCodeScannerGeneration = 0;
let loginQrCodeScannerResumeTimeout: NodeJS.Timeout | undefined;
const loginQrCodeScannerSelectedCameraId = useLocalStorage<null | string>(
    'loginQrCodeScannerSelectedCameraId',
    null,
);

const loginQrCodeScannerStatusOverlayRef = useTemplateRef('loginQrCodeScannerStatusOverlayRef');

// Functions
const confirmLogoutAllSessions = createElMessageBoxConfirmHandler(
    '確定要登出所有裝置嗎？',
    '登出中...',
    async () => !!(await ProfileSecuritySessionApi.use().deleteAll())?.data?.success,
    () => {
        assignUrlWithRedirectParamFromCurrentLocation('/auth/login/', 1000);
        showSuccessAlert(
            '登出成功',
            {
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
            },
        );
    },
    undefined,
    undefined,
    { type: 'warning' },
);

const confirmQrCodeLogin = createElMessageBoxConfirmHandler<
    AuthenticationSessionQrCodeLoginApprovalRequestData & { approvalToken: string }
>(
    (data) => `確定要允許 ${parseUserAgentToDeviceInfo(data.targetUserAgent)} (${data.targetIp}) 的登入嗎？`,
    '登入中...',
    async (data) => {
        const response = await AuthApi.use().approveQrCodeLogin(data.approvalToken, { skipShowErrorMessage: true });
        if (response?.data?.success) return true;
        if (response?.status === 410) return 'gone';
        return response?.data?.message || '系統錯誤';
    },
    () => {
        ElNotification.success('已允許登入');
        isScanLoginQrCodeDialogVisible.value = false;
        setTimeout(() => dataTablePageRef.value?.loadData(), 1000);
    },
    (_, done, reason) => {
        if (reason === 'gone') {
            done();
            resumeLoginQrCodeScanner();
            return ElNotification.error('QR Code已過期');
        }

        if (reason) ElNotification.error(reason);
    },
    () => resumeLoginQrCodeScanner(),
    { type: 'warning' },
);

function getPlatformTypeName(platformType?: string) {
    switch (platformType) {
        case 'bot': return '自動化工具';
        case 'desktop': return '電腦';
        case 'mobile': return '手機';
        case 'tablet': return '平板';
        case 'tv': return '智慧電視';
        default: return '未知裝置';
    }
}

async function onScanLoginQrCodeSuccess(decodedText: string) {
    if (html5QrCode?.getState() !== Html5QrcodeScannerState.SCANNING) return;
    html5QrCode.pause();
    const abortController = new AbortController();
    loginQrCodeApprovalRequestAbortController = abortController;
    const response = await AuthApi.use().getQrCodeLoginApprovalRequest(
        decodedText,
        {
            signal: abortController.signal,
            skipShowErrorMessage: true,
        },
    );

    if (abortController.signal.aborted || !isScanLoginQrCodeDialogVisible.value) return;
    loginQrCodeApprovalRequestAbortController = undefined;
    if (response?.data?.data?.state === 'pending') {
        confirmQrCodeLogin({
            approvalToken: decodedText,
            ...response.data.data,
        });
    } else {
        loginQrCodeScannerStatusOverlayRef.value!.showError('QR Code錯誤或過期');
        loginQrCodeScannerResumeTimeout = setTimeout(resumeLoginQrCodeScanner, 1000);
    }
}

function parseDataToDeviceColumnText(row: AuthenticationSessionListItemData) {
    return `${row.isCurrent ? '[當前] ' : ''}${parseUserAgentToDeviceInfo(row.userAgent)}`;
}

function parseUserAgentToDeviceInfo(userAgent?: string) {
    if (!userAgent) return '未知裝置';
    const {
        browser,
        os,
        platform,
    } = Bowser.parse(userAgent);

    const browserName = [
        browser.name,
        browser.version,
    ].filter((value) => value).join(' ');

    const osName = [
        os.name,
        os.versionName || os.version,
    ].filter((value) => value).join(' ');

    const platformName = [
        platform.vendor,
        platform.model,
    ].filter((value) => value).join(' ');

    const platformTypeName = platformName || osName ? '' : getPlatformTypeName(platform.type);

    return [
        browserName,
        platformName,
        osName,
        platformTypeName,
    ].filter((value) => value).join(' · ') || '未知裝置';
}

async function resetLoginQrCodeScanner() {
    loginQrCodeApprovalRequestAbortController?.abort();
    loginQrCodeApprovalRequestAbortController = undefined;
    if (loginQrCodeScannerResumeTimeout) clearTimeout(loginQrCodeScannerResumeTimeout);
    loginQrCodeScannerResumeTimeout = undefined;

    if (!html5QrCode) return;
    const scannerState = html5QrCode.getState();
    if (
        scannerState === Html5QrcodeScannerState.SCANNING
        || scannerState === Html5QrcodeScannerState.PAUSED
    ) {
        try {
            await html5QrCode.stop();
        } catch {
            return;
        }
    }

    html5QrCode.clear();
}

function resumeLoginQrCodeScanner() {
    if (html5QrCode?.getState() === Html5QrcodeScannerState.PAUSED) html5QrCode.resume();
}

async function startScanLoginQrCode() {
    const scannerGeneration = ++loginQrCodeScannerGeneration;
    loginQrCodeScannerStatusOverlayRef.value!.showLoading('相機啟動中...');
    if (!html5QrCode) html5QrCode = new Html5Qrcode('login-qr-code-scanner');
    try {
        loginQrCodeScannerCameras.value = await Html5Qrcode.getCameras();
        if (scannerGeneration !== loginQrCodeScannerGeneration || !isScanLoginQrCodeDialogVisible.value) return;
        if (loginQrCodeScannerSelectedCameraId.value) {
            const cameraIds = loginQrCodeScannerCameras.value.map((camera) => camera.id);
            if (!cameraIds.includes(loginQrCodeScannerSelectedCameraId.value)) {
                loginQrCodeScannerSelectedCameraId.value = cameraIds[0];
            }
        } else loginQrCodeScannerSelectedCameraId.value = loginQrCodeScannerCameras.value[0]?.id;

        if (!loginQrCodeScannerSelectedCameraId.value) {
            return loginQrCodeScannerStatusOverlayRef.value!.showError('沒有可用的相機');
        }

        await startScanLoginQrCodeScanner();
    } catch (error) {
        if (scannerGeneration !== loginQrCodeScannerGeneration || !isScanLoginQrCodeDialogVisible.value) return;
        if ((error instanceof Error) && error.message.toLowerCase().includes('denied')) {
            loginQrCodeScannerStatusOverlayRef.value!.showError('相機權限已被封鎖', false);
        } else loginQrCodeScannerStatusOverlayRef.value!.showError('相機啟動失敗', false);
    }
}

async function startScanLoginQrCodeScanner() {
    const scannerGeneration = ++loginQrCodeScannerGeneration;
    loginQrCodeScannerStatusOverlayRef.value!.showLoading('相機啟動中...');
    if (!html5QrCode || !loginQrCodeScannerSelectedCameraId.value) return;
    await resetLoginQrCodeScanner();
    if (scannerGeneration !== loginQrCodeScannerGeneration || !isScanLoginQrCodeDialogVisible.value) return;
    try {
        await html5QrCode.start(
            loginQrCodeScannerSelectedCameraId.value,
            {
                aspectRatio: 1,
                fps: 30,
            },
            onScanLoginQrCodeSuccess,
            undefined,
        );

        if (scannerGeneration !== loginQrCodeScannerGeneration) {
            await resetLoginQrCodeScanner();
            return;
        }

        loginQrCodeScannerStatusOverlayRef.value!.hide();
    } catch {
        if (scannerGeneration !== loginQrCodeScannerGeneration || !isScanLoginQrCodeDialogVisible.value) return;
        loginQrCodeScannerStatusOverlayRef.value!.showError('相機啟動失敗', false);
    }
}

async function stopScanLoginQrCode() {
    ++loginQrCodeScannerGeneration;
    await resetLoginQrCodeScanner();
}

// Hooks
onBeforeUnmount(stopScanLoginQrCode);
</script>
