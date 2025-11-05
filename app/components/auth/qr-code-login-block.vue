<template>
    <div class="flex flex-col items-center">
        <div class="bg-gray/40 dark:bg-light pointer-events-none select-none rounded-[10px] p-3">
            <img :src="qrCodeImageSrc">
        </div>
        <p class="fs-24px mt-4">
            使用QR Code登入
        </p>
        <p class="text-gray md:whitespace-nowrap">
            使用已登入的裝置對此掃描就能立即登入。
        </p>
        <el-button
            class="mt-1"
            size="small"
            @click="$emit('reload')"
        >
            重新獲取QR Code
        </el-button>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    qrCodeImageSrc: string;
}

// Define props, models and emits
defineProps<Props>();
defineEmits<{ (e: 'reload'): void }>();
</script>
