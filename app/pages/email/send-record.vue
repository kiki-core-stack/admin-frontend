<template>
    <data-table-page
        ref="dataTablePageRef"
        v-model:time-range-end="filter.createdAt.$lt"
        v-model:time-range-start="filter.createdAt.$gte"
        title="電子郵件發送紀錄"
        :crud-api="EmailSendRecordApi.use()"
        :filter="filter"
        :permissions="{ base: 'email.sendRecord' }"
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
                label="收件者"
                prop="to"
            />
            <el-table-column
                label="主旨"
                prop="subject"
            />
            <el-table-column
                label="內容"
                prop="content"
            />
            <el-table-column
                align="center"
                label="狀態"
                :formatter="(row: EmailSendRecordData) => commonStatusToTextMap[row.status]"
            />
            <el-table-column
                label="錯誤原因"
                prop="failureReason"
            />
            <el-table-datetime-column
                field="sentAt"
                label="寄出時間"
            />
            <el-table-column
                label="平台"
                prop="platform.name"
            />
            <el-table-column
                label="寄件者"
                prop="from"
            />
            <el-table-column
                label="外部交易ID"
                prop="serviceProviderTransactionId"
            />
        </template>
    </data-table-page>
</template>

<script lang="ts" setup>
import type { EmailSendRecordData } from '@kiki-core-stack/pack/types/data/email';

import type { GetEmailSendRecordListFilter } from '@/types/email';

// Constants/Refs/Variables
const dataTablePageRef = useTemplateRef('dataTablePageRef');
const filter = ref<GetEmailSendRecordListFilter>({
    createdAt: {
        $gte: getMidnightDateFromToday(),
        $lt: getMidnightDateFromToday(1),
    },
});
</script>
