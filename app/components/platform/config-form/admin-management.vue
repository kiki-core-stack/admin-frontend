<template>
    <el-empty description="目前尚無可調整的總後台設定項目" />
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformConfigScope,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigs } from '@kcs-project/pack/types/platform';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigs.AdminManagement): void }>();

// Constants/Refs/Variables

// @ts-expect-error Reserved for future config form fields.
// eslint-disable-next-line unused-imports/no-unused-vars
const config = useConfigFormModel<PlatformConfigs.AdminManagement>(
    props,
    emit,
    defaultPlatformConfigs[PlatformConfigScope.AdminManagement],
);
</script>
