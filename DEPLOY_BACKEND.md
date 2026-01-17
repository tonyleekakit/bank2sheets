# 部署後端到 Google Cloud Run

由於您的專案後端是使用 Python Flask 並包含 Dockerfile，我們將使用 Google Cloud Run 進行部署。

## 前置準備

1.  **安裝 Google Cloud SDK**: 確保您的電腦已安裝 gcloud CLI。
2.  **登入 Google Cloud**:
    在終端機執行：
    ```bash
    gcloud auth login
    ```
3.  **設定專案**:
    ```bash
    gcloud config set project bank2sheets-484102
    ```
    *(請確認 `bank2sheets-484102` 是否為您正確的 GCP Project ID，若不是請自行替換)*

## 部署步驟

1.  **切換到 backend 目錄**:
    ```bash
    cd backend
    ```

2.  **執行部署指令**:
    將 `<SERVICE_NAME>` 替換為您的服務名稱 (例如 `bank2sheets-converter`)。
    
    ```bash
    gcloud run deploy bank2sheets-converter --source . --region asia-east1 --allow-unauthenticated
    ```

    *   `--source .`: 表示使用當前目錄的程式碼進行構建 (會自動使用 Dockerfile)。
    *   `--region asia-east1`: 設定部署區域為台灣/亞洲 (根據您的前端 URL 推測)。
    *   `--allow-unauthenticated`: 允許公開訪問 (因為這是對外的 API)。

3.  **設定環境變數 (Environment Variables)**:
    您的後端需要連接 Supabase 和 Stripe，因此需要設定環境變數。您可以在部署時加上 `--set-env-vars` 參數，或是在 Google Cloud Console 介面上設定。

    需要設定的變數如下 (請填入實際的值)：
    *   `SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `STRIPE_API_KEY`
    *   `STRIPE_WEBHOOK_SECRET`
    *   `GCP_PROJECT_ID`
    *   `DOCAI_LOCATION` (例如 `us` 或 `eu`)
    *   `DOCAI_PROCESSOR_ID`

    **指令範例**:
    ```bash
    gcloud run deploy bank2sheets-converter \
      --source . \
      --region asia-east1 \
      --allow-unauthenticated \
      --set-env-vars "SUPABASE_URL=xxx,SUPABASE_SERVICE_ROLE_KEY=xxx,..."
    ```

## 常見問題

*   **權限錯誤**: 如果遇到 PowerShell 腳本執行錯誤 (UnauthorizedAccess)，請嘗試以管理員身分執行 PowerShell，並輸入 `Set-ExecutionPolicy RemoteSigned`，或者改用 Command Prompt (cmd) 執行指令。
*   **缺少 Document AI 權限**: 確保 Cloud Run 的 Service Account 擁有 `Document AI API User` 角色。
