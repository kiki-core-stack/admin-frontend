<template>
    <data-table-page
        ref="dataTablePageRef"
        permissions="ignore"
        title="目前登入的裝置"
        :confirm-delete-message="(row) => `確定要刪除 ${parseDataToDeviceColumnText(row)} (${row.lastActiveIp}) 嗎？`"
        :crud-api="useProfileSecuritySessionApi()"
        :disable-row-delete-btn-rule="(row) => row.isCurrent"
        hide-add-data-btn
        hide-created-at-column
        hide-edit-btn
        hide-footer
    >
        <template #toolbar-actions-append>
            <el-button @click="isScanLoginQrCodeDialogVisible = true">
                掃描登入QR Code
            </el-button>
        </template>
        <template #table>
            <el-table-column
                label="裝置"
                :formatter="(row) => parseDataToDeviceColumnText(row)"
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
            <el-table-datetime-column label="登入時間" />
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
    AdminQrCodeLoginData,
    AdminSessionData,
} from '@kiki-core-stack/pack/types/data/admin';
import type { Nullable } from '@kikiutils/shared/types';
import { Html5Qrcode } from 'html5-qrcode';
import type { CameraDevice } from 'html5-qrcode';
import { UAParser } from 'ua-parser-js';

// Constants/Refs/Variables
const authApi = useAuthApi();
const dataTablePageRef = useTemplateRef('dataTablePageRef');
let html5QrCode: Html5Qrcode | undefined;
const isScanLoginQrCodeDialogVisible = ref(false);
const loginQrCodeScannerCameras = useLocalStorage<CameraDevice[]>('loginQrCodeScannerCameras', () => []);
const loginQrCodeScannerSelectedCameraId = useLocalStorage<Nullable<string>>(
    'loginQrCodeScannerSelectedCameraId',
    null,
);

const loginQrCodeScannerStatusOverlayRef = useTemplateRef('loginQrCodeScannerStatusOverlayRef');

// Functions
const confirmQrCodeLogin = createElMessageBoxConfirmHandler<
    Pick<AdminQrCodeLoginData, 'ip' | 'userAgent'> & { token: string }
>(
    (data) => `確定要允許 ${parseUserAgentToDeviceInfo(data.userAgent)} (${data.ip}) 的登入嗎？`,
    '登入中...',
    async (data) => {
        const response = await authApi.confirmQrCodeLogin(
            data.token,
            undefined,
            { skipShowErrorMessage: true },
        );

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
            html5QrCode?.resume();
            return ElNotification.error('QR Code已過期');
        }

        if (reason) ElNotification.error(reason);
    },
    () => html5QrCode?.resume(),
    { type: 'warning' },
);

async function onScanLoginQrCodeSuccess(decodedText: string) {
    html5QrCode?.pause();
    const response = await authApi.getQrCodeLoginData(decodedText, undefined, { skipShowErrorMessage: true });
    if (response?.data?.success) {
        confirmQrCodeLogin({
            token: decodedText,
            ...response.data.data!,
        });
    } else {
        loginQrCodeScannerStatusOverlayRef.value!.showError('QR Code錯誤或過期');
        setTimeout(() => html5QrCode?.resume(), 1000);
    }
}

function parseDataToDeviceColumnText(row: AdminSessionData) {
    return `${row.isCurrent ? '[當前] ' : ''}${parseUserAgentToDeviceInfo(row.userAgent)}`;
}

function parseUserAgentToDeviceInfo(userAgent?: string) {
    if (!userAgent) return '未知裝置';
    const parseResult = UAParser(userAgent);
    const browserName = parseResult.browser.name || '未知瀏覽器';
    const browserVersion = parseResult.browser.version || '未知瀏覽器版本';
    const osName = parseResult.os.name || '未知系統';
    const osVersion = parseResult.os.version || '未知系統版本';
    return `${browserName} ${browserVersion} on ${osName} ${osVersion}`.trim();
}

async function startScanLoginQrCode() {
    loginQrCodeScannerStatusOverlayRef.value!.showLoading('相機啟動中...');
    if (!html5QrCode) html5QrCode = new Html5Qrcode('login-qr-code-scanner');
    try {
        loginQrCodeScannerCameras.value = await Html5Qrcode.getCameras();
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
        if ((error instanceof Error) && error.message.toLowerCase().includes('denied')) {
            loginQrCodeScannerStatusOverlayRef.value!.showError('相機權限已被封鎖', false);
        }
    }
}

async function startScanLoginQrCodeScanner() {
    loginQrCodeScannerStatusOverlayRef.value!.showLoading('相機啟動中...');
    if (!html5QrCode || !loginQrCodeScannerSelectedCameraId.value) return;
    await stopScanLoginQrCode();
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

        loginQrCodeScannerStatusOverlayRef.value!.hide();
    } catch {
        loginQrCodeScannerStatusOverlayRef.value!.showError('相機啟動失敗', false);
    }
}

async function stopScanLoginQrCode() {
    try {
        await html5QrCode?.stop();
    } catch {}

    html5QrCode?.clear();
}
</script>
