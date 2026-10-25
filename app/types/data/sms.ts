import type { SmsProviderData } from '@kcs-project/pack/types/data/sms';
import type {
    SetFieldType,
    SetOptional,
} from 'type-fest';

export type SmsProviderFormData = SetOptional<
    TablePageFormData<
        SetFieldType<SmsProviderData, 'config', Record<string, any>>,
        'cacheKey'
    >,
    'code'
>;
