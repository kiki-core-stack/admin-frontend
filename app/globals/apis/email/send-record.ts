import type { EmailSendRecordData } from '@kcs-project/pack/types/data/email';

export class EmailSendRecordApi extends BaseCrudApi<EmailSendRecordData> {
    constructor() {
        super('/api/admin/email/send-record');
    }
}
