import { toApiClientFailureResponse } from '@kcs-project/pack/libs/api-client/failure-response';
import axios, { AxiosError } from 'axios';
import type { CreateAxiosDefaults } from 'axios';

import type { ApiResponseErrorCode } from '@/types/api';

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
            if (!(error instanceof AxiosError)) throw error;
            // Synthesized envelopes carry the app's own messages.
            const response = await toApiClientFailureResponse(error, (key) => use$t(`errors.${key}`));
            const {
                errorCode,
                message,
                requestId,
            } = response.data;

            if (loginRequiredErrorCodes.has(errorCode)) {
                assignUrlWithRedirectParamFromCurrentLocation('/auth/login/');
            } else if (errorCode !== 'aborted' && !error.config?.silent) {
                ElNotification.error(requestId ? `${message} (${requestId})` : message);
            }

            return response;
        },
    );

    return instance;
}
