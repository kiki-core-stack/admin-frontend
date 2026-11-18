<template>
    <div class="w-full">
        <el-segmented
            v-if="factorOptions.length > 1"
            v-model="selectedFactor"
            class="mb-4"
            :disabled="isSubmitting"
            :options="factorOptions"
            block
        />
        <p
            v-if="!selectedFactor"
            class="text-gray text-center"
        >
            此帳號沒有可用的驗證方式，請聯絡管理員。
        </p>
        <div
            v-else-if="selectedFactor === 'passkey'"
            class="flex-middle flex-col"
        >
            <p class="text-gray">
                使用此裝置或安全金鑰上的密碼金鑰驗證。
            </p>
            <el-button
                class="mt-4 w-full"
                type="primary"
                :loading="isSubmitting"
                @click="submitPasskey"
            >
                使用密碼金鑰驗證
            </el-button>
        </div>
        <el-form
            v-else
            ref="formRef"
            label-position="top"
            :model="formData"
            hide-required-asterisk
            @submit.prevent="submitForm"
        >
            <el-form-input
                v-if="selectedFactor === 'password'"
                ref="inputRef"
                v-model="formData.password"
                autocomplete="current-password"
                label="密碼"
                name="password"
                prop="password"
                type="password"
                :rules="[createElFormItemRuleWithDefaults('請輸入密碼')]"
            />
            <template v-else-if="selectedFactor === 'code' || selectedFactor === 'totp'">
                <div
                    v-if="selectedFactor === 'code'"
                    class="mb-4 flex items-center justify-between gap-2"
                >
                    <span class="text-gray">
                        {{ sentCodeMessage }}
                    </span>
                    <el-button
                        :disabled="codeResendCooldown.isPending.value"
                        :loading="isSendingCode"
                        @click="sendVerificationCode"
                    >
                        {{ sentCode ? '重新寄送' : '寄送驗證碼' }}
                    </el-button>
                </div>
                <el-form-input
                    ref="inputRef"
                    v-model="formData.code"
                    autocomplete="one-time-code"
                    inputmode="numeric"
                    maxlength="6"
                    prop="code"
                    :label="selectedFactor === 'code' ? '收到的 6 位數驗證碼' : '驗證器顯示的 6 位數驗證碼'"
                    :name="selectedFactor === 'code' ? 'verification-code' : 'totp-code'"
                    :rules="[
                        createElFormItemRuleWithDefaults('請輸入驗證碼'),
                        {
                            message: '驗證碼為 6 位數字',
                            pattern: /^\d{6}$/,
                        },
                    ]"
                />
            </template>
            <el-form-input
                v-else
                ref="inputRef"
                v-model="formData.code"
                autocomplete="off"
                label="救援碼（每組只能使用一次）"
                name="recovery-code"
                prop="code"
                :rules="[createElFormItemRuleWithDefaults('請輸入救援碼')]"
            />
            <el-button
                class="w-full"
                native-type="submit"
                type="primary"
                :loading="isSubmitting"
            >
                驗證
            </el-button>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { authFactorToLabelMap } from '@kcs-project/pack/constants/auth';
import type { AuthFactor } from '@kcs-project/pack/types/auth';
import type { AuthSentCodeData } from '@kcs-project/pack/types/data/auth';

import {
    authenticateWithPasskey,
    isPasskeySupported,
} from '@/libs/auth/passkey';
import type { ApiRequestResult } from '@/types/api';
import type {
    AuthFactorProofData,
    AuthPasskeyAuthenticationOptionsData,
} from '@/types/data/auth';

interface Props {
    /**
     * Factors the account can prove; the first one is preselected.
     */
    factors: readonly AuthFactor[];
    getPasskeyOptions: () => Promise<ApiRequestResult<AuthPasskeyAuthenticationOptionsData>>;

    /**
     * Sends the account a verification code; without it the code factor is not offered.
     */
    sendCode?: () => Promise<ApiRequestResult<AuthSentCodeData>>;

    /**
     * Sends the proof; resolves to whether it was accepted. On rejection the form stays for another try.
     */
    submit: (proof: AuthFactorProofData) => Promise<boolean>;
}

// Define props, models and emits
const props = defineProps<Props>();

// Constants/Refs/Variables
const codeResendCooldown = useTimeoutFn(() => {}, 60000, { immediate: false });
const formData = ref({
    code: '',
    password: '',
});

const formRef = useTemplateRef('formRef');
const inputRef = useTemplateRef('inputRef');
const isSendingCode = ref(false);
const isSubmitting = ref(false);
const selectedFactor = ref<AuthFactor>();
const sentCode = ref<AuthSentCodeData>();

// Computed properties

// `external` only describes how a session logged in; it is never proven here.
const factorOptions = computed(() => props.factors
    .filter((factor) => {
        if (factor === 'code') return !!props.sendCode;
        if (factor === 'passkey') return isPasskeySupported;
        return factor !== 'external';
    })
    .map((factor) => ({
        label: localize(authFactorToLabelMap[factor]),
        value: factor,
    })));

const sentCodeMessage = computed(() => {
    if (!sentCode.value) return '按下按鈕以取得驗證碼。';
    return sentCode.value.destinationHint ? `驗證碼已寄至 ${sentCode.value.destinationHint}。` : '驗證碼已寄出。';
});

// Functions
async function sendVerificationCode() {
    if (!props.sendCode || isSendingCode.value) return;
    isSendingCode.value = true;
    const response = await props.sendCode();
    isSendingCode.value = false;
    if (!response.data.success) return;
    sentCode.value = response.data.data ?? {};
    codeResendCooldown.start();
    inputRef.value?.focus();
}

async function submitForm() {
    await formRef.value?.validate(async (valid) => {
        const factor = selectedFactor.value;
        if (!valid || !factor || factor === 'external' || factor === 'passkey') return;
        await submitProof(
            factor === 'password'
                ? {
                    factor,
                    password: formData.value.password,
                }
                : {
                    code: formData.value.code.trim(),
                    factor,
                },
        );
    });
}

async function submitPasskey() {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    const proof = await authenticateWithPasskey(props.getPasskeyOptions);
    isSubmitting.value = false;
    if (proof) await submitProof(proof);
}

async function submitProof(proof: AuthFactorProofData) {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    const accepted = await props.submit(proof);
    isSubmitting.value = false;
    if (accepted) return;
    formData.value.code = '';
    formData.value.password = '';
    inputRef.value?.focus();
}

// Watchers
watch(
    factorOptions,
    (options) => {
        if (!options.some((option) => option.value === selectedFactor.value)) selectedFactor.value = options[0]?.value;
    },
    { immediate: true },
);

watch(
    selectedFactor,
    async () => {
        formData.value.code = '';
        formData.value.password = '';
        formRef.value?.clearValidate();
        await nextTick();
        inputRef.value?.focus();
    },
    { flush: 'post' },
);
</script>
