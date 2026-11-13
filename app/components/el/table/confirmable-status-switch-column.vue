<template>
    <el-table-column align="center">
        <template #default="{ row }">
            <el-switch
                :before-change="() => beforeChange(row)"
                :disabled="typeof disabledCondition === 'boolean' ? disabledCondition : disabledCondition?.(row)"
                :model-value="row[field]"
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
import type { TableRowData } from '@kcs-project/pack/types/data';
import type { ConditionalKeys } from 'type-fest';

interface Props {
    confirmMessage: ((row: TR) => string) | string;
    crudApi: CA;
    disabledCondition?: ((row: TR) => boolean | undefined) | boolean;
    field: ConditionalKeys<TR, boolean> & string;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'statusChange'): void }>();

// Functions
const confirmChange = createElMessageBoxConfirmHandler<TR>({
    confirm: async (row) => (await props.crudApi.setBooleanField(row, props.field, !row[props.field])).data.success,
    loadingText: '切換中...',
    message: (row) => typeof props.confirmMessage === 'string' ? props.confirmMessage : props.confirmMessage(row),
    onSuccess: () => {
        ElNotification.success('切換成功');
        emit('statusChange');
    },
});

function beforeChange(row: TR) {
    confirmChange(row);
    return false;
}
</script>
