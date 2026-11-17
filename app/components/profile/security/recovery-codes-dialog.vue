<template>
    <el-dialog
        v-model="isVisible"
        title="救援碼"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        center
        @closed="$emit('closed')"
    >
        <el-alert
            title="救援碼只會顯示這一次，每組只能使用一次，請妥善保存。"
            type="warning"
            :closable="false"
            show-icon
        />
        <p class="text-gray mt-4 text-center">
            無法使用驗證器或密碼金鑰時，可以使用救援碼完成雙重驗證。
        </p>
        <div class="mx-auto mt-4 grid max-w-[400px] grid-cols-2 gap-2 font-mono">
            <code
                v-for="recoveryCode in recoveryCodes"
                :key="recoveryCode"
                class="el-bg-and-border b rounded-1 px-2 py-1 text-center"
            >
                {{ recoveryCode }}
            </code>
        </div>
        <template #footer>
            <div class="flex-middle gap-btns flex-wrap">
                <el-button @click="copy(recoveryCodes.join('\n'))">
                    {{ copied ? '已複製' : '複製' }}
                </el-button>
                <el-button @click="download">
                    下載
                </el-button>
                <el-button
                    type="primary"
                    @click="close"
                >
                    我已保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
// Define props, models and emits
defineEmits<{ (e: 'closed'): void }>();

// Constants/Refs/Variables
const { copied, copy } = useClipboard({ legacy: true });
const isVisible = ref(false);
const recoveryCodes = ref<string[]>([]);

// Functions
function close() {
    isVisible.value = false;
}

function download() {
    const url = URL.createObjectURL(new Blob([`${recoveryCodes.value.join('\n')}\n`], { type: 'text/plain' }));
    const anchor = document.createElement('a');
    anchor.download = `${location.hostname}-recovery-codes.txt`;
    anchor.href = url;
    anchor.click();
    // Revoke after the click has started the download.
    setTimeout(() => URL.revokeObjectURL(url));
}

function open(codes: string[]) {
    recoveryCodes.value = codes;
    isVisible.value = true;
}

// Exposes
defineExpose({
    close,
    open,
});
</script>
