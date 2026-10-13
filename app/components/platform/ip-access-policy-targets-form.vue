<template>
    <div class="mt-3 mb-2 flex items-center justify-between gap-2">
        <span class="font-500">適用目標</span>
        <el-tooltip
            placement="top"
            :content="hasGlobalTarget ? '全域 API 已涵蓋所有範圍，請先改為特定範圍再新增目標' : '新增目標'"
        >
            <span class="inline-flex">
                <el-button
                    :disabled="hasGlobalTarget"
                    circle
                    @click="addTarget"
                >
                    <nuxt-icon
                        class="fs-18px"
                        name="mdi:plus"
                    />
                </el-button>
            </span>
        </el-tooltip>
    </div>
    <div class="mb-4 flex flex-col gap-1">
        <el-card
            v-for="(target, index) in targets"
            :key="getTargetKey(target)"
            body-class="p-2!"
            header-class="px-2! py-1!"
            shadow="never"
        >
            <template #header>
                <div class="flex items-center justify-between gap-2">
                    <span class="font-500">目標 {{ index + 1 }}</span>
                    <el-button
                        :disabled="targets.length === 1"
                        circle
                        @click="targets.splice(index, 1)"
                    >
                        <nuxt-icon
                            class="fs-18px"
                            name="mdi:delete-outline"
                        />
                    </el-button>
                </div>
            </template>
            <div class="grid gap-x-2 md:grid-cols-2">
                <el-form-item
                    class="mb-2!"
                    :class="{ 'md:col-span-2': target.scope === null }"
                    label="適用範圍"
                    label-position="top"
                >
                    <el-select
                        :empty-values="[undefined]"
                        :model-value="target.scope ?? ''"
                        @change="(scope) => onScopeChange(target, scope)"
                    >
                        <el-option
                            label="全域 API"
                            value=""
                            :disabled="targets.length > 1"
                        />
                        <el-option
                            v-for="platformIpAccessPolicyScope in platformIpAccessPolicyScopes"
                            :key="platformIpAccessPolicyScope"
                            :label="platformIpAccessPolicyScopeToTextMap[platformIpAccessPolicyScope]"
                            :value="platformIpAccessPolicyScope"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="target.scope !== null"
                    class="mb-2!"
                    label="身分類型"
                    label-position="top"
                >
                    <el-select
                        :empty-values="[undefined]"
                        :model-value="target.principalType ?? ''"
                        @change="(principalType) => onPrincipalTypeChange(target, principalType)"
                    >
                        <el-option
                            label="全部身分"
                            value=""
                        />
                        <el-option
                            v-for="principalType in platformIpAccessPolicyScopeToPrincipalTypesMap[target.scope]"
                            :key="principalType"
                            :label="authenticationSessionPrincipalTypeToTextMap[principalType]"
                            :value="principalType"
                        />
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item
                v-if="target.principalType !== null"
                class="mb-2!"
                label="項目範圍"
                label-position="left"
                label-width="auto"
            >
                <el-radio-group
                    :model-value="target.principalIds !== null"
                    @change="(value) => target.principalIds = value ? [] : null"
                >
                    <el-radio :value="false">
                        全部
                    </el-radio>
                    <el-radio :value="true">
                        指定
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                v-if="target.principalType !== null && target.principalIds !== null"
                label-position="top"
                :label="`指定${authenticationSessionPrincipalTypeToTextMap[target.principalType]}`"
                :prop="`targets.${index}.principalIds`"
                :rules="principalIdsFormItemRules"
            >
                <component
                    :is="platformIpAccessPolicyPrincipalTypeToSelectorComponentMap[target.principalType]"
                    v-model="target.principalIds"
                    value-key="id"
                    :selected-data="target.principalIds"
                    multiple
                />
            </el-form-item>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {
    PlatformIpAccessPolicyScope,
    platformIpAccessPolicyScopeToTextMap,
} from '@kcs-project/pack/constants/platform';
import type { AuthenticationSessionPrincipalType } from '@kcs-project/pack/types/authentication-session';
import { getEnumNumberValues } from '@kikiutils/shared/enum';
import type { ReadonlyRecord } from '@kikiutils/shared/types';
import type { Component } from 'vue';

import SelectorAdmin from '@/components/selector/admin/index.vue';
import { authenticationSessionPrincipalTypeToTextMap } from '@/constants/authentication-session';
import type { PlatformIpAccessPolicyTargetData } from '@/types/data/platform';

// Define props, models and emits
const targets = defineModel<PlatformIpAccessPolicyTargetData[]>({ required: true });

// Constants/Refs/Variables
let nextTargetKey = 0;
const principalIdsFormItemRules = [
    createElFormItemRuleWithDefaults(
        '請至少選擇一個項目',
        {
            min: 1,
            type: 'array',
        },
    ),
];

// eslint-disable-next-line vue/max-len
const platformIpAccessPolicyPrincipalTypeToSelectorComponentMap: ReadonlyRecord<AuthenticationSessionPrincipalType, Component> = { admin: SelectorAdmin };
const platformIpAccessPolicyScopes = getEnumNumberValues(PlatformIpAccessPolicyScope);
const platformIpAccessPolicyScopeToPrincipalTypesMap: ReadonlyRecord<
    PlatformIpAccessPolicyScope,
    readonly AuthenticationSessionPrincipalType[]
> = { [PlatformIpAccessPolicyScope.AdminManagement]: ['admin'] };

const targetToKeyMap = new WeakMap<PlatformIpAccessPolicyTargetData, number>();

// Computed properties
const hasGlobalTarget = computed(() => targets.value.some((target) => target.scope === null));

// Functions
function addTarget() {
    targets.value.push({
        principalIds: null,
        principalType: null,
        scope: platformIpAccessPolicyScopes[0] ?? null,
    });
}

function getTargetKey(target: PlatformIpAccessPolicyTargetData) {
    let key = targetToKeyMap.get(target);
    if (key === undefined) {
        key = nextTargetKey++;
        targetToKeyMap.set(target, key);
    }

    return key;
}

function onPrincipalTypeChange(
    target: PlatformIpAccessPolicyTargetData,
    principalType: '' | AuthenticationSessionPrincipalType,
) {
    target.principalType = principalType || null;
    target.principalIds = null;
}

function onScopeChange(target: PlatformIpAccessPolicyTargetData, scope: '' | PlatformIpAccessPolicyScope) {
    target.scope = scope === '' ? null : scope;
    target.principalType = null;
    target.principalIds = null;
}
</script>
