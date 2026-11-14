<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="電子郵件服務商"
        permission-group="email.provider"
        title="電子郵件服務商管理"
        :before-dialog-open="(row) => void (formData.config = cloneDeep(row?.config || {}))"
        :crud-api="EmailProviderApi.use()"
        :form-rules="formRules"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="服務商"
                :formatter="(row: EmailProviderData) => localize(emailProviderCodeToLabelMap[row.code])"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換電子郵件服務商 ${row.name} 的啟用狀態？`"
                :crud-api="EmailProviderApi.use()"
                :disabled-condition="!dataTablePageRef?.can('toggle')"
                @status-change="dataTablePageRef?.loadData()"
            />
            <el-table-column
                align="center"
                label="優先度"
                prop="priority"
                sortable="custom"
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
        <template #form="{ editingRow }">
            <el-form-input
                v-model="formData.name"
                label="名稱"
                prop="name"
            />
            <el-form-item
                label="優先度"
                prop="priority"
            >
                <el-filtered-input-number
                    v-model="formData.priority"
                    :max="2147483647"
                    :min="-2147483648"
                    :precision="0"
                />
            </el-form-item>
            <el-form-input
                v-model="formData.apiProxyUrl"
                label="API Proxy 網址"
                prop="apiProxyUrl"
            />
            <el-form-switch
                v-model="formData.enabled"
                label="啟用"
                prop="enabled"
            />
            <el-form-item
                label="服務商"
                prop="code"
            >
                <el-select
                    v-model="formData.code"
                    :disabled="!!editingRow"
                    :teleported="false"
                >
                    <el-option
                        v-for="provider in getEnumNumberValues(EmailProviderCode)"
                        :key="provider"
                        :label="localize(emailProviderCodeToLabelMap[provider])"
                        :value="provider"
                    />
                </el-select>
            </el-form-item>
            <email-provider-config-form-smtp
                v-if="formData.code === EmailProviderCode.Smtp"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    EmailProviderCode,
    emailProviderCodeToLabelMap,
} from '@kcs-project/pack/constants/email';
import type { EmailProviderData } from '@kcs-project/pack/types/data/email';

import type { EmailProviderFormData } from '@/types/data/email';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<EmailProviderFormData>({
    apiProxyUrl: '',
    code: undefined,
    config: {},
    enabled: false,
    name: '',
    priority: 0,
});

const formRules: ElFormRules<EmailProviderFormData> = {
    code: [
        createElFormItemRuleWithDefaults(
            '請選擇服務商',
            {
                trigger: 'change',
                type: 'integer',
            },
        ),
    ],
    name: [createElFormItemRuleWithDefaults('請輸入名稱')],
};
</script>
