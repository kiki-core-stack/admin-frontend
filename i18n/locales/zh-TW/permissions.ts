import type {
    AdminPermission,
    AdminPermissionGroup,
} from '@/generated/static/types/admin/permission';

import type { PermissionsLocaleMessages } from '../types';

const permissionLabels: Record<AdminPermission | AdminPermissionGroup, string> = {
    'admin': '管理員',
    'admin.create': '建立管理員',
    'admin.delete': '刪除管理員',
    'admin.list': '獲取管理員列表',
    'admin.log': '管理員日誌',
    'admin.log.list': '獲取管理員日誌列表',
    'admin.role': '管理員身分組',
    'admin.role.create': '建立管理員身分組',
    'admin.role.delete': '刪除管理員身分組',
    'admin.role.list': '獲取管理員身分組列表',
    'admin.role.update': '更新管理員身分組',
    'admin.toggle': '切換管理員狀態',
    'admin.update': '更新管理員',
    'email': '電子郵件',
    'email.platform': '電子郵件平台',
    'email.platform.create': '建立電子郵件平台',
    'email.platform.delete': '刪除電子郵件平台',
    'email.platform.list': '獲取電子郵件平台列表',
    'email.platform.toggle': '切換電子郵件平台狀態',
    'email.platform.update': '更新電子郵件平台',
    'email.senderIdentity': '電子郵件寄件身份',
    'email.senderIdentity.create': '建立電子郵件寄件身份',
    'email.senderIdentity.delete': '刪除電子郵件寄件身份',
    'email.senderIdentity.list': '獲取電子郵件寄件身份列表',
    'email.senderIdentity.toggle': '切換電子郵件寄件身份狀態',
    'email.senderIdentity.update': '更新電子郵件寄件身份',
    'email.sendRecord': '電子郵件發送紀錄',
    'email.sendRecord.list': '獲取電子郵件發送紀錄列表',
    'home': '首頁',
    'home.dashboard': '首頁儀錶板',
    'home.dashboard.view': '獲取首頁儀表板資料',
};

export default defineI18nLocale<PermissionsLocaleMessages>(
    () => Object.fromEntries(
        Object.entries(permissionLabels).map(([key, value]) => [
            `permissions.${key}`,
            value,
        ]),
    ) as PermissionsLocaleMessages,
);
