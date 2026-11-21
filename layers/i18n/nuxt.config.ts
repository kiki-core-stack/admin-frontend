import { siteDefaultLocale } from '../../shared/site';

export default defineNuxtConfig({
    i18n: {
        defaultLocale: siteDefaultLocale,
        locales: [
            {
                code: 'zh-TW',
                files: ['zh-TW/index.ts'],
                language: 'zh-TW',
                name: '繁體中文',
            },
        ],
        strategy: 'no_prefix',
    },
    modules: ['@nuxtjs/i18n'],
});
