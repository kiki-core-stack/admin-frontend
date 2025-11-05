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
import type { Nullable } from '@kikiutils/shared/types';

interface Props {
    autostart?: boolean;
    defaultSeconds?: Nullable<number>;
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
const currentInterval = ref<Nullable<number>>(props.defaultSeconds);
const countdown = ref<Nullable<number>>(currentInterval.value);
let countdownInterval: Nullable<NodeJS.Timeout> = null;

// Computed properties
const buttonText = computed(() => {
    if (currentInterval.value !== null) return `${props.text}(${countdown.value})`;
    return props.text;
});

// Functions
function setIntervalSeconds(seconds: Nullable<number>) {
    currentInterval.value = seconds;
    stop();
    if (seconds !== null) start();
}

function start() {
    if (currentInterval.value === null || countdownInterval) return;
    countdown.value = currentInterval.value;
    countdownInterval = setInterval(
        () => {
            if (countdown.value !== null) {
                countdown.value--;
                if (countdown.value > 0) return;
                emit('trigger');
            }

            stop();
        },
        1000,
    );
}

function stop() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
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
