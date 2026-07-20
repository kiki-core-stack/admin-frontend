<template>
    <div>
        <Head>
            <Title>{{ $t('common.login') }}</Title>
        </Head>
        <h1 class="fs-32px">
            {{ $t('pages.auth.login.title') }}
        </h1>
        <div class="mt-4 flex w-full items-center gap-8 md:px-8">
            <el-form
                ref="formRef"
                label-width="auto"
                :model="formData"
                :rules="formRules"
                hide-required-asterisk
                @submit.prevent="login"
            >
                <el-form-input
                    ref="accountInputRef"
                    v-model="formData.account"
                    name="account"
                    prop="account"
                    :label="$t('common.account')"
                />
                <el-form-input
                    v-model="formData.password"
                    name="password"
                    prop="password"
                    type="password"
                    :label="$t('common.password')"
                />
                <div class="gap-btns mt-4 flex justify-center">
                    <el-button
                        class="md:hidden!"
                        @click="isLoginQrCodeDialogVisible = true"
                    >
                        {{ $t('pages.auth.login.qrCodeLogin') }}
                    </el-button>
                    <el-button native-type="submit">
                        {{ $t('common.login') }}
                    </el-button>
                </div>
            </el-form>
            <auth-qr-code-login-block
                class="hidden! md:flex!"
                :qr-code-image-src="qrCodeLoginImageSrc"
                @reload="reloadLoginQrCodeAndStartPolling"
            />
        </div>
        <el-dialog
            v-model="isLoginQrCodeDialogVisible"
            :width="elDialogWidthByWindowSize"
            align-center
            append-to-body
            center
        >
            <auth-qr-code-login-block
                class="mt-4"
                :qr-code-image-src="qrCodeLoginImageSrc"
                @reload="reloadLoginQrCodeAndStartPolling"
            />
        </el-dialog>
        <status-overlay ref="statusOverlayRef" />
    </div>
</template>

<script lang="ts" setup>
import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';
import { useQRCode } from '@vueuse/integrations/useQRCode';

import { initializeAuthenticatedSession } from '@/libs/session';

definePageMeta({
    keepalive: false,
    layout: 'middle-block',
});

// Constants/Refs/Variables
const accountInputRef = useTemplateRef('accountInputRef');
const formData = ref<AdminLoginFormData>({
    account: '',
    password: '',
});

const formRef = useTemplateRef('formRef');
const formRules: ElFormRules<AdminLoginFormData> = {
    account: [createElFormItemRuleWithDefaults('請輸入帳號')],
    password: [createElFormItemRuleWithDefaults('請輸入密碼')],
};

const isLoginQrCodeDialogVisible = ref(false);
const qrCodeLoginApprovalToken = ref('');
let qrCodeLoginCompletionToken: string | undefined;
let qrCodeLoginCreationAbortController: AbortController | undefined;
const qrCodeLoginImageSrc = useQRCode(
    qrCodeLoginApprovalToken,
    {
        errorCorrectionLevel: 'L',
        margin: 0,
        type: 'image/webp',
    },
);

let qrCodeLoginPollingAbortController: AbortController | undefined;
let qrCodeLoginPollingTimeout: NodeJS.Timeout | null = null;
const statusOverlayRef = useTemplateRef('statusOverlayRef');

// Functions
async function handleLoginSuccess() {
    stopQrCodeLoginFlow();
    await updateProfileState();
    ElNotification.success('登入成功');
    initializeAuthenticatedSession();
    navigateTo(normalizeRedirectPath(useRoute().query.redirect), { replace: true });
}

async function login() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading('登入中...');
        const response = await AuthApi.use().login(formData.value);
        if (response?.status === 404) accountInputRef.value?.focus();
        else if (response?.data?.success) return await handleLoginSuccess();
        statusOverlayRef.value!.hide();
    });
}

async function pollQrCodeLoginCompletion() {
    const completionToken = qrCodeLoginCompletionToken;
    if (!completionToken) return;

    qrCodeLoginPollingAbortController = new AbortController();
    const response = await AuthApi.use().completeQrCodeLogin(
        completionToken,
        {
            signal: qrCodeLoginPollingAbortController.signal,
            skipShowErrorMessage: true,
        },
    );

    if (completionToken !== qrCodeLoginCompletionToken) return;
    if (response?.data?.data?.state === 'completed') return await handleLoginSuccess();
    if (response?.status === 410) {
        ElNotification.error('QR Code已過期，已自動刷新');
        qrCodeLoginApprovalToken.value = '';
        qrCodeLoginCompletionToken = undefined;
        return await reloadLoginQrCodeAndStartPolling();
    }

    scheduleQrCodeLoginPolling();
}

async function reloadLoginQrCodeAndStartPolling() {
    qrCodeLoginCreationAbortController?.abort();
    const abortController = new AbortController();
    qrCodeLoginCreationAbortController = abortController;

    const response = await AuthApi.use().createQrCodeLogin({ signal: abortController.signal });
    if (qrCodeLoginCreationAbortController !== abortController) return;
    qrCodeLoginCreationAbortController = undefined;
    if (!response?.data?.success || !response?.data?.data) return;

    stopQrCodeLoginPolling();
    qrCodeLoginApprovalToken.value = response.data.data.approvalToken;
    qrCodeLoginCompletionToken = response.data.data.completionToken;
    scheduleQrCodeLoginPolling();
}

function scheduleQrCodeLoginPolling() {
    qrCodeLoginPollingTimeout = setTimeout(pollQrCodeLoginCompletion, 1000);
}

function stopQrCodeLoginFlow() {
    qrCodeLoginCreationAbortController?.abort();
    qrCodeLoginCreationAbortController = undefined;
    stopQrCodeLoginPolling();
    qrCodeLoginApprovalToken.value = '';
    qrCodeLoginCompletionToken = undefined;
}

function stopQrCodeLoginPolling() {
    qrCodeLoginPollingAbortController?.abort();
    qrCodeLoginPollingAbortController = undefined;
    if (qrCodeLoginPollingTimeout) clearTimeout(qrCodeLoginPollingTimeout);
    qrCodeLoginPollingTimeout = null;
}

// Hooks
onBeforeUnmount(stopQrCodeLoginFlow);
onMounted(reloadLoginQrCodeAndStartPolling);
</script>
