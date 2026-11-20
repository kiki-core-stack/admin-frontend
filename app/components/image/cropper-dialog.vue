<template>
    <el-dialog
        v-model="isVisible"
        title="裁切圖片"
        :width="elDialogWidthByWindowSize"
        align-center
        append-to-body
        destroy-on-close
        @closed="onDialogClosed"
        @opened="initializeCropper"
    >
        <div
            ref="cropperContainerRef"
            class="image-cropper-container w-full overflow-hidden"
        />
        <template #footer>
            <el-button @click="close">
                取消
            </el-button>
            <el-button @click="keepOriginal">
                使用原圖
            </el-button>
            <el-button
                type="primary"
                :loading="isCropping"
                @click="cropImage"
            >
                套用裁切
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import Cropper from 'cropperjs';

interface Props {
    source: File | null;
}

interface SelectionRect {
    height: number;
    width: number;
    x: number;
    y: number;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'closed'): void;
    (e: 'cropped', file: File): void;
}>();

// Constants/Refs/Variables
let cropper: Cropper | null = null;
const cropperContainerRef = useTemplateRef('cropperContainerRef');
const isCropping = ref(false);
const isVisible = ref(false);
let sourceUrl: string | undefined;

// Functions
function close() {
    isVisible.value = false;
}

async function cropImage() {
    if (isCropping.value) return;

    const cropperCanvas = cropper?.getCropperCanvas();
    const cropperImage = cropper?.getCropperImage();
    const selection = cropper?.getCropperSelection();
    if (!cropperCanvas || !cropperImage || !selection) return ElNotification.error('圖片裁切區域尚未準備完成');

    const imageBounds = getRelativeRect(cropperImage, cropperCanvas);
    // Selecting the whole image changes nothing; keep the original instead of re-encoding it through a canvas.
    if (selection.width >= imageBounds.width - 1 && selection.height >= imageBounds.height - 1) return keepOriginal();
    isCropping.value = true;
    try {
        const outputWidth = Math.round(selection.width * cropperImage.$image.naturalWidth / imageBounds.width);
        const outputHeight = Math.round(selection.height * cropperImage.$image.naturalHeight / imageBounds.height);
        const canvas = await selection.$toCanvas({
            height: outputHeight,
            width: outputWidth,
        });

        const outputType = props.source?.type || 'image/png';

        const outputQuality = outputType === 'image/jpeg' || outputType === 'image/webp'
            ? 0.95
            : undefined;

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, outputType, outputQuality);
        });

        if (!blob) return ElNotification.error('圖片裁切失敗');
        emit('cropped', new File([blob], '', { type: blob.type }));
        close();
    } catch (error) {
        console.error('圖片裁切失敗', error);
        ElNotification.error('圖片裁切失敗');
    } finally {
        isCropping.value = false;
    }
}

function destroyCropper() {
    cropper?.destroy();
    cropper = null;
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = undefined;
}

function getRelativeRect(element: Element, container: Element): SelectionRect {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
        height: elementRect.height,
        width: elementRect.width,
        x: elementRect.left - containerRect.left,
        y: elementRect.top - containerRect.top,
    };
}

async function initializeCropper() {
    destroyCropper();

    const container = cropperContainerRef.value;
    if (!container || !props.source) return;
    sourceUrl = URL.createObjectURL(props.source);
    const image = new Image();
    image.alt = '待裁切圖片';
    image.src = sourceUrl;

    const initializedCropper = new Cropper(image, { container });
    cropper = initializedCropper;

    const cropperImage = initializedCropper.getCropperImage();
    const selection = initializedCropper.getCropperSelection();
    if (!cropperImage || !selection) return;

    cropperImage.rotatable = false;
    cropperImage.scalable = false;
    cropperImage.skewable = false;
    cropperImage.translatable = false;
    selection.precise = true;
    selection.addEventListener('change', onCropperSelectionChange);

    try {
        await cropperImage.$ready();
        if (cropper !== initializedCropper) return;

        const imageRect = getRelativeRect(cropperImage, container);
        selection.$change(
            imageRect.x,
            imageRect.y,
            imageRect.width,
            imageRect.height,
        );
    } catch (error) {
        console.error('圖片載入失敗', error);
        ElNotification.error('圖片載入失敗');
    }
}

function isSelectionWithinImage(selection: SelectionRect, imageBounds: SelectionRect) {
    return selection.x >= imageBounds.x
      && selection.y >= imageBounds.y
      && selection.x + selection.width <= imageBounds.x + imageBounds.width
      && selection.y + selection.height <= imageBounds.y + imageBounds.height;
}

function keepOriginal() {
    if (!props.source) return;
    emit('cropped', props.source);
    close();
}

function onCropperSelectionChange(event: Event) {
    const cropperCanvas = cropper?.getCropperCanvas();
    const cropperImage = cropper?.getCropperImage();
    const selection = (event as CustomEvent<SelectionRect>).detail;
    if (!cropperCanvas || !cropperImage || !selection) return;

    const imageBounds = getRelativeRect(cropperImage, cropperCanvas);
    if (!isSelectionWithinImage(selection, imageBounds)) event.preventDefault();
}

function onDialogClosed() {
    destroyCropper();
    emit('closed');
}

function open() {
    isVisible.value = true;
}

// Hooks
onBeforeUnmount(destroyCropper);

// Exposes
defineExpose({
    close,
    open,
});
</script>

<style lang="scss" scoped>
.image-cropper-container {
    height: min(65vh, 560px);
    min-height: 280px;
    background-color: var(--el-fill-color-darker);
}

:deep(cropper-canvas) {
    width: 100%;
    height: 100%;
}
</style>
