// The admin SPA uses no_prefix and is not indexed, so only <html lang> is set; useLocaleHead would also build SEO links
// and warn about the missing baseUrl.
export default defineNuxtPlugin((nuxtApp) => {
    const { localeProperties } = nuxtApp.$i18n;
    useHead({ htmlAttrs: { lang: () => localeProperties.value.language } });
});
