<template>
    <div
        v-loading="isLoadingData"
        class="h-full"
    >
        <div
            ref="mainContainerRef"
            class="lt-md:p-3 h-full overflow-auto p-4"
        >
            <div class="dark:bg-dark lt-md:p-2 relative rounded-[10px] bg-white p-4">
                <slot name="before-toolbar" />
                <div class="b b-b-0 el-bg-and-border rounded-t-1 p-1">
                    <slot name="toolbar-prepend" />
                    <div class="gap-btns flex flex-wrap">
                        <slot name="toolbar-actions-prepend" />
                        <el-button
                            v-if="actionVisibility.create"
                            @click="openDialog()"
                        >
                            {{ addDataBtnText }}
                        </el-button>
                        <countdown-dropdown-btn
                            v-if="can('list')"
                            ref="autoReloadDataCountdownDropdownBtnRef"
                            text="刷新"
                            @trigger="loadData"
                        />
                        <time-range-quick-selector
                            v-if="can('list') && showTimeRangeQuickSelector"
                            v-model:end="timeRangeEndAt"
                            v-model:start="timeRangeStartAt"
                            @select="loadData"
                        />
                        <slot name="toolbar-actions-append" />
                    </div>
                    <slot name="toolbar-append" />
                </div>
                <el-table
                    v-if="can('list')"
                    ref="elTableRef"
                    table-layout="auto"
                    :data="tableData"
                    :empty-text="hasLoadDataFailed ? '載入失敗，請重新整理' : undefined"
                    :row-key="rowKey"
                    border
                    flexible
                    highlight-current-row
                    stripe
                    @selection-change="(selected) => selectedRows = selected"
                    @sort-change="onSortChange"
                >
                    <el-table-column
                        v-if="enableSelection"
                        align="center"
                        type="selection"
                        :reserve-selection="true"
                        :selectable="selectable"
                        :width="selectionColumnWidth"
                    />
                    <slot name="table" />
                    <el-table-datetime-column
                        v-if="!hideTimestampColumns && !hideCreatedAtColumn"
                        label="建立時間"
                    />
                    <el-table-datetime-column
                        v-if="!hideTimestampColumns && !hideUpdatedAtColumn"
                        label="更新時間"
                        prop="updatedAt"
                    />
                    <!-- @vue-generic {TR} -->
                    <el-table-column
                        v-if="!hideActionsColumn"
                        align="center"
                        label="操作"
                    >
                        <template #default="scope">
                            <div class="flex-middle gap-btns">
                                <slot
                                    :="scope"
                                    name="action-btns-prepend"
                                />
                                <el-action-btn
                                    v-if="actionVisibility.edit && !hideRowEditBtnRule?.(scope.row)"
                                    :disabled="disableRowEditBtnRule?.(scope.row)"
                                    @click="openDialog({ mode: 'edit', row: scope.row })"
                                >
                                    編輯
                                </el-action-btn>
                                <el-action-btn
                                    v-if="actionVisibility.delete && !hideRowDeleteBtnRule?.(scope.row)"
                                    type="danger"
                                    :disabled="disableRowDeleteBtnRule?.(scope.row)"
                                    @click="confirmDelete(scope.row)"
                                >
                                    {{ deleteBtnText ?? '刪除' }}
                                </el-action-btn>
                                <slot
                                    :="scope"
                                    name="action-btns-append"
                                />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div
                    v-if="!hideFooter"
                    class="b b-t-0 el-bg-and-border rounded-b-1 p-1"
                >
                    <el-pagination
                        v-if="can('list') && !disablePagination"
                        v-model:current-page="paginationParams.page"
                        v-model:page-size="paginationParams.limit"
                        layout="total, prev, pager, next, sizes"
                        :page-sizes="[
                            10,
                            20,
                            50,
                            100,
                            500,
                            1000,
                        ]"
                        :pager-count="5"
                        :total="totalTableDataCount"
                        @change="loadData"
                    />
                </div>
                <!-- @vue-generic {TR, FD} -->
                <data-table-page-form-dialog
                    v-if="formData"
                    ref="dataTablePageFormDialogRef"
                    v-model:form-data="formData"
                    :before-open="beforeDialogOpen"
                    :can-create="can('create')"
                    :can-update="can('update')"
                    :crud-api="crudApi"
                    :rules="formRules"
                    :title-suffix="dialogTitleSuffix"
                    @saved="loadData"
                >
                    <template #default="{ editingRow }">
                        <slot
                            name="form"
                            :editing-row="editingRow"
                        />
                    </template>
                </data-table-page-form-dialog>
            </div>
        </div>
        <slot />
    </div>
