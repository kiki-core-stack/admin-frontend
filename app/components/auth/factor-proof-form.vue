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
        <div
            v-if="selectedFactor === 'passkey'"
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
            <el-form-input
                v-else-if="selectedFactor === 'totp'"
                ref="inputRef"
                v-model="formData.code"
                autocomplete="one-time-code"
                inputmode="numeric"
                label="驗證器顯示的 6 位數驗證碼"
                maxlength="6"
                name="totp-code"
                prop="code"
                :rules="[
                    createElFormItemRuleWithDefaults('請輸入驗證碼'),
                    {
                        message: '驗證碼為 6 位數字',
                        pattern: /^\d{6}$/,
                    },
                ]"
            />
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
     * Sends the proof; resolves to whether it was accepted. On rejection the form stays for another try.
     */
    submit: (proof: AuthFactorProofData) => Promise<boolean>;
}

// Define props, models and emits
const props = defineProps<Props>();

// Constants/Refs/Variables
const formData = ref({
    code: '',
    password: '',
});

const formRef = useTemplateRef('formRef');
const inputRef = useTemplateRef('inputRef');
const isSubmitting = ref(false);
const selectedFactor = ref<AuthFactor>();

// Computed properties
const factorOptions = computed(() => props.factors
    .filter((factor) => factor !== 'passkey' || isPasskeySupported)
    .map((factor) => ({
        label: localize(authFactorToLabelMap[factor]),
        value: factor,
    })));

// Functions
async function submitForm() {
    await formRef.value?.validate(async (valid) => {
        if (!valid || !selectedFactor.value || selectedFactor.value === 'passkey') return;
        await submitProof(
            selectedFactor.value === 'password'
                ? {
                    factor: selectedFactor.value,
                    password: formData.value.password,
                }
                : {
                    code: formData.value.code.trim(),
                    factor: selectedFactor.value,
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
