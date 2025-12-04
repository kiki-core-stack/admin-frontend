import axios, { AxiosError } from 'axios';
import type { CreateAxiosDefaults } from 'axios';
import { nanoid } from 'nanoid';

export function createApiAxiosInstance(config?: CreateAxiosDefaults) {
    const instance = axios.create(config);
    instance.interceptors.request.use((config) => {
        config.headers['x-nonce'] = generateWithNestedRandomLength(nanoid, 21, 24, 29, 32);
        config.headers['x-timestamp'] = Date.now();
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (!(error instanceof AxiosError)) throw error;
            if (!error.response) {
                if (!error.config?.skipShowErrorMessage) ElNotification.error(use$t('messages.pleaseCheckNetwork'));
                return { error };
            }

            if (error.response.status === 401) assignUrlWithRedirectParamFromCurrentLocation('/auth/login/');
            else if (!error.config?.skipShowErrorMessage) {
                ElNotification.error(
                    use$t(`errors.apiResponse.code.${error.response.data.errorCode || 'internalServerError'}`),
                );
            }

            return Object.assign(error.response, { error });
        },
    );

    return instance;
}
