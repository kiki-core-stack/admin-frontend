// The admin SPA uses no_prefix and is not indexed, so hreflang, canonical and og:locale serve no purpose;
// only <html lang> is set.
export default defineNuxtPlugin(() => {
    const localeHead = useLocaleHead({
        dir: false,
        seo: false,
    });

    useHead({ htmlAttrs: { lang: () => localeHead.value.htmlAttrs.lang } });
});
