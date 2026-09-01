import type { WithAdminAuditData } from '@kcs-project/pack/types/data';
import type { OmitMongooseTimestampAndOtherFields } from '@kikiutils/mongoose/types';

declare global {
    type TablePageFormData<T extends object, O extends Exclude<keyof T, keyof WithAdminAuditData> = never> = Required<
        OmitMongooseTimestampAndOtherFields<T, keyof WithAdminAuditData | O>
    >;
}
