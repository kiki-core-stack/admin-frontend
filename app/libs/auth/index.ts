import type { AuthLoginResultData } from '@kcs-project/pack/types/data/auth';

import {
    loginPagePath,
    secondFactorSetupPagePath,
} from '@/constants/auth';
import { initializeAuthenticatedSession } from '@/libs/session';

// Functions

/**
 * Continues after a session was issued: a restricted session goes to set up its second factor first, and a normal one
 * to the page the admin came from (the `redirect` query).
 */
export async function enterAuthenticatedSession(result: Extract<AuthLoginResultData, { state: 'completed' }>) {
    const route = useRoute();
    await updateProfileState();
    if (result.restricted) {
        return await navigateTo(
            {
                path: secondFactorSetupPagePath,
                query: { redirect: route.query.redirect },
            },
            { replace: true },
        );
    }

    initializeAuthenticatedSession();
    await navigateTo(normalizeRedirectPath(route.query.redirect), { replace: true });
}

export async function logout(noAlert: boolean = false) {
    if (!noAlert) showLoadingAlert('登出中...');
    const response = await AuthApi.use().logout();
    if (!response.data.success) return !noAlert && showErrorAlert('登出失敗');
    assignUrlWithRedirectParamFromCurrentLocation(loginPagePath, 1000);
    if (noAlert) return;
    showSuccessAlert(
        '登出成功',
        {
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        },
    );
}
