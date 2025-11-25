<template>
    <el-dropdown
        trigger="click"
        :disabled="disabled"
    >
        <el-action-btn
            :disabled="disabled"
            :size="btnSize"
            :type="btnType"
        >
            {{ btnText ?? $t('actions') }}
        </el-action-btn>
        <template #dropdown>
            <el-dropdown-menu>
                <slot />
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
interface Props {
    btnSize?: string;
    btnText?: string;
    btnType?: string;
    disabled?: boolean;
}

// Define props, models and emits
withDefaults(
    defineProps<Props>(),
    {
        btnSize: 'small',
        btnType: 'primary',
    },
);
</script>
