<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:form-data="formData"
        dialog-title-suffix="IP存取規則"
        title="IP存取規則管理"
        :crud-api="PlatformIpAccessPolicyApi.use()"
        :form-rules="formRules"
        :permissions="{ base: 'platform.ipAccessPolicy' }"
    >
        <template #table>
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                align="center"
                label="模式"
                :formatter="(row: PlatformIpAccessPolicyListItemData) => platformIpAccessPolicyModeToTextMap[row.mode]"
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
                :confirm-message="(row) => `是否切換IP 存取規則 ${row.name} 的啟用狀態？`"
                :crud-api="PlatformIpAccessPolicyApi.use()"
                :disabled-condition="!dataTablePageRef?.capabilities.toggle"
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
                        :label="platformIpAccessPolicyModeToTextMap[mode]"
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
    platformIpAccessPolicyModeToTextMap,
    platformIpAccessPolicyScopeToTextMap,
} from '@kcs-project/pack/constants/platform';
import { getEnumNumberValues } from '@kikiutils/shared/enum';
import * as z from 'zod';

import { authenticationSessionPrincipalTypeToTextMap } from '@/constants/authentication-session';
import type {
    PlatformIpAccessPolicyFormData,
    PlatformIpAccessPolicyListItemData,
} from '@/types/data/platform';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const formData = ref<PlatformIpAccessPolicyFormData>({
    enabled: false,
    id: '',
    ipEntries: [],
    mode: PlatformIpAccessPolicyMode.Blacklist,
    name: '',
    note: '',
    targets: [
        {
            principalIds: null,
            principalType: null,
            scope: null,
        },
    ],
});

const ipEntrySchema = z.string().trim().pipe(
    z.union([
        z.ipv4(),
        z.ipv6(),
        z.cidrv4(),
        z.cidrv6(),
    ]),
);

const formRules: ElFormRules<PlatformIpAccessPolicyFormData> = {
    ipEntries: [
        createElFormItemRuleWithDefaults(
            '請至少設定一個 IP／網段',
            {
                min: 1,
                type: 'array',
            },
        ),
        {
            trigger: [
                'blur',
                'change',
            ],
            validator(_rule, value: string[], callback) {
                const invalidEntry = value.find((entry) => !ipEntrySchema.safeParse(entry).success);
                callback(invalidEntry !== undefined ? new Error(`IP或CIDR格式錯誤：${invalidEntry}`) : undefined);
            },
        },
    ],
    name: [
        createElFormItemRuleWithDefaults('請輸入名稱'),
        {
            max: 64,
            message: '名稱最多 64 個字元',
            trigger: [
                'blur',
                'change',
            ],
        },
    ],
};

// Functions
function formatTargets(row: PlatformIpAccessPolicyListItemData) {
    return row
        .targets
        .map((target) => {
            if (target.scope === null) return '全域 API';
            const scope = platformIpAccessPolicyScopeToTextMap[target.scope];
            if (target.principalType === null) return `${scope}／全部`;
            const items = target.principalIds === null ? '全部' : `${target.principalIds.length} 個指定項目`;
            return `${scope}／${authenticationSessionPrincipalTypeToTextMap[target.principalType]}／${items}`;
        })
        .join('；');
}
</script>
