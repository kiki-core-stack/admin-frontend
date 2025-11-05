<template>
    <el-select
        :loading="isLoadingData"
        :remote-method="loadData"
        :teleported="false"
        clearable
        filterable
        remote
    >
        <el-option
            v-for="item in items"
            :key="item.id"
            :label="item.name"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import type { AdminRoleData } from '@kiki-core-stack/pack/types/data/admin';

interface Props {
    selectedData?: Partial<AdminRoleData>[];
}

// Define props, models and emits
const props = defineProps<Props>();

// Constants/Refs/Variables
const isLoadingData = ref(true);
const items = ref<AdminRoleData[]>([]);

// Functions
async function loadData(query: string) {
    isLoadingData.value = true;
    const response = await useAdminRoleApi().getList({
        fields: ['name'],
        filter: { name: { $regex: query } },
        limit: 100,
    });

    items.value = response?.data?.data?.list || [];
    isLoadingData.value = false;
}

function processSelectedData() {
    if (!props.selectedData?.length) return;
    const existingIds = items.value.map((item) => item.id);
    const incomingData = props.selectedData as Required<NonNullable<Props['selectedData']>[number]>[];
    items.value.push(...incomingData.filter((item) => !existingIds.includes(item.id)));
}

// Watchers
watch(() => props.selectedData, processSelectedData);

// Hooks
onMounted(processSelectedData);
</script>
