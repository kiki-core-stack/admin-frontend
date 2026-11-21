export default defineNuxtConfig({
    kikiutilsNuxt: { enabledModules: { security: true } },
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
                    // Allow the @nuxt/image onerror handler to mark failed images.
                    // Handler: this.setAttribute('data-error', 1)
                    `'sha256-bwK6T5wZVTANitXbrTsel7kl/PyCjCd/Dq5Qoz3imjM='`,
                    // Allow the unplugin-fonts onload handler to activate the preloaded Google Fonts stylesheet.
                    // Handler: this.rel='stylesheet'
                    `'sha256-F1noxsLOnJhyRSgc0zu5JgzoLjG2BBMaXaSG24k2mRM='`,
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
        rateLimiter: false,
    },
});
