<template>
    <div class="dark:bg-dark lt-md:p-3 rounded-[10px] bg-white p-4">
        <div class="flex items-center justify-between gap-4">
            <p class="fs-20px">
                雙重驗證
            </p>
            <el-switch
                :before-change="toggleTwoFactorEnabled"
                :disabled="isSwitchDisabled"
                :loading="isUpdating"
                :model-value="isEffectivelyEnabled"
            />
        </div>
        <p class="text-gray mt-2">
            開啟後，登入時除了密碼，還需要以驗證器、密碼金鑰或救援碼完成第二步驗證。
        </p>
        <el-alert
            v-if="twoFactor.required || twoFactor.enforced"
            class="mt-4"
            type="info"
            :closable="false"
            :title="twoFactor.required ? '平台已強制所有帳號使用雙重驗證，無法關閉。' : '此帳號已被管理員強制使用雙重驗證，無法關閉。'"
            show-icon
        />
        <el-alert
            v-else-if="!hasSecondFactor"
            class="mt-4"
            title="請先綁定驗證器或密碼金鑰，才能開啟雙重驗證。"
            type="warning"
            :closable="false"
            show-icon
        />
    </div>
</template>

<script lang="ts" setup>
import type { AuthSecurityOverviewData } from '@kcs-project/pack/types/data/auth';

interface Props {
    hasSecondFactor: boolean;
    twoFactor: AuthSecurityOverviewData['twoFactor'];
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'changed'): void }>();

// Constants/Refs/Variables
const isUpdating = ref(false);

// Computed properties
const isLocked = computed(() => props.twoFactor.required || props.twoFactor.enforced);
const isEffectivelyEnabled = computed(() => isLocked.value || props.twoFactor.enabled);
const isSwitchDisabled = computed(() => isLocked.value || (!props.twoFactor.enabled && !props.hasSecondFactor));

// Functions
async function toggleTwoFactorEnabled() {
    const enabled = !props.twoFactor.enabled;
    isUpdating.value = true;
    const response = await ProfileSecurityApi.use().setTwoFactorEnabled(enabled);
    isUpdating.value = false;
    if (response.data.success) {
        ElNotification.success(enabled ? '開啟成功' : '關閉成功');
        emit('changed');
    }

    // The switch only reflects the reloaded overview.
    return false;
}
</script>
