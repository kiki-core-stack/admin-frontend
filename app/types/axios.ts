declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * Do not show the default error notification; the caller handles the failure itself.
         */
        silent?: boolean;
    }

    interface AxiosResponse {
        /**
         * The original error, present only on failures (HTTP errors and client-synthesized responses).
         */
        error?: AxiosError;
    }
}

export {};
