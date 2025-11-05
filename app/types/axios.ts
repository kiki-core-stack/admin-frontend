declare module 'axios' {
    interface AxiosRequestConfig {
        skipShowErrorMessage?: boolean;
    }

    interface AxiosResponse {
        error?: AxiosError;
    }
}

export {};
