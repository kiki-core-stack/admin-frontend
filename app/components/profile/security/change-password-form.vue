<template>
    <el-form
        ref="formRef"
        class="dark:bg-dark relative w-full rounded-[10px] bg-white p-4"
        label-width="auto"
        :model="formData"
        :rules="formRules"
        @submit.prevent="changePassword"
    >
        <p class="fs-20px text-center">
            變更密碼
        </p>
        <el-form-input
            v-model="formData.oldPassword"
            class="mt-4"
            label="舊密碼"
            name="old-password"
            prop="oldPassword"
            type="password"
        />
        <el-form-input
            v-model="formData.newPassword"
            autocomplete="new-password"
            label="新密碼"
            name="new-password"
            prop="newPassword"
            type="password"
        />
        <el-form-input
            v-model="formData.confirmPassword"
            autocomplete="new-password"
            label="確認密碼"
            name="confirm-password"
            prop="confirmPassword"
            type="password"
        />
        <div class="flex-middle gap-btns">
            <el-button @click="resetChangePasswordForm">
                清空
            </el-button>
            <el-button native-type="submit">
                變更
            </el-button>
        </div>
        <status-overlay ref="statusOverlayRef" />
    </el-form>
</template>

<script lang="ts" setup>
import type { ProfileSecurityChangePasswordFormData } from '@/types/data/profile';

// Constants/Refs/Variables
const formData = ref<ProfileSecurityChangePasswordFormData>({
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
});

const formRef = useTemplateRef('formRef');
const formRules: ElFormRules<ProfileSecurityChangePasswordFormData> = {
    confirmPassword: [
        createElFormItemRuleWithDefaults('請輸入確認密碼'),
        {
            validator(_, value, callback) {
                if (value !== formData.value.newPassword) return callback('確認密碼與新密碼不一致');
                return callback();
            },
        },
    ],
    newPassword: [
        createElFormItemRuleWithDefaults('請輸入新密碼'),
        ...commonElFormItemRules.adminPassword,
    ],
    oldPassword: [createElFormItemRuleWithDefaults('請輸入舊密碼')],
};

const statusOverlayRef = useTemplateRef('statusOverlayRef');

// Functions
const resetChangePasswordForm = () => formRef.value?.resetFields();

async function changePassword() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading('變更中...');
        const response = await ProfileSecurityApi.use().changePassword(formData.value);
        if (!response?.data?.success) return statusOverlayRef.value!.hide();
        statusOverlayRef.value!.showSuccess('變更成功', false);
        assignUrlWithRedirectParamFromCurrentLocation('/auth/login/', 1000);
    });
}

// Hooks
onDeactivated(resetChangePasswordForm);
</script>
