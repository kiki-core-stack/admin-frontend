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
            :value="item.id"
        />
    </el-select>
</template>

<script lang="ts" setup>
import type { AdminData } from '@kiki-core-stack/pack/types/data/admin';

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
</script>
