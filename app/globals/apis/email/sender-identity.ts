import type { EmailSenderIdentityData } from '@kcs-project/pack/types/data/email';

export class EmailSenderIdentityApi extends BaseCrudApi<EmailSenderIdentityData> {
    constructor() {
        super('/api/admin/email/sender-identity');
    }
}
