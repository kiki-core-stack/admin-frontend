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
            // Sent by the update prompt (`registerType: 'prompt'`) to activate the waiting worker.
            case 'SKIP_WAITING':
                event.waitUntil(self.skipWaiting());
                break;
        }
    },
);
