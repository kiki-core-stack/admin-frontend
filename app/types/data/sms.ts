import type { SmsProviderData } from '@kcs-project/pack/types/data/sms';
import type { AnyRecord } from '@kikiutils/shared/types';
import type {
    SetFieldType,
    SetOptional,
} from 'type-fest';

export type SmsProviderFormData = SetOptional<
    TablePageFormData<
        SetFieldType<SmsProviderData, 'config', AnyRecord>,
        'cacheKey'
    >,
    'code'
>;
