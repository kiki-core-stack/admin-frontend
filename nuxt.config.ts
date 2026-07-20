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
    compatibilityDate: 'latest',
    css: ['@/assets/scss/index.scss'],
    devServer: {
        host: process.env.DEV_SERVER_HOST,
        port: Number(process.env.DEV_SERVER_PORT) || undefined,
    },
    experimental: {
        asyncContext: true,
        extractAsyncDataHandlers: true,
        typescriptPlugin: true,
        watcher: 'builder',
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
    },
    modules: [
        '@kikiutils/nuxt',
        '@nuxt/icon',
        '@nuxtjs/i18n',
    ],
    plugins: [
        '@/plugins/load-profile',
        '@/plugins/auth-redirect',
        '@/plugins/initialize-session',
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
                    `'sha256-F1noxsLOnJhyRSgc0zu5JgzoLjG2BBMaXaSG24k2mRM='`,
                ],
            },
            permissionsPolicy: { camera: ['self'] },
        },
    },
    ssr: false,
    unfonts: {
        google: {
            families: [
                {
                    name: 'Noto+Sans+TC',
                    styles: 'wght@100..900',
                },
            ],
        },
        inlineFontFace: false,
    },
    vite: {
        optimizeDeps: {
            include: [
                '@kiki-core-stack/pack/constants',
                '@kiki-core-stack/pack/constants/admin',
                '@kiki-core-stack/pack/constants/email',
                '@kikiutils/micromatch',
                '@kikiutils/shared/datetime',
                '@kikiutils/shared/element-plus',
                '@kikiutils/shared/enum',
                '@kikiutils/shared/random',
                '@kikiutils/shared/url',
                '@kikiutils/shared/vue',
                '@kikiutils/shared/web',
                '@sylke/email-validation',
                '@vueuse/integrations/useQRCode',
                'axios',
                'bowser',
                'dayjs',
                'dayjs/plugin/*.js',
                'es-toolkit',
                'es-toolkit/compat',
                'html5-qrcode',
                'lodash-unified',
                'nanoid',
                'query-string',
                'sweetalert2',
            ],
        },
        plugins: [
            {
                enforce: 'post',
                name: 'fix-vite-plugin-checker-runtime-path',
                transform(code, id) {
                    if (id !== 'virtual:@vite-plugin-checker-runtime-entry') return;
                    return code.replace('"/_nuxt/@vite-plugin-checker-runtime"', '"/@vite-plugin-checker-runtime"');
                },
            },
        ],
        server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') },
    },
});
