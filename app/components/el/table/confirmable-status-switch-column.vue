<template>
    <el-table-column align="center">
        <template #default="{ row }">
            <el-switch
                :before-change="() => beforeChange(row)"
                :disabled="typeof disabledCondition === 'boolean' ? disabledCondition : disabledCondition?.(row)"
                :model-value="get(row, field)"
            />
        </template>
    </el-table-column>
</template>

<script
    lang="ts"
    generic="
        CA extends BaseCrudApi<any, any>,
        TR extends TableRowData = CA extends BaseCrudApi<infer T, any> ? T : never
    "
    setup
>
import type { TableRowData } from '@kiki-core-stack/pack/types/data';
import { get } from 'es-toolkit/compat';

import type { BaseCrudApi } from '@/libs/apis/_internals/base/crud';

interface Props {
    confirmMessage: ((row: TR) => string) | string;
    crudApi: CA;
    disabledCondition?: ((row: TR) => boolean | undefined) | boolean;
    field: string;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'statusChange'): void }>();

// Functions
const confirmChange = createElMessageBoxConfirmHandler<TR>(
    (data) => typeof props.confirmMessage === 'string' ? props.confirmMessage : props.confirmMessage(data),
    '切換中...',
    async (data) => {
        return !!(await props.crudApi.updateBooleanField(data.id, props.field, !get(data, props.field)))?.data?.success;
    },
    () => {
        ElNotification.success('切換成功');
        emit('statusChange');
    },
);

function beforeChange(row: TR) {
    confirmChange(row);
    return false;
}
</script>
