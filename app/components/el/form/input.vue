<template>
    <el-form-item>
        <template #label>
            <slot name="label" />
        </template>
        <el-input
            ref="elInputRef"
            v-model="modelValue"
            :autocomplete="autocomplete"
            :autofocus="autofocus"
            :autosize="autosize"
            :clearable="clearable"
            :disabled="disabled"
            :maxlength="maxlength"
            :name="name"
            :placeholder="placeholder"
            :readonly="!!readonly"
            :rows="rows"
            :show-password="showPassword"
            :show-word-limit="showWordLimit"
            :type="type"
        />
    </el-form-item>
</template>

<script lang="ts" setup>
import type { InputAutoSize } from 'element-plus';
import type { InputTypeHTMLAttribute } from 'vue';

interface Props {
    autocomplete?: AutoFill;
    autofocus?: boolean;
    autosize?: InputAutoSize;
    clearable?: boolean;
    disabled?: boolean;
    maxlength?: number | string;
    name?: string;
    placeholder?: string;
    readonly?: boolean;
    rows?: number;
    showPassword?: boolean;
    showWordLimit?: boolean;
    type?: InputTypeHTMLAttribute;
}

// Define props, models and emits
defineProps<Props>();
const modelValue = defineModel<string>();

// Constants/Refs/Variables
const elInputRef = useTemplateRef('elInputRef');

// Exposes
defineExpose({ focus: () => elInputRef.value?.focus() });
</script>
