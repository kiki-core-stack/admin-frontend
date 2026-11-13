<template>
    <el-form-input
        v-model="config.apiUrl"
        label="API網址"
        prop="config.apiUrl"
        :rules="[createElFormItemRuleWithDefaults('請輸入API網址')]"
    />
    <el-form-input
        v-model="config.username"
        label="帳號"
        prop="config.username"
        :rules="[createElFormItemRuleWithDefaults('請輸入帳號')]"
    />
    <el-form-input
        v-model="config.password"
        label="API密碼"
        prop="config.password"
        :rules="[createElFormItemRuleWithDefaults('請輸入API密碼')]"
    />
</template>

<script lang="ts" setup>
import type { SmsProviderCode } from '@kcs-project/pack/constants/sms';
import type { SmsProviderConfigInputByCode } from '@kcs-project/pack/types/sms';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: SmsProviderConfigInputByCode[SmsProviderCode.Mitake]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<SmsProviderConfigInputByCode[SmsProviderCode.Mitake]>(
    props,
    emit,
    {
        apiUrl: '',
        password: '',
        username: '',
    },
);
</script>