</template>

<script
    lang="ts"
    generic="
        TR extends TableRowData,
        FD extends object = never
    "
    setup
>
import type { TableRowData } from '@kcs-project/pack/types/data';
import type { TableSortOrder } from 'element-plus/es/components/table/src/table/defaults';
import type {
    Except,
    Promisable,
} from 'type-fest';

import type { AdminPermissionGroup } from '@/generated/admin/permission';

type ControlActionBtnFunction = (row: TR) => boolean | undefined;

interface OnSortChangeData {
    column: any;
    order: null | TableSortOrder;
    prop: null | string;
}

interface Props {
    addDataBtnText?: string;
    beforeDialogOpen?: (row?: TR) => Promisable<void>;
    confirmDeleteMessage?: ((row: TR) => string) | string;
    crudApi: BaseCrudApi<TR, NoInfer<FD>>;
    defaultPaginationLimit?: number;
    defaultSort?: Except<OnSortChangeData, 'column'>;
    deleteBtnText?: string;
    dialogTitleSuffix?: string;
    disablePagination?: boolean;
    disableRowDeleteBtnRule?: ControlActionBtnFunction;
    disableRowEditBtnRule?: ControlActionBtnFunction;
    enableSelection?: boolean;
    filter?: Record<string, any>;
    formRules?: ElFormRules<Record<string, any>>;
    hideActionsColumn?: boolean;
    hideAddDataBtn?: boolean;
    hideCreatedAtColumn?: boolean;
    hideDeleteBtn?: boolean;
    hideEditBtn?: boolean;
    hideFooter?: boolean;
    hideRowDeleteBtnRule?: ControlActionBtnFunction;
    hideRowEditBtnRule?: ControlActionBtnFunction;
    hideTimestampColumns?: boolean;
    hideUpdatedAtColumn?: boolean;

    /**
     * Permission group of the page: each action (`list`, `create`, `update`, `delete`, `toggle` or any other) requires
     * `<group>.<action>`, and an action whose key is not in the catalog is denied. `ignore` allows every action.
     */
    permissionGroup: 'ignore' | AdminPermissionGroup;

    rowKey?: string;
    selectable?: (row: TR, index: number) => boolean;
    selectionColumnWidth?: number;
    showTimeRangeQuickSelector?: boolean;
    title: string;
}

// Define props, models and emits
const props = withDefaults(
    defineProps<Props>(),
    {
        addDataBtnText: '新增',
        defaultPaginationLimit: 10,
        formRules: () => ({}),
        rowKey: 'id',
        selectionColumnWidth: 39,
    },
);

// Pages with a form pass their full form data at setup; pages without one (list/delete only) omit it.
const formData = defineModel<FD>('formData');
const timeRangeEndAt = defineModel<Date>('timeRangeEnd', { default: () => new EnhancedDate() });
const timeRangeStartAt = defineModel<Date>('timeRangeStart', { default: () => new EnhancedDate() });

// Constants/Refs/Variables
const autoReloadDataCountdownDropdownBtnRef = useTemplateRef('autoReloadDataCountdownDropdownBtnRef');
const dataTablePageFormDialogRef = useTemplateRef('dataTablePageFormDialogRef');
const elTableRef = useTemplateRef('elTableRef');
const hasForm = formData.value !== undefined;
const hasLoadDataFailed = ref(false);
const isLoadingData = ref(false);
const mainContainerRef = useTemplateRef('mainContainerRef');
const paginationParams = ref({
    limit: props.defaultPaginationLimit,
    page: 1,
});

const pageTitle = pageHeadTabsController.registerCurrentPageHeadTab(props.title);
const selectedRows = ref<TR[]>([]);
const sortQueryParam = ref(toSortQueryParam(props.defaultSort));
const tableData = ref<TR[]>([]);
const totalTableDataCount = ref(0);
let loadDataAbortController: AbortController | undefined;

