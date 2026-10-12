<template>
    <div
        v-if="status"
        class="flex-middle inset-0 z-10000 size-full flex-col"
        :class="{
            'bg-white/70': !withoutBackground,
            'dark:bg-dark/80': !withoutBackground,
            absolute,
        }"
    >
        <nuxt-icon
            v-if="status === 'error'"
            class="fs-3rem text-[#dc3545]"
            name="mdi:error"
        />
        <nuxt-icon
            v-else-if="status === 'success'"
            class="fs-3rem text-[#198754]"
            name="mdi:success"
        />
        <nuxt-icon
            v-else
            class="fs-3rem text-red"
            name="line-md:loading-loop"
        />
        <p
            v-if="!hideText"
            class="fs-20px mt-4"
        >
            {{ statusText }}
        </p>
    </div>
    <div v-else />
</template>

<script lang="ts" setup>
type Status = 'error' | 'loading' | 'success' | null;

interface Props {
    absolute?: boolean;
    hideText?: boolean;
    initialStatus?: Status;
    initialStatusText?: string;
    withoutBackground?: boolean;
}

// Define props, models and emits
const props = withDefaults(defineProps<Props>(), { absolute: true });

// Constants/Refs/Variables
let hideTimeoutDuration = 1000;
const status = ref<Status>(props.initialStatus || null);
const statusText = ref(props.initialStatusText);
const hideTimeout = useTimeoutFn(() => status.value = null, () => hideTimeoutDuration, { immediate: false });

// Functions
function hide() {
    hideTimeout.stop();
    status.value = null;
}

function show(stateType: Status, text: string, duration: false | number) {
    hideTimeout.stop();
    status.value = stateType;
    statusText.value = text;
    if (duration === false) return;
    hideTimeoutDuration = duration;
    hideTimeout.start();
}

// Exposes
defineExpose({
    hide,
    get isVisible() {
        return status.value !== null;
    },
    showError: (text: string, duration: false | number = 1000) => show('error', text, duration),
    showLoading: (text: string) => show('loading', text, false),
    showSuccess: (text: string, duration: false | number = 1000) => show('success', text, duration),
    status: readonly(status),
});
</script>
