<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="簡訊服務商"
        title="簡訊服務商管理"
        :before-dialog-open="(row) => void (formData.config = cloneDeep(row?.config || {}))"
        :crud-api="SmsProviderApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'sms.provider' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="服務商"
                :formatter="(row: SmsProviderData) => localize(smsProviderCodeToLabelMap[row.code])"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換簡訊服務商 ${row.name} 的啟用狀態？`"
                :crud-api="SmsProviderApi.use()"
                :disabled-condition="!dataTablePageRef?.capabilities.toggle"
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
                        v-for="provider in getEnumNumberValues(SmsProviderCode)"
                        :key="provider"
                        :label="localize(smsProviderCodeToLabelMap[provider])"
                        :value="provider"
                    />
                </el-select>
            </el-form-item>
            <sms-provider-config-form-tw-sms
                v-if="formData.code === SmsProviderCode.TwSms"
                v-model="formData.config"
            />
            <sms-provider-config-form-mitake
                v-else-if="formData.code === SmsProviderCode.Mitake"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    SmsProviderCode,
    smsProviderCodeToLabelMap,
} from '@kcs-project/pack/constants/sms';
import type { SmsProviderData } from '@kcs-project/pack/types/data/sms';

import type { SmsProviderFormData } from '@/types/data/sms';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<SmsProviderFormData>({
    apiProxyUrl: '',
    code: undefined,
    config: {},
    enabled: false,
    name: '',
    priority: 0,
});

const formRules: ElFormRules<SmsProviderFormData> = {
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
