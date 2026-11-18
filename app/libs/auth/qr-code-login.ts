import { qrCodeLoginApprovalPagePath } from '@/constants/auth';

// Constants
const stashedTokenStorageKey = 'auth:qrCodeLoginToken';

// Functions
export const clearStashedQrCodeLoginToken = () => sessionStorage.removeItem(stashedTokenStorageKey);
export const getStashedQrCodeLoginToken = () => sessionStorage.getItem(stashedTokenStorageKey) ?? '';

/**
 * The QR code login token carried by an approval URL (see `toQrCodeLoginApprovalUrl`), if the text is one.
 */
export function parseQrCodeLoginApprovalUrl(text: string) {
    if (!URL.canParse(text)) return;
    const url = new URL(text);
    if (url.origin !== globalThis.location.origin || url.pathname !== qrCodeLoginApprovalPagePath) return;
    return url.hash.slice(1) || undefined;
}

/**
 * Keeps the token of the approval page in this tab's session storage, so the approval page finds it again after a
 * reload or a login round trip without the token staying in the address bar.
 */
export const stashQrCodeLoginToken = (qrToken: string) => sessionStorage.setItem(stashedTokenStorageKey, qrToken);

/**
 * Moves the token of the approval page out of the address bar before leaving for another page with the current
 * location as its `redirect` query: the fragment would otherwise end up in a query string, which is sent to the
 * server and may be logged.
 */
export function stashQrCodeLoginTokenFromLocation() {
    const {
        hash,
        pathname,
        search,
    } = globalThis.location;

    if (pathname !== qrCodeLoginApprovalPagePath || hash.length < 2) return;
    stashQrCodeLoginToken(hash.slice(1));
    globalThis.history.replaceState(globalThis.history.state, '', `${pathname}${search}`);
}

/**
 * The URL a QR code login shows as its QR code: the approval page of this site, opened by a logged-in device. The
 * token stays in the fragment, which browsers do not send to the server; the approval page moves it into the session
 * storage once opened.
 */
export function toQrCodeLoginApprovalUrl(qrToken: string) {
    return `${globalThis.location.origin}${qrCodeLoginApprovalPagePath}#${qrToken}`;
}
