import type { SidebarMenuItem } from '@/types/sidebar';

interface AdminSidebarState {
    isShow: boolean;
    menuItems: SidebarMenuItem<'admin'>[];
}

export function useAdminSidebarState() {
    return useState<AdminSidebarState>(
        'adminSidebar',
        () => ({
            isShow: false,
            menuItems: [
                {
                    path: '/admin/',
                    requiredPermissions: 'ignore',
                    title: '首頁',
                },
                {
                    basePath: '/admin/system/',
                    children: [
                        {
                            path: '/admin/system/admin/',
                            requiredPermissions: [
                                'admin.*',
                                '!admin.log.*',
                                '!admin.role.*',
                            ],
                            title: '管理員管理',
                        },
                        {
                            path: '/admin/system/admin/role/',
                            requiredPermissions: 'admin.role.*',
                            title: '管理員身分組管理',
                        },
                        {
                            path: '/admin/system/admin/log/',
                            requiredPermissions: 'admin.log.*',
                            title: '管理員日誌',
                        },
                    ],
                    requiredPermissions: 'admin.*',
                    title: '系統',
                },
                {
                    basePath: '/admin/profile/',
                    children: [
                        {
                            basePath: '/admin/profile/security/',
                            children: [
                                {
                                    path: '/admin/profile/security/',
                                    requiredPermissions: 'ignore',
                                    title: '一般',
                                },
                                {
                                    path: '/admin/profile/security/session/',
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
            ],
        }),
    );
}
