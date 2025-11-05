import type { FormItemRule } from 'element-plus';

const windowSize = useWindowSize();

export const commonElFormItemRules = {
    adminPassword: <readonly FormItemRule[]>[
        {
            message: '密碼不能以空白開頭或結尾',
            pattern: /^\S(?:.*\S)?$/,
        },
        {
            message: '密碼至少包含一個大寫字母',
            pattern: /[A-Z]/,
        },
        {
            message: '密碼至少包含一個小寫字母',
            pattern: /[a-z]/,
        },
        {
            message: '密碼至少包含一個數字',
            pattern: /\d/,
        },
        {
            message: '密碼至少包含一個特殊字元（可為符號、表情符號、中文等）',
            pattern: /[^0-9a-z]/i,
        },
        {
            message: '密碼長度至少12個字元',
            min: 12,
        },
    ],
} as const;

export const elDialogWidthByWindowSize = computed(() => {
    if (windowSize.width.value <= windowSize.height.value) return '95vw';
    if (windowSize.width.value * 0.5 < 700) return '75vw';
    return '50vw';
});
