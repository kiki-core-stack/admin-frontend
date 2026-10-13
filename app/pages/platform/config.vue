<template>
    <data-table-page
        v-model:form-data="formData"
        dialog-title-suffix="平台設定"
        title="平台設定"
        :before-dialog-open="(row) => void (formData.config = cloneDeep(row?.config || {}))"
        :crud-api="PlatformConfigApi.use()"
        :permissions="{ base: 'platform.config' }"
        hide-add-data-btn
        hide-delete-btn
    >
        <template #table>
            <el-table-column
                label="設定範圍"
                :formatter="(row: PlatformConfigData) => platformConfigScopeToTextMap[row.scope]"
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
            <el-form-item label="設定範圍">
                {{ platformConfigScopeToTextMap[formData.scope] }}
            </el-form-item>
            <platform-config-form-system
                v-if="formData.scope === PlatformConfigScope.System"
                v-model="formData.config"
            />
            <platform-config-form-admin-management
                v-else-if="formData.scope === PlatformConfigScope.AdminManagement"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformConfigScope,
    platformConfigScopeToTextMap,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigData } from '@kcs-project/pack/types/data/platform';

// Constants/Refs/Variables
const formData = ref<TablePageFormData<PlatformConfigData>>({
    config: cloneDeep(defaultPlatformConfigs[PlatformConfigScope.System]),
    id: '',
    scope: PlatformConfigScope.System,
});
</script>
