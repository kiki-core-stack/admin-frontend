<template>
    <data-table-page
        v-model:form-data="formData"
        permission-group="platform.config"
        resource-name="平台設定"
        title="平台設定"
        :before-dialog-open="resetFormConfig"
        :crud-api="PlatformConfigApi.use()"
    >
        <template #table>
            <el-table-column
                label="設定範圍"
                :formatter="(row: PlatformConfigData) => localize(platformScopeToLabelMap[row.scope])"
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
                {{ localize(platformScopeToLabelMap[formData.scope]) }}
            </el-form-item>
            <platform-config-form-system
                v-if="formData.scope === PlatformScope.System"
                v-model="formData.config"
            />
            <platform-config-form-admin-management
                v-else-if="formData.scope === PlatformScope.AdminManagement"
                v-model="formData.config"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    defaultPlatformConfigs,
    PlatformScope,
    platformScopeToLabelMap,
} from '@kcs-project/pack/constants/platform';
import type { PlatformConfigData } from '@kcs-project/pack/types/data/platform';

// Constants/Refs/Variables
const formData = ref<CrudFormData<PlatformConfigData>>({
    config: cloneDeep(defaultPlatformConfigs[PlatformScope.System]),
    scope: PlatformScope.System,
});

// Functions
function resetFormConfig(row?: PlatformConfigData) {
    formData.value.config = cloneDeep(row?.config ?? defaultPlatformConfigs[PlatformScope.System]);
}
</script>
