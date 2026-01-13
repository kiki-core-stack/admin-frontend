export function initializeAuthenticatedSession() {
    if (!useProfileState().value.id) return;
    pageHeadTabsController.load();
}
