// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Nuxt Template',
            titleTemplate: '%s｜Nuxt Template',
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
        asyncContext: true,
        browserDevtoolsTiming: true,
        extractAsyncDataHandlers: true,
        navigationRepaint: true,
        typescriptPlugin: true,
        viewTransition: true,
        watcher: 'parcel',
    },
    kikiutilsNuxt: { enabledModules: { security: true } },
    modules: ['@kikiutils/nuxt'],
    nitro: { preset: process.env.NITRO_PRESET || 'node-cluster' },
    security: {
        headers: {
            contentSecurityPolicy: {
                'script-src-attr': [
                    `'unsafe-hashes'`,
                    `'sha256-F1noxsLOnJhyRSgc0zu5JgzoLjG2BBMaXaSG24k2mRM='`,
                ],
            },
        },
    },
    ssr: true,
    unfonts: {
        google: {
            families: [
                // {
                //     name: 'Noto+Sans+TC',
                //     styles: 'wght@100..900',
                // },
            ],
        },
        inlineFontFace: false,
    },
    vite: { server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') } },
});
