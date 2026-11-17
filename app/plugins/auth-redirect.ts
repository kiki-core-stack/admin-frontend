import {
    loginPagePath,
    secondFactorSetupPagePath,
} from '@/constants/auth';

const noLoginRequiredPathPrefixes = new Set([]);

export default defineNuxtPlugin(() => {
    const route = useRoute();
    for (const prefix of noLoginRequiredPathPrefixes) if (route.fullPath.startsWith(prefix)) return;

    const isLoginPage = route.path.startsWith(loginPagePath.slice(0, -1));
    const isSecondFactorSetupPage = route.path.startsWith(secondFactorSetupPagePath.slice(0, -1));
    const profile = useProfileState().value;
    if (!profile.id) {
        if (!isLoginPage) assignUrlWithRedirectParamFromCurrentLocation(loginPagePath);
    } else if (profile.restricted) {
        // A restricted session may only set up two-factor authentication.
        if (!isSecondFactorSetupPage) assignUrlWithRedirectParamFromCurrentLocation(secondFactorSetupPagePath);
    } else if (isLoginPage || isSecondFactorSetupPage) {
        globalThis.location.assign(normalizeRedirectPath(route.query.redirect));
    }
});
