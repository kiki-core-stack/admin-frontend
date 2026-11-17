import { qrCodeLoginApprovalPagePath } from '@/constants/auth';

// Functions

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
 * The URL a QR code login shows as its QR code: the approval page of this site, opened by a logged-in device. The
 * token stays in the fragment, which browsers do not send to the server.
 */
export function toQrCodeLoginApprovalUrl(qrToken: string) {
    return `${globalThis.location.origin}${qrCodeLoginApprovalPagePath}#${qrToken}`;
}
