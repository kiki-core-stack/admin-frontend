export default defineNuxtPlugin(() => {
    const localeHead = useLocaleHead({ lang: true });
    useHead({ htmlAttrs: { lang: () => localeHead.value.htmlAttrs.lang } });
});
