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
import type { PlatformConfigs } from '@kcs-project/pack/types/platform';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigs.System): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<PlatformConfigs.System>(
    props,
    emit,
    defaultPlatformConfigs[PlatformConfigScope.System],
);
</script>
