<template>
    <el-header
        id="layout-header-tabs-container"
        class="fs-14px flex overflow-auto bg-[#e0e0e0] dark:bg-[#4a4a4a]"
        height="unset"
    >
        <nuxt-link
            class="relative flex items-center"
            active-class="active"
            to="/"
            @auxclick.middle.prevent
            @click.middle.prevent
        >
            <nuxt-icon
                name="fa6-solid:house"
                size="21px"
            />
        </nuxt-link>
        <nuxt-link
            v-for="(tab, index) in pageHeadTabsState.tabs"
            :key="index"
            class="relative flex items-center whitespace-nowrap"
            active-class="active"
            :to="tab.path"
            @auxclick.middle.prevent="pageHeadTabsController.close(index)"
            @contextmenu="showContextMenu($event, index)"
            @click.middle.prevent
        >
            {{ tab.title }}
            <div
                class="close-xmark flex-middle ml-2"
                @click.prevent="pageHeadTabsController.close(index)"
            >
                <nuxt-icon name="mdi:close" />
            </div>
        </nuxt-link>
        <context-menu
            ref="contextMenuRef"
            :items="contextMenuItems"
        />
    </el-header>
</template>

<script lang="ts" setup>
// Constants/Refs/Variables
const contextMenuAtTabIndex = ref(0);
const contextMenuRef = useTemplateRef('contextMenuRef');
const pageHeadTabsState = usePageHeadTabsState();
const contextMenuItems = shallowRef([
    {
        action: () => pageHeadTabsController.closeAll(),
        label: '關閉全部',
    },
    {
        action: () => pageHeadTabsController.closeFromIndexTo(contextMenuAtTabIndex.value - 1, 0),
        label: '關閉左邊所有',
    },
    {
        action: () => {
            pageHeadTabsController.closeFromIndexTo(
                contextMenuAtTabIndex.value + 1,
                pageHeadTabsState.value.tabs.length,
            );
        },
        label: '關閉右邊所有',
    },
]);

// Functions
function showContextMenu(event: MouseEvent, tabIndex: number) {
    contextMenuAtTabIndex.value = tabIndex;
    contextMenuRef.value?.show(event);
}

// Watchers
watch(
    () => useRoute().fullPath,
    () => {
        setTimeout(
            () => document.querySelector('#layout-header-tabs-container .active')?.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
            }),
            50,
        );
    },
);
</script>

<style lang="scss" scoped>
#layout-header-tabs-container {
    --bg-close-xmark: #e0e0e0;
    --bg-tab-active: #f5f5f5;
    --bg-tab-hover: #ededed;
    --box-shadow-size: 30px;

    padding: 5px 15px 0 !important;

    html.dark & {
        --bg-close-xmark: #4a4a4a;
        --bg-tab-active: #2c2c2c;
        --bg-tab-hover: #2b2b2b;
    }
}

a {
    @apply bg-transparent outline-0;

    padding: 6px 15px;
    border-radius: 12px 12px 0 0;
    transition: 0.1s ease;

    &::after,
    &::before {
        @apply absolute bottom-0 rounded-full size-[20px];

        content: '';
        box-shadow: 0 0 0 40px transparent;
        transition: 0.1s ease;
    }

    &::after {
        right: -20px;
        clip-path: inset(50% 50% 0 -10px);
    }

    &::before {
        left: -20px;
        clip-path: inset(50% -10px 0 50%);
    }

    &:hover {
        background-color: var(--bg-tab-hover);

        &::after,
        &::before {
            box-shadow: 0 0 0 var(--box-shadow-size) var(--bg-tab-hover);
        }
    }

    &.active {
        @apply z-1000;

        background-color: var(--bg-tab-active);

        &::after,
        &::before {
            box-shadow: 0 0 0 var(--box-shadow-size) var(--bg-tab-active);
        }
    }

    .close-xmark {
        @apply size-[16px] rounded-[50%];

        transition: background-color 0.2s;

        &:hover {
            background-color: var(--bg-close-xmark);
        }
    }
}
</style>
