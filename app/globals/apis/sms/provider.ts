import type { SmsProviderData } from '@kcs-project/pack/types/data/sms';

export class SmsProviderApi extends BaseCrudApi<SmsProviderData> {
    constructor() {
        super('/api/admin/sms/provider');
    }

    override processCreateOrUpdateData(data: TablePageFormData<SmsProviderData>) {
        return {
            ...data,
            apiProxyUrl: data.apiProxyUrl?.trim() || undefined,
        };
    }
}
