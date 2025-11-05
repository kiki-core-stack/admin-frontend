export function initializeAppSession() {
    if (!useProfileState().value.id) return;
    pageHeadTabsController.load();
}
