import type { AnyRecord } from '@kikiutils/shared/types';
import type { FormRules } from 'element-plus';

declare global {
    type ElFormRules<T extends MaybeRef<AnyRecord | string>> = FormRules<T>;

    interface ElTreeNode {
        children?: ElTreeNode[];
        label: null | string;
        value: string;
    }
}
