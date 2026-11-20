<template>
    <el-form-item
        ref="formItemRef"
        :rules="rules"
    >
        <input
            ref="fileInputRef"
            class="hidden"
            type="file"
            :accept="[...allowedMimeTypes].join(',')"
            @change="onFileSelected"
        >
        <div
            ref="dropZoneRef"
            class="
                b
                b-dashed
                b-gray-300
                max-w-300px
                relative
                size-full
                cursor-pointer
                overflow-hidden
                rounded-[10px]
                bg-gray-50
                dark:bg-gray-800
            "
            @click="fileInputRef?.click()"
        >
            <div
                v-if="isOverDropZone"
                class="
                    flex-middle
                    absolute
                    inset-0
                    m-1
                    rounded-[10px]
                    bg-white/70
                    text-xl
                    dark:bg-black/80
                "
            >
                放開以選擇圖片
            </div>
            <div
                v-if="imageSrc"
                class="group"
            >
                <img
                    class="size-full object-cover"
                    :src="imageSrc"
                >
                <div
                    class="
                        flex-middle
                        absolute
                        inset-0
                        flex-col
                        bg-white/70
                        opacity-0
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                        dark:bg-black/80
                    "
                >
                    <nuxt-icon
                        class="text-4xl"
                        name="mdi:image-plus"
                    />
                    <span class="mt-1 text-lg">更換圖片</span>
                </div>
            </div>
            <div
                v-else
                class="flex-middle h-50 w-full flex-col text-gray-500 dark:text-gray-400"
            >
                <nuxt-icon
                    class="text-4xl"
                    name="mdi:image-plus"
                />
                <span class="mt-1 text-lg">選擇圖片</span>
            </div>
            <el-button
                v-if="canRemove && imageSrc"
                class="absolute top-1 right-1"
                type="danger"
                @click.stop="remove"
            >
                <nuxt-icon
                    class="text-lg"
                    name="mdi:trash"
                />
            </el-button>
        </div>
    </el-form-item>
    <image-cropper-dialog
        ref="imageCropperDialogRef"
        :source="pendingFile"
        @closed="pendingFile = null"
        @cropped="onImageCropped"
    />
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'element-plus';

import { defaultMaxImageFileSize } from '@/constants/upload';

interface Props {
    /**
     * Also accepts GIF, which skips cropping to keep the animation; upload it with `allowGif` as well.
     */
    allowGif?: boolean;
    canRemove?: boolean;
    initialImageFileId?: string;
    required?: boolean;
}

// Define props, models and emits
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'remove'): void }>();
const file = defineModel<File | null>('file');

// Constants/Refs/Variables
const dropZoneRef = useTemplateRef('dropZoneRef');
const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop: (files) => prepareFileForCropping(files?.[0]) });
const fileInputRef = useTemplateRef('fileInputRef');
const formItemRef = useTemplateRef('formItemRef');
const imageCropperDialogRef = useTemplateRef('imageCropperDialogRef');
const fileObjectUrl = useObjectUrl(file);
const pendingFile = ref<File | null>(null);

// Computed properties
const allowedMimeTypes = computed(() => new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    ...props.allowGif ? ['image/gif'] : [],
]));

// The form item's `prop` is the backend field (the file id), so whether an image is chosen is checked here instead.
const rules = computed<FormItemRule[]>(() => [
    {
        required: props.required,
        validator(_, __, callback) {
            if (props.required && !file.value && !props.initialImageFileId) return callback(new Error('請選擇圖片'));
            callback();
        },
    },
]);

const imageSrc = computed(() => {
    if (fileObjectUrl.value) return fileObjectUrl.value;
    if (props.initialImageFileId) return `/api/file/redirect/${props.initialImageFileId}`;
    return '';
});

// Functions
function onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;

    prepareFileForCropping(target.files?.[0]);
    target.value = '';
}

function onImageCropped(croppedFile: File) {
    file.value = croppedFile;
    pendingFile.value = null;
}

function prepareFileForCropping(fileItem: File | undefined) {
    if (!fileItem) return;
    if (!allowedMimeTypes.value.has(fileItem.type)) return ElNotification.error('不支援的檔案類型');
    if (fileItem.size > defaultMaxImageFileSize) {
        return ElNotification.error(`圖片不能超過 ${defaultMaxImageFileSize / 1024 / 1024}MB`);
    }

    // Cropping goes through a canvas, which drops the animation.
    if (fileItem.type === 'image/gif') {
        file.value = fileItem;
        return;
    }

    pendingFile.value = fileItem;
    imageCropperDialogRef.value?.open();
}

function remove() {
    file.value = null;
    emit('remove');
}

// Hooks
// Clears the "choose an image" error once a file is chosen; reopening the form (file reset to null) shows no error.
watch(file, (value) => value && formItemRef.value?.clearValidate());
</script>
