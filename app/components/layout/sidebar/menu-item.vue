<template>
    <el-sub-menu
        v-if="'children' in item"
        :index="item.basePath"
    >
        <template #title>
            <span>{{ item.title }}</span>
        </template>
        <layout-sidebar-menu-item
            v-for="child, index in item.children"
            :key="index"
            :item="child"
        />
    </el-sub-menu>
    <el-menu-item
        v-else
        :index="item.path"
        @click="sidebarState.isShow = false"
    >
        {{ item.title }}
    </el-menu-item>
</template>

<script lang="ts" setup>
import type { SidebarMenuItem } from '@/types/sidebar';

interface Props {
    item: SidebarMenuItem;
}

// Define props, models and emits
defineProps<Props>();

// Constants/Refs/Variables
const sidebarState = useSidebarState();
</script>
