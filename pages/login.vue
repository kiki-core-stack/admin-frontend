<template>
    <div>
        <h1 class="fs-32px">
            後台管理系統登入
        </h1>
        <el-form
            ref="formRef"
            class="mt-4"
            label-width="auto"
            :model="formData"
            :rules="formRules"
            hide-required-asterisk
            @submit.prevent="login"
        >
            <el-form-input
                ref="accountInputRef"
                v-model="formData.account"
                label="帳號"
                name="account"
                prop="account"
            />
            <el-form-input
                v-model="formData.password"
                label="密碼"
                name="password"
                prop="password"
                type="password"
            />
            <div class="flex items-center">
                <el-form-input
                    ref="verCodeInputRef"
                    v-model="formData.verCode"
                    class="mb-0!"
                    autocomplete="off"
                    label="驗證碼"
                    maxlength="4"
                    name="ver-code"
                    prop="verCode"
                />
                <img
                    class="ml-2 cursor-pointer"
                    alt="刷新驗證碼"
                    height="50"
                    width="150"
                    :src="verCodeSrc"
                    @click="reloadVerCode"
                >
            </div>
            <el-button
                class="mt-4"
                native-type="submit"
            >
                登入
            </el-button>
        </el-form>
        <state-absolute
            loading-text="登入中..."
            success-text="登入成功！"
            :state="loginState"
        />
    </div>
</template>

<script lang="ts" setup>
import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';

import { authApi } from '@/apis/auth';
import { init } from '@/plugins/12.init.client';

definePageMeta({
    keepalive: false,
    layout: 'middle-block',
    title: '登入',
});

// Variables
const { state: loginState } = createLoadingState();
const accountInputRef = ref<ElFormInputRef>(null);
const formData = reactive<AdminLoginFormData>({
    account: '',
    password: '',
    verCode: '',
});

const formRef = ref<ElFormRef>(null);
const formRules: ElFormRules<AdminLoginFormData> = {
    account: [createElFormItemRule('請輸入帳號')],
    password: [createElFormItemRule('請輸入密碼')],
    verCode: [
        createElFormItemRule('請輸入驗證碼'),
        {
            max: 4,
            message: '驗證碼必須為四個字',
            min: 4,
        },
    ],
};

const verCodeInputRef = ref<ElFormInputRef>(null);
const verCodeSrc = ref('/api/ver-code');

// Functions
async function login() {
    if (loginState.loading) return;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        loginState.loading = true;
        const response = await authApi.login(formData);
        if (response?.status === 404) accountInputRef.value?.focus();
        else if (response?.data.data?.isVerCodeIncorrect) verCodeInputRef.value?.focus();
        else if (response?.data.success) {
            await updateProfileState();
            ElNotification.success('登入成功！');
            formRef.value?.resetFields();
            init();
            navigateTo(flattenToSingleValue(useRoute().query.redirect, '/'), { replace: true });
            return;
        }

        loginState.loading = false;
        reloadVerCode();
        formRef.value?.resetFields(['verCode']);
    });
}

function reloadVerCode() {
    formData.verCode = '';
    verCodeSrc.value = `/api/ver-code?${Date.now()}`;
}
</script>
