<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        permission-group="platform.ipAccessPolicy"
        resource-name="IP 存取規則"
        title="IP 存取規則管理"
        :crud-api="PlatformIpAccessPolicyApi.use()"
        :form-rules="formRules"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="模式"
                :formatter="(row: PlatformIpAccessPolicyListItemData) => formatMode(row)"
            />
            <el-table-column
                label="適用目標"
                :formatter="formatTargets"
            />
            <el-table-column
                label="IP／網段"
                :formatter="(row: PlatformIpAccessPolicyListItemData) => row.ipEntries.join('、') || '空清單'"
            />
            <el-table-confirmable-status-switch-column
                field="enabled"
                label="啟用"
                :confirm-message="(row) => `是否切換 IP 存取規則 ${row.name} 的啟用狀態？`"
                :crud-api="PlatformIpAccessPolicyApi.use()"
                :disabled-condition="!dataTablePageRef?.can('toggle')"
                @status-change="dataTablePageRef?.loadData()"
            />
            <el-table-column
                label="備註"
                prop="note"
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
            <el-form-switch
                v-model="formData.enabled"
                label="啟用"
                prop="enabled"
            />
            <el-form-item
                label="模式"
                prop="mode"
            >
                <el-select v-model="formData.mode">
                    <el-option
                        v-for="mode in getEnumNumberValues(PlatformIpAccessPolicyMode)"
                        :key="mode"
                        :label="localize(platformIpAccessPolicyModeToLabelMap[mode])"
                        :value="mode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="IP／網段"
                prop="ipEntries"
            >
                <el-input-tag
                    v-model="formData.ipEntries"
                    placeholder="輸入 IPv4、IPv6 或 CIDR 網段後按 Enter"
                    clearable
                />
            </el-form-item>
            <el-form-input
                v-model="formData.note"
                label="備註"
                prop="note"
                type="textarea"
                autosize
            />
            <platform-ip-access-policy-targets-form v-model="formData.targets" />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    PlatformIpAccessPolicyMode,
    platformIpAccessPolicyModeToLabelMap,
    PlatformScope,
    platformScopeToLabelMap,
} from '@kcs-project/pack/constants/platform';

import type {
    PlatformIpAccessPolicyFormData,
    PlatformIpAccessPolicyListItemData,
} from '@/types/data/platform';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<PlatformIpAccessPolicyFormData>({
    enabled: false,
    ipEntries: [],
    mode: PlatformIpAccessPolicyMode.Blacklist,
    name: '',
    note: '',
    targets: [
        {
            principalIds: null,
            scope: PlatformScope.System,
        },
    ],
});

const formRules: ElFormRules<PlatformIpAccessPolicyFormData> = {
    ipEntries: [
        createElFormItemRuleWithDefaults(
            '請至少設定一個 IP／網段',
            {
                min: 1,
                type: 'array',
            },
        ),
    ],
    name: [createElFormItemRuleWithDefaults('請輸入名稱')],
};

// Functions
function formatMode(row: PlatformIpAccessPolicyListItemData) {
    return localize(platformIpAccessPolicyModeToLabelMap[row.mode]);
}

function formatTargets(row: PlatformIpAccessPolicyListItemData) {
    return row
        .targets
        .map((target) => {
            const scope = localize(platformScopeToLabelMap[target.scope]);
            if (target.scope === PlatformScope.System) return scope;
            return `${scope}／${target.principalIds === null ? '全部' : `${target.principalIds.length} 個指定項目`}`;
        })
        .join('；');
}
</script>
