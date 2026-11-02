import type { TableRowData } from '@kcs-project/pack/types/data';
import type { AxiosRequestConfig } from 'axios';
import type { Promisable } from 'type-fest';

export class BaseCrudApi<
    T extends TableRowData = TableRowData,
    CreateOrUpdateData = T | TablePageFormData<T>,
> extends BaseApi {
    async create(data: CreateOrUpdateData, config?: AxiosRequestConfig) {
        try {
            return await this.postRequest<T>(undefined, await this.processCreateOrUpdateData(data), config);
        } catch {}
    }

    async delete(id: string) {
        return await this.deleteRequest(`/${id}`);
    }

    async get(id: string, params?: any) {
        return await this.getRequest<T>(`/${id}`, params);
    }

    async getList(params?: GetListApiParams) {
        return await this.getRequest<{ count: number; list: T[]; totals?: Record<string, number | string> }>(
            '/list',
            {
                ...params,
                filter: params?.filter ? this.buildQueryFilter(params.filter) : undefined,
            },
        );
    }

    processCreateOrUpdateData(data: CreateOrUpdateData): Promisable<any> {
        return data;
    }

    async update(id: string, data: CreateOrUpdateData, config?: AxiosRequestConfig) {
        try {
            return await this.putRequest(`/${id}`, await this.processCreateOrUpdateData(data), config);
        } catch {}
    }

    async updateBooleanField(id: string, field: string, value: boolean) {
        return await this.patchRequest(
            `/${id}/boolean-field`,
            {
                field,
                value,
            },
        );
    }
}
