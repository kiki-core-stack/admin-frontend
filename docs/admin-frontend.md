# admin-frontend 架構

總管理後台前端（Nuxt、Element Plus），對接 management-backend 的 `/api/admin/*`。由 nuxt-template 合併而來；共用規則（API 回應格式、錯誤碼、多語系、權限）見 [pack docs](https://github.com/kiki-core-stack/pack/blob/main/docs/pack.md)。

## 啟動

1. `.env.development.local` 由 main 的開發 profile 產生，不要手改；`API_BASE_URL`（management-backend 的 origin，不含 `/api`）只有產生腳本使用。
2. 頁面中的請求一律打同源的 `/api/...`，前端本身不做 proxy；開發與部署都需要前面有反向代理把 `/api` 轉給 management-backend、其餘轉給前端（main 的 gateway，開發時為 dev gateway）。
3. 先啟動 management-backend，再 `pnpm dev`：會先以 bun 執行 `scripts/generate-files.ts` 從後端產生 `app/generated/`，再啟動 Nuxt。
4. 型別檢查用 `pnpm typecheck`（根 `tsconfig.json` 只有 references，`vue-tsc --noEmit` 不會檢查任何檔案）。

## 結構

- app/generated/：由後端產生的錯誤碼與權限，不可手改；有進版控，後端新增錯誤碼或權限後重新跑 dev 並 commit。
- app/plugins/：`load-profile` → `auth-redirect` → `initialize-session`，順序由 `nuxt.config.ts` 的 `plugins` 指定（導向與連線都依賴先載入的個人資料）。
- layers/i18n/i18n/locales/：除了介面文字，也併入 pack 的 `enums`、`apiClientErrors` 與產生的權限名稱；API 錯誤與驗證訊息由後端翻好，不放這裡。元件外（axios 攔截器等）用 `useNuxtApp().$i18n`。

## API 呼叫

- API 不拋錯，一律回傳 axios response，`response.data` 是 envelope：
  - 成功：`response.data.success === true`，資料在 `response.data.data`。
  - 失敗：`response.data.errorCode` 判斷原因；`response.data.message` 是後端翻好的訊息（攔截器已預設顯示，請求選項 `silent` 可關閉）。
- 表單送出失敗時呼叫 `showElFormApiFieldErrors(formRef, response.data)`，把後端的欄位錯誤標到對應的 `el-form-item`（`prop` 需與後端欄位路徑一致）。
- 前端表單只保留必填與「確認密碼一致」等 UI 規則；格式、長度等以後端為準。

## 登入與驗證身分

後端行為見 pack 的 `docs/auth.md`。

- 頁面：
  - `/auth/second-factor-setup/`：必須使用雙重驗證但尚未綁定的帳號（個人資料 `restricted` 為 true）只能停在這頁綁定驗證器或密碼金鑰，完成後才進入系統。
  - `/auth/qr-code-login/#<qrToken>`：已登入裝置核准或拒絕 QR Code 登入。登入頁的 QR Code 內容就是這個網址，手機相機或「登入裝置」頁的掃描對話框都會開到這頁。token 只放在網址 fragment，離開前移到 sessionStorage，避免進到 `redirect` query 被送到伺服器。
  - 管理員管理的「安全性」對話框（`principal-security-dialog.vue` 各 realm 共用，後端需在 `<apiBasePath>/<id>/security` 下提供 pack 的管理路由與 `event/list`）。
- 驗證身分由 API 層統一處理，頁面不需要知道哪些操作需要驗證：
  - 後端回 `verificationRequired` 時，`errorData` 帶有操作名稱與帳號可用的因子；攔截器開啟驗證對話框，驗證成功後把一次性憑據放進 `X-Auth-Verification` 標頭重送原請求，呼叫端拿到的是重送後的結果。
  - 使用者取消驗證時，呼叫端拿到 `errorCode === 'verificationRequired'` 的失敗回應且不會顯示錯誤通知，當作使用者取消處理。
- 使用者自己登出或變更密碼時，先以 `expectSessionEnd` 標記，讓隨後的強制登出通知或 401 不被當成意外登出。

## 圖片欄位

- `el-form-image` 的 GIF 不裁切以保留動畫，需設定 `allowGif`，上傳時也要帶 `allowGif`。表單項目的 `prop` 是後端的 File id 欄位，是否已選圖片由元件自己檢查。

## 新增頁面

除了 API 類別與頁面，選單與需要的權限要加在 `app/constants/sidebar.ts`。
