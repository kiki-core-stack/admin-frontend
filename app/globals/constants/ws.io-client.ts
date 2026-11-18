import { createWsIoClient } from '@kcs-project/pack/libs/ws.io';
import type { WsIoEvents } from '@kcs-project/pack/types/ws.io-events';

import { loginPagePath } from '@/constants/auth';
import { isSessionEndExpected } from '@/libs/session';

// Constants/Variables
export const wsIoClient = createWsIoClient<WsIoEvents.ToServer, WsIoEvents.ToAdminFrontend>(
    `${window.location.origin.replace('http', 'ws')}/admin-frontend`,
);

// Register events
wsIoClient.on(
    WsIoEventNames.ToAdminFrontend.ForceLogout,
    () => {
        void wsIoClient.disconnect();
        if (isSessionEndExpected()) return;
        showErrorAlert('該裝置已被登出', { willClose: () => assignUrlWithRedirectParamFromCurrentLocation(loginPagePath) });
    },
);
