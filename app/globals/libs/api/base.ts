import type { ApiResponseData } from '@kiki-core-stack/pack/types/data';
import type { AnyRecord } from '@kikiutils/shared/types';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    Method,
} from 'axios';
import queryString from 'query-string';
import type { Except } from 'type-fest';

import { createApiAxiosInstance } from '@/libs/api/instance';

const apiInstances = new WeakMap<new (...args: any[]) => any, Map<string, BaseApi>>();

export class BaseApi {
    // Private properties
    readonly #rangeOperators = new Set([
        '$gt',
        '$gte',
        '$lt',
        '$lte',
    ]);

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
    protected buildQueryFilter(filter: AnyRecord) {
        filter = cloneDeep(filter);
        Object.entries(filter).forEach(([field, condition]) => {
            if (condition === null || condition === undefined || (typeof condition === 'string' && !condition)) {
                delete filter[field];
                return;
            }

            if (Array.isArray(condition)) {
                if (!condition.length) delete filter[field];
                return;
            }

            if (condition instanceof Date) {
                filter[field] = condition.toISOString();
                return;
            }

            if (typeof condition === 'object') {
                Object.entries(condition).forEach(([operator, operand]) => {
                    if (this.#rangeOperators.has(operator) && operand instanceof Date) {
                        condition[operator] = operand.toISOString();
                        return;
                    }

                    if (operator === '$in') {
                        if (!Array.isArray(operand) || !operand.length) delete condition[operator];
                        return;
                    }

                    if (operator === '$regex' && (typeof operand !== 'string' || !operand)) delete condition[operator];
                });

                if (!Object.keys(condition).length) delete filter[field];
            }
        });

        return JSON.stringify(filter);
    }

    protected deleteRequest<T extends object | undefined = undefined, E extends string | undefined = undefined>(
        url?: string,
        params?: any,
        config?: AxiosRequestConfig,
    ) {
        return this.request<T, E>(
            'delete',
            url,
            undefined,
            {
                ...config,
                params,
            },
        );
    }

    protected getRequest<T extends object | undefined = undefined, E extends string | undefined = undefined>(
        url?: string,
        params?: any,
        config?: AxiosRequestConfig,
    ) {
        return this.request<T, E>(
            'get',
            url,
            undefined,
            {
                ...config,
                params,
            },
        );
    }

    protected patchRequest<T extends object | undefined = undefined, E extends string | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return this.request<T, E>('patch', url, data, config);
    }

    protected postRequest<T extends object | undefined = undefined, E extends string | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return this.request<T, E>('post', url, data, config);
    }

    protected putRequest<T extends object | undefined = undefined, E extends string | undefined = undefined>(
        url?: string,
        data?: any,
        config?: AxiosRequestConfig,
    ) {
        return this.request<T, E>('put', url, data, config);
    }

    protected request<
        T extends object | undefined = undefined,
        E extends string | undefined = undefined,
        // eslint-disable-next-line style/max-len
        R extends Partial<AxiosResponse<ApiResponseData<T, E>>> | undefined = Partial<AxiosResponse<ApiResponseData<T, E>>> | undefined,
        D = any,
    >(
        method: Method,
        url?: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ) {
        return this.axiosInstance.request<T, R, D>({
            ...config,
            data,
            method,
            url,
        });
    }
}
