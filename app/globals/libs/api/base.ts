import type {
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults,
    Method,
} from 'axios';
import { isPlainObject } from 'es-toolkit';
import queryString from 'query-string';
import {
    objectEntries,
    objectKeys,
} from 'ts-extras';
import type {
    Except,
    UnknownRecord,
} from 'type-fest';

import { createApiAxiosInstance } from '@/libs/api/instance';
import type { ApiRequestResult } from '@/types/api';
import type { GetListFilter } from '@/types/get-list-query';

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

    /**
     * Serializes a list filter into the `filter` query param, or `undefined` when nothing is left to filter by.
     *
     * Empty conditions (`undefined`, `''`, empty `$in` / `$nin`, empty `$and` / `$or`) are dropped, and populated refs
     * (such as selector values) are sent as their ids.
     */
    protected serializeGetListFilter(filter?: GetListFilter<any>) {
        const normalizedFilter = filter && normalizeGetListFilter(filter);
        return normalizedFilter && objectKeys(normalizedFilter).length ? JSON.stringify(normalizedFilter) : undefined;
    }
}

// Functions
function normalizeGetListFilter(filter: GetListFilter<any>) {
    const serializedFilter: UnknownRecord = {};
    for (const [key, condition] of objectEntries(filter)) {
        if (key === '$and' || key === '$or') {
            const subFilters = (condition as Array<GetListFilter<any>>)
                .map(normalizeGetListFilter)
                .filter((subFilter) => objectKeys(subFilter).length);

            if (subFilters.length) serializedFilter[key] = subFilters;
        } else if (isPlainObject(condition) && !('id' in condition)) {
            const serializedCondition: UnknownRecord = {};
            for (const [operator, operand] of objectEntries(condition)) {
                if (Array.isArray(operand)) {
                    if (operand.length) serializedCondition[operator] = operand.map(toFilterValue);
                } else if (operand !== undefined && operand !== '') serializedCondition[operator] = toFilterValue(operand);
            }

            // `$ignoreCase` alone (its text operator left empty) is not a condition.
            if (objectKeys(serializedCondition).some((operator) => operator !== '$ignoreCase')) {
                serializedFilter[key] = serializedCondition;
            }
        } else if (condition !== undefined && condition !== '') serializedFilter[key] = toFilterValue(condition);
    }

    return serializedFilter;
}

function toFilterValue(value: unknown) {
    return isPlainObject(value) && typeof value.id === 'string' ? value.id : value;
}
