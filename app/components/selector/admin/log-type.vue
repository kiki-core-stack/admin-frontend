<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(AdminLogType)"
            :key="item"
            :label="t(`enums.admin.logType.${item}`)"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import { AdminLogType } from '@kcs-project/pack/constants/admin';

// Constants/Refs/Variables
const { t } = useI18n();
</script>
