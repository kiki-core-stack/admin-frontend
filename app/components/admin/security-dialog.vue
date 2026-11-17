<template>
    <el-dialog
        v-model="isVisible"
        :title="`「${admin?.account}」的安全性`"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
        @closed="reset"
    >
        <div
            v-loading="isLoading"
            class="relative"
        >
            <el-descriptions
                v-if="overview"
                :column="1"
                border
            >
                <el-descriptions-item label="雙重驗證">
                    {{ twoFactorStatusText }}
                </el-descriptions-item>
                <el-descriptions-item label="驗證器">
                    {{ overview.totpConfirmedAt ? `已綁定（${formatDate(overview.totpConfirmedAt)}）` : '未綁定' }}
                </el-descriptions-item>
                <el-descriptions-item
                    v-if="overview.passkeySupported"
                    label="密碼金鑰"
                >
                    {{ overview.passkeys.length }} 把
                </el-descriptions-item>
                <el-descriptions-item label="剩餘救援碼">
                    {{ overview.recoveryCodesRemaining }} 組
                </el-descriptions-item>
                <el-descriptions-item label="強制此帳號使用雙重驗證">
                    <el-switch
                        :model-value="overview.twoFactor.enforced"
                        @click="confirmToggleTwoFactorEnforced()"
                    />
                </el-descriptions-item>
            </el-descriptions>
            <div class="gap-btns mt-4 flex flex-wrap">
                <el-button
                    type="danger"
                    @click="confirmResetTwoFactor()"
                >
                    重設雙重驗證
                </el-button>
                <el-button
                    type="danger"
                    :disabled="!sessions.length"
                    @click="confirmRevokeAllSessions()"
                >
                    登出所有裝置
                </el-button>
            </div>
            <el-table
                class="mt-4"
                empty-text="沒有登入中的裝置"
                table-layout="auto"
                :data="sessions"
                border
                stripe
            >
                <el-table-column
                    label="裝置"
                    :formatter="(row: AuthSessionData) => parseUserAgentToDeviceInfo(row.userAgent)"
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
                <!-- @vue-generic {AuthSessionData} -->
                <el-table-column
                    align="center"
                    label="操作"
                >
                    <template #default="{ row }">
                        <el-action-btn
                            type="danger"
                            @click="confirmRevokeSession(row)"
                        >
                            登出
                        </el-action-btn>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { AdminData } from '@kcs-project/pack/types/data/admin';
import type {
    AuthSecurityOverviewData,
    AuthSessionData,
} from '@kcs-project/pack/types/data/auth';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';

// Constants/Refs/Variables
const admin = ref<AdminData>();
const isLoading = ref(false);
const isVisible = ref(false);
const overview = ref<AuthSecurityOverviewData>();
const sessions = ref<AuthSessionData[]>([]);

// Computed properties
const twoFactorStatusText = computed(() => {
    if (!overview.value) return '';
    const { twoFactor } = overview.value;
    if (twoFactor.required) return '平台設定強制';
    if (twoFactor.enforced) return '此帳號被強制';
    return twoFactor.enabled ? '本人已開啟' : '未開啟';
});

// Functions
const confirmResetTwoFactor = createElMessageBoxConfirmHandler<void>({
    boxOptions: { type: 'warning' },
    confirm: async () => (await AdminSecurityApi.use(admin.value!.id).resetTwoFactor()).data.success,
    loadingText: '重設中...',
    message: () => `確定要重設「${admin.value!.account}」的雙重驗證嗎？將移除其驗證器、密碼金鑰與救援碼，並登出所有裝置。`,
    onSuccess: async () => {
        ElNotification.success('重設成功');
        await loadData();
    },
});

const confirmRevokeAllSessions = createElMessageBoxConfirmHandler<void>({
    boxOptions: { type: 'warning' },
    confirm: async () => (await AdminSecuritySessionApi.use(admin.value!.id).deleteAll()).data.success,
    loadingText: '登出中...',
    message: () => `確定要登出「${admin.value!.account}」的所有裝置嗎？`,
    onSuccess: async () => {
        ElNotification.success('登出成功');
        await loadData();
    },
});

const confirmRevokeSession = createElMessageBoxConfirmHandler<AuthSessionData>({
    boxOptions: { type: 'warning' },
    confirm: async (session) => (await AdminSecuritySessionApi.use(admin.value!.id).delete(session.id)).data.success,
    loadingText: '登出中...',
    message: (session) => `確定要登出裝置「${parseUserAgentToDeviceInfo(session.userAgent)} (${session.ip})」嗎？`,
    onSuccess: async () => {
        ElNotification.success('登出成功');
        await loadData();
    },
});

const confirmToggleTwoFactorEnforced = createElMessageBoxConfirmHandler<void>({
    boxOptions: { type: 'warning' },
    confirm: async () => {
        const enforced = !overview.value!.twoFactor.enforced;
        return (await AdminSecurityApi.use(admin.value!.id).setTwoFactorEnforced(enforced)).data.success;
    },
    loadingText: '處理中...',
    message: () => overview.value!.twoFactor.enforced
        ? `確定要取消強制「${admin.value!.account}」使用雙重驗證嗎？已綁定的驗證器與密碼金鑰會保留。`
        : `確定要強制「${admin.value!.account}」使用雙重驗證嗎？尚未綁定驗證器或密碼金鑰時，下次登入必須先完成綁定才能使用。`,
    onSuccess: async () => {
        ElNotification.success('設定成功');
        await loadData();
    },
});

function close() {
    isVisible.value = false;
}

async function loadData() {
    const adminId = admin.value?.id;
    if (!adminId) return;
    isLoading.value = true;
    const [overviewResponse, sessionsResponse] = await Promise.all([
        AdminSecurityApi.use(adminId).getOverview(),
        AdminSecuritySessionApi.use(adminId).getList(),
    ]);

    if (adminId !== admin.value?.id) return;
    isLoading.value = false;
    if (!overviewResponse.data.data || !sessionsResponse.data.data) return close();
    overview.value = overviewResponse.data.data;
    sessions.value = sessionsResponse.data.data.list;
}

async function open(row: AdminData) {
    admin.value = row;
    isVisible.value = true;
    await loadData();
}

function reset() {
    admin.value = undefined;
    overview.value = undefined;
    sessions.value = [];
}

// Exposes
defineExpose({
    close,
    open,
});
</script>
