import { EmailServiceProvider } from '@kiki-core-stack/pack/constants/email';
import type { EmailPlatformData } from '@kiki-core-stack/pack/types/data/email';

export class EmailPlatformApi extends BaseCrudApi<EmailPlatformData> {
    constructor() {
        super('/api/admin/email/platform');
    }

    override processCreateOrUpdateData(data: TablePageFormData<EmailPlatformData>) {
        data = cloneDeep(data);
        switch (data.serviceProvider) {
            case EmailServiceProvider.Smtp:
                data.config = {
                    ...data.config,
                    password: data.config.password?.trim() || undefined,
                    username: data.config.username?.trim() || undefined,
                };

                break;
        }

        return data;
    }
}
