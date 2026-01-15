<template>
    <div
        v-loading="isLoadingData"
        class="h-full"
    >
        <Head>
            <Title>首頁</Title>
        </Head>
        <div
            v-if="!hasViewDashboardPermission"
            class="grid h-full place-items-center overflow-auto p-4"
        >
            <el-empty description="您沒有權限查看儀表板" />
        </div>
        <div
            v-else
            class="h-full overflow-auto p-4"
        >
            <filter-form
                v-model="filter"
                class="dark:bg-dark rounded-[10px] bg-white p-4"
                @submit.prevent="loadData"
            >
                <filter-time-range-fields
                    v-model:end="filter.endAt"
                    v-model:start="filter.startAt"
                />
                <template #before-submit-btn>
                    <time-range-quick-selector
                        v-model:end="filter.endAt"
                        v-model:start="filter.startAt"
                        @select="loadData"
                    />
                </template>
            </filter-form>
            <div
                v-if="isInitialLoading"
                class="skeleton-cards-container mt-4 grid gap-1"
            >
                <el-skeleton
                    v-for="i in 12"
                    :key="i"
                    animated
                >
                    <template #template>
                        <el-card body-class="p-4!">
                            <el-skeleton-item
                                class="w-50%"
                                variant="p"
                            />
                            <el-skeleton-item variant="h1" />
                        </el-card>
                    </template>
                </el-skeleton>
            </div>
            <div
                v-else-if="loadError"
                class="mt-4"
            >
                <el-card body-class="p-4!">
                    <el-result
                        icon="error"
                        sub-title="請檢查網路連線或稍後再試"
                        title="資料獲取失敗"
                    />
                </el-card>
            </div>
            <div
                v-if="dashboardData"
                class="mt-4 flex flex-col gap-4"
            >
                <section>
                    <h3 class="font-bold">
                        系統摘要
                    </h3>
                    <div class="cards-container mt-4 grid gap-1">
                        <el-card>
                            <h4>數量1</h4>
                            <p>1</p>
                        </el-card>
                        <el-card>
                            <h4>數量2</h4>
                            <p>2</p>
                        </el-card>
                        <el-card>
                            <h4>數量3</h4>
                            <p>3</p>
                        </el-card>
                        <el-card>
                            <h4>數量4</h4>
                            <p>4</p>
                        </el-card>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { GetHomeDashboardDataFilter } from '@/types/home';

interface AdminHomeDashboardData {}

// Constants/Refs/Variables
const dashboardData = ref<AdminHomeDashboardData | undefined>();
const filter = ref<GetHomeDashboardDataFilter>({
    endAt: getMidnightDateFromToday(1),
    startAt: getMidnightDateFromToday(),
});

const hasViewDashboardPermission = hasPermission('home.dashboard.view');
const isInitialLoading = ref(true);
const isLoadingData = ref(false);
const loadError = ref(false);

// Functions
async function loadData() {
    if (isLoadingData.value || !hasViewDashboardPermission) return;
    isLoadingData.value = true;
    loadError.value = false;

    const response = await HomeApi.use().getDashboardData(filter.value);
    if (response?.data?.data) dashboardData.value = response.data.data;
    else loadError.value = true;

    isInitialLoading.value = false;
    isLoadingData.value = false;
}

// Load data
onMounted(loadData);
</script>

<style lang="scss" scoped>
:deep(.cards-container) {
    /* stylelint-disable-next-line selector-class-pattern */
    .el-card__body {
        @apply p-4!;
    }

    h4 {
        @apply mb-3;
    }

    p {
        @apply fs-24px;
    }
}

.cards-container,
.skeleton-cards-container {
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
