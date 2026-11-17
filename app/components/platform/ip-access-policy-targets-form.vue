<template>
    <div class="mt-3 mb-2 flex items-center justify-between gap-2">
        <span class="font-500">適用目標</span>
        <el-tooltip
            placement="top"
            :content="hasSystemTarget ? '全系統已涵蓋所有範圍，請先改為特定範圍再新增目標' : '新增目標'"
        >
            <span class="inline-flex">
                <el-button
                    :disabled="hasSystemTarget"
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
            <el-form-item
                class="mb-2!"
                label="適用範圍"
                label-position="top"
            >
                <el-select
                    :model-value="target.scope"
                    @change="(scope) => onScopeChange(target, scope)"
                >
                    <el-option
                        v-for="platformScope in platformScopes"
                        :key="platformScope"
                        :disabled="platformScope === PlatformScope.System && targets.length > 1"
                        :label="localize(platformScopeToLabelMap[platformScope])"
                        :value="platformScope"
                    />
                </el-select>
            </el-form-item>
            <template v-if="platformIpAccessPolicyScopeToPrincipalMap[target.scope]">
                <el-form-item
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
                    v-if="target.principalIds !== null"
                    label-position="top"
                    :label="`指定${platformIpAccessPolicyScopeToPrincipalMap[target.scope]!.label}`"
                    :prop="`targets.${index}.principalIds`"
                    :rules="principalIdsFormItemRules"
                >
                    <component
                        :is="platformIpAccessPolicyScopeToPrincipalMap[target.scope]!.selectorComponent"
                        v-model="target.principalIds"
                        value-key="id"
                        :selected-data="target.principalIds"
                        multiple
                    />
                </el-form-item>
            </template>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {
    PlatformScope,
    platformScopeToLabelMap,
} from '@kcs-project/pack/constants/platform';
import type { Component } from 'vue';

import SelectorAdmin from '@/components/selector/admin/index.vue';
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

const platformScopes = getEnumNumberValues(PlatformScope).toSorted((a, b) => a - b);

// 可指定帳號的範圍；未列出的範圍只能套用到整個範圍。
const platformIpAccessPolicyScopeToPrincipalMap: Readonly<
    Partial<Record<PlatformScope, { label: string; selectorComponent: Component }>>
> = {
    [PlatformScope.AdminManagement]: {
        label: '管理員',
        selectorComponent: SelectorAdmin,
    },
};

const targetToKeyMap = new WeakMap<PlatformIpAccessPolicyTargetData, number>();

// Computed properties
const hasSystemTarget = computed(() => targets.value.some((target) => target.scope === PlatformScope.System));

// Functions
function addTarget() {
    targets.value.push({
        principalIds: null,
        scope: platformScopes.find((scope) => scope !== PlatformScope.System)!,
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

function onScopeChange(target: PlatformIpAccessPolicyTargetData, scope: PlatformScope) {
    target.scope = scope;
    target.principalIds = null;
}
</script>
