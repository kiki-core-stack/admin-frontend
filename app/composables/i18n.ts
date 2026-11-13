import type {
    Locale,
    LocalizedMessages,
} from '@kcs-project/pack/types/i18n';
import type { Composer } from 'vue-i18n';

export const use$t: Composer['t'] = (...args: any) => useNuxtApp().$i18n.t(
    // @ts-expect-error Ignore this error.
    ...args,
);

/**
 * The message in the app's current locale, for texts defined with their translations (pack enum labels, generated
 * permission labels). App locale codes must match the pack `Locale` codes.
 */
export function localize(messages: LocalizedMessages) {
    return messages[useNuxtApp().$i18n.locale.value as Locale];
}
