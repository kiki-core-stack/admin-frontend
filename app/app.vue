<template>
    <div>
        <nuxt-loading-indicator />
        <el-config-provider :locale="zhTw">
            <nuxt-layout>
                <nuxt-page />
            </nuxt-layout>
            <auth-verification-dialog />
        </el-config-provider>
    </div>
</template>

<script setup>
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';
</script>
