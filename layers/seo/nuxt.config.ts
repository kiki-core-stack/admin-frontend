import { checkAndGetEnvValue } from '@kikiutils/shared/env';

import {
    siteDescription,
    siteName,
} from '../../shared/site';

// Constants/Variables
const envValidationSkipped = process.env.SKIP_ENV_VALIDATION === 'true';
const seoIndexingEnabled = process.env.SEO_INDEXING_ENABLED?.trim() === 'true';
const siteUrl = (envValidationSkipped ? process.env.NUXT_SITE_URL : checkAndGetEnvValue('NUXT_SITE_URL'))
    ?.trim()
    .replace(/\/+$/, '');

export default defineNuxtConfig({
    // Disable AI-readable Markdown pages and discovery endpoints.
    aiReady: false,
    linkChecker: { enabled: false },
    modules: ['@nuxtjs/seo'],
    ogImage: { enabled: false },
    schemaOrg: {
        enabled: seoIndexingEnabled,
        identity: {
            '@type': [],
            'logo': `${siteUrl}/favicon.ico`,
            'name': siteName,
            'url': siteUrl,
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
    // Disable old build asset retention and deployment update detection.
    skewProtection: false,
});
