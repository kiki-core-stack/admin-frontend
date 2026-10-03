import type { EmailProviderData } from '@kcs-project/pack/types/data/email';
import type { AnyRecord } from '@kikiutils/shared/types';
import type {
    SetFieldType,
    SetOptional,
} from 'type-fest';

export type EmailProviderFormData = SetOptional<
    TablePageFormData<
        SetFieldType<EmailProviderData, 'config', AnyRecord>,
        'cacheKey'
    >,
    'code'
>;
