<template>
    <el-input-number
        v-model="modelValue"
        @beforeinput="filterInput"
    >
        <template
            v-if="clearable && modelValue !== null && modelValue !== undefined"
            #suffix
        >
            <nuxt-icon
                class="el-input__icon el-input__clear"
                name="mdi:close-circle-outline"
                @click.stop="modelValue = null"
                @mousedown.prevent
            />
        </template>
    </el-input-number>
</template>

<script lang="ts" setup>
// Define props, models and emits
defineProps<{ clearable?: boolean }>();
const modelValue = defineModel<null | number>();

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
