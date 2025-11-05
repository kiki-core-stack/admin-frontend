<template>
    <el-container class="fixed inset-0 bg-[#f5f5f5] p-0 dark:bg-[#2c2c2c]">
        <el-drawer
            v-model="sidebarState.isShow"
            body-class="p-0!"
            direction="ltr"
            size="200"
            :with-header="false"
        >
            <layout-sidebar />
        </el-drawer>
        <el-aside
            class="hidden md:block"
            width="auto"
        >
            <layout-sidebar />
        </el-aside>
        <el-container direction="vertical">
            <layout-header />
            <layout-header-tabs />
            <el-main class="overflow-hidden! p-0!">
                <slot />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
// Constants/Refs/Variables
const sidebarState = useSidebarState();
</script>
