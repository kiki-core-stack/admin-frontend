<template>
    <el-button @click="onSelect('today')">
        今天
    </el-button>
    <el-button @click="onSelect('yesterday')">
        昨天
    </el-button>
    <el-button @click="onSelect('thisWeek')">
        本周
    </el-button>
    <el-button @click="onSelect('lastWeek')">
        上週
    </el-button>
    <el-button @click="onSelect('thisMonth')">
        本月
    </el-button>
    <el-button @click="onSelect('lastMonth')">
        上月
    </el-button>
</template>

<script lang="ts" setup>
import type { DateRangeType } from '@kikiutils/shared/datetime';

// Define props, models and emits
const emit = defineEmits<{ (e: 'select'): void }>();
const endAt = defineModel<Date>('end', { required: true });
const startAt = defineModel<Date>('start', { required: true });

// Functions
function onSelect(type: DateRangeType) {
    const { endDate, startDate } = getDateRangeFromDate(new Date(), type, { setEndDateToNextDayStart: true });
    endAt.value = endDate;
    startAt.value = startDate;
    emit('select');
}
</script>
