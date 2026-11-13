import type {
    ElMessageBoxOptions,
    FormInstance,
} from 'element-plus';
import type {
    Except,
    Promisable,
} from 'type-fest';

import { getApiErrorData } from '@/libs/api/error-data';
import type { ApiResponseEnvelope } from '@/types/api';

interface ElMessageBoxConfirmHandlerOptions<T> {
    boxOptions?: Except<ElMessageBoxOptions, 'beforeClose'>;

    /**
     * Runs on confirm: `true` closes the box and calls `onSuccess`; anything else (`false` or a reason) calls
     * `onFailed`.
     */
    confirm: (data: T) => Promise<boolean | string>;
    loadingText: string;
    message: ((data: T) => string) | string;
    onCancel?: (data: T) => Promisable<any>;
    onFailed?: (data: T, done: () => void, reason?: false | string) => Promisable<any>;
    onSuccess?: (data: T) => Promisable<any>;
}

// Functions
export function createElMessageBoxConfirmHandler<T = any>(options: ElMessageBoxConfirmHandlerOptions<T>) {
    return (data: T) => {
        void ElMessageBox.confirm(
            typeof options.message === 'function' ? options.message(data) : options.message,
            {
                beforeClose(action, instance, done) {
                    if (instance.confirmButtonLoading) return;
                    if (action !== 'confirm') {
                        void options.onCancel?.(data);
                        return done();
                    }

                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = options.loadingText;
                    instance.showCancelButton = false;

                    void options.confirm(data).then(async (confirmResult) => {
                        if (confirmResult === true) {
                            done();
                            await options.onSuccess?.(data);
                        } else {
                            await options.onFailed?.(data, done, confirmResult);
                            instance.confirmButtonLoading = false;
                            instance.confirmButtonText = '確定';
                            instance.showCancelButton = true;
                        }
                    });
                },
                confirmButtonClass: 'el-message-box-confirm-btn',
                draggable: true,
                ...options.boxOptions,
            },
        );
    };
}

/**
 * Shows the field errors of a failed response on the form items: `validationFailed` issues by `path` (falling back to
 * the closest parent item, e.g. `ipEntries.2` on `ipEntries`) and `duplicateKey` fields. Only the first error of each
 * item is shown; the default error notification still reports the failure.
 */
export function showElFormApiFieldErrors(form: FormInstance | null | undefined, responseData: ApiResponseEnvelope) {
    if (!form || responseData.success) return;
    const shownProps = new Set<string>();
    const setFieldError = (path: ReadonlyArray<number | string>, message: string) => {
        for (let length = path.length; length > 0; length--) {
            const prop = path.slice(0, length).join('.');
            const field = form.getField(prop);
            if (!field) continue;
            if (shownProps.has(prop)) return;
            shownProps.add(prop);
            field.validateState = 'error';
            field.validateMessage = message;
            return;
        }
    };

    getApiErrorData(responseData, 'validationFailed')?.issues.forEach((issue) => setFieldError(issue.path, issue.message));
    getApiErrorData(responseData, 'duplicateKey')?.fields.forEach((field) => setFieldError([field], responseData.message));
}
