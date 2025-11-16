import type { ReadonlyDeep } from 'type-fest';

import type { SidebarMenuItem } from '@/types/sidebar';

export const sidebarMenuItems: ReadonlyDeep<SidebarMenuItem[]> = [
    {
        path: '/',
        requiredPermissions: 'ignore',
        title: '首頁',
    },
    {
        basePath: '/email/',
        children: [
            {
                path: '/email/platform/',
                requiredPermissions: ['email.platform.*'],
                title: '平台管理',
            },
            {
                path: '/email/sender-identity/',
                requiredPermissions: ['email.senderIdentity.*'],
                title: '寄件身份管理',
            },
            {
                path: '/email/send-record/',
                requiredPermissions: ['email.sendRecord.*'],
                title: '發送記錄',
            },
        ],
        requiredPermissions: 'email.*',
        title: '電子郵件',
    },
    {
        basePath: '/system/',
        children: [
            {
                path: '/system/admin/',
                requiredPermissions: [
                    'admin.*',
                    '!admin.log.*',
                    '!admin.role.*',
                ],
                title: '管理員管理',
            },
            {
                path: '/system/admin/role/',
                requiredPermissions: 'admin.role.*',
                title: '管理員身分組管理',
            },
            {
                path: '/system/admin/log/',
                requiredPermissions: 'admin.log.*',
                title: '管理員日誌',
            },
        ],
        requiredPermissions: 'admin.*',
        title: '系統',
    },
    {
        basePath: '/profile/',
        children: [
            {
                basePath: '/profile/security/',
                children: [
                    {
                        path: '/profile/security/',
                        requiredPermissions: 'ignore',
                        title: '一般',
                    },
                    {
                        path: '/profile/security/session/',
                        requiredPermissions: 'ignore',
                        title: '登入裝置',
                    },
                ],
                requiredPermissions: 'ignore',
                title: '安全性',
            },
        ],
        requiredPermissions: 'ignore',
        title: '個人',
    },
];
