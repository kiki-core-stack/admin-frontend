import {
    siteName,
    siteTitle,
} from './shared/site';

// Nuxt configuration reference: https://nuxt.com/docs/api/configuration/nuxt-config
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
    experimental: { typescriptPlugin: true },
    kikiutilsNuxt: {
        autoImportUtils: { '@kikiutils/shared': { elementPlus: true } },
        enabledModules: {
            colorMode: true,
            elementPlus: true,
        },
    },
    modules: ['@kikiutils/nuxt'],
    // Pack ships TypeScript sources and the i18n locale files import its messages, which Nitro also bundles; its
    // esbuild transform skips node_modules by default.
    nitro: { esbuild: { options: { exclude: /node_modules\/(?!(?:\.pnpm\/)?@[\w-]+[+/]pack[/@])/ } } },
    plugins: [
        '@/plugins/load-profile',
        '@/plugins/auth-redirect',
        '@/plugins/initialize-session',
    ],
    routeRules: {},
    ssr: false,
    typescript: { nodeTsConfig: { include: ['../scripts/**/*.ts'] } },
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
                '@kcs-project/pack/constants/ws.io-event-names',
                '@kcs-project/pack/libs/permission',
                '@kcs-project/pack/libs/ws.io',
                '@kikiutils/shared/datetime',
                '@kikiutils/shared/element-plus',
                '@kikiutils/shared/enum',
                '@kikiutils/shared/url',
                '@kikiutils/shared/vue',
                '@kikiutils/shared/web',
                '@vueuse/integrations/useQRCode',
                'axios',
                'bowser',
                'cropperjs',
                'es-toolkit',
                'es-toolkit/compat',
                'html5-qrcode',
                'nanoid',
                'query-string',
                'sweetalert2',
            ],
        },
        server: { allowedHosts: process.env.DEV_VITE_SERVER_ALLOWED_HOSTS?.split(',').filter(Boolean) },
    },
});
