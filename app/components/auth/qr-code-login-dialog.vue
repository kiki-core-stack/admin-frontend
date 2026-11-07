<template>
    <el-dialog
        v-model="isVisible"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
    >
        <auth-qr-code-login-block
            class="mt-4"
            :qr-code-image-src="qrCodeImageSrc"
            @reload="$emit('reload')"
        />
    </el-dialog>
</template>

<script lang="ts" setup>
// Define props, models and emits
defineProps<{ qrCodeImageSrc: string }>();
defineEmits<{ (e: 'reload'): void }>();

// Constants/Refs/Variables
const isVisible = ref(false);

// Functions
function close() {
    isVisible.value = false;
}

function open() {
    isVisible.value = true;
}

// Exposes
defineExpose({
    close,
    open,
});
</script>
