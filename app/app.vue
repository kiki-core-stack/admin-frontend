<template>
    <div>
        <nuxt-loading-indicator />
        <el-config-provider :locale="elementPlusLocale">
            <nuxt-layout>
                <nuxt-page />
            </nuxt-layout>
            <auth-verification-dialog />
        </el-config-provider>
    </div>
</template>

<script lang="ts" setup>
import type { Locale } from '@kcs-project/pack/types/i18n';
import type { Language } from 'element-plus/es/locale';
import en from 'element-plus/es/locale/lang/en';
import zhTw from 'element-plus/es/locale/lang/zh-tw';

// Constants/Refs/Variables
const { locale } = useI18n();
const localeToElementPlusLocaleMap = {
    'en': en,
    'zh-TW': zhTw,
} satisfies Record<Locale, Language>;

// Computed properties
const elementPlusLocale = computed(() => localeToElementPlusLocaleMap[locale.value]);
</script>
