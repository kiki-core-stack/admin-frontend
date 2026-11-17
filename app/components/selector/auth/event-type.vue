<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(AuthEventType)"
            :key="item"
            :label="localize(authEventTypeToLabelMap[item])"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import {
    AuthEventType,
    authEventTypeToLabelMap,
} from '@kcs-project/pack/constants/auth';
</script>
