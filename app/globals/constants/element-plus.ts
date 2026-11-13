const windowSize = useWindowSize();

export const elDialogWidthByWindowSize = computed(() => {
    if (windowSize.width.value <= windowSize.height.value) return '95vw';
    if (windowSize.width.value * 0.5 < 700) return '75vw';
    return '50vw';
});
