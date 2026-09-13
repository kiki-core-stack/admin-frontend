<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:time-range-end="filter.createdAt.$lt"
        v-model:time-range-start="filter.createdAt.$gte"
        title="簡訊發送紀錄"
        :crud-api="SmsSendRecordApi.use()"
        :filter="filter"
        :permissions="{ base: 'sms.sendRecord' }"
        hide-actions-column
        hide-add-data-btn
        show-time-range-quick-selector
    >
        <template #toolbar-prepend>
            <filter-form
                v-if="dataTablePageRef?.capabilities.list"
                v-model="filter"
                class="pb-1 pl-1"
                @submit.prevent="dataTablePageRef?.loadData()"
            >
                <filter-time-range-fields
                    v-model:end="filter.createdAt.$lt"
                    v-model:start="filter.createdAt.$gte"
                />
            </filter-form>
        </template>
        <template #table>
            <el-table-column
                label="電話號碼"
                prop="to"
            />
            <el-table-column
                label="內容"
                prop="content"
            />
            <el-table-column
                align="center"
                label="狀態"
                :formatter="(row: SmsSendRecordData) => commonStatusToTextMap[row.status]"
            />
            <el-table-column
                label="錯誤原因"
                prop="failureReason"
            />
            <el-table-column
                label="服務商"
                prop="provider.name"
            />
            <el-table-column
                label="外部交易ID"
                prop="providerTransactionId"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import type { SmsSendRecordData } from '@kcs-project/pack/types/data/sms';

import type { GetSmsSendRecordListFilter } from '@/types/sms';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const filter = ref<GetSmsSendRecordListFilter>({
    createdAt: {
        $gte: getMidnightDateFromToday(),
        $lt: getMidnightDateFromToday(1),
    },
});
</script>
