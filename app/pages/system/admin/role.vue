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
import type { AdminRoleData } from '@kcs-project/pack/types/data/admin';

import {
    adminPermissionGroups,
    adminPermissionKeys,
    adminPermissionLabelMap,
} from '@/generated/static/types/admin/permission';

// Constants/Refs/Variables
const formData = ref<CrudFormData<AdminRoleData>>({
    name: '',
    permissions: [],
});

const formRules: ElFormRules<CrudFormData<AdminRoleData>> = { name: [createElFormItemRuleWithDefaults('請輸入名稱')] };

// Computed properties
// Groups and keys nest by their dotted paths; labels follow the current locale.
const permissionTreeNodes = computed(() => {
    const pathToNodeMap = new Map<string, ElTreeNode>();
    const rootNodes: ElTreeNode[] = [];
    for (const path of [
        ...adminPermissionGroups,
        ...adminPermissionKeys,
    ].toSorted()) {
        const node: ElTreeNode = {
            label: localize(adminPermissionLabelMap[path]),
            value: path,
        };

        pathToNodeMap.set(path, node);
        const parentNode = pathToNodeMap.get(path.slice(0, path.lastIndexOf('.')));
        if (parentNode) (parentNode.children ??= []).push(node);
        else rootNodes.push(node);
    }

    return rootNodes;
});
</script>
