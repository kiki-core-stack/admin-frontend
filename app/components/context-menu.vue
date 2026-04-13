<template>
    <div
        v-if="isShow"
        ref="menuRef"
        class="fixed z-2000 flex min-w-40 flex-col rounded-sm bg-white py-2 dark:bg-[#18181b]"
        :style="{ top: `${menuY}px`, left: `${menuX}px` }"
    >
        <button
            v-for="item, index in items"
            :key="index"
            class="cursor-pointer py-1 hover:bg-[#f1f5f9] dark:hover:bg-[#27272a]"
            @click="() => {
                item.action();
                isShow = false;
            }"
        >
            {{ item.label }}
        </button>
    </div>
    <div
        v-else
        class="hidden"
    />
</template>

<script lang="ts" setup>
interface Props {
    items: {
        action: () => any;
        label: string;
    }[];
}

// Define props, models and emits
defineProps<Props>();

// Constants/Refs/Variables
const menuRef = useTemplateRef('menuRef');
const menuX = ref(0);
const menuY = ref(0);
const isShow = ref(false);

// Functions
const close = () => isShow.value = false;

function show(event: MouseEvent) {
    event.preventDefault();
    isShow.value = true;
    nextTick(() => {
        if (!menuRef.value) return;
        const { offsetHeight, offsetWidth } = menuRef.value;
        let left = event.clientX;
        let top = event.clientY;
        if (left + offsetWidth > window.innerWidth) left = window.innerWidth - offsetWidth;
        if (top + offsetHeight > window.innerHeight) top = window.innerHeight - offsetHeight;
        menuX.value = left;
        menuY.value = top;
    });
}

// Hooks
onBeforeMount(() => {
    window.removeEventListener('click', close);
    window.removeEventListener('resize', close);
});

onMounted(() => {
    window.addEventListener('click', close);
    window.addEventListener('resize', close);
});

// Exposes
defineExpose({
    close,
    show,
});
</script>
