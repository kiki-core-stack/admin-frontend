export default defineNuxtConfig({
    i18n: {
        defaultLocale: 'zh-TW',
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
