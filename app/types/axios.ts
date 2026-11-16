declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * Do not show the default error notification; the caller handles the failure itself.
         */
        silent?: boolean;
    }
}

export {};
