<template>
    <div class="dark:bg-dark lt-md:p-3 rounded-[10px] bg-white p-4">
        <div class="flex items-center justify-between gap-4">
            <p class="fs-20px">
                驗證器
            </p>
            <el-button
                v-if="totpConfirmedAt"
                type="danger"
                @click="confirmRemoveTotp"
            >
                移除
            </el-button>
            <el-button
                v-else
                @click="profileSecurityTotpSetupDialogRef?.open()"
            >
                綁定
            </el-button>
        </div>
        <p class="text-gray mt-2">
            使用驗證器 App 產生的 6 位數驗證碼完成雙重驗證。
        </p>
        <p class="mt-4 flex items-center">
            <template v-if="totpConfirmedAt">
                <el-tag type="success">
                    已綁定
                </el-tag>
                <span class="text-gray ml-2">綁定時間：{{ formatDate(totpConfirmedAt) }}</span>
            </template>
            <el-tag
                v-else
                type="info"
            >
                未綁定
            </el-tag>
        </p>
        <profile-security-totp-setup-dialog
            ref="profileSecurityTotpSetupDialogRef"
            @confirmed="onTotpConfirmed"
        />
    </div>
</template>

<script lang="ts" setup>
// Define props, models and emits
defineProps<{ totpConfirmedAt?: string }>();
const emit = defineEmits<{ (e: 'changed', recoveryCodes?: string[]): void }>();

// Constants/Refs/Variables
const profileSecurityTotpSetupDialogRef = useTemplateRef('profileSecurityTotpSetupDialogRef');

// Functions
const confirmRemoveTotp = createElMessageBoxConfirmHandler({
    boxOptions: { type: 'warning' },
    confirm: async () => (await ProfileSecurityTotpApi.use().remove()).data.success,
    loadingText: '移除中...',
    message: '確定要移除驗證器嗎？移除後若沒有其他驗證器或密碼金鑰，雙重驗證會一併關閉，救援碼也會失效。',
    onSuccess: () => {
        ElNotification.success('移除成功');
        emit('changed');
    },
});

function onTotpConfirmed(recoveryCodes?: string[]) {
    ElNotification.success('綁定成功');
    emit('changed', recoveryCodes);
}
</script>
