<template>
    <platform-config-form-auth-fields
        v-model="config.auth"
        prop-prefix="config.auth"
    />
</template>

<script lang="ts" setup>
import { defaultPlatformConfigs } from '@kcs-project/pack/constants/platform';
import type { PlatformScope } from '@kcs-project/pack/constants/platform';
import type { PlatformConfigInputByScope } from '@kcs-project/pack/types/platform';

type AuthPlatformScope = Exclude<PlatformScope, PlatformScope.System>;

// Define props, models and emits
const props = defineProps<{
    modelValue: Record<string, any>;
    scope: AuthPlatformScope;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', config: PlatformConfigInputByScope[AuthPlatformScope]): void }>();

// Constants/Refs/Variables
const config = useConfigFormModel<PlatformConfigInputByScope[AuthPlatformScope]>(
    props,
    emit,
    defaultPlatformConfigs[props.scope],
);
</script>
