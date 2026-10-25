import type { EmailProviderData } from '@kcs-project/pack/types/data/email';
import type {
    SetFieldType,
    SetOptional,
} from 'type-fest';

export type EmailProviderFormData = SetOptional<
    TablePageFormData<
        SetFieldType<EmailProviderData, 'config', Record<string, any>>,
        'cacheKey'
    >,
    'code'
>;
