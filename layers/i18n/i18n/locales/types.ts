export interface LocaleMessages {}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends LocaleMessages {}
}
