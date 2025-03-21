<template>
    <div
        v-loading="isLoadingData"
        class="color-mode-transition dark:bg-dark rounded-10px relative w-full overflow-auto bg-white p-4"
    >
        <p class="fs-20px mb-4 text-center">
            二階段驗證
        </p>
        <el-form-switch
            v-model="profileState.twoFactorAuthenticationStatus.emailOtp"
            label="Email OTP驗證碼"
            :before-change="() => beforeSwitchChange('emailOtp')"
        />
        <el-form-switch
            v-model="profileState.twoFactorAuthenticationStatus.totp"
            class="mb-0!"
            label="TOTP驗證碼"
            :before-change="() => beforeSwitchChange('totp')"
        />
    </div>
    <el-dialog
        v-model="isDialogOpen"
        width="96vmin"
        :close-on-click-modal="!toggleState.loading"
        :close-on-press-escape="!toggleState.loading"
        :title="`切換${methodToTextMap[toToggleMethod]}狀態`"
        align-center
        append-to-body
        center
        draggable
    >
        <el-form
            ref="formRef"
            class="fs-16px text-center"
            label-width="auto"
            :model="formData"
            @submit.prevent="toggleStatus"
        >
            <p class="mb-1">
                輸入驗證碼並送出以切換狀態
            </p>
            <div v-if="toToggleMethod === 'totp'">
                <div
                    v-if="totpSecretData.secret"
                    class="flex-middle w-full flex-col"
                >
                    <p>請使用TOTP應用程式(例如Google Authenticator)掃描該QRCode或自行輸入設定金鑰獲取驗證碼</p>
                    <QrCodeVue
                        class="h-auto! max-w-250px! rounded-3 w-full! mt-4 bg-white p-3"
                        level="L"
                        render-as="svg"
                        :value="decodeURI(totpSecretData.url)"
                    />
                    <el-form-input
                        v-model="totpSecretData.secret"
                        class="mt-4 w-full"
                        label="設定金鑰"
                        disabled
                        enable-copy-btn
                    />
                </div>
            </div>
            <two-factor-authentication-code-inputs
                email-otp-code-type="adminToggleTwoFactorAuthenticationStatus"
                :force-enabled-fields="[toToggleMethod]"
                :form-data="formData"
            />
            <el-button
                native-type="submit"
                type="primary"
            >
                切換
            </el-button>
        </el-form>
        <state-absolute
            loading-text="切換中..."
            :state="toggleState"
        />
    </el-dialog>
</template>

<script lang="ts" setup>
import type { ProfileSecurityTotpSecretData } from '@kiki-core-stack/pack/types/data/profile';
import QrCodeVue from 'qrcode.vue';

import { profileSecurityApi } from '@/apis/profile/security';

// Variables
const { state: toggleState } = createLoadingState();
const formData = reactive<TwoFactorAuthenticationCodesData>({
    emailOtpCode: '',
    totpCode: '',
});

const formRef = ref<ElFormRef>(null);
const isDialogOpen = ref(false);
const isLoadingData = ref(true);
const methodToTextMap: Record<TwoFactorAuthenticationMethod, string> = {
    emailOtp: 'Email OTP驗證碼',
    totp: 'TOTP驗證碼',
};

const toToggleMethod = ref<TwoFactorAuthenticationMethod>('emailOtp');
const totpSecretData = reactive<ProfileSecurityTotpSecretData>({
    secret: '',
    url: '',
});

// Functions
function beforeSwitchChange(method: TwoFactorAuthenticationMethod) {
    formRef.value?.resetFields();
    isDialogOpen.value = true;
    toToggleMethod.value = method;
    return false;
}

async function loadData() {
    isLoadingData.value = true;
    const response = await profileSecurityApi.getTotpSecret();
    isLoadingData.value = false;
    if (response?.data.success) clearAndAssignObject(totpSecretData, response.data.data);
}

async function toggleStatus() {
    if (toggleState.loading) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        profileState.autoUpdateTwoFactorAuthenticationStatus = false;
        toggleState.loading = true;
        const response = await profileSecurityApi.toggleTwoFactorAuthenticationStatus(toToggleMethod.value, formData);
        profileState.autoUpdateTwoFactorAuthenticationStatus = true;
        toggleState.loading = false;
        if (!response?.data.success) return;
        ElNotification.success('切換成功！');
        isDialogOpen.value = false;
        setTimeout(loadData, 500);
        await updateProfileState();
    });
}

// Hooks
onMounted(loadData);
</script>