// Computed properties
// Built-in buttons; kept apart from `can`, which only reflects permissions.
const actionVisibility = computed(() => ({
    create: hasForm && can('create') && !props.hideAddDataBtn,
    delete: can('delete') && !props.hideDeleteBtn,
    edit: hasForm && can('update') && !props.hideEditBtn,
}));

// Functions
const clearSelection = () => elTableRef.value?.clearSelection();
const confirmDelete = createElMessageBoxConfirmHandler<TR>({
    boxOptions: { type: 'warning' },
    confirm: async (row) => (await props.crudApi.delete(row.id)).data.success,
    loadingText: '刪除中...',
    message: props.confirmDeleteMessage || defaultConfirmDeleteMessage,
    onSuccess: async () => {
        ElNotification.success('刪除成功');
        await loadData();
    },
});

/**
 * Whether the current admin may perform `action` on this page (see `permissionGroup`).
 */
function can(action: string) {
    if (props.permissionGroup === 'ignore') return true;
    const key = `${props.permissionGroup}.${action}`;
    return isAdminPermissionKey(key) && hasPermission(key);
}

function closeDialog() {
    dataTablePageFormDialogRef.value?.close();
}

function defaultConfirmDeleteMessage(row: TR) {
    return 'name' in row && typeof row.name === 'string' ? `確定要刪除 ${row.name} 嗎？` : '確定要刪除此資料嗎？';
}

/**
 * Loads the current page; a newer call cancels the pending one, so the latest filter/sort/page always wins.
 */
async function loadData() {
    if (!can('list')) return;
    loadDataAbortController?.abort();
    const abortController = loadDataAbortController = new AbortController();
    isLoadingData.value = true;
    autoReloadDataCountdownDropdownBtnRef.value?.stop();
    const response = await props.crudApi.getList(
        {
            ...props.disablePagination || props.hideFooter ? {} : paginationParams.value,
            filter: props.filter,
            sort: sortQueryParam.value,
        },
        { signal: abortController.signal },
    );

    if (abortController !== loadDataAbortController) return;
    loadDataAbortController = undefined;
    isLoadingData.value = false;
    hasLoadDataFailed.value = !response.data.success;
    if (response.data.data) {
        tableData.value = response.data.data.list;
        totalTableDataCount.value = response.data.data.count || 0;
    }

    autoReloadDataCountdownDropdownBtnRef.value?.start();
}

async function onSortChange(data: OnSortChangeData) {
    sortQueryParam.value = toSortQueryParam(data);
    await loadData();
}

async function openDialog(payload?: Parameters<NonNullable<typeof dataTablePageFormDialogRef.value>['open']>[0]) {
    await dataTablePageFormDialogRef.value?.open(payload);
}

function toSortQueryParam(sort?: Except<OnSortChangeData, 'column'>) {
    if (!sort?.prop) return;
    if (sort.order === 'ascending') return sort.prop;
    if (sort.order === 'descending') return `-${sort.prop}`;
}

// Hooks
onBeforeUnmount(() => loadDataAbortController?.abort());
onMounted(loadData);
usePreserveScroll(mainContainerRef);

// Watchers
watch(() => props.title, (nv) => pageTitle.value = nv);

// Exposes
defineExpose({
    can,
    clearSelection,
    closeDialog,
    loadData,
    openDialog,
    selectedRows: readonly(selectedRows),
});
</script>

<style lang="scss" scoped>
.el-bg-and-border {
    border-color: var(--el-border-color-lighter);
    background-color: var(--el-bg-color);
}

:deep(.el-pagination) {
    .el-select {
        @apply w-[115px];
    }

    @media (width <= 768px) {
        @apply justify-center;

        .btn-prev,
        /* stylelint-disable-next-line selector-class-pattern */
        .el-pagination__sizes {
            @apply ml-0;
        }

        .el-pager :not(.is-active),
        /* stylelint-disable-next-line selector-class-pattern */
        .el-pagination__jump {
            @apply hidden;
        }
    }
}
</style>
