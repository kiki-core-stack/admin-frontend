<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:time-range-end="filter.createdAt.$lt"
        v-model:time-range-start="filter.createdAt.$gte"
        permission-group="ignore"
        title="安全性紀錄"
        :crud-api="ProfileSecurityEventApi.use()"
        :filter="filter"
        hide-actions-column
        hide-updated-at-column
        show-time-range-quick-selector
    >
        <template #toolbar-prepend>
            <filter-form
                v-model="filter"
                class="pb-1 pl-1"
                @submit.prevent="dataTablePageRef?.loadData()"
            >
                <filter-time-range-fields
                    v-model:end="filter.createdAt.$lt"
                    v-model:start="filter.createdAt.$gte"
                />
                <el-form-item label="類型">
                    <selector-auth-event-type
                        v-model="filter.type.$in"
                        multiple
                    />
                </el-form-item>
            </filter-form>
        </template>
        <template #table>
            <el-table-column
                label="類型"
                :formatter="formatType"
            />
            <el-table-column
                label="使用因子"
                :formatter="(row: AuthEventData) => row.factor ? localize(authFactorToLabelMap[row.factor]) : ''"
            />
            <el-table-column
                label="IP"
                prop="ip"
            />
            <el-table-column
                label="裝置"
                :formatter="(row: AuthEventData) => parseUserAgentToDeviceInfo(row.userAgent)"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import {
    authEventTypeToLabelMap,
    authFactorToLabelMap,
} from '@kcs-project/pack/constants/auth';
import type { AuthEventData } from '@kcs-project/pack/types/data/auth';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';
import type { GetAuthEventListFilter } from '@/types/auth';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const filter = ref<GetAuthEventListFilter>({
    createdAt: {
        $gte: getMidnightDateFromToday(-6),
        $lt: getMidnightDateFromToday(1),
    },
    type: { $in: [] },
});

// Functions
function formatType(row: AuthEventData) {
    const label = localize(authEventTypeToLabelMap[row.type]);
    // Events such as enforcement changes or resets are performed on this account by another admin.
    const isByOther = row.actorRealm !== row.realm || row.actorPrincipalId !== row.principalId;
    return isByOther ? `${label}（由其他管理員操作）` : label;
}
</script>
