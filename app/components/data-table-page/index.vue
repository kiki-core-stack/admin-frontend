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
                            v-if="capabilities.create && !hideAddDataBtn"
                            @click="openDialog()"
                        >
                            {{ addDataBtnText }}
                        </el-button>
                        <countdown-dropdown-btn
                            v-if="capabilities.list"
                            ref="autoReloadDataCountdownDropdownBtnRef"
                            text="刷新"
                            @trigger="loadData"
                        />
                        <time-range-quick-selector
                            v-if="capabilities.list && showTimeRangeQuickSelector"
                            v-model:end="timeRangeEndAt"
                            v-model:start="timeRangeStartAt"
                            @select="loadData"
                        />
                        <slot name="toolbar-actions-append" />
                    </div>
                    <slot name="toolbar-append" />
                </div>
                <el-table
                    v-if="capabilities.list"
                    ref="tableRef"
                    table-layout="auto"
                    :data="tableData"
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
                                    v-if="capabilities.update && !hideEditBtn && !hideRowEditBtnRule?.(scope.row)"
                                    :disabled="disableRowEditBtnRule?.(scope.row)"
                                    @click="openDialog({ mode: 'edit', row: scope.row })"
                                >
                                    編輯
                                </el-action-btn>
                                <el-action-btn
                                    v-if="capabilities.delete && !hideDeleteBtn && !hideRowDeleteBtnRule?.(scope.row)"
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
                        v-if="capabilities.list && !disablePagination"
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
                    ref="formDialogRef"
                    v-model:form-data="formData"
                    :before-open="beforeDialogOpen"
                    :can-save="capabilities.create || capabilities.update"
                    :crud-api="crudApi"
                    :rules="formRules"
                    :title-suffix="dialogTitleSuffix"
                    @saved="loadData"
                >
                    <slot name="form" />
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
        FD extends TableRowData = TableRowData
    "
    setup
>
import type { TableRowData } from '@kcs-project/pack/types/data';
import type { TableSortOrder } from 'element-plus/es/components/table/src/table/defaults';
import type {
    Except,
    Promisable,
} from 'type-fest';

import type { PermissionPattern } from '@/types/permission';

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
    permissions:
      | 'ignore'
      | {
          base: PermissionPattern;
          create?: PermissionPattern;
          delete?: PermissionPattern;
          list?: PermissionPattern;
          read?: PermissionPattern;
          update?: PermissionPattern;
      };

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

const formData = defineModel<FD>('formData');
const timeRangeEndAt = defineModel<Date>('timeRangeEnd', { default: () => new EnhancedDate() });
const timeRangeStartAt = defineModel<Date>('timeRangeStart', { default: () => new EnhancedDate() });

// Constants/Refs/Variables
const autoReloadDataCountdownDropdownBtnRef = useTemplateRef('autoReloadDataCountdownDropdownBtnRef');
const formDialogRef = useTemplateRef('formDialogRef');
const isLoadingData = ref(false);
const mainContainerRef = useTemplateRef('mainContainerRef');
const paginationParams = ref({
    limit: props.defaultPaginationLimit,
    page: 1,
});

const pageTitle = pageHeadTabsController.registerCurrentPageHeadTab(props.title);
const selectedRows = ref<TR[]>([]);
const sortQueryParam = ref<string | undefined>(undefined);
const tableData = ref<TR[]>([]);
const tableRef = useTemplateRef('tableRef');
const totalTableDataCount = ref(0);

// Computed properties
const capabilities = computed(() => {
    const obj = {
        create: true,
        delete: true,
        list: true,
        read: true,
        toggle: true,
        update: true,
    };

    if (props.permissions === 'ignore') return obj;
    obj.create = hasPermission(props.permissions.create || `${props.permissions.base}.create`);
    obj.delete = hasPermission(props.permissions.delete || `${props.permissions.base}.delete`);
    obj.list = hasPermission(props.permissions.list || `${props.permissions.base}.list`);
    obj.read = hasPermission(props.permissions.list || `${props.permissions.base}.read`);
    obj.toggle = hasPermission(props.permissions.update || `${props.permissions.base}.toggle`);
    obj.update = hasPermission(props.permissions.update || `${props.permissions.base}.update`);
    return obj;
});

// Functions
const clearSelection = () => tableRef.value?.clearSelection();
const confirmDelete = createElMessageBoxConfirmHandler<TR>(
    props.confirmDeleteMessage || ((data) => `確定要刪除 ${(data as any).name} 嗎？`),
    '刪除中...',
    async (data) => !!(await props.crudApi.delete(data.id))?.data?.success,
    async () => {
        ElNotification.success('刪除成功');
        await loadData();
    },
    undefined,
    undefined,
    { type: 'warning' },
);

function closeDialog() {
    formDialogRef.value?.close();
}

async function loadData() {
    if (isLoadingData.value || !capabilities.value.list) return;
    isLoadingData.value = true;
    autoReloadDataCountdownDropdownBtnRef.value?.stop();
    const response = await props.crudApi.getList({
        ...props.disablePagination || props.hideFooter ? {} : paginationParams.value,
        filter: props.filter,
        sort: sortQueryParam.value,
    });

    if (response?.data?.data) {
        tableData.value = response.data.data.list;
        totalTableDataCount.value = response.data.data.count || 0;
    }

    isLoadingData.value = false;
    autoReloadDataCountdownDropdownBtnRef.value?.start();
}

async function onSortChange(data: OnSortChangeData) {
    if (data.order === 'ascending') sortQueryParam.value = data.prop ?? undefined;
    else if (data.order === 'descending') sortQueryParam.value = `-${data.prop}`;
    else sortQueryParam.value = undefined;

    await loadData();
}

async function openDialog(payload?: Parameters<NonNullable<typeof formDialogRef.value>['open']>[0]) {
    await formDialogRef.value?.open(payload);
}

// Hooks
onMounted(loadData);
usePreserveScroll(mainContainerRef);

// Watchers
watch(() => props.title, (nv) => pageTitle.value = nv);

// Exposes
defineExpose({
    capabilities: readonly(capabilities),
    clearSelection,
    closeDialog,
    loadData,
    openDialog,
    selectedRows: readonly(selectedRows),
});

// Init
if (props.defaultSort?.order === 'ascending') sortQueryParam.value = props.defaultSort.prop ?? undefined;
else if (props.defaultSort?.order === 'descending') sortQueryParam.value = `-${props.defaultSort.prop}`;
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
