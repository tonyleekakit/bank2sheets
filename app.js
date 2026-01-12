import { supabase } from './supabaseClient.js';

// ==================== Toast Notification System ====================
function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ==================== Progress Bar Functions ====================
function showProgress() {
    const container = document.getElementById('progress-container');
    if (container) container.style.display = 'block';
}

function hideProgress() {
    const container = document.getElementById('progress-container');
    if (container) container.style.display = 'none';
}

function updateProgress(percent, text = '') {
    const fill = document.getElementById('progress-fill');
    const textEl = document.getElementById('progress-text');
    if (fill) fill.style.width = `${percent}%`;
    if (textEl) {
        textEl.textContent = text || `${percent}%`;
    }
}

// ==================== File Size Validation ====================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFileSize(file) {
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `檔案大小超過限制 (最大 10MB)`
        };
    }
    return { valid: true };
}

// ==================== PDF Preview Functions ====================
async function previewPDF(file) {
    const container = document.getElementById('file-preview-container');
    const canvas = document.getElementById('pdf-preview');
    const filenameEl = document.getElementById('preview-filename');
    
    if (!container || !canvas || !filenameEl) return;

    try {
        // Wait for PDF.js to load
        if (typeof pdfjsLib === 'undefined') {
            await new Promise((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    if (typeof pdfjsLib !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkInterval);
                    reject(new Error('PDF.js failed to load'));
                }, 5000);
            });
        }
        
        // Set PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext('2d');
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        filenameEl.textContent = file.name;
        container.style.display = 'block';
    } catch (error) {
        console.error('PDF preview error:', error);
        // Don't show error toast if PDF.js is not loaded yet, just skip preview
        if (error.message !== 'PDF.js failed to load') {
            showToast('無法預覽 PDF 檔案', 'error');
        }
    }
}

function removeFilePreview() {
    const container = document.getElementById('file-preview-container');
    const fileInput = document.getElementById('file-input');
    if (container) container.style.display = 'none';
    if (fileInput) fileInput.value = '';
}

// ==================== Quota Management ====================
async function updateQuotaDisplay() {
    const quotaDisplay = document.getElementById('quota-display');
    const quotaCount = document.getElementById('quota-count');
    
    if (!quotaDisplay || !quotaCount) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // TODO: Fetch actual quota from backend
        // For now, show placeholder
        quotaDisplay.style.display = 'flex';
        quotaCount.textContent = '5'; // Placeholder
    } else {
        quotaDisplay.style.display = 'none';
    }
}

// ==================== Conversion History ====================
async function loadConversionHistory() {
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    
    if (!historySection || !historyList) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        historySection.style.display = 'none';
        return;
    }

    historySection.style.display = 'block';
    
    // TODO: Fetch actual history from backend
    // For now, show empty state
    historyList.innerHTML = `
        <div class="history-empty">
            <div class="history-empty-icon">📄</div>
            <p data-i18n="history_empty">暫無轉換記錄</p>
        </div>
    `;
    
    // Apply translations
    const emptyText = document.querySelector('[data-i18n="history_empty"]');
    if (emptyText && translations[currentLang]) {
        emptyText.textContent = translations[currentLang]['history_empty'] || '暫無轉換記錄';
    }
}

// ==================== Excel Preview ====================
async function previewExcel(url) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.id = 'excel-preview-modal';
    
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-modal-header">
                <div class="preview-modal-title" data-i18n="preview_title">預覽 Excel 檔案</div>
                <button class="preview-modal-close" onclick="document.getElementById('excel-preview-modal').remove()">×</button>
            </div>
            <div class="preview-modal-body">
                <div class="preview-table-container">
                    <p data-i18n="preview_loading">正在載入預覽...</p>
                </div>
            </div>
            <div class="preview-modal-footer">
                <button class="btn btn-outline" onclick="document.getElementById('excel-preview-modal').remove()" data-i18n="close">關閉</button>
                <a href="${url}" download class="btn btn-black" data-i18n="download">下載</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('show');
    
    // Load Excel file using SheetJS (xlsx library)
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        
        // Dynamically load xlsx library
        if (typeof XLSX === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => {
                script.onload = resolve;
            });
        }
        
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(firstSheet);
        
        const container = modal.querySelector('.preview-table-container');
        container.innerHTML = html;
        
        // Apply translations
        applyTranslationsToElement(modal);
    } catch (error) {
        console.error('Excel preview error:', error);
        const container = modal.querySelector('.preview-table-container');
        container.innerHTML = '<p data-i18n="preview_error">無法載入預覽</p>';
        applyTranslationsToElement(modal);
    }
}

