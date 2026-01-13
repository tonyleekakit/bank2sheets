# BANK2SHEETS - 部署指南

恭喜！您的專案架構已經升級。現在我們需要將其部署上線。

## 步驟 1: 推送到 GitHub

由於我無法直接存取您的 GitHub 帳號，請您手動執行以下步驟：

1.  登入您的 [GitHub](https://github.com/)。
2.  建立一個新的 Repository (倉庫)，命名為 `bank2sheets`。
3.  在您的電腦終端機 (Terminal) 執行以下指令 (請確保您在專案資料夾內)：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bank2sheets.git
git push -u origin main
```
*(請將 YOUR_USERNAME 換成您的 GitHub 用戶名)*

## 步驟 2: 連接 Cloudflare Pages

1.  登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  點擊左側選單的 **Workers & Pages**。
3.  點擊 **Create application** -> **Pages** -> **Connect to Git**。
4.  選擇您剛才建立的 `bank2sheets` repository。
5.  **設定構建 (Build settings)**:
    *   **Framework preset**: 選擇 `Vite`
    *   **Build command**: `npm run build`
    *   **Output directory**: `dist`
6.  點擊 **Save and Deploy**。

## 步驟 3: Supabase 設定

我們稍後會需要這些金鑰，請先準備好：
1.  登入 Supabase。
2.  建立新專案 `bank2sheets`。
3.  記下 **Project URL** 和 **API Key (anon/public)**。

---
完成以上步驟後，您的網站就正式上線了！
