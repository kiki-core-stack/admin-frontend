export async function logout(noAlert: boolean = false) {
    if (!noAlert) showLoadingAlert('登出中...');
    const response = await AuthApi.use().logout();
    if (!response?.data?.success) return !noAlert && showErrorAlert('登出失敗');
    assignUrlWithRedirectParamFromCurrentLocation('/auth/login/', 1000);
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
