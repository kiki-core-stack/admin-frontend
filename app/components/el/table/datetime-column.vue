<template>
    <el-table-column
        align="center"
        width="156"
        :formatter="formatDateCell"
        :prop="prop"
    />
</template>

<script lang="ts" setup>
import type { AnyRecord } from '@kikiutils/shared/types';
import { get } from 'es-toolkit/compat';

interface Props {
    emptyText?: string;
    prop?: string;
}

// Define props, models and emits
const props = withDefaults(
    defineProps<Props>(),
    {
        emptyText: '',
        prop: 'createdAt',
    },
);

// Functions
function formatDateCell(row: AnyRecord) {
    const value = get(row, props.prop);
    if (value === null || value === undefined) return props.emptyText;
    return formatDate(value);
}
</script>
