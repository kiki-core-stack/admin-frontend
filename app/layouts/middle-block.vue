<template>
    <div class="fixed inset-0 grid overflow-auto bg-[#f5f5f5] dark:bg-[#2c2c2c]">
        <div class="flex-middle page-container p-4">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-container > :deep(:first-child) {
    @apply dark:bg-dark rounded-[10px] relative flex flex-col items-center overflow-hidden bg-white p-4 text-center;

    box-shadow: 1px 2px 12px 0 rgb(0 0 0 / 25%);
}
</style>
