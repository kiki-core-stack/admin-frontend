<template>
    <platform-config-form-auth-fields
        v-model="config.auth"
        prop-prefix="config.auth"
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
const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigInputByScope[PlatformScope.AdminManagement]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<PlatformConfigInputByScope[PlatformScope.AdminManagement]>(
    props,
    emit,
    defaultPlatformConfigs[PlatformScope.AdminManagement],
);
</script>
