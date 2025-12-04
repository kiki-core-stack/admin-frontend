import type { RemoveIndexSignature } from '@intlify/core-base';
import type {
    ComposerTranslation,
    DefineLocaleMessage,
} from 'vue-i18n';

// @ts-expect-error Ignore this error.
export const use$t: ComposerTranslation<
    object,
    'zh-TW',
    RemoveIndexSignature<{ [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]; }>
    // @ts-expect-error Ignore this error.
> = (...args) => useNuxtApp().$i18n.t(...args);
