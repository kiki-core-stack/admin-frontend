const noLoginRequiredPathPrefixes = new Set([]);

export default defineNuxtPlugin(() => {
    const route = useRoute();
    for (const prefix of noLoginRequiredPathPrefixes) if (route.fullPath.startsWith(prefix)) return;

    const isLoginPage = route.fullPath.startsWith('/auth/login');
    if (useProfileState().value.id) {
        if (isLoginPage) globalThis.location.assign(normalizeRedirectPath(route.query.redirect));
    } else if (!isLoginPage) assignUrlWithRedirectParamFromCurrentLocation('/auth/login');
});
