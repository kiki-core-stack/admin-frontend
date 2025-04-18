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
    compatibilityDate: '2100-01-01',
    css: ['@/assets/scss/index.scss'],
    devServer: {
        host: process.env.DEV_SERVER_HOST,
        port: Number(process.env.DEV_SERVER_PORT) || undefined,
    },
    googleFonts: { families: { 'Noto Sans TC': '100..900' } },
    imports: { dirs: ['./globals/**/*.ts'] },
    kikiutilsNuxt: {
        enabledModules: {
            colorMode: true,
            elementPlus: true,
            googleFonts: true,
            robots: true,
            security: true,
        },
        enabledUtils: {
            clipboard: true,
            datetime: true,
            hash: true,
        },
    },
    modules: [
        '@kikiutils/nuxt',
        'unplugin-icons/nuxt',
    ],
    postcss: { plugins: { 'postcss-pxtorem': {} } },
    robots: { disallow: '/' },
    security: {
        headers: {
            contentSecurityPolicy: {
                'img-src': [
                    `'self'`,
                    'blob:',
                ],
                'media-src': [
                    `'self'`,
                    'blob:',
                ],
            },
        },
    },
    ssr: false,
    typescript: { tsConfig: { include: ['./vite-components.d.ts'] } },
    vite: {
        plugins: [
            ViteComponents({
                dts: './.nuxt/vite-components.d.ts',
                resolvers: [IconsResolver()],
            }),
        ],
        server: {
            allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(','),
            hmr: { protocol: process.env.DEV_VITE_SERVER_HMR_PROTOCOL },
        },
    },
});
