<template>
    <el-dialog
        v-model="isVisible"
        :before-close="beforeClose"
        :close-on-click-modal="!statusOverlayRef?.isVisible"
        :close-on-press-escape="!statusOverlayRef?.isVisible"
        :title="`${editingRow ? '編輯' : '新增'}${titleSuffix}`"
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
            <slot :editing-row="editingRow" />
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
        FD extends object
    "
    setup
>
import type { TableRowData } from '@kcs-project/pack/types/data';
import type { Promisable } from 'type-fest';

type OpenPayload =
  | { initialData?: Partial<FD>; mode: 'create' }
  | { mode: 'edit'; row: TR };

interface Props {
    beforeOpen?: (row?: TR) => Promisable<void>;
    canCreate: boolean;
    canUpdate: boolean;
    crudApi: BaseCrudApi<TR, FD>;
    rules?: ElFormRules<Record<string, any>>;
    titleSuffix?: string;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'saved'): void }>();
const formData = defineModel<FD>('formData', { required: true });

// Constants/Refs/Variables
// Snapshot of the initial form data: every opening starts from it, and its keys define what the form contains.
const defaultFormData = cloneDeep(formData.value);
const editingRow = shallowRef<TR>();
const formRef = useTemplateRef('formRef');
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

/**
 * Builds the form data from the defaults, taking only the form's own fields from the source (an edited row also has
 * `id` and list-only fields such as `createdAt` or `createdByAdmin`).
 */
function createFormData(source?: object) {
    const data = cloneDeep(defaultFormData);
    if (!source) return data;
    for (const key in defaultFormData) {
        if (key in source) data[key] = cloneDeep(Reflect.get(source, key));
    }

    return data;
}

async function open(payload: OpenPayload = { mode: 'create' }) {
    const generation = ++openGeneration;
    const row = payload.mode === 'edit' ? payload.row : undefined;
    const source = payload.mode === 'edit' ? payload.row : payload.initialData;

    statusOverlayRef.value?.hide();
    formRef.value?.resetFields();
    editingRow.value = row;
    formData.value = createFormData(source);

    await props.beforeOpen?.(row);
    if (generation !== openGeneration) return;

    isVisible.value = true;
}

async function save() {
    const row = editingRow.value;
    const canSave = row ? props.canUpdate : props.canCreate;
    if (!canSave || !statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    formRef.value?.clearValidate();
    if (!await formRef.value?.validate().catch(() => false)) return;

    statusOverlayRef.value.showLoading('儲存中...');
    const response = row
        ? await props.crudApi.update(row, formData.value)
        : await props.crudApi.create(formData.value);

    if (!response.data.success) {
        showElFormApiFieldErrors(formRef.value, response.data);
        statusOverlayRef.value.hide();
        return;
    }

    close();
    ElNotification.success(row ? '儲存成功' : '新增成功');
    emit('saved');
}

// Hooks
onBeforeUnmount(close);

// Exposes
defineExpose({
    close,
    open,
});
</script>
