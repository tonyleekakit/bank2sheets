import { supabase } from './supabaseClient.js';

// Language Switcher Logic
const langBtn = document.getElementById('lang-btn');
const langMenu = document.getElementById('lang-menu');
const langOptions = document.querySelectorAll('.lang-option');
const currentLangText = document.getElementById('current-lang-text');

// Initialize language from localStorage or default to 'en'
let currentLang = localStorage.getItem('preferredLang') || 'en';
let currentUser = null; // Global user state

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
        'hero_title': '支援圖片及 200+ 語言銀行月結單',
        'hero_subtitle': '專業、準確、安全。將您的 PDF 或圖片月結單即時轉換為 Excel 格式。',
        'dropzone_title': '點擊或拖放 PDF/圖片檔案至此處',
        'dropzone_subtitle': '支援各大銀行月結單 (PDF, JPG, PNG)',
        'select_file': '選擇檔案',
        'features_title': '網站優點',
        'feature1_title': '快速轉換',
        'feature1_text': '支援 PDF 及各種圖片格式，先進的 OCR 技術，幾秒鐘內完成轉換。',
        'feature2_title': '極高準確度',
        'feature2_text': '支援全球 200+ 種語言，專為複雜排版優化，精準識別表格數據。',
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
        'alert_pdf_only': '請上載支援的檔案格式 (PDF, JPG, PNG, TIFF, GIF, BMP)',
        'processing': '正在處理',
        'preview_title': '預覽第一頁',
        'remaining_quota': '今日剩餘次數:',
        'history_title': '轉換記錄',
        'no_history': '暫無記錄',
        'success_msg': '成功！\n\n檔案 "{filename}" 已準備好轉換。\n(此為示範頁面，實際轉換功能需連接後端)',
        // Upgrade Page
        'upgrade_title': '升級至專業版',
        'upgrade_subtitle': '解鎖更多轉換次數，提升工作效率',
        'basic_plan': 'Basic 計劃',
        'pro_plan': 'Pro 計劃',
        'subscribe_basic': '訂閱 Basic',
        'subscribe_pro': '訂閱 Pro',
        'per_month': '/ 月',
        'basic_conversions': '500 次轉換 / 月',
        'pro_conversions': '1000 次轉換 / 月',
        'priority_support': '優先客戶支援',
        'secure_encryption': '銀行級加密',
        'cancel_anytime': '批量轉換',
        'best_value': '超值',
        'pro_subtitle': '適合高用量企業',
        'remaining_quota': '今日剩餘次數：',
        'alert_login_first': '請先登入以使用此功能',
        'alert_quota_exceeded': '您已達到今日免費轉換上限。請升級以繼續使用。',
        'alert_pdf_only': '請上載支援的檔案格式 (PDF, JPG, PNG, TIFF, GIF, BMP)',
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
        'or_email': '或使用電子郵件'
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
        'hero_title': 'Support Image & 200+ Languages Bank Statements',
        'hero_subtitle': 'Professional, Accurate, Secure. Convert your PDF or Image bank statements to Excel instantly.',
        'dropzone_title': 'Click or Drop PDF/Image Files Here',
        'dropzone_subtitle': 'Supports Major Bank Statements (PDF, JPG, PNG)',
        'select_file': 'Select File',
        'features_title': 'Features',
        'feature1_title': 'Fast Conversion',
        'feature1_text': 'Supports PDF and various image formats. Advanced OCR technology completes conversion in seconds.',
        'feature2_title': 'High Accuracy',
        'feature2_text': 'Supports 200+ languages globally. Optimized for complex layouts, accurately identifying table data.',
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
        'plan3_limit': 'More Conversions',
        'plan3_desc': 'Best for Professionals',
        'plan3_btn': 'Upgrade Now',
        'alert_pdf_only': 'Please upload supported file formats (PDF, JPG, PNG, TIFF, GIF, BMP)',
        'processing': 'Processing',
        'success_msg': 'Success!\n\nFile "{filename}" is ready for conversion.\n(This is a demo page, backend connection required for actual conversion)',
        // Upgrade Page
        'upgrade_title': 'Upgrade to Pro',
        'upgrade_subtitle': 'Unlock higher limits and boost efficiency',
        'basic_plan': 'Basic Plan',
        'pro_plan': 'Pro Plan',
        'subscribe_basic': 'Subscribe Basic',
        'subscribe_pro': 'Subscribe Pro',
        'per_month': '/ mo',
        'basic_conversions': '500 Conversions / Month',
        'pro_conversions': '1000 Conversions / Month',
        'priority_support': 'Priority Support',
        'secure_encryption': 'Bank-Grade Encryption',
        'cancel_anytime': 'Batch File Conversion',
        'best_value': 'Best Value',
        'pro_subtitle': 'For High Volume',
        'remaining_quota': 'Daily Remaining:',
        'alert_login_first': 'Please login to use this feature',
        'alert_quota_exceeded': 'Daily limit reached. Please upgrade for more.',
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
        'or_email': 'Or continue with email'
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

