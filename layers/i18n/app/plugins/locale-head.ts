// @nuxtjs/i18n only emits hreflang alternates, the locale-aware canonical and og:locale through useLocaleHead;
// nuxt-seo-utils does not add hreflang.
export default defineNuxtPlugin(() => {
    const localeHead = useLocaleHead();
    useHead(() => ({
        htmlAttrs: { lang: localeHead.value.htmlAttrs.lang },
        link: localeHead.value.link,
        meta: localeHead.value.meta,
    }));
});
