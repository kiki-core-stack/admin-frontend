import type { TableRowData } from '@kcs-project/pack/types/data';
import type { AxiosRequestConfig } from 'axios';
import type { Promisable } from 'type-fest';

/**
 * CRUD API of a resource.
 *
 * - `TRow`: the list/detail row returned by the backend.
 * - `TInput`: the form data sent on create/update; `never` for resources without a form.
 */
export class BaseCrudApi<TRow extends TableRowData, TInput extends object> extends BaseApi {
    /**
     * Converts form data into the request body. Override with an arrow function property, so the input type is
     * checked strictly (a method parameter would be bivariant and accept a mismatched type).
     */
    protected readonly serializeInput: (data: TInput) => Promisable<object> = (data) => data;

    // Public methods
    async create(data: TInput, config?: AxiosRequestConfig) {
        return await this.postRequest<TRow>(undefined, await this.serializeInput(data), config);
    }

    async delete(id: string) {
        return await this.deleteRequest(`/${id}`);
    }

    async get(id: string, params?: any) {
        return await this.getRequest<TRow>(`/${id}`, params);
    }

    async getList(params?: GetListApiParams, config?: AxiosRequestConfig) {
        return await this.getRequest<{ count: number; list: TRow[]; totals?: Record<string, number | string> }>(
            '/list',
            {
                ...params,
                filter: params?.filter ? this.buildQueryFilter(params.filter) : undefined,
            },
            config,
        );
    }

    /**
     * Updates the row with the form data. The row's `updatedAt` is sent along, so the backend can reject the update
     * when the row was modified after it was loaded.
     */
    async update(row: TRow, data: TInput, config?: AxiosRequestConfig) {
        const updatedAt = 'updatedAt' in row && typeof row.updatedAt === 'string' ? row.updatedAt : undefined;
        return await this.putRequest(
            `/${row.id}`,
            {
                ...await this.serializeInput(data),
                updatedAt,
            },
            config,
        );
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
