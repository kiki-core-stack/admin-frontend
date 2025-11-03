import IconsResolver from 'unplugin-icons/resolver';
import ViteComponents from 'unplugin-vue-components/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: { lang: 'zh-Hant-TW' },
            title: '後台管理系統',
            titleTemplate: '%s｜後台管理系統',
        },
        keepalive: true,
    },
    colorMode: { storage: 'localStorage' },
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
    kikiutilsNuxt: {
        autoImportUtils: {
            '@kikiutils/shared': {
                clipboard: true,
                datetime: true,
                elementPlus: true,
                enhancedLocalStorage: true,
                enum: true,
                general: true,
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
        'unplugin-icons/nuxt',
    ],
    plugins: [
        '@/plugins/init-system-type',
        '@/plugins/auth-redirect',
        '@/plugins/init-session',
    ],
    postcss: { plugins: { 'postcss-pxtorem': {} } },
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
            },
            permissionsPolicy: { camera: ['self'] },
        },
    },
    ssr: false,
    typescript: { tsConfig: { include: ['./vite-components.d.ts'] } },
    unfonts: {
        google: {
            families: [
                {
                    name: 'Noto+Sans+TC',
                    styles: 'wght@100..900',
                },
            ],
        },
    },
    vite: {
        plugins: [
            ViteComponents({
                dts: '../.nuxt/vite-components.d.ts',
                resolvers: [IconsResolver()],
            }),
        ],
        server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') },
    },
});
