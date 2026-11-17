import type { AuthQrCodeLoginCreationData } from '@kcs-project/pack/types/data/auth';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import type { Promisable } from 'type-fest';

import { toQrCodeLoginApprovalUrl } from '@/libs/auth/qr-code-login';

/**
 * QR code login of a logged-out device: creates a login request, shows its approval URL as a QR code and polls until
 * a logged-in device approves or rejects it. A rejected or expired request is replaced with a new one.
 *
 * @param onCompleted - Called once the request was approved and the session cookie is set.
 */
export function useAuthQrCodeLogin(onCompleted: () => Promisable<void>) {
    const approvalUrl = ref('');
    const imageSrc = useQRCode(
        approvalUrl,
        {
            errorCorrectionLevel: 'L',
            margin: 0,
            type: 'image/webp',
        },
    );

    // Whether the backend offers QR code login is only known once a login request was created. The last known answer
    // is remembered, so the login page does not show the QR code and then drop it on every load while it is disabled.
    const isEnabled = useLocalStorage('authQrCodeLoginEnabled', true);
    const polling = useTimeoutPoll(poll, 2000, { immediate: false });
    let abortController: AbortController | undefined;
    let qrCodeLogin: AuthQrCodeLoginCreationData | undefined;

    async function poll() {
        const polledQrCodeLogin = qrCodeLogin;
        if (!polledQrCodeLogin) return;
        const response = await AuthApi.use().pollQrCodeLogin(
            polledQrCodeLogin.qrToken,
            polledQrCodeLogin.pollSecret,
            {
                signal: abortController?.signal,
                silent: true,
            },
        );

        if (polledQrCodeLogin !== qrCodeLogin) return;
        const state = response.data.data?.state;
        if (state === 'completed') {
            stop();
            return await onCompleted();
        }

        if (state === 'rejected') ElNotification.error('登入請求已被拒絕');
        // Expired, or QR code login was turned off meanwhile: asking for a new request settles which one it is.
        const errorCode = response.data.success ? undefined : response.data.errorCode;
        if (state === 'rejected' || errorCode === 'qrCodeLoginExpired' || errorCode === 'qrCodeLoginDisabled') {
            await reload();
        }
    }

    /**
     * Replaces the login request with a new one; the current QR code stays until the new one is ready.
     */
    async function reload() {
        abortController?.abort();
        const controller = new AbortController();
        abortController = controller;
        polling.pause();
        const response = await AuthApi.use().createQrCodeLogin({
            signal: controller.signal,
            silent: true,
        });

        if (abortController !== controller) return;
        if (!response.data.data) {
            if (!response.data.success && response.data.errorCode === 'qrCodeLoginDisabled') isEnabled.value = false;
            qrCodeLogin = undefined;
            approvalUrl.value = '';
            return;
        }

        isEnabled.value = true;
        qrCodeLogin = response.data.data;
        approvalUrl.value = toQrCodeLoginApprovalUrl(qrCodeLogin.qrToken);
        polling.resume();
    }

    function stop() {
        abortController?.abort();
        abortController = undefined;
        polling.pause();
        qrCodeLogin = undefined;
        approvalUrl.value = '';
    }

    tryOnScopeDispose(stop);
    return {
        imageSrc,
        isEnabled,
        reload,
        stop,
    };
}
