import { siteDefaultLocale } from '../../shared/site';

export default defineNuxtConfig({
    i18n: {
        // Absolute URLs for the SEO head; NUXT_SITE_URL is validated by the seo layer.
        baseUrl: process.env.NUXT_SITE_URL?.trim().replace(/\/+$/, ''),
        defaultLocale: siteDefaultLocale,
        detectBrowserLanguage: false,
        locales: [
            {
                code: 'zh-TW',
                file: 'zh-TW.ts',
                language: 'zh-TW',
                name: '繁體中文',
            },
        ],
        strategy: 'prefix_except_default',
    },
    modules: ['@nuxtjs/i18n'],
});