function applyTranslationsToElement(element) {
    if (!translations[currentLang]) return;
    element.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Language Switcher Logic
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('current-lang-text');
    
    // Initialize language from localStorage or default to 'zh'
    let currentLang = localStorage.getItem('preferredLang') || 'zh';

    const translations = {
        'zh': {
            'doc_title_home': 'BANK2SHEETS - 銀行月結單轉Excel',
            'doc_title_upgrade': '升級 - BANK2SHEETS',
            'doc_title_privacy': '私隱權政策 - BANK2SHEETS',
            'doc_title_terms': '條款及細則 - BANK2SHEETS',
            'doc_title_login': '登入 - BANK2SHEETS',
            'upgrade': '升級',
            'login': '登入',
            'logout': '登出',
            'hero_title': '首個支援中英文銀行月結單的網站',
            'hero_subtitle': '專業、準確、安全。將您的 PDF 月結單即時轉換為 Excel 格式。',
            'dropzone_title': '點擊或拖放 PDF 檔案至此處',
            'dropzone_subtitle': '支援各大銀行月結單',
            'select_file': '選擇檔案',
            'features_title': '網站優點',
            'feature1_title': '快速轉換',
            'feature1_text': '先進的 OCR 技術，幾秒鐘內完成複雜的月結單轉換，節省您寶貴的時間。',
            'feature2_title': '極高準確度',
            'feature2_text': '專為中英文混合排版優化，精準識別表格數據，減少手動修正的煩惱。',
            'feature3_title': '安全保密',
            'feature3_text': '銀行級加密傳輸，文件轉換後自動刪除，確保您的財務數據絕對安全。',
            'testimonials_title': '用家評價',
            'review1_text': '"這是我用過最好的轉換工具！以前要花幾小時手打，現在幾秒鐘就搞定，中文字識別非常準確。"',
            'review1_author': '- 陳先生, 會計師',
            'review2_text': '"BANK2SHEETS 幫了我們公司大忙。介面簡潔，操作直觀，對於處理大量銀行單據非常有幫助。"',
            'review2_author': '- 李小姐, 行政經理',
            'review3_text': '"非常專業的服務。特別喜歡它的格式保留功能，轉出來的 Excel 幾乎不用調整。"',
            'review3_author': '- David Wong, 財務顧問',
            'pricing_title': '服務計劃',
            'plan1_title': '一般用戶',
            'plan1_limit': '24小時內 1 次轉換',
            'plan1_desc': '適合偶爾需要轉換的用戶',
            'plan2_title': '註冊用戶',
            'plan2_limit': '24小時內 5 次轉換',
            'plan2_desc': '免費註冊，享受更多額度',
            'plan3_title': '升級用戶',
            'plan3_limit': '不限次數轉換',
            'plan3_desc': '專業人士的最佳選擇',
            'plan3_btn': '立即升級',
            'alert_pdf_only': '請上載 PDF 檔案格式',
            'processing': '正在處理',
            'success_msg': '成功！\n\n檔案 "{filename}" 已準備好轉換。\n(此為示範頁面，實際轉換功能需連接後端)',
            // Upgrade Page
            'upgrade_title': '升級至專業版',
            'upgrade_subtitle': '解鎖無限次轉換，提升工作效率',
            'monthly_plan': '月費計劃',
            'per_month': '/ 月',
            'unlimited_conversions': '無限次轉換',
            'priority_support': '優先客戶支援',
            'secure_encryption': '銀行級加密',
            'cancel_anytime': '隨時取消',
            'subscribe_monthly': '訂閱月費',
            'save_24': '節省 24%',
            'yearly_plan': '年費計劃',
            'per_year': '/ 年',
            'yearly_breakdown': '相當於 $18.99 / 月',
            'subscribe_yearly': '訂閱年費',
            // Footer
            'privacy_policy': '私隱權政策',
            'terms_of_service': '條款及細則',
            'contact_us': '聯絡我們',
            // Auth Page
            'login_title': '登入帳戶',
            'register_title': '註冊帳戶',
            'login_subtitle': '歡迎回來，請輸入您的資料',
            'register_subtitle': '建立新帳戶以享受更多功能',
            'email_label': '電子郵件',
            'password_label': '密碼',
            'login_btn': '登入',
            'register_btn': '註冊',
            'no_account': '還沒有帳戶？',
            'has_account': '已經有帳戶？',
            'register_link': '立即註冊',
            'login_link': '立即登入',
            'auth_success_login': '登入成功！',
            'auth_success_register': '註冊成功！請檢查您的郵箱以驗證帳戶。',
            'auth_error_generic': '發生錯誤，請稍後再試。',
            'continue_with_google': '使用 Google 帳號繼續',
            'or_email': '或使用電子郵件',
            // New features
            'remaining_quota': '剩餘轉換次數',
            'file_limit_hint': '最大檔案大小: 10MB',
            'file_too_large': '檔案大小超過 10MB，請選擇較小的檔案',
            'uploading': '上傳中',
            'converting': '轉換中',
            'conversion_complete': '轉換完成',
            'download_starting': '開始下載',
            'history_title': '轉換歷史',
            'history_empty': '暫無轉換記錄',
            'preview_title': '預覽 Excel 檔案',
            'preview_loading': '正在載入預覽...',
            'preview_error': '無法載入預覽',
            'close': '關閉',
            'download': '下載',
            'preview': '預覽',
            'remove_file': '移除檔案'
        },
        'en': {
            'doc_title_home': 'BANK2SHEETS - Convert Bank Statements to Excel',
            'doc_title_upgrade': 'Upgrade - BANK2SHEETS',
            'doc_title_privacy': 'Privacy Policy - BANK2SHEETS',
            'doc_title_terms': 'Terms of Service - BANK2SHEETS',
            'doc_title_login': 'Login - BANK2SHEETS',
            'upgrade': 'Upgrade',
            'login': 'Login',
            'logout': 'Logout',
            'hero_title': 'The First Website to Convert Chinese & English Bank Statements',
            'hero_subtitle': 'Professional, Accurate, Secure. Convert your PDF bank statements to Excel instantly.',
            'dropzone_title': 'Click or Drop PDF Files Here',
            'dropzone_subtitle': 'Supports Major Bank Statements',
            'select_file': 'Select File',
            'features_title': 'Features',
            'feature1_title': 'Fast Conversion',
            'feature1_text': 'Advanced OCR technology completes complex statement conversions in seconds, saving your valuable time.',
            'feature2_title': 'High Accuracy',
            'feature2_text': 'Optimized for mixed Chinese & English layouts, accurately identifying table data to reduce manual corrections.',
            'feature3_title': 'Secure & Confidential',
            'feature3_text': 'Bank-grade encryption, files automatically deleted after conversion, ensuring your financial data is absolutely secure.',
            'testimonials_title': 'Testimonials',
            'review1_text': '"The best tool I\'ve used! Used to take hours, now done in seconds. Chinese recognition is very accurate."',
            'review1_author': '- Mr. Chan, Accountant',
            'review2_text': '"BANK2SHEETS helped us a lot. Clean interface, intuitive operation, very helpful for processing large amounts of statements."',
            'review2_author': '- Ms. Li, Admin Manager',
            'review3_text': '"Very professional service. Especially love the format retention, the Excel output needs almost no adjustment."',
            'review3_author': '- David Wong, Financial Advisor',
            'pricing_title': 'Pricing Plans',
            'plan1_title': 'General User',
            'plan1_limit': '1 Conversion per 24 Hours',
            'plan1_desc': 'For Occasional Users',
            'plan2_title': 'Registered User',
            'plan2_limit': '5 Conversions per 24 Hours',
            'plan2_desc': 'Free Registration, More Quota',
            'plan3_title': 'Premium User',
            'plan3_limit': 'Unlimited Conversions',
            'plan3_desc': 'Best for Professionals',
            'plan3_btn': 'Upgrade Now',
            'alert_pdf_only': 'Please upload PDF files only',
            'processing': 'Processing',
            'success_msg': 'Success!\n\nFile "{filename}" is ready for conversion.\n(This is a demo page, backend connection required for actual conversion)',
            // Upgrade Page
            'upgrade_title': 'Upgrade to Pro',
            'upgrade_subtitle': 'Unlock unlimited conversions and boost efficiency',
            'monthly_plan': 'Monthly Plan',
            'per_month': '/ mo',
            'unlimited_conversions': 'Unlimited Conversions',
            'priority_support': 'Priority Support',
            'secure_encryption': 'Bank-Grade Encryption',
            'cancel_anytime': 'Cancel Anytime',
            'subscribe_monthly': 'Subscribe Monthly',
            'save_24': 'Save 24%',
            'yearly_plan': 'Yearly Plan',
            'per_year': '/ yr',
            'yearly_breakdown': 'Equivalent to $18.99 / mo',
            'subscribe_yearly': 'Subscribe Yearly',
            // Footer
            'privacy_policy': 'Privacy Policy',
            'terms_of_service': 'Terms of Service',
            'contact_us': 'Contact Us',
            // Auth Page
            'login_title': 'Login',
            'register_title': 'Create Account',
            'login_subtitle': 'Welcome back, please enter your details',
            'register_subtitle': 'Create an account to enjoy more features',
            'email_label': 'Email',
            'password_label': 'Password',
            'login_btn': 'Login',
            'register_btn': 'Sign Up',
            'no_account': 'Don\'t have an account?',
            'has_account': 'Already have an account?',
            'register_link': 'Sign Up Now',
            'login_link': 'Login Now',
            'auth_success_login': 'Login Successful!',
            'auth_success_register': 'Registration Successful! Please check your email to verify your account.',
            'auth_error_generic': 'An error occurred, please try again later.',
            'continue_with_google': 'Continue with Google',
            'or_email': 'Or continue with email',
            // New features
            'remaining_quota': 'Remaining Conversions',
            'file_limit_hint': 'Max file size: 10MB',
            'file_too_large': 'File size exceeds 10MB, please select a smaller file',
            'uploading': 'Uploading',
            'converting': 'Converting',
            'conversion_complete': 'Conversion Complete',
            'download_starting': 'Download Starting',
            'history_title': 'Conversion History',
            'history_empty': 'No conversion history',
            'preview_title': 'Preview Excel File',
            'preview_loading': 'Loading preview...',
            'preview_error': 'Failed to load preview',
            'close': 'Close',
            'download': 'Download',
            'preview': 'Preview',
            'remove_file': 'Remove File'
        }
    };

    // Apply language immediately on load
    setLanguage(currentLang);

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
                langMenu.classList.remove('show');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                setLanguage(lang);
                langMenu.classList.remove('show');
            });
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang); // Persist preference

        if (currentLangText) {
            currentLangText.textContent = lang === 'zh' ? '繁中' : 'ENG';
        }
        
        // Translate Page Elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Translate Document Title
        let titleKey = 'doc_title_home'; // Default
        const path = window.location.pathname;
        if (path.includes('upgrade.html')) titleKey = 'doc_title_upgrade';
        else if (path.includes('privacy.html')) titleKey = 'doc_title_privacy';
        else if (path.includes('terms.html')) titleKey = 'doc_title_terms';
        else if (path.includes('auth.html')) titleKey = 'doc_title_login';
        
        if (translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        }

        document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
    }

    // --- Auth State Management ---
    checkUser();
    
    // Initialize quota and history on page load
    updateQuotaDisplay();
    loadConversionHistory();

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        await updateUI(user);
    }

    async function updateUI(user) {
        const loginBtns = document.querySelectorAll('[data-i18n="login"]');
        
        if (user) {
            // User is logged in
            loginBtns.forEach(btn => {
                btn.setAttribute('data-i18n', 'logout');
                btn.textContent = translations[currentLang]['logout'];
                btn.onclick = handleLogout;
                // Remove existing event listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.onclick = handleLogout;
            });
            // Update quota and history for logged in users
            await updateQuotaDisplay();
            await loadConversionHistory();
        } else {
            // User is logged out
            loginBtns.forEach(btn => {
                btn.setAttribute('data-i18n', 'login');
                btn.textContent = translations[currentLang]['login'];
                btn.onclick = () => window.location.href = 'auth.html';
                // Remove existing event listeners
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.onclick = () => window.location.href = 'auth.html';
            });
            // Hide quota and history for logged out users
            const quotaDisplay = document.getElementById('quota-display');
            const historySection = document.getElementById('history-section');
            if (quotaDisplay) quotaDisplay.style.display = 'none';
            if (historySection) historySection.style.display = 'none';
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.reload();
        }
    }

    // --- Auth Page Logic ---
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                // Determine the correct redirect URL
                // If running locally (127.0.0.1 or localhost), use that.
                // Otherwise, use the production URL or let Supabase use its default Site URL.
                const redirectUrl = window.location.origin; // This captures http://127.0.0.1:5500 or https://your-site.com
                
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: redirectUrl
                    }
                });
                if (error) throw error;
            } catch (error) {
                console.error('Google login error:', error);
                showToast(error.message, 'error', '登入失敗');
            }
        });
    }

    // --- Stripe Payment Logic ---
    const subscribeMonthlyBtn = document.getElementById('subscribe-monthly-btn');
    const subscribeYearlyBtn = document.getElementById('subscribe-yearly-btn');
    
    // 請將您的 Stripe Payment Link 填入此處
    const STRIPE_MONTHLY_LINK = 'https://buy.stripe.com/eVq7sMdp0aqI77Ta7u28800'; 
    const STRIPE_YEARLY_LINK = 'https://buy.stripe.com/14A14o70C7ewak53J628801'; // 請填入年費連結

    if (subscribeMonthlyBtn) {
        subscribeMonthlyBtn.addEventListener('click', () => handleSubscription(STRIPE_MONTHLY_LINK));
    }

    if (subscribeYearlyBtn) {
        subscribeYearlyBtn.addEventListener('click', () => handleSubscription(STRIPE_YEARLY_LINK));
    }

    async function handleSubscription(paymentLink) {
        // 1. Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            // If not logged in, redirect to auth page
            showToast(translations[currentLang]['login_required'] || 'Please login first', 'warning');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return;
        }

        if (!paymentLink || paymentLink.includes('YOUR_')) {
            showToast('Payment link not configured yet.', 'error');
            return;
        }

        // 3. Determine locale
        // Stripe uses 'zh-HK' for Traditional Chinese, 'en' for English
        const stripeLocale = currentLang === 'zh' ? 'zh-HK' : 'en';

        // 2. Redirect to Stripe with user email pre-filled AND locale
        const paymentUrl = `${paymentLink}?prefilled_email=${encodeURIComponent(user.email)}&locale=${stripeLocale}`;
        window.location.href = paymentUrl;
    }

    // Existing File Upload Logic (Only if on homepage)
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone && fileInput) {
        // Drag and Drop Events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.style.borderColor = '#000';
            dropZone.style.backgroundColor = '#e0e0e0';
        }

        function unhighlight(e) {
            dropZone.style.borderColor = '#e0e0e0';
            dropZone.style.backgroundColor = '#f5f5f5';
        }

        // Handle Drop
        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        // Handle File Input
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                if (file.type !== 'application/pdf') {
                    showToast(translations[currentLang]['alert_pdf_only'], 'error');
                    return;
                }
                
                // Validate file size
                const validation = validateFileSize(file);
                if (!validation.valid) {
                    showToast(translations[currentLang]['file_too_large'], 'error');
                    return;
                }
                
                // Clear previous buttons and progress
                const existingButtons = dropZone.querySelector('.button-container');
                if (existingButtons) existingButtons.remove();
                hideProgress();
                
                // Preview PDF
                previewPDF(file);
                uploadFile(file);
            }
        }
        
        // Remove file preview button
        const removeFileBtn = document.getElementById('remove-file-btn');
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => {
                removeFilePreview();
                hideProgress();
            });
        }

        async function uploadFile(file) {
            showProgress();
            updateProgress(0, translations[currentLang]['uploading']);
            showToast(translations[currentLang]['uploading'] + ': ' + file.name, 'info');
            
            try {
                // 1. Generate a unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                // 2. Upload to Supabase Storage with progress tracking
                updateProgress(20, translations[currentLang]['uploading'] + '... 20%');
                
                const { data, error } = await supabase.storage
                    .from('uploads')
                    .upload(filePath, file);

                if (error) throw error;

                updateProgress(50, translations[currentLang]['converting'] + '... 50%');
                showToast(translations[currentLang]['converting'], 'info');

                const { data: { user } } = await supabase.auth.getUser();
                const userId = user ? user.id : 'anon';

                // 3. Call Google Cloud Run Backend
                updateProgress(60, translations[currentLang]['converting'] + '... 60%');
                
                const response = await fetch('https://bank2sheets-converter-202541778800.asia-east1.run.app/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        file_path: filePath,
                        user_id: userId
                    })
                });

                updateProgress(80, translations[currentLang]['converting'] + '... 80%');

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Conversion failed on server');
                }

                // 4. Success
                updateProgress(100, translations[currentLang]['conversion_complete']);
                showToast(translations[currentLang]['conversion_complete'], 'success', translations[currentLang]['success_msg'].replace('{filename}', file.name));
                
                // 5. Show preview option and download
                updateProgress(100, translations[currentLang]['download_starting']);
                
                // Create preview button
                const previewBtn = document.createElement('button');
                previewBtn.className = 'btn btn-outline';
                previewBtn.textContent = translations[currentLang]['preview'];
                previewBtn.style.marginTop = '1rem';
                previewBtn.onclick = () => previewExcel(result.download_url);
                
                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.href = result.download_url;
                downloadLink.download = file.name.replace('.pdf', '.xlsx');
                downloadLink.className = 'btn btn-black';
                downloadLink.textContent = translations[currentLang]['download'];
                downloadLink.style.marginTop = '1rem';
                downloadLink.style.marginLeft = '0.5rem';
                
                // Add buttons to drop zone temporarily
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.gap = '0.5rem';
                buttonContainer.appendChild(previewBtn);
                buttonContainer.appendChild(downloadLink);
                
                const existingButtons = dropZone.querySelector('.button-container');
                if (existingButtons) existingButtons.remove();
                buttonContainer.className = 'button-container';
                dropZone.appendChild(buttonContainer);
                
                // Auto download after 2 seconds
                setTimeout(() => {
                    downloadLink.click();
                }, 2000);
                
                // Update quota and history
                await updateQuotaDisplay();
                await loadConversionHistory();

            } catch (error) {
                console.error('Upload/Conversion error:', error);
                showToast(error.message || translations[currentLang]['auth_error_generic'], 'error', '轉換失敗');
                hideProgress();
            } finally {
                // Keep progress at 100% if successful, otherwise hide it
                // Progress will be reset when new file is selected
            }
        }
    }
});
