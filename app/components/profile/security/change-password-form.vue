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
            {{ actionLabel }}密碼
        </p>
        <p class="text-gray mt-2 mb-4">
            {{ actionLabel }}後所有裝置都會被登出，需要以新密碼重新登入。
        </p>
        <el-form-input
            v-if="requiresCurrentPassword"
            v-model="formData.currentPassword"
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
                {{ actionLabel }}
            </el-button>
        </div>
        <status-overlay ref="statusOverlayRef" />
    </el-form>
</template>

<script lang="ts" setup>
import { loginPagePath } from '@/constants/auth';
import type { AuthChangePasswordFormData } from '@/types/data/auth';

interface Props {
    /**
     * Accounts registered with an external identity may have no password yet.
     */
    hasPassword: boolean;

    /**
     * Otherwise the backend only asks for a verification.
     */
    requiresCurrentPassword: boolean;
}

// Define props, models and emits
const props = defineProps<Props>();

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

// Computed properties
const actionLabel = computed(() => props.hasPassword ? '變更' : '設定');

// Functions
const resetChangePasswordForm = () => formRef.value?.resetFields();

async function changePassword() {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading(`${actionLabel.value}中...`);
        const response = await ProfileSecurityApi.use().changePassword({
            currentPassword: props.requiresCurrentPassword ? formData.value.currentPassword : undefined,
            newPassword: formData.value.newPassword,
        });

        if (!response.data.success) {
            showElFormApiFieldErrors(formRef.value, response.data);
            return statusOverlayRef.value!.hide();
        }

        // The backend signs out every device, this one included.
        statusOverlayRef.value!.showSuccess(`${actionLabel.value}成功，請重新登入`);
        assignUrlWithRedirectParamFromCurrentLocation(loginPagePath, 1000);
    });
}

// Hooks
onDeactivated(resetChangePasswordForm);
</script>
