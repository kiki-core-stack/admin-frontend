import { EmailProviderCode } from '@kiki-core-stack/pack/constants/email';
import type { EmailProviderData } from '@kiki-core-stack/pack/types/data/email';

export class EmailProviderApi extends BaseCrudApi<EmailProviderData> {
    constructor() {
        super('/api/admin/email/provider');
    }

    override processCreateOrUpdateData(data: TablePageFormData<EmailProviderData>) {
        data = cloneDeep(data);
        switch (data.providerCode) {
            case EmailProviderCode.Smtp:
                data.config = {
                    ...data.config,
                    password: data.config.password?.trim() || undefined,
                    username: data.config.username?.trim() || undefined,
                };

                break;
        }

        return {
            ...data,
            apiProxyUrl: data.apiProxyUrl?.trim() || undefined,
        };
    }
}
