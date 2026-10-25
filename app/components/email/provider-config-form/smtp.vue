<template>
    <el-form-input
        v-model="config.host"
        label="主機位址"
        prop="config.host"
        :rules="[
            createElFormItemRuleWithDefaults('請輸入主機位址'),
            {
                pattern: /^[a-zA-Z0-9.-]+$/,
                message: '請輸入正確的主機位址',
            },
        ]"
    />
    <el-form-item
        label="Port"
        prop="config.port"
        :rules="[createElFormItemRuleWithDefaults('請輸入Port', { type: 'integer' })]"
    >
        <el-filtered-input-number
            v-model="config.port"
            :max="65535"
            :min="1"
            :precision="0"
        />
    </el-form-item>
    <el-form-input
        v-model="config.username"
        label="帳號"
        prop="config.username"
    />
    <el-form-input
        v-model="config.password"
        label="密碼"
        prop="config.password"
    />
    <el-form-switch
        v-model="config.secure"
        label="啟用SSL"
    />
    <el-form-switch
        v-model="config.tls.required"
        label="啟用TLS"
    />
    <el-form-switch
        v-model="config.tls.rejectUnauthorized"
        class="mb-0!"
        label="拒絕TLS自簽名憑證"
    />
</template>

<script lang="ts" setup>
import type { EmailProviderConfigs } from '@kcs-project/pack/types/email';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: EmailProviderConfigs.Smtp): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<EmailProviderConfigs.Smtp>(
    props,
    emit,
    {
        host: '',
        password: '',
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: true,
            required: true,
        },
        username: '',
    },
);
</script>