// --- Toast Notification Logic ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Allow HTML in message if needed, or textContent for safety. 
    // Using innerHTML to support line breaks <br> if passed
    toast.innerHTML = message.replace(/\n/g, '<br>');

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '1rem';
    closeBtn.onclick = () => toast.remove();
    
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// --- Usage Limit Logic ---
    const USAGE_LIMITS = {
        'guest': 1,
        'user': 5,
        'basic': 500,
        'pro': 1000
    };

    function getRecentUsage() {
        // If logged in, usage is tracked by backend/Supabase and synced to currentUser.monthly_usage
        // But for guest, we still use localStorage
        if (currentUser) {
            // Return dummy array with length equal to monthly_usage from profile
            // This is a quick hack to make existing logic work without rewriting everything
            // Ideally we should refactor checkUsage to look at currentUser.monthly_usage directly
            return new Array(currentUser.monthly_usage || 0).fill(0);
        }

        try {
            const usage = JSON.parse(localStorage.getItem('conversionUsage') || '[]');
            if (!Array.isArray(usage)) return [];
            
            // Filter for last 24 hours
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            return usage.filter(timestamp => timestamp > oneDayAgo);
        } catch (e) {
            console.error('Error parsing usage:', e);
            localStorage.setItem('conversionUsage', '[]');
            return [];
        }
    }

    function checkUsage() {
        // 1. Check if user is pro
        const isPro = currentUser && currentUser.is_pro; 
        if (isPro) {
             // For Pro/Basic, check against monthly limit
             const limit = (currentUser.plan === 'pro') ? USAGE_LIMITS.pro : USAGE_LIMITS.basic;
             const used = currentUser.monthly_usage || 0;
             if (used >= limit) {
                 const msg = currentLang === 'zh' 
                    ? `您已達到本月額度上限 (${limit}次)。` 
                    : `Monthly quota reached (${limit}).`;
                 alert(msg);
                 return false;
             }
             return true;
        }

        const limit = currentUser ? USAGE_LIMITS.user : USAGE_LIMITS.guest;
        const recentUsage = getRecentUsage();

        if (recentUsage.length >= limit) {
            const msg = currentUser 
                ? (currentLang === 'zh' ? `您已達到每日 ${limit} 次轉換上限。` : `You have reached your daily limit of ${limit} conversions.`)
                : (currentLang === 'zh' ? `訪客每日限制 ${limit} 次。請登入以獲取更多額度。` : `Guest limit reached (${limit}/day). Please login for more.`);
            alert(msg);
            return false;
        }
        return true;
    }

    function incrementUsage() {
        if (currentUser) {
            // For logged in user, backend handles increment.
            // We just optimistic update frontend state for immediate UI feedback
            currentUser.monthly_usage = (currentUser.monthly_usage || 0) + 1;
        } else {
            // Guest: save to localStorage
            const usage = getRecentUsage(); // this gets localStorage array for guest
            usage.push(Date.now());
            localStorage.setItem('conversionUsage', JSON.stringify(usage));
        }
        updateQuotaUI();
    }

    function updateQuotaUI() {
        const display = document.getElementById('usage-display');
        
        if (!display) return;

        // Show the display
        display.classList.remove('hidden');

        let limit = USAGE_LIMITS.guest;
        let used = 0;

        if (currentUser) {
            if (currentUser.is_pro) {
                limit = (currentUser.plan === 'pro') ? USAGE_LIMITS.pro : USAGE_LIMITS.basic;
            } else {
                limit = USAGE_LIMITS.user;
            }
            used = currentUser.monthly_usage || 0;
        } else {
            used = getRecentUsage().length;
        }

        const remaining = Math.max(0, limit - used);
        
        // Display for all users (Guest, Free, Basic, Pro)
        // Using English label as requested previously
        display.innerHTML = `Remaining Quota: <span id="quota-count" class="font-bold">${remaining}</span> / ${limit}`;
        
        // Styling based on plan
        if (currentUser && currentUser.is_pro) {
            display.style.backgroundColor = '#e8f5e9'; // Light green for paid
            display.style.border = '1px solid #c8e6c9';
            
            // Add Manage Subscription Link if not exists
            if (!document.getElementById('manage-sub-link')) {
                const link = document.createElement('a');
                link.id = 'manage-sub-link';
                link.href = '#';
                link.textContent = currentLang === 'zh' ? '管理訂閱' : 'Manage Subscription';
                link.style.display = 'block';
                link.style.fontSize = '0.8rem';
                link.style.marginTop = '4px';
                link.style.color = '#2e7d32';
                link.style.textDecoration = 'underline';
                link.onclick = (e) => {
                    e.preventDefault();
                    manageSubscription();
                };
                display.appendChild(link);
            }
        } else {
            display.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            display.style.border = 'none';
            // Remove link if exists (e.g. downgraded)
            const link = document.getElementById('manage-sub-link');
            if (link) link.remove();
        }
    }

    async function manageSubscription() {
        if (!currentUser) return;
        
        try {
            const btn = document.getElementById('manage-sub-link');
            if(btn) btn.textContent = 'Loading...';

            const response = await fetch(`${BACKEND_URL}/create-portal-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUser.id })
            });
            
            const result = await response.json();
            
            if (result.url) {
                window.location.href = result.url;
            } else {
                alert('Error opening portal: ' + (result.error || 'Unknown error'));
                if(btn) btn.textContent = currentLang === 'zh' ? '管理訂閱' : 'Manage Subscription';
            }
        } catch (e) {
            console.error(e);
            alert('Error: ' + e.message);
        }
    }

// --- Auth State Management ---
// checkUser(); - MOVED TO BOTTOM - MOVED TO BOTTOM

async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // Fetch Profile Data (is_pro status and plan)
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_pro, plan, monthly_usage')
                .eq('id', user.id)
                .single();
            
            if (profile) {
                user.is_pro = profile.is_pro;
                user.plan = profile.plan;
                user.monthly_usage = profile.monthly_usage;
            }
        }
        updateUI(user);
    }

    function updateUI(user) {
        currentUser = user; // Update global user
        const loginBtns = document.querySelectorAll('[data-i18n="login"]');
        
        // Update Quota UI
        updateQuotaUI();

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
            alert(error.message);
        }
    });
}

// --- Stripe Payment Logic ---
    const subscribeBasicBtn = document.getElementById('subscribe-basic-btn');
    const subscribeProBtn = document.getElementById('subscribe-pro-btn');
    
    // Test Mode Payment Links (Replace with actual Basic/Pro links)
    const STRIPE_BASIC_LINK = 'https://buy.stripe.com/fZu9AUfx81Uc2RD3J628802'; 
    const STRIPE_PRO_LINK = 'https://buy.stripe.com/3cIfZiacO6asfEp2F228803'; 

    if (subscribeBasicBtn) {
        subscribeBasicBtn.addEventListener('click', () => handleSubscription(STRIPE_BASIC_LINK));
    }

    if (subscribeProBtn) {
        subscribeProBtn.addEventListener('click', () => handleSubscription(STRIPE_PRO_LINK));
    }

async function handleSubscription(paymentLink) {
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        // If not logged in, redirect to auth page
        alert(translations[currentLang]['login_required'] || 'Please login first');
        window.location.href = 'auth.html';
        return;
    }

    if (!paymentLink || paymentLink.includes('YOUR_')) {
        alert('Payment link not configured yet.');
        return;
    }

    // 3. Determine locale
    // Stripe uses 'zh-HK' for Traditional Chinese, 'en' for English
    const stripeLocale = currentLang === 'zh' ? 'zh-HK' : 'en';

    // 2. Redirect to Stripe with user email pre-filled AND locale AND client_reference_id
    const paymentUrl = `${paymentLink}?prefilled_email=${encodeURIComponent(user.email)}&locale=${stripeLocale}&client_reference_id=${user.id}`;
    
    // GA4 Event Tracking
    if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
            'currency': 'USD',
            'value': paymentLink.includes('30') ? 30.00 : 55.00,
            'items': [{
                'item_id': paymentLink.includes('30') ? 'basic_plan' : 'pro_plan',
                'item_name': paymentLink.includes('30') ? 'Basic Plan' : 'Pro Plan'
            }]
        });
    }

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
        dropZone.style.borderColor = '#217346';
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
        if (files.length === 0) return;

        // 1. Permission Check for Batch Upload
        const isPro = currentUser && currentUser.is_pro;
        let filesToProcess = Array.from(files);

        if (!isPro && filesToProcess.length > 1) {
            alert(translations[currentLang]['alert_pro_batch'] || 'Free users can only upload 1 file at a time. Upgrading to Pro for batch upload.');
            filesToProcess = [filesToProcess[0]]; // Take only the first one
        }

        // 2. Filter Supported Types
        const supportedTypes = [
            'application/pdf', 'image/jpeg', 'image/png', 
            'image/tiff', 'image/gif', 'image/bmp'
        ];

        // 3. Process Each File
        filesToProcess.forEach(file => {
            if (supportedTypes.includes(file.type)) {
                if (checkUsage()) {
                    // Create UI Item first
                    const fileItem = renderFileItem(file);
                    // Start Upload
                    uploadFile(file, fileItem);
                }
            } else {
                alert(`${file.name}: ${translations[currentLang]['alert_pdf_only']}`);
            }
        });
    }

    function renderFileItem(file) {
        const container = document.getElementById('file-list');
        const item = document.createElement('div');
        item.className = 'file-item uploading';
        
        // Determine icon based on type
        const icon = file.type === 'application/pdf' ? '📄' : '🖼️';
        const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        item.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${icon}</span>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${size}</span>
                </div>
            </div>
            <div class="file-actions">
                <span class="status-text">${translations[currentLang]['processing'] || 'Processing...'}</span>
                <!-- Loading Spinner (Simple CSS circle) -->
                <div class="spinner" style="width: 16px; height: 16px; border: 2px solid #ccc; border-top-color: #217346; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
        `;
        
        // Add spin animation style if not exists
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        container.appendChild(item);
        return item;
    }

    async function uploadFile(file, fileItem) {
        const statusText = fileItem.querySelector('.status-text');
        const actionsDiv = fileItem.querySelector('.file-actions');
        
        try {
            // 1. Generate unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Upload to Supabase
            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            if (error) throw error;

            // 3. Trigger Backend
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user ? user.id : 'anon';
            
            // API URL Configuration
            // const API_URL = 'http://localhost:8080/convert'; // Local
            const API_URL = 'https://bank2sheets-converter-202541778800.asia-east1.run.app/convert'; // Production

            console.log(`[Frontend] Calling API: ${API_URL}`);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_path: filePath, user_id: userId })
            });

            const result = await response.json();
            console.log('[Frontend] API Response:', result);

            if (!response.ok) throw new Error(result.error || 'Server Error');

            // 4. Success UI Update
            fileItem.classList.remove('uploading');
            fileItem.classList.add('complete');
            
            // GA4 Event Tracking
            if (typeof gtag === 'function') {
                gtag('event', 'file_converted', {
                    'file_type': file.type,
                    'user_plan': (currentUser && currentUser.plan) ? currentUser.plan : 'free'
                });
            }

            // Replace actions with Download Button
            actionsDiv.innerHTML = `
                <span class="status-text" style="color: #2e7d32;">Success</span>
                <button class="btn-action btn-download">Download</button>
            `;
            
            const downloadBtn = actionsDiv.querySelector('.btn-download');
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = result.download_url;
                link.download = file.name.replace(/\.[^/.]+$/, "") + ".xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            // Add Preview Button
            // If table_data is missing (old backend), we still show button but with warning
            const hasTableData = result.table_data && result.table_data.length > 0;
            
            const previewBtn = document.createElement('button');
            previewBtn.className = 'btn-action btn-preview';
            previewBtn.textContent = 'Preview';
            previewBtn.style.marginLeft = '10px';
            previewBtn.style.cursor = 'pointer';
            previewBtn.style.padding = '2px 8px';
            previewBtn.style.backgroundColor = hasTableData ? '#217346' : '#9ca3af'; // Blue or Gray
            previewBtn.style.color = 'white';
            previewBtn.style.border = 'none';
            previewBtn.style.borderRadius = '4px';
            
            previewBtn.onclick = () => {
                if (hasTableData) {
                    showPreview(file, result.table_data);
                } else {
                    alert('Preview not available: Backend did not return table data.\nPlease deploy the updated backend code to Cloud Run.\n\n(此功能需要更新後端程式碼才能運作)');
                }
            };
            actionsDiv.appendChild(previewBtn);

            incrementUsage();

        } catch (error) {
            console.error('Error:', error);
            fileItem.classList.remove('uploading');
            fileItem.classList.add('error');
            
            actionsDiv.innerHTML = `
                <span class="status-text" style="color: #c62828;">Error</span>
                <button class="btn-action btn-remove" title="Remove">&times;</button>
            `;
            
            const removeBtn = actionsDiv.querySelector('.btn-remove');
            removeBtn.onclick = () => fileItem.remove();
            
            // Optional: Show specific error in tooltip
            fileItem.title = error.message;
        }
    }
}

