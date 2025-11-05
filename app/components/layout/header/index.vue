<template>
    <el-header
        class="dark:bg-dark py-2! flex flex-wrap items-center justify-between bg-white"
        height="unset"
    >
        <i-fa6-solid-bars
            class="mr-4 mt-0.5 cursor-pointer md:hidden"
            @click="sidebarState.isShow = true"
        />
        <span class="fs-20px">後台管理系統</span>
        <div class="grow" />
        <el-button
            class="rounded-full! w-1"
            @click="toggleTheme"
        >
            <i-fa6-solid-moon v-if="isDark" />
            <i-fa6-solid-sun v-else />
        </el-button>
        <el-button
            class="ml-1!"
            @click="logout()"
        >
            登出
        </el-button>
    </el-header>
</template>

<script lang="ts" setup>
import { logout } from '@/libs/auth';

// Constants/Refs/Variables
const colorMode = useColorMode();
const sidebarState = useSidebarState();

// Computed properties
const isDark = computed(() => colorMode.preference === 'dark');

// Functions
const toggleDark = () => void (colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark');

function toggleTheme(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if (!document.startViewTransition) return void toggleDark();
    const transition = document.startViewTransition(() => toggleDark());
    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
            { clipPath: isDark.value ? clipPath.reverse() : clipPath },
            {
                duration: 400,
                easing: 'ease-in-out',
                fill: 'both',
                pseudoElement: isDark.value
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)',
            },
        );
    });
}
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
:deep(.el-drawer__body) {
    @apply p-0!;
}
</style>
