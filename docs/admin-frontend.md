# admin-frontend 架構

總管理後台前端（Nuxt、Element Plus），對接 management-backend 的 `/api/admin/*`。由 nuxt-template 合併而來；共用規則（API 回應格式、錯誤碼、多語系、權限）見 pack README。

## 啟動

1. 複製 `.env.development` 為 `.env.development.local`，設定 `API_BASE_URL`：management-backend 的 origin（例如 `http://127.0.0.1:8080`），不含 `/api`（產生腳本會自己接上路由路徑）。只有產生腳本使用。
2. 頁面中的請求一律打同源的 `/api/...`，前端本身不做 proxy；開發與部署都需要前面有反向代理把 `/api` 轉給 management-backend、其餘轉給前端（main 的 gateway，開發時為 dev gateway）。
3. 先啟動 management-backend，再 `pnpm dev`：會先執行 `scripts/generate-files.ts` 從後端產生 `app/generated/`，再啟動 Nuxt。
4. 型別檢查用 `pnpm typecheck`（根 `tsconfig.json` 只有 references，`vue-tsc --noEmit` 不會檢查任何檔案）。

## 結構

- app/generated/：由後端產生，有進版控；後端新增錯誤碼或權限後重新跑 dev 並 commit。
  - api-error-code.ts：`ApiErrorCode`。
  - admin/permission.ts：權限群組、key、型別、各語系名稱、依賴表。
- app/globals/：自動匯入。
  - apis/：每個資源一個 API 類別（繼承 `BaseApi` 或 `BaseCrudApi`），以 `XxxApi.use()` 取得實例。
  - libs/api/：`BaseApi`（請求、查詢 filter 序列化）、`BaseCrudApi`（`create`、`update(row, data)`、`delete`、`getList`、`setBooleanField`；`serializeInput` 轉換送出的表單資料）。
  - libs/permission.ts：`hasPermission`、`isAdminPermissionKey`。
  - libs/element-plus.ts：`createElMessageBoxConfirmHandler`、`showElFormApiFieldErrors`。
- app/libs/：需明確 import 的內部實作。
  - api/instance.ts：axios 實例；帶上 `Accept-Language`、把失敗統一成 envelope、預設顯示錯誤通知（`silent` 可關閉）、需登入時導向登入頁。
  - api/error-data.ts：`getApiErrorData(responseData, code)` 取得有型別的 `errorData`；本後端自訂的 errorData 型別加在 `ApiErrorDataMap`。
- app/components/：
  - data-table-page/：列表頁元件（`index.vue`）與新增／編輯對話框（`form-dialog.vue`）。
  - admin/permission-picker.vue：身分組的權限選擇。
  - el/、selector/、filter/：Element Plus 包裝、資料選擇器、篩選表單。
- app/composables/i18n.ts：`use$t`、`localize(messages)`（取 pack 與產生檔的多語系文字）。
- app/types/：`api.ts`（`ApiRequestResult`、`ApiResponseEnvelope`）、`data/`（各資源的表單與 filter 型別）、`index.ts`（全域 `CrudFormData`）、`axios.ts`（`silent` 等請求選項）。
- app/constants/sidebar.ts：側邊選單與各項目需要的權限。
- i18n/locales/：介面文字；錯誤、驗證、enum 與權限名稱由後端或 pack 提供，不放這裡。

## API 呼叫

- API 不拋錯，一律回傳 axios response，`response.data` 是 envelope：
  - 成功：`response.data.success === true`，資料在 `response.data.data`。
  - 失敗：`response.data.errorCode` 判斷原因；`response.data.message` 是後端翻好的訊息（攔截器已預設顯示）。
- 表單送出失敗時呼叫 `showElFormApiFieldErrors(formRef, response.data)`，把後端的欄位錯誤標到對應的 `el-form-item`（`prop` 需與後端欄位路徑一致）。
- 前端表單只保留必填與「確認密碼一致」等 UI 規則；格式、長度等以後端為準。

## data-table-page

```vue
<data-table-page
    v-model:form-data="formData"
    title="..."
    :crud-api="XxxApi.use()"
    :form-rules="formRules"
    permission-group="email.provider"
>
    <template #table>...</template>
    <template #form="{ editingRow }">...</template>
</data-table-page>
```

- `permission-group` 為權限群組，各動作需要 `<group>.<action>`（不在權限清單內的動作視為無權限）；`ignore` 不檢查。頁面自訂的按鈕以 ref 的 `can('<action>')` 判斷（例如 `can('toggle')`）。
- 不傳 `formData` 時沒有新增、編輯與對話框；`hide-*` 可隱藏內建按鈕，改用 slot 放自訂按鈕。
- `formData` 須在 setup 時提供完整欄位（`CrudFormData<T>`，不含 `id`）；每次開啟都從這份預設值建立，編輯時只取 row 中表單有的欄位。編輯模式以 slot 的 `editingRow` 判斷。

## 新增頁面

1. 在 `app/globals/apis/` 建立 API 類別（無表單的資源第二個 generic 寫 `never`）。
2. 在 `app/pages/` 建立頁面，多半直接使用 data-table-page。
3. 在 `app/constants/sidebar.ts` 加上選單與需要的權限。
