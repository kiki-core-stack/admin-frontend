<template>
    <el-form-switch
        v-model="auth.twoFactorRequired"
        label="強制所有帳號使用雙重驗證"
        :prop="`${propPrefix}.twoFactorRequired`"
    />
    <el-form-item
        label="閒置逾時（分鐘）"
        :prop="`${propPrefix}.session.idleTimeoutSeconds`"
    >
        <el-filtered-input-number
            v-model="idleTimeoutMinutes"
            :max="maxTimeoutMinutes"
            :min="1"
            :precision="0"
        />
    </el-form-item>
    <el-form-item
        label="登入有效期限（分鐘）"
        :prop="`${propPrefix}.session.absoluteTimeoutSeconds`"
    >
        <el-filtered-input-number
            v-model="absoluteTimeoutMinutes"
            :max="maxTimeoutMinutes"
            :min="5"
            :precision="0"
        />
    </el-form-item>
    <el-form-item
        label="同時登入裝置上限"
        :prop="`${propPrefix}.maxSessions`"
    >
        <el-filtered-input-number
            v-model="auth.maxSessions"
            placeholder="不限制"
            :max="100"
            :min="1"
            :precision="0"
            clearable
        />
    </el-form-item>
    <el-form-switch
        v-model="auth.qrCodeLoginEnabled"
        label="開放 QR Code 登入"
        :prop="`${propPrefix}.qrCodeLoginEnabled`"
    />
    <el-form-switch
        v-model="auth.qrCodeLoginApprovalRequiresVerification"
        label="核准 QR Code 登入前需驗證身分"
        :disabled="!auth.qrCodeLoginEnabled"
        :prop="`${propPrefix}.qrCodeLoginApprovalRequiresVerification`"
    />
</template>

<script lang="ts" setup>
import type { PlatformAuthConfig } from '@kcs-project/pack/types/platform';

interface Props {
    /**
     * Form `prop` path of the auth config, e.g. `config.auth`.
     */
    propPrefix: string;
}

// Define props, models and emits
defineProps<Props>();
const auth = defineModel<PlatformAuthConfig>({ required: true });

// Constants/Refs/Variables
const maxTimeoutMinutes = 525600;

// Computed properties
const absoluteTimeoutMinutes = computed({
    get: () => Math.round(auth.value.session.absoluteTimeoutSeconds / 60),
    set: (minutes) => auth.value.session.absoluteTimeoutSeconds = (minutes ?? 5) * 60,
});

const idleTimeoutMinutes = computed({
    get: () => Math.round(auth.value.session.idleTimeoutSeconds / 60),
    set: (minutes) => auth.value.session.idleTimeoutSeconds = (minutes ?? 1) * 60,
});
</script>
