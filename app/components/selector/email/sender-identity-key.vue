<template>
    <el-select
        :teleported="false"
        clearable
    >
        <el-option
            v-for="item in getEnumNumberValues(EmailSenderIdentityKey)"
            :key="item"
            :label="t(`enums.email.senderIdentityKey.${item}`)"
            :value="item"
        />
    </el-select>
</template>

<script lang="ts" setup>
import { EmailSenderIdentityKey } from '@kcs-project/pack/constants/email';

// Constants/Refs/Variables
const { t } = useI18n();
</script>
