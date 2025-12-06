<template>
    <div
        v-if="status"
        class="flex-middle z-10000 inset-0 size-full flex-col"
        :class="{
            'bg-white/70': !withoutBackground,
            'dark:bg-dark/80': !withoutBackground,
            absolute,
        }"
    >
        <i-mdi-error
            v-if="status === 'error'"
            class="fs-3rem text-[#dc3545]"
        />
        <i-mdi-success
            v-else-if="status === 'success'"
            class="fs-3rem text-[#198754]"
        />
        <i-line-md-loading-loop
            v-else
            class="fs-3rem text-red"
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
import type { Nullable } from '@kikiutils/shared/types';

type Status = Nullable<'error' | 'loading' | 'success'>;

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
let hideTimeout: Nullable<NodeJS.Timeout> = null;
const status = ref<Status>(props.initialStatus || null);
const statusText = ref(props.initialStatusText);

// Functions
function show(stateType: Status, text: string, duration: false | number) {
    status.value = stateType;
    statusText.value = text;
    if (duration === false) return;
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    hideTimeout = setTimeout(() => status.value = null, duration);
}

// Exposes
defineExpose({
    hide() {
        status.value = null;
    },
    get isVisible() {
        return status.value !== null;
    },
    showError: (text: string, duration: false | number = 1000) => show('error', text, duration),
    showLoading: (text: string) => show('loading', text, false),
    showSuccess: (text: string, duration: false | number = 1000) => show('success', text, duration),
    status: readonly(status),
});
</script>
