<template>
    <el-input-number
        @keypress="(event: KeyboardEvent) => {
            if (event.key.match(filterCharsRegex)) event.preventDefault();
        }"
    />
</template>

<script lang="ts" setup>
// Define props, models and emits
const props = withDefaults(defineProps<{ filterChars?: string }>(), { filterChars: '+-.e' });

// Computed properties
const filterCharsRegex = computed(() => new RegExp(`[${props.filterChars}]`, 'i'));
</script>
