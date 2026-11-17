<template>
    <div class="flex flex-col items-center text-center">
        <div
            v-loading="!qrCodeImageSrc"
            class="pointer-events-none size-[200px] overflow-hidden rounded-[10px] bg-white p-3 select-none"
        >
            <img
                v-if="qrCodeImageSrc"
                class="size-full"
                :src="qrCodeImageSrc"
            >
        </div>
        <p class="fs-18px mt-4">
            使用 QR Code 登入
        </p>
        <p class="text-gray fs-13px mt-1">
            以已登入的裝置掃描即可登入
        </p>
        <el-button
            class="mt-3"
            size="small"
            @click="$emit('reload')"
        >
            重新取得
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
