import type { AppLocaleMessages } from '../types';

export default {
    common: {
        account: '帳號',
        actions: '操作',
        cancel: '取消',
        login: '登入',
        logout: '登出',
        password: '密碼',
        search: '搜尋',
    },
    errors: {
        aborted: '請求已取消',
        invalidResponse: '伺服器回應異常',
        networkError: '請檢查網路連線',
    },
    pages: {
        auth: {
            login: {
                qrCodeLogin: 'QR Code登入',
                title: '總後台登入',
            },
        },
    },
} satisfies AppLocaleMessages;
