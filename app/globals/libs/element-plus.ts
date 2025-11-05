import type { ElMessageBoxOptions } from 'element-plus';
import type {
    Except,
    Promisable,
} from 'type-fest';

export function createElMessageBoxConfirmHandler<T = any>(
    messageRender: ((data: T) => string) | string,
    loadingText: string,
    handleConfirm: (data: T) => Promise<boolean | string>,
    onSuccess?: (data: T) => Promisable<any>,
    onFailed?: (data: T, done: () => void, reason?: false | string) => Promisable<any>,
    onCancel?: (data: T) => Promisable<any>,
    options?: Except<ElMessageBoxOptions, 'beforeClose'>,
) {
    return (data: T) => {
        ElMessageBox.confirm(
            typeof messageRender === 'function' ? messageRender(data) : messageRender,
            {
                async beforeClose(action, instance, done) {
                    if (instance.confirmButtonLoading) return;
                    if (action !== 'confirm') {
                        onCancel?.(data);
                        return done();
                    }

                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = loadingText;
                    instance.showCancelButton = false;

                    const confirmResult = await handleConfirm(data);
                    if (typeof confirmResult === 'boolean' && confirmResult) {
                        done();
                        await onSuccess?.(data);
                    } else {
                        await onFailed?.(data, done, confirmResult);
                        instance.confirmButtonLoading = false;
                        instance.confirmButtonText = '確定';
                        instance.showCancelButton = true;
                    }
                },
                confirmButtonClass: 'el-message-box-confirm-btn',
                draggable: true,
                ...options,
            },
        );
    };
}
