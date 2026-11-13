import { EmailProviderCode } from '@kcs-project/pack/constants/email';
import type { EmailProviderData } from '@kcs-project/pack/types/data/email';

import type { EmailProviderFormData } from '@/types/data/email';

export class EmailProviderApi extends BaseCrudApi<EmailProviderData, EmailProviderFormData> {
    constructor() {
        super('/api/admin/email/provider');
    }

    protected override readonly serializeInput = (data: EmailProviderFormData) => {
        data = cloneDeep(data);
        switch (data.code) {
            case EmailProviderCode.Smtp:
                data.config = {
                    ...data.config,
                    password: data.config.password?.trim() || undefined,
                    username: data.config.username?.trim() || undefined,
                };

                break;
            case undefined:
                break;
        }

        return {
            ...data,
            apiProxyUrl: data.apiProxyUrl?.trim() || undefined,
        };
    };
}