async function showPreview(file, tableData) {
    // Create Modal Elements
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `<h3>Table Preview - ${file.name}</h3><button class="btn-close" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>`;
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    content.appendChild(header);
    content.appendChild(body);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Close Handler
    header.querySelector('.btn-close').onclick = () => document.body.removeChild(overlay);
    overlay.onclick = (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
    };

    try {
        const isImage = file.type.startsWith('image/');
        const pagesWithTables = [...new Set(tableData.map(t => t.page_index))];
        
        if (pagesWithTables.length === 0) {
            body.innerHTML = '<p>No tables detected to visualize.</p>';
            return;
        }

        // Check for cell data (Debug helper)
        const hasCells = tableData.some(t => t.cells && t.cells.length > 0);
        if (!hasCells) {
            const warning = document.createElement('div');
            warning.style.padding = '10px';
            warning.style.backgroundColor = '#fff3cd';
            warning.style.color = '#856404';
            warning.style.marginBottom = '10px';
            warning.style.borderRadius = '4px';
            warning.style.textAlign = 'center';
            warning.innerHTML = '⚠️ <strong>注意：</strong> 未偵測到表格欄位數據。<br>這通常是因為<strong>後端程式碼尚未更新</strong>。<br>請務必執行後端部署指令：<code>gcloud run deploy ...</code>';
            body.appendChild(warning);
            console.warn('[Preview] Missing cell data. Please redeploy backend.');
        }

        pagesWithTables.sort((a, b) => a - b);

        if (isImage) {
             // --- Image Handling ---
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            // For Document AI, page_index is usually 0 for single images.
            // We'll just render the image once.
            const viewport = { width: img.width, height: img.height };
            
            // Scale down if too large for modal
            const MAX_WIDTH = 800;
            let scale = 1;
            if (viewport.width > MAX_WIDTH) {
                scale = MAX_WIDTH / viewport.width;
            }
            
            const displayWidth = viewport.width * scale;
            const displayHeight = viewport.height * scale;

            const container = document.createElement('div');
            container.className = 'canvas-container';
            container.style.width = `${displayWidth}px`;
            container.style.height = `${displayHeight}px`;
            container.style.marginBottom = '20px';
            container.style.position = 'relative'; // Important for overlay

            // Image Element
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.style.width = '100%';
            imgEl.style.height = '100%';
            container.appendChild(imgEl);

            // Overlay Canvas
            const overlayCanvas = document.createElement('canvas');
            overlayCanvas.width = displayWidth;
            overlayCanvas.height = displayHeight;
            overlayCanvas.style.position = 'absolute';
            overlayCanvas.style.top = '0';
            overlayCanvas.style.left = '0';
            overlayCanvas.style.pointerEvents = 'none';

            const overlayCtx = overlayCanvas.getContext('2d');
            // Scale context to match image scaling
            overlayCtx.scale(scale, scale);
            
            // Draw Tables
            // Images usually have only 1 page (index 0), but let's iterate just in case
            tableData.forEach(table => {
                 drawTableOverlay(overlayCtx, table, viewport);
            });

            container.appendChild(overlayCanvas);
            body.appendChild(container);

        } else {
            // --- PDF Handling ---
            // Only try to parse as PDF if it is NOT an image
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

            for (const pageIndex of pagesWithTables) {
                const pageNum = pageIndex + 1;
                const page = await pdf.getPage(pageNum);
                
                const viewport = page.getViewport({ scale: 1.5 });
                
                const container = document.createElement('div');
                container.className = 'canvas-container';
                container.style.width = `${viewport.width}px`;
                container.style.height = `${viewport.height}px`;
                container.style.marginBottom = '20px'; // Spacing between pages
                
                // Canvas for PDF
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                
                container.appendChild(canvas);
                
                // Overlay Canvas for Tables
                const overlayCanvas = document.createElement('canvas');
                overlayCanvas.width = viewport.width;
                overlayCanvas.height = viewport.height;
                overlayCanvas.style.position = 'absolute';
                overlayCanvas.style.top = '0';
                overlayCanvas.style.left = '0';
                overlayCanvas.style.pointerEvents = 'none'; // Let clicks pass through
                
                const overlayCtx = overlayCanvas.getContext('2d');
                
                // Draw Tables for this page
                const tablesOnPage = tableData.filter(t => t.page_index === pageIndex);
                
                tablesOnPage.forEach(table => {
                    drawTableOverlay(overlayCtx, table, viewport);
                });
                
                container.appendChild(overlayCanvas);
                body.appendChild(container);
            }
        }
        
    } catch (e) {
        console.error(e);
        body.innerHTML = `<p style="color:red">Error rendering preview: ${e.message}</p>`;
    }
}

function drawTableOverlay(ctx, table, viewport) {
    // Helper to draw tables
    // viewport can be PDF viewport object OR simple {width, height} object
    
    // Draw Table Border
    if (table.vertices && table.vertices.length > 0) {
        ctx.save(); 
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.05)'; 
        
        ctx.beginPath();
        table.vertices.forEach((v, i) => {
            const x = v.x * viewport.width;
            const y = v.y * viewport.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore(); 
    }

    // Draw Cells
    if (table.cells && table.cells.length > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 120, 215, 0.6)'; // Blue-ish
        ctx.lineWidth = 1;
        
        table.cells.forEach(cell => {
            if (cell.vertices && cell.vertices.length > 0) {
                ctx.beginPath();
                cell.vertices.forEach((v, i) => {
                    const x = v.x * viewport.width;
                    const y = v.y * viewport.height;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.closePath();
                ctx.stroke();
            }
        });
        ctx.restore();
    }
}


// Initialize App
// Move initialization to the end to ensure all functions and constants (like USAGE_LIMITS) are defined
setLanguage(currentLang);
checkUser();
