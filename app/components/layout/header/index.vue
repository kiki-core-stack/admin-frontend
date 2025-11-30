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
        <el-actions-dropdown
            class="ml-1"
            btn-size="default"
            btn-text="操作"
            btn-type="default"
        >
            <el-dropdown-item
                class="justify-center"
                @click="clearCache"
            >
                清除快取
            </el-dropdown-item>
            <el-dropdown-item
                class="justify-center"
                @click="logout()"
            >
                登出
            </el-dropdown-item>
        </el-actions-dropdown>
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

async function clearCache() {
    showLoadingAlert('清除中...');
    await PublicApi.use().clearClientCache().catch(() => {});
    showSuccessAlert(
        '清除完成',
        {
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        },
    );

    setTimeout(() => globalThis.location.reload(), 1000);
}

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
