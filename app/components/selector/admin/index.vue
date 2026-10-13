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
            :label="item.account"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import type { AdminData } from '@kcs-project/pack/types/data/admin';

interface Props {
    selectedData?: Partial<AdminData>[];
}

// Define props, models and emits
const props = defineProps<Props>();

// Constants/Refs/Variables
const isLoadingData = ref(true);
const items = ref<AdminData[]>([]);

// Functions
async function loadData(query: string) {
    isLoadingData.value = true;
    const response = await AdminApi.use().getList({
        fields: ['account'],
        filter: { account: { $regex: query } },
        limit: 100,
    });

    items.value = response?.data?.data?.list || [];
    isLoadingData.value = false;
}

function processSelectedData() {
    if (!props.selectedData?.length) return;
    const existingIds = items.value.map(({ id }) => id);
    const incomingData = props.selectedData as Required<NonNullable<Props['selectedData']>[number]>[];
    items.value.push(...incomingData.filter(({ id }) => !existingIds.includes(id)));
}

// Watchers
watch(() => props.selectedData, processSelectedData, { immediate: true });
</script>
