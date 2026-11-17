<template>
    <el-empty description="目前尚無可調整的總後台設定項目" />
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformScope,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigInputByScope } from '@kcs-project/pack/types/platform';

// Define props, models and emits
const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigInputByScope[PlatformScope.AdminManagement]): void }>();

// Constants/Refs/Variables

// @ts-expect-error Reserved for future config form fields.
// eslint-disable-next-line unused-imports/no-unused-vars
const config = useConfigFormModel<PlatformConfigInputByScope[PlatformScope.AdminManagement]>(
    props,
    emit,
    defaultPlatformConfigs[PlatformScope.AdminManagement],
);
</script>
