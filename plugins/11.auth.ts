export default defineNuxtPlugin(async () => {
    const urlPath = useRoute().fullPath;
    const isLoginPage = urlPath.startsWith('/login/');
    if ((await updateProfileState()).id) {
        if (isLoginPage) assignToUrlOrNavigateTo(flattenToSingleValue(useRoute().query.redirect, '/'));
    } else if (!isLoginPage) assignToUrlOrNavigateTo('/login/', true);
});
