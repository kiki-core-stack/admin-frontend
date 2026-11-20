import type {
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults,
    Method,
} from 'axios';
import queryString from 'query-string';
import type { Except } from 'type-fest';

import { createApiAxiosInstance } from '@/libs/api/instance';
import type { ApiRequestResult } from '@/types/api';

const apiInstances = new WeakMap<new (...args: any[]) => any, Map<string, BaseApi>>();

export class BaseApi {
    // Protected properties
    protected readonly axiosInstance: AxiosInstance;

    constructor(baseUrl?: string, createAxiosInstanceConfigs?: Except<CreateAxiosDefaults, 'baseURL'>) {
        this.axiosInstance = createApiAxiosInstance({
            ...createAxiosInstanceConfigs,
            baseURL: baseUrl,
            paramsSerializer: { serialize: (params) => queryString.stringify(params, { arrayFormat: 'none' }) },
        });
    }

    // Static methods
    static use<T extends typeof BaseApi>(this: T, ...args: ConstructorParameters<T>) {
        let cache = apiInstances.get(this);
        if (!cache) apiInstances.set(this, cache = new Map());
        const key = JSON.stringify(args);
        let instance = cache.get(key);
        // @ts-expect-error Ignore this error.
        if (!instance) cache.set(key, instance = new this(...args));
        return instance as InstanceType<T>;
    }

    // Protected methods
    protected async deleteRequest<T extends object | undefined = undefined>(
        url?: string,
        params?: any,
        config?: AxiosRequestConfig,
    ) {
        return await this.request<T>(
            'delete',
            url,
            undefined,
            {
                ...config,
                params,
            },
        );
    }

    protected async getRequest<T extends object | undefined = undefined>(
        url?: string,
        params?: any,
        config?: AxiosRequestConfig,
    ) {
        return await this.request<T>(
            'get',
            url,
            undefined,
            {
                ...config,
                params,
            },
        );
    }

    protected async patchRequest<T extends object | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return await this.request<T>('patch', url, data, config);
    }

    protected async postRequest<T extends object | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return await this.request<T>('post', url, data, config);
    }

    protected async putRequest<T extends object | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return await this.request<T>('put', url, data, config);
    }

    protected async request<
        T extends object | undefined = undefined,
        R extends ApiRequestResult<T> = ApiRequestResult<T>,
        D = any,
    >(
        method: Method,
        url?: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ) {
        return await this.axiosInstance.request<T, R, D>({
            ...config,
            data,
            method,
            url,
        });
    }
}
