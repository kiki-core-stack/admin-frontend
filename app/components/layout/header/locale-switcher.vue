<template>
    <el-dropdown
        trigger="click"
        @command="(code: Locale) => setLocale(code)"
    >
        <el-button class="w-1 rounded-full!">
            <nuxt-icon name="fa6-solid:language" />
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in locales"
                    :key="item.code"
                    :command="item.code"
                >
                    <nuxt-icon
                        class="mr-2"
                        :class="{ invisible: item.code !== locale }"
                        name="fa6-solid:check"
                    />
                    {{ item.name }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import type { Locale } from '@kcs-project/pack/types/i18n';

// Constants/Refs/Variables
const {
    locale,
    locales,
    setLocale,
} = useI18n();
</script>
