import { authVerificationHeaderName } from '@kcs-project/pack/constants/auth';
import { toApiClientFailureResponse } from '@kcs-project/pack/libs/api-client/failure-response';
import axios from 'axios';
import type { CreateAxiosDefaults } from 'axios';

import {
    loginPagePath,
    secondFactorSetupPagePath,
} from '@/constants/auth';
import { isSessionEndExpected } from '@/libs/auth/session';
import { requestAuthVerification } from '@/libs/auth/verification';
import type { ApiResponseErrorCode } from '@/types/api';

import { getApiErrorData } from './error-data';

// Constants/Variables
const loginRequiredErrorCodes = new Set<string>([
    'sessionInvalid',
    'unauthorized',
] satisfies ApiResponseErrorCode[]);

// Functions
export function createApiAxiosInstance(config?: CreateAxiosDefaults) {
    const instance = axios.create(config);
    // Backend messages (errors, validation issues) follow the app's locale.
    instance.interceptors.request.use((requestConfig) => {
        requestConfig.headers.set('accept-language', useNuxtApp().$i18n.locale.value);
        return requestConfig;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!axios.isAxiosError(error)) throw error;
            // Synthesized envelopes carry the app's own messages.
            const response = await toApiClientFailureResponse(error, (key) => useNuxtApp().$i18n.t(`apiClientErrors.${key}`));
            const {
                errorCode,
                message,
                requestId,
            } = response.data;

            // High-risk operation: ask the admin to verify, then send the request again with the one-time grant.
            const verificationRequest = getApiErrorData(response.data, 'verificationRequired');
            if (verificationRequest && error.config && !error.config.headers.has(authVerificationHeaderName)) {
                const grant = await requestAuthVerification(verificationRequest);
                if (!grant) return response;
                error.config.headers.set(authVerificationHeaderName, grant);
                return await instance.request(error.config);
            }

            if (loginRequiredErrorCodes.has(errorCode)) {
                if (!isSessionEndExpected()) assignUrlWithRedirectParamFromCurrentLocation(loginPagePath);
            } else if (errorCode === ('secondFactorSetupRequired' satisfies ApiResponseErrorCode)) {
                assignUrlWithRedirectParamFromCurrentLocation(secondFactorSetupPagePath);
            } else if (errorCode !== 'aborted' && !error.config?.silent) {
                ElNotification.error(requestId ? `${message} (${requestId})` : message);
            }

            return response;
        },
    );

    return instance;
}
