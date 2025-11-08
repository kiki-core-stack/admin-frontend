import type { EmailSendRecordData } from '@kiki-core-stack/pack/types/data/email';

export class EmailSendRecordApi extends BaseCrudApi<EmailSendRecordData> {
    constructor() {
        super('/api/admin/email/send-record');
    }
}
