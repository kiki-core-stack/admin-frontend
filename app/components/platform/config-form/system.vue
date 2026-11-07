<template>
    <el-form-switch
        v-model="config.ipAccessPolicy.enabled"
        label="IP存取規則總開關"
        prop="config.ipAccessPolicy.enabled"
    />
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformConfigScope,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigInputByScope } from '@kcs-project/pack/types/platform';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigInputByScope[PlatformConfigScope.System]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<PlatformConfigInputByScope[PlatformConfigScope.System]>(
    props,
    emit,
    defaultPlatformConfigs[PlatformConfigScope.System],
);
</script>
