<template>
    <data-table-page
        v-model:form-data="formData"
        dialog-title-suffix="管理員身分組"
        title="管理員身分組管理"
        :crud-api="AdminRoleApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'admin.role' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                label="建立管理員帳號"
                prop="createdByAdmin.account"
            />
            <el-table-column
                label="編輯管理員帳號"
                prop="editedByAdmin.account"
            />
        </template>
        <template #form>
            <el-form-input
                v-model="formData.name"
                label="名稱"
                prop="name"
            />
            <el-form-item
                label="權限"
                prop="permissions"
            >
                <admin-permission-picker v-model="formData.permissions" />
            </el-form-item>
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import type { AdminRoleData } from '@kcs-project/pack/types/data/admin';

// Constants/Refs/Variables
const formData = ref<CrudFormData<AdminRoleData>>({
    name: '',
    permissions: [],
});

const formRules: ElFormRules<CrudFormData<AdminRoleData>> = { name: [createElFormItemRuleWithDefaults('請輸入名稱')] };
</script>
