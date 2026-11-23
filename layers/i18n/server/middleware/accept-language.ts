// With browser-language detection on, `/` redirects by Accept-Language. Crawlers and link-preview bots send
// arbitrary or no Accept-Language, so they would land on varying locales and the default-locale `/` would never
// be indexed. Treat them, and visitors without the header, as the default locale; hreflang points crawlers to
// the other locale versions. Visitors sending an unsupported language still get `fallbackLocale`.
const botUserAgentPattern = new RegExp(
    [
        'bot',
        'crawl',
        'daumoa',
        'embedly',
        'facebookexternalhit',
        'google-inspectiontool',
        'iframely',
        'kakaotalk-scrap',
        'skypeuripreview',
        'slurp',
        'spider',
        'whatsapp',
        'yeti',
    ].join('|'),
    'i',
);

export default defineEventHandler((event) => {
    const isBot = botUserAgentPattern.test(getRequestHeader(event, 'user-agent') ?? '');
    if (!isBot && getRequestHeader(event, 'accept-language')) return;
    event.node.req.headers['accept-language'] = useRuntimeConfig(event).public.i18n.defaultLocale;
});
