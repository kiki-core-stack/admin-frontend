import type { EmailSenderIdentityData } from '@kiki-core-stack/pack/types/data/email';

export class EmailSenderIdentityApi extends BaseCrudApi<EmailSenderIdentityData> {
    constructor() {
        super('/api/admin/email/sender-identity');
    }
}
