<template>
    <div class="w-full max-w-[360px] items-stretch! p-0! text-left! md:w-auto md:max-w-none">
        <Head>
            <Title>{{ $t('common.login') }}</Title>
        </Head>
        <div class="flex w-full">
            <div class="lt-md:p-5 w-full p-8 md:w-[360px]">
                <h1 class="fs-28px mb-6">
                    {{ secondFactorChallenge ? '雙重驗證' : $t('pages.auth.login.title') }}
                </h1>
                <template v-if="secondFactorChallenge">
                    <auth-factor-proof-form
                        :factors="secondFactorChallenge.factors"
                        :get-passkey-options="getSecondFactorPasskeyOptions"
                        :submit="loginWithSecondFactor"
                    />
                    <el-button
                        class="mt-3 w-full"
                        @click="returnToCredentials"
                    >
                        返回登入
                    </el-button>
                </template>
                <el-form
                    v-else
                    ref="formRef"
                    label-position="top"
                    :model="formData"
                    :rules="formRules"
                    hide-required-asterisk
                    @submit.prevent="login"
                >
                    <el-form-input
                        ref="accountInputRef"
                        v-model="formData.account"
                        autocomplete="username"
                        name="account"
                        prop="account"
                        size="large"
                        :label="$t('common.account')"
                    />
                    <el-form-input
                        v-model="formData.password"
                        autocomplete="current-password"
                        name="password"
                        prop="password"
                        size="large"
                        type="password"
                        :label="$t('common.password')"
                        show-password
                    />
                    <el-button
                        class="mt-2 w-full"
                        native-type="submit"
                        size="large"
                        type="primary"
                    >
                        {{ $t('common.login') }}
                    </el-button>
                    <template v-if="isPasskeySupported || isQrCodeLoginEnabled">
                        <div class="my-5 flex items-center gap-3">
                            <div class="login-divider-line" />
                            <span class="text-gray fs-12px">或</span>
                            <div class="login-divider-line" />
                        </div>
                        <div class="children:m-0! flex flex-col gap-2">
                            <el-button
                                v-if="isPasskeySupported"
                                class="w-full"
                                size="large"
                                @click="loginWithPasskey"
                            >
                                {{ $t('pages.auth.login.passkeyLogin') }}
                            </el-button>
                            <el-button
                                v-if="isQrCodeLoginEnabled"
                                class="w-full md:hidden!"
                                size="large"
                                @click="authQrCodeLoginDialogRef?.open()"
                            >
                                {{ $t('pages.auth.login.qrCodeLogin') }}
                            </el-button>
                        </div>
                    </template>
                </el-form>
            </div>
            <div
                v-if="isQrCodeLoginEnabled && !secondFactorChallenge"
                class="login-qr-code-panel lt-md:hidden flex-middle w-[320px] p-8"
            >
                <auth-qr-code-login-block
                    :qr-code-image-src="qrCodeLoginImageSrc"
                    @reload="reloadQrCodeLogin"
                />
            </div>
        </div>
        <auth-qr-code-login-dialog
            ref="authQrCodeLoginDialogRef"
            :qr-code-image-src="qrCodeLoginImageSrc"
            @reload="reloadQrCodeLogin"
        />
        <status-overlay ref="statusOverlayRef" />
    </div>
</template>

<script lang="ts" setup>
import { signalUnknownPasskey } from '@kcs-project/pack/libs/auth/passkey/browser';
import type {
    AuthLoginResultData,
    AuthPasswordLoginData,
} from '@kcs-project/pack/types/data/auth';

import { enterAuthenticatedSession } from '@/libs/auth';
import {
    authenticateWithPasskey,
    isPasskeySupported,
} from '@/libs/auth/passkey';
import type { AuthFactorProofData } from '@/types/data/auth';

definePageMeta({
    keepalive: false,
    layout: 'middle-block',
});

// Constants/Refs/Variables
const accountInputRef = useTemplateRef('accountInputRef');
const authQrCodeLoginDialogRef = useTemplateRef('authQrCodeLoginDialogRef');
const formData = ref<AuthPasswordLoginData>({
    account: '',
    password: '',
});

const formRef = useTemplateRef('formRef');
const formRules: ElFormRules<AuthPasswordLoginData> = {
    account: [createElFormItemRuleWithDefaults('請輸入帳號')],
    password: [createElFormItemRuleWithDefaults('請輸入密碼')],
};

const {
    imageSrc: qrCodeLoginImageSrc,
    isEnabled: isQrCodeLoginEnabled,
    reload: reloadQrCodeLogin,
    stop: stopQrCodeLogin,
} = useAuthQrCodeLogin(async () => {
    await handleLoginResult({
        restricted: false,
        state: 'completed',
    });
});

const secondFactorChallenge = ref<Extract<AuthLoginResultData, { state: 'secondFactorRequired' }>>();
const statusOverlayRef = useTemplateRef('statusOverlayRef');

// Functions
async function getSecondFactorPasskeyOptions() {
    return await AuthApi.use().getSecondFactorPasskeyOptions(
        secondFactorChallenge.value!.challengeId,
    );
}

/**
 * Continues with the result of a login step; resolves to whether the step succeeded.
 */
async function handleLoginResult(result?: AuthLoginResultData) {
    if (!result) return false;
    stopQrCodeLogin();
    if (result.state === 'secondFactorRequired') {
        authQrCodeLoginDialogRef.value?.close();
        secondFactorChallenge.value = result;
        return true;
    }

    ElNotification.success('登入成功');
    await enterAuthenticatedSession(result);
    return true;
}

async function login() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading('登入中...');
        const response = await AuthApi.use().login(formData.value);
        // After a successful login the page may have been left by now.
        if (!await handleLoginResult(response.data.data)) {
            if (!response.data.success && response.data.errorCode === 'invalidCredentials') {
                accountInputRef.value?.focus();
            } else showElFormApiFieldErrors(formRef.value, response.data);
        }

        statusOverlayRef.value?.hide();
    });
}

async function loginWithPasskey() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    statusOverlayRef.value.showLoading('登入中...');
    const authentication = await authenticateWithPasskey(async () => await AuthApi.use().getLoginPasskeyOptions());
    if (authentication) {
        const { proof } = authentication;
        const response = await AuthApi.use().loginWithPasskey(proof.challengeId, proof.response);
        if (!response.data.success && response.data.errorCode === 'passkeyUnknown') {
            void signalUnknownPasskey(authentication.rpId, proof.response.id);
        }

        await handleLoginResult(response.data.data);
    }

    statusOverlayRef.value?.hide();
}

async function loginWithSecondFactor(proof: AuthFactorProofData) {
    const challenge = secondFactorChallenge.value;
    if (!challenge) return false;
    const response = await AuthApi.use().loginWithSecondFactor(challenge.challengeId, proof);
    if (await handleLoginResult(response.data.data)) return true;
    // The first step has to be done again once its challenge is gone.
    if (!response.data.success && response.data.errorCode === 'challengeExpired') await returnToCredentials();
    return false;
}

async function returnToCredentials() {
    secondFactorChallenge.value = undefined;
    formData.value.password = '';
    await reloadQrCodeLogin();
}

// Hooks
onMounted(reloadQrCodeLogin);
</script>

<style lang="scss" scoped>
.login-qr-code-panel {
    @apply bg-black/3 dark:bg-white/3;

    border-left: 1px solid var(--el-border-color-lighter);
}

.login-divider-line {
    flex: 1;
    height: 1px;
    background: var(--el-border-color);
}
</style>
