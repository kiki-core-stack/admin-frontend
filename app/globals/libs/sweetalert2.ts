import swal from 'sweetalert2';
import type { SweetAlertOptions } from 'sweetalert2';

const customSweetAlert = swal.mixin({
    buttonsStyling: false,
    confirmButtonText: '確認',
    padding: '1rem',
});

export const closeAlert = customSweetAlert.close;

export function showErrorAlert(title: string, options?: SweetAlertOptions) {
    customSweetAlert.fire({
        ...options,
        customClass: {
            confirmButton: 'el-button el-button--danger',
            ...options?.customClass,
        },
        icon: 'error',
        title,
    });
}

export function showLoadingAlert(title: string = '載入中...', options?: SweetAlertOptions) {
    customSweetAlert.fire({
        ...options,
        allowEscapeKey: false,
        allowOutsideClick: false,
        customClass: {
            ...options?.customClass,
            actions: 'mt-4',
        },
        didOpen: () => customSweetAlert.showLoading(),
        title,
    });
}

export function showSuccessAlert(title: string, options?: SweetAlertOptions) {
    customSweetAlert.fire({
        ...options,
        customClass: {
            ...options?.customClass,
            confirmButton: 'el-button el-button--success',
        },
        icon: 'success',
        title,
    });
}
