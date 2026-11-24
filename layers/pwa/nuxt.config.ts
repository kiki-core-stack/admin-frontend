import { fileURLToPath } from 'node:url';

import {
    siteBackgroundColor,
    siteDefaultLocale,
    siteDescription,
    siteName,
    siteThemeColor,
} from '../../shared/site';

export default defineNuxtConfig({
    modules: ['@vite-pwa/nuxt'],
    pwa: {
        buildSW: {
            globPatterns: [],
            swSrc: fileURLToPath(new URL('./app/service-worker/sw.ts', import.meta.url)),
        },
        client: { periodicSyncForUpdates: 60 * 60 },
        devOptions: { enabled: false },
        filename: 'sw.js',
        manifest: {
            background_color: siteBackgroundColor,
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
            lang: siteDefaultLocale,
            name: siteName,
            scope: '/',
            short_name: siteName,
            start_url: '/',
            theme_color: siteThemeColor,
        },
        // Update prompts are app-specific UI; switch to 'prompt' once an app ships one.
        registerType: 'autoUpdate',
        strategies: 'buildSW',
    },
});
