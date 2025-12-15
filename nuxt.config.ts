// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: { lang: 'zh-Hant-TW' },
            title: '總後台',
            titleTemplate: '%s｜總後台',
        },
        keepalive: true,
    },
    compatibilityDate: '2100-01-01',
    css: ['@/assets/scss/index.scss'],
    devServer: {
        host: process.env.DEV_SERVER_HOST,
        port: Number(process.env.DEV_SERVER_PORT) || undefined,
    },
    experimental: {
        extractAsyncDataHandlers: true,
        typescriptPlugin: true,
    },
    i18n: {
        defaultLocale: 'zh-TW',
        locales: [
            {
                code: 'zh-TW',
                files: [
                    'zh-TW/index.ts',
                    'zh-TW/permissions.ts',
                ],
                name: '繁體中文',
            },
        ],
        strategy: 'no_prefix',
    },
    icon: {
        clientBundle: { scan: true },
        componentName: 'NuxtIcon',
        customCollections: [
            {
                dir: './app/assets/icons',
                prefix: 'icon',
                recursive: true,
            },
        ],
        mode: 'svg',
        provider: 'none',
    },
    kikiutilsNuxt: {
        autoImportUtils: {
            '@kikiutils/shared': {
                datetime: true,
                elementPlus: true,
                enum: true,
                random: true,
            },
        },
        enabledModules: {
            colorMode: true,
            elementPlus: true,
            robots: true,
            security: true,
        },
        unoCss: { enabledResets: false },
    },
    modules: [
        '@kikiutils/nuxt',
        '@nuxt/icon',
        '@nuxtjs/i18n',
    ],
    plugins: [
        '@/plugins/auth-redirect',
        '@/plugins/init-session',
    ],
    robots: { disallow: '/' },
    security: {
        headers: {
            contentSecurityPolicy: {
                'img-src': [
                    `'self'`,
                    'blob:',
                    'data:',
                ],
                'media-src': [
                    `'self'`,
                    'blob:',
                ],
                'script-src-attr': [
                    `'unsafe-hashes'`,
                    `'sha256-nNExX8dGhf3ce7nlLMW210YbT1+ATSaoMpg5lf/l+Ng='`,
                ],
            },
            permissionsPolicy: { camera: ['self'] },
        },
    },
    ssr: false,
    typescript: { tsConfig: { include: ['./vite-components.d.ts'] } },
    vite: { server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') } },
    // eslint-disable-next-line style/max-len
    vitePluginWebfontDl: { webfontUrls: ['https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap'] },
});
