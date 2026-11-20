import type { TableRowData } from '@kcs-project/pack/types/data';
import type { AxiosRequestConfig } from 'axios';
import {
    isPlainObject,
    kebabCase,
} from 'es-toolkit';
import {
    objectEntries,
    objectKeys,
} from 'ts-extras';
import type {
    ConditionalKeys,
    Promisable,
    UnknownRecord,
} from 'type-fest';

import type {
    GetListFilter,
    GetListQueryParams,
} from '@/types/get-list-query';

/**
 * CRUD API of a resource.
 *
 * - `TRow`: the list/detail row returned by the backend.
 * - `TInput`: the form data sent on create/update (usually `CrudFormData<TRow>`); `never` for resources without a form.
 */
export class BaseCrudApi<TRow extends TableRowData, TInput extends object> extends BaseApi {
    /**
     * Converts form data into the request body. Override with an arrow function property, so the input type is
     * checked strictly (a method parameter would be bivariant and accept a mismatched type). Throw to abort the request
     * (e.g. when uploading a file fails); the form dialog stops loading and keeps the form open.
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

    async getList(params?: GetListQueryParams<TRow>, config?: AxiosRequestConfig) {
        const filter = params?.filter && serializeGetListFilter(params.filter);
        return await this.getRequest<{ count: number; list: TRow[]; totals?: Record<string, number | string> }>(
            '/list',
            {
                ...params,
                filter: filter && objectKeys(filter).length ? JSON.stringify(filter) : undefined,
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

    /**
     * Sets a boolean field through its own endpoint, `PATCH /<id>/<field in kebab-case>` with `{ <field>: value }`.
     */
    async setBooleanField(row: TRow, field: ConditionalKeys<TRow, boolean> & string, value: boolean) {
        return await this.patchRequest(`/${row.id}/${kebabCase(field)}`, { [field]: value });
    }
}

// Functions

/**
 * Drops empty conditions (`undefined`, `''`, empty `$in` / `$nin`, empty `$and` / `$or`) so unset filter fields do not
 * filter, and sends populated refs (such as selector values) as their ids.
 */
function serializeGetListFilter(filter: GetListFilter<any>) {
    const serializedFilter: UnknownRecord = {};
    for (const [key, condition] of objectEntries(filter)) {
        if (key === '$and' || key === '$or') {
            const subFilters = (condition as Array<GetListFilter<any>>)
                .map(serializeGetListFilter)
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
