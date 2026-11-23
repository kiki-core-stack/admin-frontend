<template>
    <data-table-page
        ref="dataTablePageRef"
        delete-btn-text="登出"
        permission-group="ignore"
        title="登入裝置"
        :confirm-delete-message="(row) => `確定要登出裝置「${parseUserAgentToDeviceInfo(row.userAgent)}${row.ip ? ` (${row.ip})` : ''}」嗎？`"
        :crud-api="ProfileSecuritySessionApi.use()"
        :disable-row-delete-btn-rule="(row) => row.current"
        hide-footer
        hide-timestamp-columns
    >
        <template #toolbar-actions-append>
            <el-button
                v-if="isQrCodeLoginEnabled"
                @click="profileSecurityScanLoginQrCodeDialogRef?.open()"
            >
                掃描登入 QR Code
            </el-button>
            <el-button @click="confirmLogoutOtherSessions">
                登出其他裝置
            </el-button>
        </template>
        <template #table>
            <el-table-column
                label="裝置"
                :formatter="(row: AuthSessionData) => `${row.current ? '[目前] ' : ''}${parseUserAgentToDeviceInfo(row.userAgent)}`"
            />
            <el-table-column
                label="IP"
                prop="ip"
            />
            <el-table-datetime-column
                label="最後活動時間"
                prop="lastActiveAt"
            />
            <el-table-datetime-column label="登入時間" />
            <el-table-column
                label="登入方式"
                :formatter="formatLoginMethod"
            />
        </template>
        <profile-security-scan-login-qr-code-dialog ref="profileSecurityScanLoginQrCodeDialogRef" />
    </data-table-page>
</template>

<script lang="ts" setup>
import type { AuthSessionData } from '@kcs-project/pack/types/data/auth';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';

// Constants/Refs/Variables
const { t } = useI18n();
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const isQrCodeLoginEnabled = ref(false);
const profileSecurityScanLoginQrCodeDialogRef = useTemplateRef('profileSecurityScanLoginQrCodeDialogRef');

// Functions
const confirmLogoutOtherSessions = createElMessageBoxConfirmHandler({
    boxOptions: { type: 'warning' },
    confirm: async () => (await ProfileSecuritySessionApi.use().deleteOthers()).data.success,
    loadingText: '登出中...',
    message: '確定要登出其他所有裝置嗎？目前的裝置會保持登入。',
    onSuccess: async () => {
        ElNotification.success('登出成功');
        await dataTablePageRef.value?.loadData();
    },
});

function formatLoginMethod(row: AuthSessionData) {
    const factorsText = row.factors.map((factor) => t(`enums.auth.factor.${factor}`)).join('＋');
    if (!row.approvedBySessionId) return factorsText;
    return factorsText ? `QR Code 核准（${factorsText}）` : 'QR Code 核准';
}

// Hooks
onActivated(async () => {
    const overview = (await ProfileSecurityApi.use().getOverview()).data.data;
    if (overview) isQrCodeLoginEnabled.value = overview.qrCodeLoginEnabled;
});
</script>
