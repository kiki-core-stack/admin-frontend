export default defineNuxtPlugin(async () => {
    const isLoginPage = useRoute().fullPath.startsWith('/auth/login');
    if ((await updateProfileState()).value.id) {
        if (isLoginPage) window.location.assign(extractFirstValue(useRoute().query.redirect, '/'));
    } else if (!isLoginPage) assignUrlWithRedirectParamFromCurrentLocation('/auth/login');
});
