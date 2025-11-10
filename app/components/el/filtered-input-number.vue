<template>
    <el-input-number
        @beforeinput="(event: InputEvent) => {
            if (typeof event.data === 'string' && filterCharsRegex.test(event.data)) event.preventDefault();
        }"
        @keydown="(event: KeyboardEvent) => {
            if (filterCharsRegex.test(event.key)) event.preventDefault();
        }"
    />
</template>

<script lang="ts" setup>
// Define props, models and emits
const props = withDefaults(defineProps<{ filterChars?: string }>(), { filterChars: '+-.e' });

// Computed properties
const filterCharsRegex = computed(() => new RegExp(`[${props.filterChars}]`, 'i'));
</script>
