<template>
    <el-dialog
        v-model="isVisible"
        title="綁定驗證器"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
        @closed="!isVisible && reset()"
    >
        <div
            v-loading="!setupData"
            class="relative flex min-h-[200px] flex-col items-center gap-4"
        >
            <template v-if="setupData">
                <p class="text-gray text-center">
                    請使用驗證器 App（如 Google Authenticator、Microsoft Authenticator）掃描下方 QR Code。
                </p>
                <img
                    class="size-[200px] rounded-[10px] bg-white p-2"
                    alt="驗證器 QR Code"
                    :src="qrCodeImageSrc"
                >
                <div class="w-full max-w-[400px] text-center">
                    <p class="text-gray">
                        無法掃描時，請在驗證器中手動輸入以下金鑰：
                    </p>
                    <div class="flex-middle mt-1 gap-2">
                        <code class="font-mono break-all">{{ setupData.secret }}</code>
                        <el-button
                            size="small"
                            @click="copy(setupData.secret)"
                        >
                            {{ copied ? '已複製' : '複製' }}
                        </el-button>
                    </div>
                </div>
                <el-form
                    ref="formRef"
                    class="w-full max-w-[400px]"
                    label-position="top"
                    :model="formData"
                    :rules="formRules"
                    @submit.prevent="confirm"
                >
                    <el-form-item
                        label="驗證器顯示的 6 位數驗證碼"
                        prop="code"
                    >
                        <el-input
                            v-model="formData.code"
                            autocomplete="one-time-code"
                            inputmode="numeric"
                            maxlength="6"
                            name="totp-code"
                            placeholder="000000"
                        />
                    </el-form-item>
                    <div class="flex-middle gap-btns">
                        <el-button @click="close">
                            取消
                        </el-button>
                        <el-button
                            native-type="submit"
                            type="primary"
                        >
                            確認綁定
                        </el-button>
                    </div>
                </el-form>
            </template>
            <status-overlay ref="statusOverlayRef" />
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { AuthTotpSetupData } from '@kcs-project/pack/types/data/auth';
import { useQRCode } from '@vueuse/integrations/useQRCode';

// Define props, models and emits
const emit = defineEmits<{ (e: 'confirmed', recoveryCodes?: string[]): void }>();

// Constants/Refs/Variables
const { copied, copy } = useClipboard({ legacy: true });
const formData = ref({ code: '' });
const formRef = useTemplateRef('formRef');
const formRules: ElFormRules<{ code: string }> = {
    code: [
        createElFormItemRuleWithDefaults('請輸入驗證碼'),
        {
            message: '驗證碼為 6 位數字',
            pattern: /^\d{6}$/,
        },
    ],
};

const isVisible = ref(false);
const setupData = ref<AuthTotpSetupData>();
const qrCodeImageSrc = useQRCode(
    computed(() => setupData.value?.uri ?? ''),
    {
        errorCorrectionLevel: 'M',
        margin: 0,
        type: 'image/webp',
    },
);

const statusOverlayRef = useTemplateRef('statusOverlayRef');
let openGeneration = 0;

// Functions
function close() {
    isVisible.value = false;
}

async function confirm() {
    if (!setupData.value || !statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid || !setupData.value) return;
        statusOverlayRef.value!.showLoading('綁定中...');
        const response = await ProfileSecurityTotpApi.use().confirm(
            setupData.value.challengeId,
            formData.value.code.trim(),
        );

        statusOverlayRef.value!.hide();
        if (!response.data.success) {
            showElFormApiFieldErrors(formRef.value, response.data);
            formData.value.code = '';
            return;
        }

        close();
        emit('confirmed', response.data.data?.recoveryCodes);
    });
}

async function open() {
    const generation = ++openGeneration;
    reset();
    isVisible.value = true;
    const data = (await ProfileSecurityTotpApi.use().setup()).data.data;
    // Ignore a response that arrives after the dialog was closed or reopened.
    if (generation !== openGeneration || !isVisible.value) return;
    if (!data) return close();
    setupData.value = data;
}

function reset() {
    formData.value.code = '';
    formRef.value?.clearValidate();
    setupData.value = undefined;
    statusOverlayRef.value?.hide();
}

// Exposes
defineExpose({
    close,
    open,
});
</script>
