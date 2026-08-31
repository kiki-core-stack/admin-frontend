<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="電子郵件服務商"
        title="電子郵件服務商管理"
        :before-dialog-open="(row) => void (formData.config = row?.config || {})"
        :crud-api="EmailProviderApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'email.provider' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="服務商"
                :formatter="(row: EmailProviderData) => emailProviderCodeToTextMap[row.providerCode]"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換電子郵件服務商 ${row.name} 的啟用狀態？`"
                :crud-api="EmailProviderApi.use()"
                :disabled-condition="!dataTablePageRef?.capabilities.toggle"
                @status-change="dataTablePageRef?.loadData()"
            />
            <el-table-column
                align="center"
                label="優先度"
                prop="priority"
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
                maxlength="64"
                prop="name"
            />
            <el-form-item
                label="優先度"
                prop="priority"
            >
                <el-filtered-input-number v-model="formData.priority" />
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
                prop="providerCode"
            >
                <el-select
                    v-model="formData.providerCode"
                    :disabled="!!formData.id"
                    :teleported="false"
                >
                    <el-option
                        v-for="provider in getEnumNumberValues(EmailProviderCode)"
                        :key="provider"
                        :label="emailProviderCodeToTextMap[provider]"
                        :value="provider"
                    />
                </el-select>
            </el-form-item>
            <email-provider-config-form-smtp
                v-if="formData.providerCode === EmailProviderCode.Smtp"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    EmailProviderCode,
    emailProviderCodeToTextMap,
} from '@kiki-core-stack/pack/constants/email';
import type { EmailProviderData } from '@kiki-core-stack/pack/types/data/email';
import type { SetOptional } from 'type-fest';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<SetOptional<TablePageFormData<EmailProviderData, 'configHash'>, 'providerCode'>>({
    apiProxyUrl: '',
    config: {},
    enabled: false,
    id: '',
    name: '',
    priority: 0,
    providerCode: undefined,
});

const formRules: TablePageElFormRules<EmailProviderData> = {
    apiProxyUrl: [
        createElFormItemRuleWithDefaults(
            '請輸入正確的網址',
            {
                required: false,
                type: 'url',
            },
        ),
    ],
    name: [createElFormItemRuleWithDefaults('請輸入名稱')],
    priority: [createElFormItemRuleWithDefaults('請輸入優先度', { type: 'integer' })],
    providerCode: [
        createElFormItemRuleWithDefaults(
            '請選擇服務提供者',
            {
                trigger: 'change',
                type: 'integer',
            },
        ),
    ],
};
</script>
