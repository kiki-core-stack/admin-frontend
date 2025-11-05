<template>
    <div
        v-loading="isLoadingData"
        class="h-full"
    >
        <Head>
            <Title>首頁</Title>
        </Head>
        <div
            v-if="hasViewDashboardPermission"
            class="h-full overflow-auto p-4"
        >
            <filter-form
                v-model="filter"
                class="dark:bg-dark rounded-[10px] bg-white p-4"
                @submit.prevent="loadData"
            >
                <filter-time-range-fields
                    v-model:end="filter.createdAt.$lt"
                    v-model:start="filter.createdAt.$gte"
                />
                <template #before-submit-btn>
                    <time-range-quick-selector
                        v-model:end="filter.createdAt.$lt"
                        v-model:start="filter.createdAt.$gte"
                        @select="loadData"
                    />
                </template>
            </filter-form>
            <div class="cards-container mt-4 grid gap-1">
                <el-card body-class="p-4!">
                    <p class="mb-3">
                        數量
                    </p>
                    <p class="fs-24px">
                        1
                    </p>
                </el-card>
                <el-card body-class="p-4!">
                    <p class="mb-3">
                        數量2
                    </p>
                    <p class="fs-24px">
                        2
                    </p>
                </el-card>
            </div>
            <div class="cards-container mt-1 grid gap-1">
                <el-card body-class="p-4!">
                    <p class="mb-3">
                        數量3
                    </p>
                    <p class="fs-24px">
                        3
                    </p>
                </el-card>
                <el-card body-class="p-4!">
                    <p class="mb-3">
                        數量4
                    </p>
                    <p class="fs-24px">
                        4
                    </p>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { GetHomeDashboardDataFilter } from '@/types/home';

// Constants/Refs/Variables
const defaultHomeDashboardData = {} as const;
const dashboardData = ref<typeof defaultHomeDashboardData>(cloneDeep(defaultHomeDashboardData));
const filter = ref<GetHomeDashboardDataFilter>({
    createdAt: {
        $gte: getMidnightDateFromToday(),
        $lt: getMidnightDateFromToday(1),
    },
});

const isLoadingData = ref(false);

// Computed properties
const hasViewDashboardPermission = computed(() => hasPermission('home.dashboard.view'));

// Functions
async function loadData() {
    if (isLoadingData.value || !hasViewDashboardPermission.value) return;
    isLoadingData.value = true;
    const response = await useHomeApi().getDashboardData(filter.value);
    Object.assign(dashboardData.value, defaultHomeDashboardData, response?.data?.data);
    isLoadingData.value = false;
}

// Load data
onMounted(loadData);
</script>

<style lang="scss" scoped>
.cards-container {
    grid-template-columns: repeat(6, 1fr);

    @media (width <= 1600px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (width <= 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (width <= 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (width <= 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>
