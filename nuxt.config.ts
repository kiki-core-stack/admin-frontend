import { checkAndGetEnvValue } from '@kikiutils/shared/env';

// Constants/Variables
const envValidationSkipped = process.env.SKIP_ENV_VALIDATION === 'true';
const seoIndexingEnabled = process.env.SEO_INDEXING_ENABLED?.trim() !== 'false';

const siteDescription = 'nuxt template';
const siteName = 'nuxt template';
const siteTitle = 'nuxt template';
const siteUrl = (envValidationSkipped ? process.env.NUXT_SITE_URL : checkAndGetEnvValue('NUXT_SITE_URL'))
    ?.trim()
    .replace(/\/+$/, '');

// https://nuxt.com/docs/api/configuration/nuxt-config
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
    icon: {
        clientBundle: {
            icons: [],
            includeCustomCollections: true,
        },
        componentName: 'NuxtIcon',
        customCollections: [
            {
                dir: './app/assets/icons',
                prefix: 'icon',
                recursive: true,
            },
        ],
        localApiEndpoint: '/_api/_nuxt_icon',
        mode: 'svg',
    },
    kikiutilsNuxt: {
        autoImportUtils: { '@kikiutils/shared': {} },
        enabledModules: {
            robots: false,
            security: true,
        },
    },
    linkChecker: { enabled: false },
    modules: [
        '@kikiutils/nuxt',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/seo',
        '@vite-pwa/nuxt',
    ],
    nitro: {
        apiBaseURL: '/_api',
        preset: process.env.NITRO_PRESET || 'node-cluster',
    },
    ogImage: { enabled: false },
    plugins: [],
    pwa: {
        client: { periodicSyncForUpdates: 60 * 60 },
        devOptions: { enabled: false },
        filename: 'sw.ts',
        injectManifest: { globPatterns: [] },
        manifest: {
            background_color: 'to be fill',
            description: siteDescription,
            display: 'standalone',
            icons: [
                {
                    sizes: '192x192',
                    src: '/icon-192x192.png',
                    type: 'image/png',
                },
                {
                    purpose: 'any',
                    sizes: '512x512',
                    src: '/icon-512x512.png',
                    type: 'image/png',
                },
                {
                    purpose: 'maskable',
                    sizes: '512x512',
                    src: '/icon-maskable-512x512.png',
                    type: 'image/png',
                },
            ],
            id: '/',
            lang: 'zh-TW',
            name: siteName,
            scope: '/',
            short_name: siteName,
            start_url: '/',
            theme_color: 'to be fill',
        },
        registerType: 'prompt',
        srcDir: 'service-worker',
        strategies: 'injectManifest',
    },
    robots: { disallow: seoIndexingEnabled ? undefined : '/' },
    routeRules: {},
    runtimeConfig: { public: { siteUrl } },
    schemaOrg: {
        enabled: seoIndexingEnabled,
        identity: {
            '@type': [],
            'logo': `${siteUrl}/favicon.ico`,
            'name': siteName,
            'url': siteUrl,
        },
    },
    security: {
        headers: {
            contentSecurityPolicy: {
                'connect-src': [
                    `'self'`,
                    'https://*.analytics.google.com',
                    'https://*.google-analytics.com',
                    'https://*.googletagmanager.com',
                    'https://fonts.googleapis.com',
                    'https://fonts.gstatic.com',
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
                    `'sha256-F1noxsLOnJhyRSgc0zu5JgzoLjG2BBMaXaSG24k2mRM='`,
                    `'sha256-bwK6T5wZVTANitXbrTsel7kl/PyCjCd/Dq5Qoz3imjM='`,
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
    seo: {},
    site: {
        defaultLocale: 'zh-TW',
        description: siteDescription,
        indexable: seoIndexingEnabled,
        name: siteName,
        url: siteUrl,
    },
    sitemap: {
        autoI18n: false,
        cacheMaxAgeSeconds: 900,
        defaultSitemapsChunkSize: false,
        enabled: seoIndexingEnabled,
        minify: process.env.NODE_ENV === 'production',
        sitemaps: {},
        sortEntries: true,
    },
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
        server: { allowedHosts: (process.env.DEV_VITE_SERVER_ALLOWED_HOSTS || '').split(',') },
    },
});
