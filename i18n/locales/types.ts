export interface CommonLocaleMessages {
    actions: string;
    cancel: string;
    search: string;
}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends CommonLocaleMessages {}
}
