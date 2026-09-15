// Constants/Variables
const siteName = '總後台';
const siteTitle = '總後台';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: siteTitle,
            titleTemplate: `%s｜${siteName}`,
        },
        keepalive: true,
    },
    build: { transpile: ['@kcs-project/pack'] },
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
    hooks: {
        'prepare:types': function ({ tsConfig }) {
            delete tsConfig.compilerOptions?.paths?.['~'];
            delete tsConfig.compilerOptions?.paths?.['~/*'];
        },
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
        clientBundle: {
            icons: [],
            includeCustomCollections: true,
            scan: true,
        },
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
                'base-uri': [`'self'`],
                'connect-src': [
                    `'self'`,
                    'https://*.analytics.google.com',
                    'https://*.google-analytics.com',
                    'https://*.googletagmanager.com',
                    'https://fonts.googleapis.com',
                    'https://fonts.gstatic.com',
                    'https://stats.g.doubleclick.net',
                    'https://i.ytimg.com',
                    'https://s.ytimg.com',
                    'https://www.youtube.com',
                    'https://www.youtube-nocookie.com',
                ],
                'default-src': [`'none'`],
                'font-src': [
                    `'self'`,
                    'data:',
                    'https://fonts.gstatic.com',
                ],
                'frame-src': [
                    `'self'`,
                    'https://www.youtube.com',
                    'https://www.youtube-nocookie.com',
                ],
                'img-src': [
                    `'self'`,
                    'blob:',
                    'data:',
                    'https://*.google-analytics.com',
                    'https://*.googletagmanager.com',
                    'https://i.ytimg.com',
                ],
                'manifest-src': [`'self'`],
                'media-src': [`'self'`],
                'script-src': [
                    `'self'`,
                    'https:',
                    `'unsafe-inline'`,
                    `'strict-dynamic'`,
                    `'nonce-{{nonce}}'`,
                ],
                'script-src-attr': [
                    `'unsafe-hashes'`,
                    // @nuxt/image image error marker onerror handler: this.setAttribute('data-error', 1)
                    `'sha256-bwK6T5wZVTANitXbrTsel7kl/PyCjCd/Dq5Qoz3imjM='`,
                    // unplugin-fonts Google Fonts preload 的 onload handler: this.rel='stylesheet'
                    `'sha256-F1noxsLOnJhyRSgc0zu5JgzoLjG2BBMaXaSG24k2mRM='`,
                ],
                'script-src-elem': [
                    `'self'`,
                    `'nonce-{{nonce}}'`,
                    'https://static.cloudflareinsights.com',
                ],
                'style-src': [
                    `'self'`,
                    `'unsafe-inline'`,
                    'https://fonts.googleapis.com',
                ],
                'worker-src': [`'self'`],
            },
            crossOriginEmbedderPolicy: false,
            permissionsPolicy: {
                'camera': ['self'],
                'encrypted-media': [
                    'self',
                    '"https://www.youtube.com"',
                    '"https://www.youtube-nocookie.com"',
                ],
                'fullscreen': [
                    'self',
                    '"https://www.youtube.com"',
                    '"https://www.youtube-nocookie.com"',
                ],
            },
            referrerPolicy: 'strict-origin-when-cross-origin',
        },
    },
    site: {
        defaultLocale: 'zh-TW',
        indexable: false,
        name: siteName,
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
                '@kcs-project/pack/constants',
                '@kcs-project/pack/constants/admin',
                '@kcs-project/pack/constants/email',
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
        server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') },
    },
});
