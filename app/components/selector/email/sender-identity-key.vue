<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(EmailSenderIdentityKey)"
            :key="item"
            :label="localize(emailSenderIdentityKeyToLabelMap[item])"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import {
    EmailSenderIdentityKey,
    emailSenderIdentityKeyToLabelMap,
} from '@kcs-project/pack/constants/email';
</script>
