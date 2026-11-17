<template>
    <el-form
        ref="formRef"
        class="dark:bg-dark lt-md:p-3 relative w-full rounded-[10px] bg-white p-4"
        label-width="auto"
        :model="formData"
        :rules="formRules"
        @submit.prevent="changePassword"
    >
        <p class="fs-20px">
            變更密碼
        </p>
        <p class="text-gray mt-2">
            變更後其他裝置會被登出，目前的裝置會保持登入。
        </p>
        <el-form-input
            v-model="formData.currentPassword"
            class="mt-4"
            autocomplete="current-password"
            label="目前密碼"
            name="current-password"
            prop="currentPassword"
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
import type { AuthChangePasswordFormData } from '@/types/data/auth';

// Constants/Refs/Variables
const formData = ref<AuthChangePasswordFormData>({
    confirmPassword: '',
    currentPassword: '',
    newPassword: '',
});

const formRef = useTemplateRef('formRef');
const formRules: ElFormRules<AuthChangePasswordFormData> = {
    confirmPassword: [
        createElFormItemRuleWithDefaults('請輸入確認密碼'),
        {
            message: '確認密碼與新密碼不一致',
            validator: (_, value) => value === formData.value.newPassword,
        },
    ],
    currentPassword: [createElFormItemRuleWithDefaults('請輸入目前密碼')],
    newPassword: [createElFormItemRuleWithDefaults('請輸入新密碼')],
};

const statusOverlayRef = useTemplateRef('statusOverlayRef');

// Functions
const resetChangePasswordForm = () => formRef.value?.resetFields();

async function changePassword() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading('變更中...');
        const { confirmPassword: _, ...data } = formData.value;
        const response = await ProfileSecurityApi.use().changePassword(data);
        if (!response.data.success) {
            showElFormApiFieldErrors(formRef.value, response.data);
            return statusOverlayRef.value!.hide();
        }

        // The backend reissues this device's session and signs out the others, so the admin stays logged in.
        statusOverlayRef.value!.showSuccess('變更成功');
        resetChangePasswordForm();
    });
}

// Hooks
onDeactivated(resetChangePasswordForm);
</script>
