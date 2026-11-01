<template>
    <el-input-number @beforeinput="filterInput" />
</template>

<script lang="ts" setup>
// Constants/Refs/Variables
const attrs = useAttrs();

// Functions
function filterInput(event: InputEvent) {
    if (!event.data) return;

    // Only block characters the bound min / precision would reject; scientific notation and plus signs never apply.
    const blockedChars = new Set([
        '+',
        'E',
        'e',
    ]);

    if (Number(attrs.min) >= 0) blockedChars.add('-');
    if (Number(attrs.precision) === 0) blockedChars.add('.');
    for (const char of event.data) {
        if (blockedChars.has(char)) return event.preventDefault();
    }
}
</script>
