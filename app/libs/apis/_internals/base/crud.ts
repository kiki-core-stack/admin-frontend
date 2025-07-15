import type { AxiosRequestConfig } from 'axios';

import { BaseApi } from './';

export abstract class BaseCrudApi<
    T extends TableRowData = TableRowData,
    CreateOrUpdateData = T | TablePageFormData<T>,
> extends BaseApi {
    async create(data: CreateOrUpdateData, config?: AxiosRequestConfig) {
        try {
            return await this.postRequest<T>(undefined, await this.processCreateOrUpdateData(data), config);
        } catch {}
    }

    delete(id: string) {
        return this.deleteRequest(`/${id}`);
    }

    get(id: string, params?: any) {
        return this.getRequest<T>(`/${id}`, params);
    }

    getList(params?: GetListApiParams) {
        return this.getRequest<{ count: number; list: T[]; totals?: Record<string, number | string> }>(
            '/list',
            {
                ...params,
                filter: params?.filter ? buildApiQueryFilter(params.filter) : undefined,
            },
        );
    }

    // eslint-disable-next-line require-await
    async processCreateOrUpdateData(data: CreateOrUpdateData) {
        return data;
    }

    async update(id: string, data: CreateOrUpdateData, config?: AxiosRequestConfig) {
        try {
            return await this.putRequest(`/${id}`, await this.processCreateOrUpdateData(data), config);
        } catch {}
    }

    updateBooleanField(id: string, field: string, value: boolean) {
        return this.patchRequest(
            `/${id}/boolean-field`,
            {
                field,
                value,
            },
        );
    }
}
