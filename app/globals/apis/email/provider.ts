import type { EmailProviderData } from '@kcs-project/pack/types/data/email';

import type { EmailProviderFormData } from '@/types/data/email';

export class EmailProviderApi extends BaseCrudApi<EmailProviderData, EmailProviderFormData> {
    constructor() {
        super('/api/admin/email/provider');
    }
}
