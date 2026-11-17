<template>
    <el-form-switch
        v-model="config.ipAccessPolicy.enabled"
        label="IP 存取規則總開關"
        prop="config.ipAccessPolicy.enabled"
    />
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformScope,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigInputByScope } from '@kcs-project/pack/types/platform';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigInputByScope[PlatformScope.System]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<PlatformConfigInputByScope[PlatformScope.System]>(
    props,
    emit,
    defaultPlatformConfigs[PlatformScope.System],
);
</script>
