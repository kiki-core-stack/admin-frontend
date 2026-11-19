import {
    browserSupportsWebAuthn,
    startAuthentication,
    startRegistration,
    WebAuthnError,
} from '@simplewebauthn/browser';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';
import type { ApiRequestResult } from '@/types/api';
import type {
    AuthFactorProofData,
    AuthPasskeyAuthenticationOptionsData,
} from '@/types/data/auth';

// Constants
export const isPasskeySupported = browserSupportsWebAuthn();

// Functions

/**
 * Asks the browser for a passkey assertion against freshly requested options. Resolves to nothing when the options
 * request failed (already notified by the API layer) or the admin dismissed the browser prompt. `rpId` is what
 * `signalUnknownPasskey` needs when the backend does not know the passkey.
 */
export async function authenticateWithPasskey(
    getOptions: () => Promise<ApiRequestResult<AuthPasskeyAuthenticationOptionsData>>,
): Promise<undefined | { proof: Extract<AuthFactorProofData, { factor: 'passkey' }>; rpId?: string }> {
    const optionsData = (await getOptions()).data.data;
    if (!optionsData) return;
    try {
        return {
            proof: {
                challengeId: optionsData.challengeId,
                factor: 'passkey',
                response: await startAuthentication({ optionsJSON: optionsData.options }),
            },
            rpId: optionsData.options.rpId,
        };
    } catch (error) {
        notifyPasskeyError(error);
    }
}

function notifyPasskeyError(error: unknown) {
    // Dismissing the browser prompt (or letting it time out) is not a failure worth reporting.
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'NotAllowedError')) return;
    if (error instanceof WebAuthnError && error.code === 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED') {
        return ElNotification.error('此裝置已經註冊過密碼金鑰');
    }

    ElNotification.error('密碼金鑰操作失敗，請再試一次');
}

const passkeyNameMessageBoxOptions = {
    draggable: true,
    inputPlaceholder: '例如：公司筆電',
    inputValidator: (value: string) => (value.trim().length >= 1 && value.trim().length <= 64) || '名稱長度須為 1 至 64 個字',
};

/**
 * Asks for a new name of a passkey; resolves to the trimmed name, or nothing when canceled.
 */
export async function promptPasskeyName(title: string, inputValue: string) {
    try {
        const { value } = await ElMessageBox.prompt(
            '請輸入密碼金鑰名稱，方便日後辨識',
            title,
            {
                ...passkeyNameMessageBoxOptions,
                inputValue,
            },
        );

        return value.trim();
    } catch (error) {
        if (error === 'cancel' || error === 'close') return;
        throw error;
    }
}

/**
 * Registers a passkey of this device for the current admin. Resolves to the registration result (recovery codes on
 * the first second factor), or nothing when a request failed (already notified) or the admin dismissed the prompt.
 *
 * The browser prompt comes first, so a device that cannot be added (already registered, dismissed) ends there. The
 * name is asked afterwards and cannot be canceled: by then the device holds the passkey, and leaving would orphan
 * it. It defaults to this device's name and can be changed later.
 */
export async function registerPasskey() {
    const api = ProfileSecurityPasskeyApi.use();
    const optionsData = (await api.getRegistrationOptions()).data.data;
    if (!optionsData) return;
    let response;
    try {
        response = await startRegistration({ optionsJSON: optionsData.options });
    } catch (error) {
        return void notifyPasskeyError(error);
    }

    const { value: name } = await ElMessageBox.prompt(
        '請輸入密碼金鑰名稱，方便日後辨識',
        '新增密碼金鑰',
        {
            ...passkeyNameMessageBoxOptions,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            inputValue: parseUserAgentToDeviceInfo(navigator.userAgent).slice(0, 64),
            showCancelButton: false,
            showClose: false,
        },
    );

    const result = await api.register(optionsData.challengeId, name.trim(), response);
    if (result.data.success) return result.data.data ?? {};
}
