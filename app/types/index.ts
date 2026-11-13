import type { WithAdminAuditData } from '@kcs-project/pack/types/data';
import type { OmitMongooseTimestampAndOtherFields } from '@kikiutils/mongoose/types';

declare global {
    /**
     * Form data sent by `BaseCrudApi` create/update: the editable fields of a row, without `id`, timestamps and audit
     * fields (the edited row is identified by the row itself).
     */
    type CrudFormData<T extends object, O extends Exclude<keyof T, 'id' | keyof WithAdminAuditData> = never> = Required<
        OmitMongooseTimestampAndOtherFields<T, 'id' | keyof WithAdminAuditData | O>
    >;
}
