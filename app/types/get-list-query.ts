export type GetListFilter<T> = {
    $and?: Array<GetListFilter<T>>;
    $or?: Array<GetListFilter<T>>;
} & { [K in keyof T & string]?: GetListFilterCondition<GetListFilterValue<NonNullable<T[K]>>> };

export type GetListFilterCondition<V> = GetListFilterOperators<V> | null | V;

// Strings also accept `Date` (sent as ISO strings); populated refs also accept their id.
type GetListFilterValue<V> = V extends Array<infer E>
    ? GetListFilterValue<E>
    : V extends string
        ? Date | string
        : V extends object
            ? string | V
            : V;

export interface GetListFilterOperators<V> {
    /**
     * Matches values containing the text literally.
     */
    $contains?: string;

    /**
     * Matches values ending with the text literally.
     */
    $endsWith?: string;
    $eq?: null | V;

    /**
     * Whether the field exists (`false` also matches documents without it).
     */
    $exists?: boolean;
    $gt?: V;
    $gte?: V;

    /**
     * Makes `$contains` / `$startsWith` / `$endsWith` case-insensitive; `$startsWith` then can no longer use an index.
     */
    $ignoreCase?: boolean;
    $in?: V[];
    $lt?: V;
    $lte?: V;
    $ne?: null | V;
    $nin?: V[];

    /**
     * Matches values starting with the text literally; unlike `$contains` it can use an index.
     */
    $startsWith?: string;
}

/**
 * Query params of a list route, parsed by `parseGetListQuery` of management-backend.
 */
export interface GetListQueryParams<T> {
    /**
     * Paths to return; prefix with `-` to exclude.
     */
    fields?: string[];
    filter?: GetListFilter<T>;
    limit?: number;
    page?: number;

    /**
     * Comma-separated paths; prefix with `-` for descending.
     */
    sort?: string;
}
