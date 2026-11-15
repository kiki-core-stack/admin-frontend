<template>
    <el-form-input
        v-model="config.apiUrl"
        label="API 網址"
        prop="config.apiUrl"
        :rules="[createElFormItemRuleWithDefaults('請輸入 API 網址')]"
    />
    <el-form-input
        v-model="config.username"
        label="帳號"
        prop="config.username"
        :rules="[createElFormItemRuleWithDefaults('請輸入帳號')]"
    />
    <el-form-input
        v-model="config.password"
        label="API 密碼"
        prop="config.password"
        :rules="[createElFormItemRuleWithDefaults('請輸入 API 密碼')]"
    />
</template>

<script lang="ts" setup>
import type { SmsProviderCode } from '@kcs-project/pack/constants/sms';
import type { SmsProviderConfigInputByCode } from '@kcs-project/pack/types/sms';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: SmsProviderConfigInputByCode[SmsProviderCode.TwSms]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<SmsProviderConfigInputByCode[SmsProviderCode.TwSms]>(
    props,
    emit,
    {
        apiUrl: '',
        password: '',
        username: '',
    },
);
</script>
