<template>
    <data-table-page
        v-model:form-data="formData"
        dialog-title-suffix="管理員身分組"
        title="管理員身分組管理"
        :crud-api="AdminRoleApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'admin.role' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                label="建立管理員帳號"
                prop="createdByAdmin.account"
            />
            <el-table-column
                label="編輯管理員帳號"
                prop="editedByAdmin.account"
            />
        </template>
        <template #form>
            <el-form-input
                v-model="formData.name"
                label="名稱"
                maxlength="32"
                prop="name"
            />
            <el-form-item label="權限">
                <el-tree-select
                    v-model="formData.permissions"
                    size="large"
                    :data="permissionTreeNodes"
                    :max-collapse-tags="20"
                    clearable
                    collapse-tags
                    collapse-tags-tooltip
                    multiple
                    show-checkbox
                />
            </el-form-item>
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import type { AdminRoleData } from '@kiki-core-stack/pack/types/data/admin';

// Constants/Refs/Variables
const { locale } = useI18n();
const formData = ref<TablePageFormData<AdminRoleData>>({
    id: '',
    name: '',
    permissions: [],
});

const formRules: TablePageElFormRules<AdminRoleData> = { name: [createElFormItemRuleWithDefaults('請輸入名稱')] };
const permissionTreeNodes = ref<ElTreeNode[]>([]);

// Functions
async function loadPermissionTreeNodes() {
    const response = await AdminPermissionApi.use().getTreeNodes();
    permissionTreeNodes.value = response?.data?.data || [];
    translatePermissionTreeNodes(permissionTreeNodes.value);
}

function translatePermissionTreeNodes(nodes: ElTreeNode[]) {
    nodes.forEach((node) => {
        if (node.children?.length) translatePermissionTreeNodes(node.children);
        node.label = $t(`permissions.${node.label}`);
    });
}

// Hooks
onMounted(loadPermissionTreeNodes);

// Watchers
watch(() => locale.value, loadPermissionTreeNodes);
</script>
