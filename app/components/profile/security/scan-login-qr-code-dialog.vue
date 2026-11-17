<template>
    <el-dialog
        v-model="isVisible"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
        @closed="stopScanning"
        @open="startScanning"
    >
        <div class="text-center">
            <p class="fs-24px">
                請掃描登入畫面上的 QR Code
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
                        <status-overlay ref="statusOverlayRef" />
                    </div>
                </aspect-ratio>
                <el-select
                    v-model="selectedCameraId"
                    class="mt-1 max-w-[400px]"
                    :disabled="
                        statusOverlayRef?.isVisible
                            && statusOverlayRef?.status !== 'error'
                    "
                    @change="startCamera"
                >
                    <el-option
                        v-for="camera in cameras"
                        :key="camera.id"
                        :label="camera.label"
                        :value="camera.id"
                    />
                </el-select>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
    Html5Qrcode,
    Html5QrcodeScannerState,
} from 'html5-qrcode';
import type { CameraDevice } from 'html5-qrcode';

import { qrCodeLoginApprovalPagePath } from '@/constants/auth';
import { parseQrCodeLoginApprovalUrl } from '@/libs/auth/qr-code-login';

// Constants/Refs/Variables
const cameras = useLocalStorage<CameraDevice[]>('loginQrCodeScannerCameras', () => []);
const isVisible = ref(false);
const selectedCameraId = useLocalStorage<null | string>(
    'loginQrCodeScannerSelectedCameraId',
    null,
);

// Resumes scanning shortly after a QR code that is not a login one was shown.
const resumeTimeout = useTimeoutFn(resumeScanning, 1000, { immediate: false });
const statusOverlayRef = useTemplateRef('statusOverlayRef');
let scanner: Html5Qrcode | undefined;
let scannerGeneration = 0;

// Functions
function close() {
    isVisible.value = false;
}

/**
 * Opens the approval page of the scanned QR code login, where the admin sees the requesting device and decides.
 */
async function onScanSuccess(decodedText: string) {
    if (scanner?.getState() !== Html5QrcodeScannerState.SCANNING) return;
    const qrToken = parseQrCodeLoginApprovalUrl(decodedText);
    if (!qrToken) {
        scanner.pause();
        statusOverlayRef.value!.showError('不是登入用的 QR Code');
        resumeTimeout.start();
        return;
    }

    close();
    await navigateTo({
        hash: `#${qrToken}`,
        path: qrCodeLoginApprovalPagePath,
    });
}

function open() {
    isVisible.value = true;
}

async function resetScanner() {
    resumeTimeout.stop();
    if (!scanner) return;
    const scannerState = scanner.getState();
    if (
        scannerState === Html5QrcodeScannerState.SCANNING
        || scannerState === Html5QrcodeScannerState.PAUSED
    ) {
        try {
            await scanner.stop();
        } catch {
            return;
        }
    }

    scanner.clear();
}

function resumeScanning() {
    if (scanner?.getState() === Html5QrcodeScannerState.PAUSED) scanner.resume();
}

async function startCamera() {
    const generation = ++scannerGeneration;
    statusOverlayRef.value!.showLoading('相機啟動中...');
    if (!scanner || !selectedCameraId.value) return;
    await resetScanner();
    if (generation !== scannerGeneration || !isVisible.value) return;
    try {
        await scanner.start(
            selectedCameraId.value,
            {
                aspectRatio: 1,
                fps: 30,
            },
            (decodedText) => void onScanSuccess(decodedText),
            undefined,
        );

        if (generation !== scannerGeneration) {
            await resetScanner();
            return;
        }

        statusOverlayRef.value!.hide();
    } catch {
        if (generation !== scannerGeneration || !isVisible.value) return;
        statusOverlayRef.value!.showError('相機啟動失敗', false);
    }
}

async function startScanning() {
    const generation = ++scannerGeneration;
    statusOverlayRef.value!.showLoading('相機啟動中...');
    if (!scanner) scanner = new Html5Qrcode('login-qr-code-scanner');
    try {
        cameras.value = await Html5Qrcode.getCameras();
        if (generation !== scannerGeneration || !isVisible.value) return;
        if (selectedCameraId.value) {
            const cameraIds = cameras.value.map((camera) => camera.id);
            if (!cameraIds.includes(selectedCameraId.value)) {
                selectedCameraId.value = cameraIds[0];
            }
        } else selectedCameraId.value = cameras.value[0]?.id;

        if (!selectedCameraId.value) {
            return statusOverlayRef.value!.showError('沒有可用的相機');
        }

        await startCamera();
    } catch (error) {
        if (generation !== scannerGeneration || !isVisible.value) return;
        if ((error instanceof Error) && error.message.toLowerCase().includes('denied')) {
            statusOverlayRef.value!.showError('相機權限已被封鎖', false);
        } else statusOverlayRef.value!.showError('相機啟動失敗', false);
    }
}

async function stopScanning() {
    ++scannerGeneration;
    await resetScanner();
}

// Hooks
onBeforeUnmount(stopScanning);
onDeactivated(async () => {
    close();
    return await stopScanning();
});

// Exposes
defineExpose({
    close,
    open,
});
</script>
