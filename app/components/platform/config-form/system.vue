<template>
    <el-empty description="目前尚無可調整的全系統設定項目" />
</template>

<script lang="ts" setup>
import type { PlatformConfigs } from '@kcs-project/pack/types/platform';
import type { AnyRecord } from '@kikiutils/shared/types';

// Define props, models and emits
const props = defineProps<{ modelValue: AnyRecord }>();
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigs.System): void }>();

// Constants/Refs/Variables

// @ts-expect-error Reserved for future config form fields.
// eslint-disable-next-line unused-imports/no-unused-vars
const config = useConfigFormModel<PlatformConfigs.System>(props, emit, {});
</script>
