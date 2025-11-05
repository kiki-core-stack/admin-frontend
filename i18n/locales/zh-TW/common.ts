import type { CommonLocaleMessages } from '../types';

export default defineI18nLocale<CommonLocaleMessages>(() => ({
    account: '帳號',
    actions: '操作',
    cancel: '取消',
    login: '登入',
    password: '密碼',
    search: '搜尋',
    verCode: '驗證碼',
} satisfies CommonLocaleMessages));
