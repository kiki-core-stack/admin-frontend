<template>
    <data-table-page
        ref="dataTablePageRef"
        permission-group="ignore"
        title="目前登入的裝置"
        :confirm-delete-message="(row) => `確定要刪除 ${parseDataToDeviceColumnText(row)} (${row.lastActiveIp}) 嗎？`"
        :crud-api="ProfileSecuritySessionApi.use()"
        :disable-row-delete-btn-rule="(row) => row.isCurrent"
        hide-footer
        hide-timestamp-columns
    >
        <template #toolbar-actions-append>
            <el-button @click="profileSecurityScanLoginQrCodeDialogRef?.open()">
                掃描登入QR Code
            </el-button>
            <el-button @click="confirmLogoutAllSessions">
                登出所有裝置
            </el-button>
        </template>
        <template #table>
            <el-table-column
                label="裝置"
                :formatter="(row: AuthenticationSessionListItemData) => parseDataToDeviceColumnText(row)"
            />
            <el-table-column
                label="最後活動IP"
                prop="lastActiveIp"
            />
            <el-table-datetime-column
                label="最後活動時間"
                prop="lastActiveAt"
            />
            <el-table-column
                label="登入IP"
                prop="loginIp"
            />
            <el-table-datetime-column
                label="登入時間"
                prop="loggedAt"
            />
        </template>
        <profile-security-scan-login-qr-code-dialog
            ref="profileSecurityScanLoginQrCodeDialogRef"
            @approved="onQrCodeLoginApproved"
        />
    </data-table-page>
</template>

<script lang="ts" setup>
import type { AuthenticationSessionListItemData } from '@kcs-project/pack/types/data/authentication-session';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const profileSecurityScanLoginQrCodeDialogRef = useTemplateRef('profileSecurityScanLoginQrCodeDialogRef');

// Functions
const confirmLogoutAllSessions = createElMessageBoxConfirmHandler({
    boxOptions: { type: 'warning' },
    confirm: async () => (await ProfileSecuritySessionApi.use().deleteAll()).data.success,
    loadingText: '登出中...',
    message: '確定要登出所有裝置嗎？',
    onSuccess: () => {
        assignUrlWithRedirectParamFromCurrentLocation('/auth/login/', 1000);
        showSuccessAlert(
            '登出成功',
            {
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
            },
        );
    },
});

function onQrCodeLoginApproved() {
    setTimeout(() => dataTablePageRef.value?.loadData(), 1000);
}

function parseDataToDeviceColumnText(row: AuthenticationSessionListItemData) {
    return `${row.isCurrent ? '[當前] ' : ''}${parseUserAgentToDeviceInfo(row.userAgent)}`;
}
</script>
