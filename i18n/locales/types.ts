import type {
    AdminPermissionGroup,
    AdminPermissionKey,
} from '@/generated/static/types/admin/permission';
import type { ApiResponseErrorCode } from '@/types/api';

export type PermissionsLocaleMessages = Record<`permissions.${AdminPermissionGroup | AdminPermissionKey}`, string>;

export interface AppLocaleMessages {
    common: {
        account: string;
        actions: string;
        cancel: string;
        login: string;
        logout: string;
        password: string;
        search: string;
    };

    errors: { apiResponse: { code: Record<Exclude<ApiResponseErrorCode, 'aborted'>, string> } };
    pages: {
        auth: {
            login: {
                qrCodeLogin: string;
                title: string;
            };
        };
    };
}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends AppLocaleMessages, PermissionsLocaleMessages {}
}
