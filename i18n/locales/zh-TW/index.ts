import type { AppLocaleMessages } from '../types';

export default defineI18nLocale<AppLocaleMessages>(() => ({
    common: {
        account: '帳號',
        actions: '操作',
        cancel: '取消',
        login: '登入',
        logout: '登出',
        password: '密碼',
        search: '搜尋',
        verCode: '驗證碼',
    },
    errors: {
        apiResponse: {
            code: {
                badRequest: '資料格式錯誤或是非法操作',
                conflict: '欄位值重複或是該資料使用中',
                forbidden: '沒有權限',
                gatewayTimeout: '超時',
                gone: '資料已過期或被刪除',
                internalServerError: '系統錯誤',
                invalidVerificationCode: '驗證碼錯誤',
                notFound: '找不到資料',
                payloadTooLarge: '檔案大小超出限制',
                serviceUnavailable: '系統維護中',
                tooManyRequests: '請求過於頻繁',
                unauthorized: '尚未登入',
                validationFailed: '資料格式錯誤',
            },
        },
    },
    messages: { pleaseCheckNetwork: '請檢查網路連線' },
    pages: {
        auth: {
            login: {
                qrCodeLogin: 'QR Code登入',
                title: '總後台登入',
            },
        },
    },
}));
