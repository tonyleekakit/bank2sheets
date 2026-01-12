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
            'upgrade': '升級',
            'login': '登入',
            'hero_title': '首個可以轉換中英文銀行月結單的網站',
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
            'contact_us': '聯絡我們'
        },
        'en': {
            'doc_title_home': 'BANK2SHEETS - Convert Bank Statements to Excel',
            'doc_title_upgrade': 'Upgrade - BANK2SHEETS',
            'doc_title_privacy': 'Privacy Policy - BANK2SHEETS',
            'doc_title_terms': 'Terms of Service - BANK2SHEETS',
            'upgrade': 'Upgrade',
            'login': 'Login',
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
            'contact_us': 'Contact Us'
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
        
        if (translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        }

        document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
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
                if (file.type === 'application/pdf') {
                    uploadFile(file);
                } else {
                    alert(translations[currentLang]['alert_pdf_only']);
                }
            }
        }

        function uploadFile(file) {
            // Mock upload process
            const titleElement = dropZone.querySelector('h3'); // Use h3 directly or data-i18n selector
            const originalTextKey = titleElement.getAttribute('data-i18n');
            
            titleElement.textContent = `${translations[currentLang]['processing']}: ${file.name}...`;
            
            setTimeout(() => {
                let msg = translations[currentLang]['success_msg'].replace('{filename}', file.name);
                alert(msg);
                // Restore original text
                titleElement.textContent = translations[currentLang][originalTextKey];
            }, 1500);
        }
    }
});
