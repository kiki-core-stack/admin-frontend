<template>
    <el-form-input
        v-model="config.apiUrl"
        label="API網址"
        prop="config.apiUrl"
        :rules="[
            createElFormItemRuleWithDefaults('請輸入API網址'),
            createElFormItemRuleWithDefaults('請輸入正確的網址', { type: 'url' }),
        ]"
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
import type { SmsProviderConfigs } from '@kcs-project/pack/types/sms';
import type { AnyRecord } from '@kikiutils/shared/types';

// Define props, models and emits
const props = defineProps<{ modelValue: AnyRecord }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: SmsProviderConfigs.TwSms): void }>();

// Constants/Refs/Variables
const config = ref<SmsProviderConfigs.TwSms>({
    apiUrl: '',
    password: '',
    username: '',
});

// Watchers
watch(
    () => config,
    (nv) => emit('update:modelValue', nv.value),
    { deep: true },
);

watch(
    () => props.modelValue,
    (nv) => {
        let needToEmit = false;
        for (const key in config.value) {
            if (nv[key] === undefined) needToEmit = true;
            // @ts-expect-error Ignore this error.
            else config.value[key] = nv[key];
        }

        if (needToEmit) emit('update:modelValue', config.value);
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>
