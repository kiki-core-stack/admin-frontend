function normalizeConfigFormData<T extends Record<string, any>>(defaults: T, value: Record<string, any>): T {
    const config = cloneDeep(defaults);
    for (const key in config) {
        const incomingValue = value[key];
        if (incomingValue === undefined) continue;
        config[key] = isPlainObject(config[key]) && isPlainObject(incomingValue)
            ? normalizeConfigFormData(config[key], incomingValue)
            : cloneDeep(incomingValue);
    }

    return config;
}

export function useConfigFormModel<T extends Record<string, any>>(
    props: { modelValue: Record<string, any> },
    emit: (event: 'update:modelValue', config: T) => void,
    defaultConfig: T,
) {
    const normalizedConfig = computed(() => normalizeConfigFormData(defaultConfig, props.modelValue));
    const emitConfig = (event: 'update:modelValue', config: T) => emit(event, cloneDeep(config));
    const config = useVModel(
        {
            get modelValue() {
                return normalizedConfig.value;
            },
        },
        'modelValue',
        emitConfig,
        {
            clone: cloneDeep,
            deep: true,
            passive: true,
        },
    );

    watch(
        () => props.modelValue,
        (value) => {
            if (!isEqual(value, normalizedConfig.value)) emitConfig('update:modelValue', normalizedConfig.value);
        },
        {
            deep: true,
            immediate: true,
        },
    );

    return config;
}
