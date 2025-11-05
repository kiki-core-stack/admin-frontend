import type { WithAdminAuditData } from '@kiki-core-stack/pack/types/data';
import type { AnyRecord } from '@kikiutils/shared/types';

declare global {
    type TablePageElFormRules<
        T extends object,
        O extends Exclude<keyof T, keyof WithAdminAuditData> = never,
    > = ElFormRules<TablePageFormData<T, O>>;

    interface GetListApiParams {
        [key: string]: any;
        fields?: string[];
        filter?: AnyRecord;
        limit?: number;
        page?: number;
    }
}
