<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(AuthEventType)"
            :key="item"
            :label="t(`enums.auth.eventType.${item}`)"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import { AuthEventType } from '@kcs-project/pack/constants/auth';

// Constants/Refs/Variables
const { t } = useI18n();
</script>
