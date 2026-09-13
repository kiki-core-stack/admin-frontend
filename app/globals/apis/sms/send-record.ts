import type { SmsSendRecordData } from '@kcs-project/pack/types/data/sms';

export class SmsSendRecordApi extends BaseCrudApi<SmsSendRecordData> {
    constructor() {
        super('/api/admin/sms/send-record');
    }
}
