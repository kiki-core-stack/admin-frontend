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
    build: { transpile: [] },
    compatibilityDate: 'latest',
    css: ['@/assets/scss/index.scss'],
    devServer: {
        host: process.env.DEV_SERVER_HOST,
        port: Number(process.env.DEV_SERVER_PORT) || undefined,
    },
    experimental: { typescriptPlugin: true },
    kikiutilsNuxt: { autoImportUtils: { '@kikiutils/shared': {} } },
    modules: ['@kikiutils/nuxt'],
    nitro: {
        apiBaseURL: '/_api',
        preset: process.env.NITRO_PRESET || 'node-cluster',
    },
    plugins: [],
    routeRules: {},
    ssr: true,
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
        optimizeDeps: { include: [] },
        server: { allowedHosts: process.env.DEV_VITE_SERVER_ALLOWED_HOSTS?.split(',').filter(Boolean) },
    },
});
