import { localeDefinitions } from '@kcs-project/pack/i18n/locales';

import { siteDefaultLocale } from '../../shared/site';

export default defineNuxtConfig({
    i18n: {
        defaultLocale: siteDefaultLocale,
        locales: localeDefinitions.map((definition) => ({
            ...definition,
            files: [`${definition.code}/index.ts`],
        })),
        strategy: 'no_prefix',
    },
    modules: ['@nuxtjs/i18n'],
});
