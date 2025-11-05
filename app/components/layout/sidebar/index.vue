<template>
    <el-menu
        class="sidebar h-full w-[200px] py-[48px] tracking-[2px]"
        background-color="#252828"
        text-color="#fff"
        :default-active="route.path"
        router
    >
        <el-scrollbar>
            <layout-sidebar-menu-item
                v-for="menuItem, index in processedMenuItems"
                :key="index"
                :item="menuItem"
            />
        </el-scrollbar>
    </el-menu>
</template>

<script lang="ts" setup>
import type { WritableDeep } from 'type-fest';

import { sidebarMenuItems } from '@/constants/sidebar';
import type { SidebarMenuItem } from '@/types/sidebar';

// Constants/Refs/Variables
const route = useRoute();

// Computed properties
const processedMenuItems = computed(() => {
    return processAccessibleMenuItems(cloneDeep(sidebarMenuItems) as WritableDeep<SidebarMenuItem[]>);
});

// Functions
function processAccessibleMenuItems(menuItems: SidebarMenuItem[]) {
    for (let i = menuItems.length - 1; i >= 0; i--) {
        const menuItem = menuItems[i]!;
        if (!hasPermission(menuItem.requiredPermissions)) menuItems.splice(i, 1);
        else if ('children' in menuItem) {
            menuItem.children = processAccessibleMenuItems(menuItem.children);
            if (!menuItem.children.length) menuItems.splice(i, 1);
        }
    }

    return menuItems;
}
</script>
