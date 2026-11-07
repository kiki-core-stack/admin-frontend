<template>
    <el-dialog
        v-model="isVisible"
        :before-close="beforeClose"
        :close-on-click-modal="!statusOverlayRef?.isVisible"
        :close-on-press-escape="!statusOverlayRef?.isVisible"
        :title="`${isEditing ? '編輯' : '新增'}${titleSuffix}`"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
        draggable
    >
        <el-form
            ref="formRef"
            label-width="auto"
            :model="formData"
            :rules="rules"
            status-icon
            @submit.prevent="save"
        >
            <slot />
            <div class="text-center">
                <el-button
                    native-type="submit"
                    type="primary"
                >
                    儲存
                </el-button>
            </div>
        </el-form>
        <status-overlay ref="statusOverlayRef" />
    </el-dialog>
</template>

<script
    lang="ts"
    generic="
        TR extends TableRowData,
        FD extends TableRowData = TableRowData
    "
    setup
>
import type { TableRowData } from '@kcs-project/pack/types/data';
import type { Promisable } from 'type-fest';

type InitialData = Omit<Partial<FD>, 'id'>;
type OpenPayload =
  | { initialData?: InitialData; mode: 'create' }
  | { mode: 'edit'; row: TR };

interface Props {
    beforeOpen?: (row?: TR) => Promisable<void>;
    canSave: boolean;
    crudApi: BaseCrudApi<TR, NoInfer<FD>>;
    rules?: ElFormRules<Record<string, any>>;
    titleSuffix?: string;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'saved'): void }>();
const formData = defineModel<FD>('formData');

// Constants/Refs/Variables
const defaultFormData = formData.value && cloneDeep(formData.value);
const formRef = useTemplateRef('formRef');
const isEditing = ref(false);
const isVisible = ref(false);
const statusOverlayRef = useTemplateRef('statusOverlayRef');
let openGeneration = 0;

// Functions
function beforeClose(done: () => void) {
    close();
    done();
}

function close() {
    ++openGeneration;
    isVisible.value = false;
}

async function open(payload: OpenPayload = { mode: 'create' }) {
    if (!defaultFormData) return;

    const generation = ++openGeneration;
    const row = payload.mode === 'edit' ? payload.row : undefined;

    statusOverlayRef.value?.hide();
    formRef.value?.resetFields();
    isEditing.value = row !== undefined;

    const source = payload.mode === 'edit' ? payload.row : payload.initialData;
    const data = cloneDeep(defaultFormData);
    merge(data, source ?? {});
    if (!row) data.id = defaultFormData.id;
    formData.value = data;

    await props.beforeOpen?.(row);
    if (generation !== openGeneration) return;

    isVisible.value = true;
}

async function save() {
    if (!props.canSave) return;
    if (!formData.value || !statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    const data = formData.value;
    await formRef.value?.validate(async (valid) => {
        if (!valid) return;
        statusOverlayRef.value!.showLoading('儲存中...');
        const response = data.id
            ? await props.crudApi.update(data.id, data)
            : await props.crudApi.create(data);

        if (!response?.data?.success) return statusOverlayRef.value!.hide();
        close();
        ElNotification.success(data.id ? '儲存成功' : '新增成功');
        emit('saved');
    });
}

// Hooks
onBeforeUnmount(close);

// Exposes
defineExpose({
    close,
    open,
});
</script>
