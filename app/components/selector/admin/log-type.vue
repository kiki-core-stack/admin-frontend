<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(AdminLogType)"
            :key="item"
            :label="adminLogTypeToTextMap[item]"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import {
    AdminLogType,
    adminLogTypeToTextMap,
} from '@kiki-core-stack/pack/constants/admin';
</script>
