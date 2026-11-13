<template>
    <el-dropdown
        trigger="click"
        split-button
        @click="emit('trigger')"
    >
        {{ buttonText }}
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="setIntervalSeconds(null)">
                    關閉
                </el-dropdown-item>
                <el-dropdown-item
                    v-for="option in options"
                    :key="option"
                    @click="setIntervalSeconds(option)"
                >
                    {{ option }}s
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
interface Props {
    autostart?: boolean;
    defaultSeconds?: null | number;
    options?: number[];
    text: string;
}

// Define props, models and emits
const props = withDefaults(
    defineProps<Props>(),
    {
        defaultSeconds: 60,
        options: () => [
            5,
            10,
            20,
            30,
            40,
            50,
            60,
        ],
    },
);

const emit = defineEmits<{ (e: 'trigger'): void }>();

// Constants/Refs/Variables
const currentInterval = ref<null | number>(props.defaultSeconds);
const countdown = ref<null | number>(currentInterval.value);
const countdownTicker = useIntervalFn(
    () => {
        if (countdown.value !== null && --countdown.value > 0) return;
        const isCompleted = countdown.value !== null;
        stop();
        if (isCompleted) emit('trigger');
    },
    1000,
    { immediate: false },
);

// Computed properties
const buttonText = computed(() => {
    if (currentInterval.value !== null) return `${props.text}(${countdown.value})`;
    return props.text;
});

// Functions
function setIntervalSeconds(seconds: null | number) {
    currentInterval.value = seconds;
    stop();
    if (seconds !== null) start();
}

function start() {
    if (currentInterval.value === null || countdownTicker.isActive.value) return;
    countdown.value = currentInterval.value;
    countdownTicker.resume();
}

function stop() {
    countdownTicker.pause();
    countdown.value = currentInterval.value;
}

// Hooks
onMounted(() => {
    if (props.autostart) start();
});

// Exposes
defineExpose({
    start,
    stop,
});
</script>
