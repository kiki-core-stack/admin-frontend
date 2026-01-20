import type { Composer } from 'vue-i18n';

export const use$t: Composer['t'] = (...args: any) => useNuxtApp().$i18n.t(
    // @ts-expect-error Ignore this error.
    ...args,
);
