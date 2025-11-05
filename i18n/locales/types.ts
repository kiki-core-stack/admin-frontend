export interface CommonLocaleMessages {
    account: string;
    actions: string;
    cancel: string;
    login: string;
    password: string;
    search: string;
    verCode: string;
}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends CommonLocaleMessages {}
}
