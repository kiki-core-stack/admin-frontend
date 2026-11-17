<template>
    <div class="dark:bg-dark lt-md:p-3 rounded-[10px] bg-white p-4">
        <div class="flex items-center justify-between gap-4">
            <p class="fs-20px">
                救援碼
            </p>
            <el-button
                v-if="hasSecondFactor"
                @click="confirmRegenerateRecoveryCodes"
            >
                重新產生
            </el-button>
        </div>
        <p class="text-gray mt-2">
            無法使用驗證器或密碼金鑰時，可以使用救援碼完成雙重驗證，每組只能使用一次。
        </p>
        <p
            v-if="hasSecondFactor"
            class="mt-4"
            :class="{ 'text-[#dc3545]': isRecoveryCodesLow }"
        >
            剩餘 {{ recoveryCodesRemaining }} 組可用的救援碼{{ isRecoveryCodesLow ? '，建議重新產生' : '' }}
        </p>
        <p
            v-else
            class="text-gray mt-4"
        >
            綁定驗證器或密碼金鑰後會產生救援碼。
        </p>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    hasSecondFactor: boolean;
    recoveryCodesRemaining: number;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'changed', recoveryCodes?: string[]): void }>();

// Constants/Refs/Variables
let regeneratedRecoveryCodes: string[] | undefined;

// Computed properties
const isRecoveryCodesLow = computed(() => props.recoveryCodesRemaining <= 3);

// Functions
const confirmRegenerateRecoveryCodes = createElMessageBoxConfirmHandler({
    boxOptions: { type: 'warning' },
    confirm: async () => {
        regeneratedRecoveryCodes = (await ProfileSecurityApi.use().regenerateRecoveryCodes()).data.data?.recoveryCodes;
        return !!regeneratedRecoveryCodes;
    },
    loadingText: '產生中...',
    message: '確定要重新產生救援碼嗎？舊的救援碼將全部失效。',
    onSuccess: () => emit('changed', regeneratedRecoveryCodes),
});
</script>
