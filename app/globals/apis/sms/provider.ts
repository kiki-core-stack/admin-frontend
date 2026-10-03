import type { SmsProviderData } from '@kcs-project/pack/types/data/sms';

import type { SmsProviderFormData } from '@/types/data/sms';

export class SmsProviderApi extends BaseCrudApi<SmsProviderData, SmsProviderFormData> {
    constructor() {
        super('/api/admin/sms/provider');
    }

    override processCreateOrUpdateData(data: SmsProviderFormData) {
        return {
            ...data,
            apiProxyUrl: data.apiProxyUrl?.trim() || undefined,
        };
    }
}
