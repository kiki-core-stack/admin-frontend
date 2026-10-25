import type { WithAdminAuditData } from '@kcs-project/pack/types/data';

declare global {
    type TablePageElFormRules<
        T extends object,
        O extends Exclude<keyof T, keyof WithAdminAuditData> = never,
    > = ElFormRules<TablePageFormData<T, O>>;

    interface GetListApiParams {
        [key: string]: any;
        fields?: string[];
        filter?: Record<string, any>;
        limit?: number;
        page?: number;
    }
}
