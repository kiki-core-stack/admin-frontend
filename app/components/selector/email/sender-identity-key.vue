<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(EmailSenderIdentityKey)"
            :key="item"
            :label="emailSenderIdentityKeyToTextMap[item]"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import {
    EmailSenderIdentityKey,
    emailSenderIdentityKeyToTextMap,
} from '@kiki-core-stack/pack/constants/email';
</script>
