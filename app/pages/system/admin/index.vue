<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="管理員"
        title="管理員管理"
        :confirm-delete-message="(row) => `確定要刪除 ${row.account} 嗎？`"
        :crud-api="AdminApi.use()"
        :disable-row-delete-btn-rule="(row) => row.id === profileState.id"
        :form-rules="formRules"
        :permissions="{ base: 'admin' }"
    >
        <template #table>
            <el-table-column
                label="帳號"
                prop="account"
            />
            <el-table-column
                label="電子郵件"
                prop="email"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換管理員 ${row.account} 的啟用狀態？`"
                :crud-api="AdminApi.use()"
                :disabled-condition="(row) => !dataTablePageRef?.capabilities.toggle || row.id === profileState.id"
                @status-change="dataTablePageRef?.loadData()"
            />
        </template>
        <template #form>
            <el-form-input
                v-model="formData.account"
                label="帳號"
                maxlength="32"
                name="account"
                prop="account"
            />
            <el-form-input
                v-model="formData.email"
                label="電子郵件"
                name="email"
                prop="email"
                type="email"
            />
            <el-form-input
                v-model="formData.password"
                autocomplete="new-password"
                name="password"
                prop="password"
                type="password"
                :label="`${formData.id ? '修改' : ''}密碼`"
                :rules="[
                    {
                        message: '請輸入密碼',
                        required: !formData.id,
                    },
                    ...commonElFormItemRules.adminPassword,
                ]"
            />
            <el-form-input
                v-model="formData.confirmPassword"
                label="確認密碼"
                name="confirm-password"
                prop="confirmPassword"
                type="password"
                :rules="formConfirmPasswordFieldItemRules"
            />
            <el-form-item label="身分組">
                <selector-admin-role
                    v-model="formData.roles"
                    value-key="id"
                    :selected-data="formData.roles"
                    multiple
                />
            </el-form-item>
            <el-form-switch
                v-model="formData.enabled"
                label="啟用"
                prop="enabled"
                :disabled="formData.id === profileState.id"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'element-plus';

import type { AdminFormData } from '@/types/data/admin';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<AdminFormData>({
    account: '',
    confirmPassword: '',
    email: '',
    enabled: false,
    id: '',
    password: '',
    roles: [],
});

const formRules: ElFormRules<AdminFormData> = {
    account: [createElFormItemRuleWithDefaults('請輸入帳號')],
    email: [
        createElFormItemRuleWithDefaults(
            '請輸入正確的電子郵件',
            {
                required: false,
                type: 'email',
            },
        ),
    ],
};

const profileState = useProfileState();

// Computed properties
const formConfirmPasswordFieldItemRules = computed<FormItemRule[]>(() => [
    {
        message: '請輸入確認密碼',
        required: !formData.value.id || !!formData.value.password,
    },
    {
        validator(_, value, callback) {
            if (value !== formData.value.password) return callback('確認密碼與密碼不一致');
            return callback();
        },
    },
]);
</script>
