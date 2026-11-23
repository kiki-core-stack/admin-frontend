import { clientsClaim } from '@vite-pwa/workbox-swkit/core';
import {
    cleanupOutdatedCaches,
    precacheAndRoute,
} from '@vite-pwa/workbox-swkit/precaching';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Parameters<typeof precacheAndRoute>[0] };

// Precaching
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Lifecycle

// `registerType: 'autoUpdate'` expects the worker to activate itself instead of waiting for open pages to close.
void self.skipWaiting();
clientsClaim();

// Event listeners
self.addEventListener(
    'message',
    (event) => {
        switch (event.data?.type) {
            // Lets the page probe whether a service worker is controlling it.
            case 'PING':
                event.source?.postMessage({ type: 'PONG' });
                break;
        }
    },
);
