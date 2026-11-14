<template>
    <div class="w-full">
        <div class="mb-2 flex flex-wrap items-center gap-2">
            <el-input
                v-model="searchText"
                class="min-w-48 flex-1"
                placeholder="搜尋權限"
                clearable
            />
            <span class="text-sm">已選 {{ selectedKeySet.size }} / {{ adminPermissionKeys.length }}</span>
            <el-button-group>
                <el-button @click="setKeys(adminPermissionKeys, true)">
                    全選
                </el-button>
                <el-button @click="setKeys(adminPermissionKeys, false)">
                    清空
                </el-button>
            </el-button-group>
        </div>
        <el-collapse v-model="expandedSectionGroups">
            <el-collapse-item
                v-for="section in visibleSections"
                :key="section.group"
                :name="section.group"
            >
                <template #title>
                    <div class="flex w-full items-center gap-2 pr-2">
                        <el-checkbox
                            v-bind="getCheckState(section.keys)"
                            @change="(checked) => setKeys(section.keys, !!checked)"
                            @click.stop
                        />
                        <span class="flex-1 font-bold">{{ section.label }}</span>
                        <span class="text-sm">{{ countSelected(section.keys) }} / {{ section.keys.length }}</span>
                    </div>
                </template>
                <div
                    v-for="row in section.rows"
                    :key="row.path"
                    class="permission-row flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5 pl-6"
                >
                    <el-checkbox
                        class="min-w-40 font-bold"
                        v-bind="getCheckState(row.keys)"
                        :label="row.label"
                        @change="(checked) => setKeys(row.keys, !!checked)"
                    />
                    <el-checkbox
                        v-for="key in row.keys"
                        :key="key"
                        :label="localize(adminPermissionLabelMap[key])"
                        :model-value="selectedKeySet.has(key)"
                        @change="(checked) => setKeys([key], !!checked)"
                    />
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-empty
            v-if="!visibleSections.length"
            description="沒有符合的權限"
            :image-size="60"
        />
    </div>
</template>

<script lang="ts" setup>
import { objectEntries } from 'ts-extras';

import {
    adminPermissionGroups,
    adminPermissionKeys,
    adminPermissionLabelMap,
    adminPermissionRequirementMap,
} from '@/generated/admin/permission';
import type {
    AdminPermissionGroup,
    AdminPermissionKey,
} from '@/generated/admin/permission';

interface PermissionRow {
    keys: AdminPermissionKey[];
    label: string;
    path: string;
}

interface PermissionSection {
    group: AdminPermissionGroup;
    keys: AdminPermissionKey[];
    label: string;
    rows: PermissionRow[];
}

// Define props, models and emits
const model = defineModel<string[]>({ required: true });

// Constants/Refs/Variables
const keyToDependentKeysMap = new Map<AdminPermissionKey, AdminPermissionKey[]>();
for (const [key, requiredKeys] of objectEntries(adminPermissionRequirementMap)) {
    requiredKeys?.forEach((requiredKey) => {
        let dependentKeys = keyToDependentKeysMap.get(requiredKey);
        if (!dependentKeys) keyToDependentKeysMap.set(requiredKey, dependentKeys = []);
        dependentKeys.push(key);
    });
}

const expandedSectionGroups = ref<string[]>([]);
const searchText = ref('');

// Computed properties
/**
 * Top-level groups as sections; inside a section, every group with keys of its own is a row of its actions (e.g.
 * `admin.account` with create, update...). Labels follow the current locale.
 */
const sections = computed(() => {
    const pathToRowMap = new Map<string, PermissionRow>();
    const groupToSectionMap = new Map<string, PermissionSection>();
    for (const group of adminPermissionGroups) {
        if (group.includes('.')) continue;
        groupToSectionMap.set(
            group,
            {
                group,
                keys: [],
                label: localize(adminPermissionLabelMap[group]),
                rows: [],
            },
        );
    }

    for (const key of adminPermissionKeys) {
        const rowPath = getParentPath(key);
        const section = groupToSectionMap.get(key.split('.')[0]!)!;
        let row = pathToRowMap.get(rowPath);
        if (!row) {
            const pathSegments = rowPath.split('.');
            const labelPaths = pathSegments.slice(1).map((_, index) => pathSegments.slice(0, index + 2).join('.'));
            row = {
                keys: [],
                label: labelPaths.length
                    ? labelPaths.map((path) => localize(adminPermissionLabelMap[path as AdminPermissionGroup])).join(' / ')
                    : section.label,
                path: rowPath,
            };

            pathToRowMap.set(rowPath, row);
            section.rows.push(row);
        }

        row.keys.push(key);
        section.keys.push(key);
    }

    return [...groupToSectionMap.values()];
});

const selectedKeySet = computed(() => new Set(model.value));
const visibleSections = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    if (!keyword) return sections.value;
    const matches = (text: string) => text.toLowerCase().includes(keyword);
    return sections.value.flatMap((section) => {
        const rows = matches(section.label)
            ? section.rows
            : section.rows.filter(
                (row) => matches(row.label) || row.keys.some((key) => matches(localize(adminPermissionLabelMap[key]))),
            );

        return rows.length
            ? [
                {
                    ...section,
                    rows,
                },
            ]
            : [];
    });
});

// Functions
function countSelected(keys: readonly AdminPermissionKey[]) {
    return keys.filter((key) => selectedKeySet.value.has(key)).length;
}

function getCheckState(keys: readonly AdminPermissionKey[]) {
    const selectedCount = countSelected(keys);
    return {
        indeterminate: selectedCount > 0 && selectedCount < keys.length,
        modelValue: selectedCount === keys.length,
    };
}

function getParentPath(path: string) {
    return path.slice(0, path.lastIndexOf('.'));
}

/**
 * Checks or unchecks keys with their requirements (defined with the permissions in the backend): checking a key also
 * checks the keys it requires, and unchecking a key also unchecks the keys requiring it.
 */
function setKeys(keys: readonly AdminPermissionKey[], checked: boolean) {
    const keySet = new Set<string>(model.value);
    for (const key of keys) {
        if (checked) {
            keySet.add(key);
            adminPermissionRequirementMap[key]?.forEach((requiredKey) => keySet.add(requiredKey));
        } else {
            keySet.delete(key);
            keyToDependentKeysMap.get(key)?.forEach((dependentKey) => keySet.delete(dependentKey));
        }
    }

    // Keeps the catalog order and drops keys no longer in the catalog.
    model.value = adminPermissionKeys.filter((key) => keySet.has(key));
}

// Watchers
watch(
    searchText,
    (keyword) => {
        if (keyword.trim()) expandedSectionGroups.value = visibleSections.value.map((section) => section.group);
    },
);
</script>

<style lang="scss" scoped>
.permission-row {
    border-top: 1px solid var(--el-border-color-lighter);
}
</style>
