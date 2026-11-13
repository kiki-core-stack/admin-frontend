<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(AdminLogType)"
            :key="item"
            :label="localize(adminLogTypeToLabelMap[item])"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import {
    AdminLogType,
    adminLogTypeToLabelMap,
} from '@kcs-project/pack/constants/admin';
</script>
