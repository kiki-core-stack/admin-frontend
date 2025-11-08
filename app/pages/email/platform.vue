<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="電子郵件平台"
        title="電子郵件平台管理"
        :before-dialog-open="(row?: EmailPlatformData) => formData.config = row?.config || {}"
        :crud-api="EmailPlatformApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'email.platform' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="服務提供者"
                :formatter="(row: EmailPlatformData) => emailServiceProviderToTextMap[row.serviceProvider]"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換電子郵件平台 ${row.name} 的啟用狀態？`"
                :crud-api="EmailPlatformApi.use()"
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
                maxlength="32"
                prop="name"
            />
            <el-form-item
                label="優先度"
                prop="priority"
            >
                <el-filtered-input-number v-model="formData.priority" />
            </el-form-item>
            <el-form-switch
                v-model="formData.enabled"
                label="啟用"
                prop="enabled"
            />
            <el-form-item
                label="服務提供者"
                prop="serviceProvider"
            >
                <el-select
                    v-model="formData.serviceProvider"
                    :disabled="!!formData.id"
                    :teleported="false"
                >
                    <el-option
                        v-for="provider in getEnumNumberValues(EmailServiceProvider)"
                        :key="provider"
                        :label="emailServiceProviderToTextMap[provider]"
                        :value="provider"
                    />
                </el-select>
            </el-form-item>
            <email-platform-config-form-smtp
                v-if="formData.serviceProvider === EmailServiceProvider.Smtp"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    EmailServiceProvider,
    emailServiceProviderToTextMap,
} from '@kiki-core-stack/pack/constants/email';
import type { EmailPlatformData } from '@kiki-core-stack/pack/types/data/email';
import type { SetOptional } from 'type-fest';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<SetOptional<TablePageFormData<EmailPlatformData, 'configMd5'>, 'serviceProvider'>>({
    config: {},
    enabled: false,
    id: '',
    name: '',
    priority: 0,
    serviceProvider: undefined,
});

const formRules: TablePageElFormRules<EmailPlatformData> = {
    name: [createElFormItemRuleWithDefaults('請輸入名稱')],
    priority: [createElFormItemRuleWithDefaults('請輸入優先度', { type: 'integer' })],
    serviceProvider: [
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
