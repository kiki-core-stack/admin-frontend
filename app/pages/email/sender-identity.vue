<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="電子郵件寄件身份"
        title="電子寄件身份管理"
        :confirm-delete-message="(row) => `確定要刪除寄件身分為 ${emailSenderIdentityKeyToTextMap[row.key]} 的設定嗎？`"
        :crud-api="EmailSenderIdentityApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'email.senderIdentity' }"
    >
        <template #table>
            <el-table-column
                label="寄件身分"
                :formatter="(row: EmailSenderIdentityData) => emailSenderIdentityKeyToTextMap[row.key]"
            />
            <el-table-column
                label="寄件地址"
                prop="from"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換寄件身分為 ${emailSenderIdentityKeyToTextMap[row.key]} 的啟用狀態？`"
                :crud-api="EmailSenderIdentityApi.use()"
                :disabled-condition="!dataTablePageRef?.capabilities.toggle"
                @status-change="dataTablePageRef?.loadData()"
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
            <el-form-item
                label="寄件身分"
                prop="key"
            >
                <selector-email-sender-identity-key
                    v-model="formData.key"
                    :clearable="false"
                />
            </el-form-item>
            <el-form-input
                v-model="formData.from"
                label="寄件地址"
                prop="from"
            />
            <el-form-switch
                v-model="formData.enabled"
                label="啟用"
                prop="enabled"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    EmailSenderIdentityKey,
    emailSenderIdentityKeyToTextMap,
} from '@kiki-core-stack/pack/constants/email';
import type { EmailSenderIdentityData } from '@kiki-core-stack/pack/types/data/email';
import { isValid } from '@sylke/email-validation';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<TablePageFormData<EmailSenderIdentityData>>({
    enabled: false,
    from: '',
    id: '',
    key: EmailSenderIdentityKey.Admin,
});

const formRules: TablePageElFormRules<EmailSenderIdentityData> = {
    from: [
        createElFormItemRuleWithDefaults('請輸入寄件地址'),
        {
            validator(_, value, callback) {
                if (!isValid(
                    value,
                    {
                        allowDisplayText: true,
                        allowDomainLiteral: false,
                        minimumSubDomains: 2,
                    },
                )) return callback(new Error('請輸入正確格式的寄件地址'));
                callback();
            },
        },
    ],
};
</script>
