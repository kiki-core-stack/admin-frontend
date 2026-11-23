import { getRequiredEnv } from '@kikiutils/shared/env';

import {
    siteDefaultLocale,
    siteDescription,
    siteName,
} from '../../shared/site';

// Constants/Variables
const envValidationSkipped = process.env.SKIP_ENV_VALIDATION === 'true';
const seoIndexingEnabled = process.env.SEO_INDEXING_ENABLED?.trim() === 'true';
const siteUrl = (envValidationSkipped ? process.env.NUXT_SITE_URL : getRequiredEnv('NUXT_SITE_URL'))
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
            logo: '/favicon.ico',
            name: siteName,
        },
    },
    seo: {},
    site: {
        defaultLocale: siteDefaultLocale,
        description: siteDescription,
        indexable: seoIndexingEnabled,
        name: siteName,
        url: siteUrl,
    },
    sitemap: {
        cacheMaxAgeSeconds: 900,
        defaultSitemapsChunkSize: false,
        enabled: seoIndexingEnabled,
        minify: process.env.NODE_ENV === 'production',
        // sitemaps: {},
        sortEntries: true,
    },
    // Disable old build asset retention and deployment update detection.
    skewProtection: false,
});
