// js/script.js - GT-ZAKAT v3.0 (النسخة النهائية المصححة)

(function() {
    // ========== المتغيرات العامة والإعدادات ==========
    const CACHE_DURATION = 60 * 60 * 1000; // 60 دقيقة بالمللي ثانية
    const FIXER_API_KEY = '22f73cfd86a628868d6ecdf30e6dbf44';      // مفتاح Fixer.io الخاص بالمستخدم
    const GOLD_API_KEY = 'goldapi-du5psmmbyojlc-io';               // مفتاح GoldAPI الخاص بالمستخدم

    // ========== عناصر الصفحة ==========
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        langToggle: document.getElementById('langToggle'),
        logoHome: document.getElementById('logoHome'),
        madhhabTabs: document.querySelectorAll('.madhhab-tab'),
        calculateBtn: document.getElementById('calculateBtn'),
        resultDisplay: document.getElementById('resultDisplay'),
        cashInput: document.getElementById('cashInput'),
        goldInput: document.getElementById('goldInput'),
        silverInput: document.getElementById('silverInput'),
        tradeInput: document.getElementById('tradeInput'),
        currencySelect: document.getElementById('currencySelect'),
        nisabGoldSpan: document.getElementById('nisabGoldDisplay'),
        nisabSilverSpan: document.getElementById('nisabSilverDisplay'),
        nisabGoldCurrency: document.getElementById('nisabGoldCurrency'),
        nisabSilverCurrency: document.getElementById('nisabSilverCurrency'),
        preferredNisabRow: document.getElementById('preferredNisabRow'),
        preferredNisabDisplay: document.getElementById('preferredNisabDisplay'),
        preferredNisabCurrency: document.getElementById('preferredNisabCurrency'),
        countryNote: document.getElementById('countrySpecificNote'),
        priceSource: document.getElementById('priceSource'),
        updateStatus: document.getElementById('updateStatus'),
        lastUpdateNote: document.getElementById('lastUpdateNote'),
        goldCaratInfo: document.getElementById('goldCaratInfo'),
        toggleManualBtn: document.getElementById('toggleManualBtn'),
        manualPriceSection: document.getElementById('manualPriceSection'),
        manualGoldPrice: document.getElementById('manualGoldPrice'),
        manualSilverPrice: document.getElementById('manualSilverPrice')
    };

    // ========== حالة التطبيق ==========
    let currentLang = localStorage.getItem('gtzakat_lang') || 'ar';
    let useManualPrices = false;
    let currentPrices = {
        gold: 500,
        silver: 26,
        source: 'auto',
        lastUpdated: new Date()
    };

    // ========== دوال مساعدة ==========
    function formatNumber(num) {
        if (num === undefined || num === null) return '';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    }

    function formatDate(date) {
        if (!date) return '';
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) + ', ' +
               date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    // ========== نظام التخزين المؤقت (Cache) الذكي ==========
    function getCachedData(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_DURATION) {
                localStorage.removeItem(key);
                return null;
            }
            return data;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    }

    // ========== جلب أسعار العملات من Fixer.io ==========
    async function fetchFixerRates() {
        const cacheKey = 'fixer_rates';
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.log('📦 استخدام أسعار Fixer.io من الذاكرة المؤقتة');
            return cached;
        }

        try {
            console.log('🌍 جلب أسعار جديدة من Fixer.io...');
            const response = await fetch(`https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&format=1`);
            if (!response.ok) throw new Error('فشل الاتصال بـ Fixer.io');
            const data = await response.json();
            if (data.success) {
                setCachedData(cacheKey, data.rates);
                console.log('✅ تم تحديث أسعار Fixer.io');
                return data.rates;
            } else {
                throw new Error(data.error?.info || 'خطأ في استجابة Fixer.io');
            }
        } catch (error) {
            console.error('❌ خطأ في جلب أسعار Fixer.io:', error);
            return null;
        }
    }

    // ========== جلب أسعار الذهب والفضة من GoldAPI ==========
    async function fetchGoldPriceFromGoldAPI() {
        const cacheKey = 'goldapi_price';
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.log('📦 استخدام أسعار GoldAPI من الذاكرة المؤقتة');
            return cached;
        }

        try {
            console.log('🌍 جلب أسعار جديدة من GoldAPI...');
            const response = await fetch(`https://www.goldapi.io/api/XAU/USD`, {
                headers: { 'x-access-token': GOLD_API_KEY }
            });
            if (!response.ok) throw new Error('فشل الاتصال بـ GoldAPI');
            const data = await response.json();
            const result = {
                gold: data.price_gram_24k,          // سعر جرام الذهب عيار 24 بالدولار
                silver: data.price_gram_silver,      // سعر جرام الفضة بالدولار
                source: 'GoldAPI'
            };
            setCachedData(cacheKey, result);
            console.log('✅ تم تحديث أسعار GoldAPI');
            return result;
        } catch (error) {
            console.error('❌ خطأ في جلب أسعار GoldAPI:', error);
            return null;
        }
    }

    // ========== جلب أسعار الذهب من GoldPriceData.com (مصدر احتياطي) ==========
    async function fetchGoldPriceFromGoldPriceData() {
        const cacheKey = 'goldpricedata_price';
        const cached = getCachedData(cacheKey);
        if (cached) return cached;

        try {
            console.log('🌍 محاولة جلب أسعار من GoldPriceData...');
            // ملاحظة: هذا API تجريبي، قد تحتاج إلى تعديل الرابط
            const response = await fetch('https://api.goldpricedata.com/v1/gold/latest?apikey=demo');
            if (!response.ok) throw new Error('فشل الاتصال بـ GoldPriceData');
            const data = await response.json();
            const result = {
                gold: data.price_gram_24k,
                silver: data.price_gram_24k * 0.018, // تقديري
                source: 'GoldPriceData'
            };
            setCachedData(cacheKey, result);
            return result;
        } catch (error) {
            console.error('❌ GoldPriceData غير متاح:', error);
            return null;
        }
    }

    // ========== جلب أسعار الذهب من جميع المصادر (مع fallback) ==========
    async function fetchMetalPrices() {
        // حاول أولاً من GoldAPI
        let metalData = await fetchGoldPriceFromGoldAPI();
        if (metalData) return metalData;

        // إذا فشل، حاول من GoldPriceData
        metalData = await fetchGoldPriceFromGoldPriceData();
        if (metalData) return metalData;

        // إذا فشل الجميع، أرجع null
        return null;
    }

    // ========== تحديث النصاب الرئيسي (مع التكامل مع Fixer.io و GoldAPI) ==========
    async function updateNisab() {
        const selected = elements.currencySelect.options[elements.currencySelect.selectedIndex];
        const currency = selected.value;
        const country = selected.dataset.country;

        // إذا كان المستخدم يستخدم الإدخال اليدوي
        if (useManualPrices) {
            const goldManual = parseFloat(elements.manualGoldPrice.value);
            const silverManual = parseFloat(elements.manualSilverPrice.value);
            if (!isNaN(goldManual) && goldManual > 0) currentPrices.gold = goldManual;
            if (!isNaN(silverManual) && silverManual > 0) currentPrices.silver = silverManual;
            currentPrices.source = 'يدوي';
            elements.priceSource.innerText = currentLang === 'ar' ? 'يدوي' : 'Manual';
        } else {
            // التحديث التلقائي
            elements.updateStatus.innerText = currentLang === 'ar' ? 'جاري التحديث...' : 'Updating...';
            elements.updateStatus.style.background = 'orange';

            // جلب أسعار العملات من Fixer.io
            const fixerRates = await fetchFixerRates();
            // جلب أسعار الذهب والفضة
            const metalPrices = await fetchMetalPrices();

            let goldPriceUSD = null, silverPriceUSD = null, sourceText = '';

            if (metalPrices) {
                goldPriceUSD = metalPrices.gold;
                silverPriceUSD = metalPrices.silver;
                sourceText = metalPrices.source;
            } else {
                // استخدام الأسعار الافتراضية من الـ data attributes
                goldPriceUSD = parseFloat(selected.dataset.goldPrice) || 500;
                silverPriceUSD = parseFloat(selected.dataset.silverPrice) || 26;
                sourceText = 'افتراضي';
            }

            // تحويل السعر إلى العملة المحلية باستخدام سعر الصرف من Fixer.io
            let usdToLocal = 1;
            if (fixerRates && fixerRates[currency]) {
                // Fixer.io يعطي أسعاراً مقارنة باليورو (base هو EUR)
                // نحتاج أولاً لمعرفة سعر USD مقابل EUR، ثم نحول إلى العملة المحلية.
                const eurToUsd = fixerRates['USD'] ? 1 / fixerRates['USD'] : 1; // إذا كان 1 USD = X EUR، فإن 1 EUR = 1/X USD
                const localPerEur = fixerRates[currency];
                if (localPerEur && eurToUsd) {
                    usdToLocal = localPerEur * eurToUsd;
                    sourceText += ' + Fixer.io';
                }
            } else {
                sourceText += ' (سعر صرف تقديري)';
            }

            // حساب السعر المحلي للذهب والفضة
            currentPrices.gold = goldPriceUSD * usdToLocal;
            currentPrices.silver = silverPriceUSD * usdToLocal;
            currentPrices.source = sourceText;
            currentPrices.lastUpdated = new Date();

            elements.priceSource.innerText = sourceText;
            elements.updateStatus.innerText = currentLang === 'ar' ? '✓ محدث' : '✓ Updated';
            elements.updateStatus.style.background = 'var(--md-primary)';
        }

        // حساب وعرض النصاب
        const goldCarats = parseInt(selected.dataset.goldCarats) || 24;
        const currencyName = selected.text.split('(')[1]?.replace(')', '') || currency;

        // نصاب الذهب (85 جرام) مع تعديل العيار
        const nisabGold = 85 * currentPrices.gold * (goldCarats / 24);
        // نصاب الفضة (595 جرام)
        const nisabSilver = 595 * currentPrices.silver;

        elements.nisabGoldSpan.innerText = formatNumber(nisabGold);
        elements.nisabSilverSpan.innerText = formatNumber(nisabSilver);
        elements.nisabGoldCurrency.innerText = currencyName;
        elements.nisabSilverCurrency.innerText = currencyName;
        elements.goldCaratInfo.innerText = `(عيار ${goldCarats})`;

        // النصاب الأحوط (للدول التي تفضل الفضة)
        if (selected.dataset.preferredNisab === 'silver') {
            elements.preferredNisabRow.style.display = 'block';
            elements.preferredNisabDisplay.innerText = formatNumber(nisabSilver);
            elements.preferredNisabCurrency.innerText = currencyName;
        } else {
            elements.preferredNisabRow.style.display = 'none';
        }

        // تحديث المذهب النشط حسب البلد
        const madhhab = selected.dataset.madhhab || 'maliki';
        elements.madhhabTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.madhhab === madhhab) tab.classList.add('active');
        });

        // تحديث ملاحظة البلد (اختياري)
        updateCountryNote();

        // تحديث تاريخ آخر تحديث
        if (currentPrices.lastUpdated) {
            elements.lastUpdateNote.innerText = `${currentLang === 'ar' ? 'آخر تحديث' : 'Last update'}: ${formatDate(currentPrices.lastUpdated)}`;
        }
    }

    // ========== حساب الزكاة ==========
    function calculateZakat() {
        const cash = parseFloat(elements.cashInput.value) || 0;
        const gold = parseFloat(elements.goldInput.value) || 0;
        const silver = parseFloat(elements.silverInput.value) || 0;
        const trade = parseFloat(elements.tradeInput.value) || 0;

        const selected = elements.currencySelect.options[elements.currencySelect.selectedIndex];
        const goldCarats = parseInt(selected.dataset.goldCarats) || 24;
        const currency = selected.value;

        // تعديل وزن الذهب حسب العيار
        const goldPureWeight = gold * (goldCarats / 24);
        const goldValue = goldPureWeight * currentPrices.gold;
        const silverValue = silver * currentPrices.silver;
        const totalWealth = cash + goldValue + silverValue + trade;

        // المذهب النشط
        const activeMadhhab = document.querySelector('.madhhab-tab.active')?.dataset.madhhab || 'maliki';

        // حساب النصاب حسب المذهب
        const nisabGold = 85 * currentPrices.gold;
        const nisabSilver = 595 * currentPrices.silver;
        let nisabValue, nisabType;

        switch (activeMadhhab) {
            case 'maliki':
                nisabValue = Math.min(nisabGold, nisabSilver);
                nisabType = currentLang === 'ar' ? 'الفضة (الأحوط)' : 'Silver (preferred)';
                break;
            case 'hanafi':
            case 'shafii':
            case 'hanbali':
                nisabValue = nisabGold;
                nisabType = currentLang === 'ar' ? 'الذهب' : 'Gold';
                break;
            default:
                nisabValue = nisabSilver;
                nisabType = currentLang === 'ar' ? 'الفضة' : 'Silver';
        }

        const source = currentPrices.source || elements.priceSource.innerText;
        const updateTime = currentPrices.lastUpdated ? formatDate(currentPrices.lastUpdated) : '';

        if (totalWealth >= nisabValue) {
            const zakatDue = totalWealth * 0.025;
            const resultAr = `✅ الزكاة المستحقة: ${formatNumber(zakatDue)} ${currency}<br>
                             <small>على مجموع المال: ${formatNumber(totalWealth)} ${currency}<br>
                             بلغ النصاب (${nisabType}: ${formatNumber(nisabValue)} ${currency})<br>
                             المصدر: ${source} · آخر تحديث: ${updateTime}</small>`;
            const resultEn = `✅ Zakat due: ${formatNumber(zakatDue)} ${currency}<br>
                             <small>On total wealth: ${formatNumber(totalWealth)} ${currency}<br>
                             Reached nisab (${nisabType}: ${formatNumber(nisabValue)} ${currency})<br>
                             Source: ${source} · Last update: ${updateTime}</small>`;
            elements.resultDisplay.innerHTML = currentLang === 'ar' ? resultAr : resultEn;
        } else {
            const resultAr = `❌ لم تبلغ النصاب بعد<br>
                             <small>النصاب المعتبر (${nisabType}): ${formatNumber(nisabValue)} ${currency}<br>
                             مجموع مالك: ${formatNumber(totalWealth)} ${currency}<br>
                             المصدر: ${source} · آخر تحديث: ${updateTime}</small>`;
            const resultEn = `❌ Wealth below nisab<br>
                             <small>Nisab (${nisabType}): ${formatNumber(nisabValue)} ${currency}<br>
                             Your wealth: ${formatNumber(totalWealth)} ${currency}<br>
                             Source: ${source} · Last update: ${updateTime}</small>`;
            elements.resultDisplay.innerHTML = currentLang === 'ar' ? resultAr : resultEn;
        }
    }

    // ========== تحديث ملاحظة البلد ==========
    function updateCountryNote() {
        const selected = elements.currencySelect.options[elements.currencySelect.selectedIndex];
        const country = selected.dataset.country;
        let noteKey = 'maNote';
        if (country === 'dz') noteKey = 'dzNote';
        else if (country === 'tn') noteKey = 'tnNote';
        else noteKey = 'maNote';
        // يمكن إضافة ملاحظات مخصصة لكل بلد في future
    }

    // ========== إدارة اللغة (مع localStorage) ==========
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('gtzakat_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        elements.langToggle.innerText = lang === 'ar' ? 'English' : 'العربية';

        // تحديث جميع عناصر data-i18n في الصفحة (إذا وجدت)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            // يمكن استخدام قاموس الترجمة الموجود في النسخة الأصلية
            if (translations[key] && translations[key][lang]) {
                el.innerText = translations[key][lang];
            }
        });

        // تحديث بطاقات الزكاة
        document.querySelectorAll('.zakat-card h3').forEach((el, i) => {
            const keys = ['moneyOption', 'goldOption', 'grainsOption', 'salaryOption', 'tradeOption', 'fitrahOption'];
            if (keys[i] && translations[keys[i]] && translations[keys[i]][lang])
                el.innerText = translations[keys[i]][lang];
        });
        document.querySelectorAll('.zakat-card p').forEach((el, i) => {
            const keys = ['moneyDesc', 'goldDesc', 'grainsDesc', 'salaryDesc', 'tradeDesc', 'fitrahDesc'];
            if (keys[i] && translations[keys[i]] && translations[keys[i]][lang])
                el.innerText = translations[keys[i]][lang];
        });

        // تحديث status
        if (elements.updateStatus) {
            elements.updateStatus.innerText = lang === 'ar' ? '✓ محدث' : '✓ Updated';
        }
    }

    // ========== الوضع المظلم ==========
    function setTheme(theme) {
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    // ========== ربط الأحداث والتهيئة ==========
    async function init() {
        // استرجاع اللغة المحفوظة
        applyLanguage(currentLang);

        // تهيئة الوضع المظلم
        setTheme('auto');
        elements.themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        });

        // أحداث التغيير والحساب
        elements.currencySelect.addEventListener('change', updateNisab);
        elements.calculateBtn.addEventListener('click', calculateZakat);

        // زر التبديل اليدوي
        elements.toggleManualBtn.addEventListener('click', () => {
            useManualPrices = !useManualPrices;
            elements.manualPriceSection.style.display = useManualPrices ? 'block' : 'none';
            elements.toggleManualBtn.style.background = useManualPrices ? 'var(--md-primary)' : 'transparent';
            elements.toggleManualBtn.style.color = useManualPrices ? 'white' : 'var(--md-primary)';
            if (!useManualPrices) {
                // إذا عاد إلى التلقائي، حدث الأسعار
                updateNisab();
            }
        });

        elements.manualGoldPrice.addEventListener('input', () => {
            if (useManualPrices) updateNisab();
        });
        elements.manualSilverPrice.addEventListener('input', () => {
            if (useManualPrices) updateNisab();
        });

        // تغيير اللغة
        elements.langToggle.addEventListener('click', () => {
            applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });

        // إعادة تحميل الصفحة عند النقر على الشعار
        elements.logoHome.addEventListener('click', (e) => {
            e.preventDefault();
            location.reload();
        });

        // تحديث النصاب أول مرة
        await updateNisab();

        // تحديث دوري كل ساعة (بدلاً من 10 دقائق)
        setInterval(updateNisab, CACHE_DURATION);
    }

    // بدء التطبيق
    init();
})();
