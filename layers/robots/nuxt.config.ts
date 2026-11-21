export default defineNuxtConfig({
    app: {
        head: {
            meta: [
                {
                    content: 'noindex, nofollow',
                    name: 'robots',
                },
            ],
        },
    },
    robots: { disallow: '/' },
    site: { indexable: false },
});
