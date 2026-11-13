import type { FormRules } from 'element-plus';

declare global {
    type ElFormRules<T extends MaybeRef<Record<string, any> | string>> = FormRules<T>;
}
