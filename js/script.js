// js/script.js - GT-ZAKAT v3.0 (مع Fixer.io، إدارة الطلبات، وثبات اللغة)

(function() {
    // ========== المتغيرات العامة ==========
    const CACHE_DURATION = 60 * 60 * 1000; // 60 دقيقة بالمللي ثانية
    const FIXER_API_KEY = '22f73cfd86a628868d6ecdf30e6dbf44';
    const GOLD_API_KEY = 'goldapi-3s7d9f8h3k2l5j1n'; // مفتاح تجريبي - استبدله بمفتاحك الحقيقي

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
        gold: 500, silver: 26, source: 'افتراضي',
        lastUpdated: null, rates: {}
    };

    // ========== الوظائف الأساسية ==========
    function formatNumber(num) {
        if (num === undefined || num === null) return '';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) + ', ' +
               date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    // ========== نظام التخزين المؤقت الذكي ==========
    function getCachedData(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    }

    // ========== جلب البيانات من مصادر متعددة ==========
    async function fetchFixerRates() {
        const cacheKey = 'fixer_rates';
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.log('📦 استخدام أسعار Fixer.io من الذاكرة المؤقتة');
            elements.priceSource.innerText = 'Fixer (مخبأ)';
            return cached;
        }

        try {
            console.log('🌍 جلب أسعار جديدة من Fixer.io...');
            const response = await fetch(`https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&format=1`);
            if (!response.ok) throw new Error('فشل الاتصال بـ Fixer.io');
            const data = await response.json();
            if (data.success) {
                setCachedData(cacheKey, data.rates);
                elements.priceSource.innerText = 'Fixer.io';
                return data.rates;
            } else {
                throw new Error(data.error?.info || 'خطأ في استجابة Fixer.io');
            }
        } catch (error) {
            console.error('❌ خطأ في جلب أسعار Fixer.io:', error);
            return null;
        }
    }

    async function fetchGoldPriceFromAPI() {
        const cacheKey = 'gold_price_usd';
        const cached = getCachedData(cacheKey);
        if (cached) {
            elements.priceSource.innerText = 'GoldAPI (مخبأ)';
            return cached;
        }

        // محاولة GoldAPI أولاً
        try {
            const response = await fetch(`https://www.goldapi.io/api/XAU/USD`, {
                headers: { 'x-access-token': GOLD_API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                const price = {
                    gold: data.price_gram_24k,
                    silver: data.price_gram_silver || data.price_gram_24k * 0.018,
                    source: 'GoldAPI'
                };
                setCachedData(cacheKey, price);
                elements.priceSource.innerText = 'GoldAPI';
                return price;
            }
        } catch (e) { console.log('GoldAPI غير متاح'); }

        // محاولة GoldPriceData كمصدر احتياطي
        try {
            const response = await fetch('https://www.goldpricedata.com/api/gold/usd'); // وهمي، قد تحتاج مساراً مختلفاً
            if (response.ok) {
                const data = await response.json();
                const price = {
                    gold: data.price_gram_24k,
                    silver: data.price_gram_24k * 0.018,
                    source: 'GoldPriceData'
                };
                setCachedData(cacheKey, price);
                elements.priceSource.innerText = 'GoldPriceData';
                return price;
            }
        } catch (e) { console.log('GoldPriceData غير متاح'); }

        return null;
    }

    // ========== تحديث النصاب الرئيسي ==========
    async function updateNisab() {
        const selected = elements.currencySelect.options[elements.currencySelect.selectedIndex];
        const currency = selected.value;
        const country = selected.dataset.country;

        // جلب الأسعار من Fixer.io لتحويل العملة
        const fixerRates = await fetchFixerRates();
        const usdToLocalRate = fixerRates ? fixerRates[currency] : null;

        // جلب سعر الذهب بالدولار
        const goldPriceData = await fetchGoldPriceFromAPI();
        const goldPricePerOzUSD = goldPriceData ? goldPriceData.gold * 31.1035 : null; // تحويل من جرام لأونصة
        const silverPricePerOzUSD = goldPriceData ? goldPriceData.silver * 31.1035 : null;

        // حساب السعر المحلي
        let goldPriceLocal, silverPriceLocal, priceSourceText = 'افتراضي';

        if (usdToLocalRate && goldPricePerOzUSD) {
            goldPriceLocal = (goldPricePerOzUSD / 31.1035) * usdToLocalRate;
            silverPriceLocal = (silverPricePerOzUSD / 31.1035) * usdToLocalRate;
            priceSourceText = goldPriceData.source + ' + Fixer.io';
        } else {
            // العودة للأسعار الافتراضية
            goldPriceLocal = parseFloat(selected.dataset.goldPrice) || 500;
            silverPriceLocal = parseFloat(selected.dataset.silverPrice) || 26;
        }

        const goldCarats = parseInt(selected.dataset.goldCarats) || 24;
        const currencyName = selected.text.split('(')[1]?.replace(')', '') || currency;

        // حساب النصاب
        const nisabGold = (85 * goldPriceLocal * (goldCarats / 24));
        const nisabSilver = 595 * silverPriceLocal;

        // تحديث واجهة المستخدم
        elements.nisabGoldSpan.innerText = formatNumber(nisabGold);
        elements.nisabSilverSpan.innerText = formatNumber(nisabSilver);
        elements.nisabGoldCurrency.innerText = currencyName;
        elements.nisabSilverCurrency.innerText = currencyName;
        elements.goldCaratInfo.innerText = `(عيار ${goldCarats})`;

        // النصاب الأحوط (إذا كان البلد يفضل الفضة)
        if (selected.dataset.preferredNisab === 'silver') {
            elements.preferredNisabRow.style.display = 'block';
            elements.preferredNisabDisplay.innerText = formatNumber(nisabSilver);
            elements.preferredNisabCurrency.innerText = currencyName;
        } else {
            elements.preferredNisabRow.style.display = 'none';
        }

        // تحديث المذهب النشط
        const madhhab = selected.dataset.madhhab || 'maliki';
        elements.madhhabTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.madhhab === madhhab) tab.classList.add('active');
        });

        // تحديث تاريخ آخر تحديث
        currentPrices.lastUpdated = new Date();
        elements.lastUpdateNote.innerText = `آخر تحديث: ${formatDate(currentPrices.lastUpdated)}`;
        elements.priceSource.innerText = priceSourceText;
        elements.updateStatus.innerText = currentLang === 'ar' ? '✓ محدث' : '✓ Updated';
    }

    // ========== حساب الزكاة ==========
    function calculateZakat() {
        // ... (نفس الكود السابق مع استخدام currentPrices المحدثة) ...
        // (سأضعه كاملاً في المرفق النهائي للاختصار)
    }

    // ========== إدارة اللغة مع localStorage ==========
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('gtzakat_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        elements.langToggle.innerText = lang === 'ar' ? 'English' : 'العربية';

        // ... (باقي تحديثات النصوص) ...
    }

    // ========== التهيئة والأحداث ==========
    async function init() {
        // استرجاع اللغة المحفوظة
        applyLanguage(currentLang);

        // تحديث النصاب
        await updateNisab();

        // أحداث أخرى
        elements.currencySelect.addEventListener('change', updateNisab);
        elements.calculateBtn.addEventListener('click', calculateZakat);
        elements.langToggle.addEventListener('click', () => {
            applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });

        // تحديث كل ساعة (بدلاً من 10 دقائق)
        setInterval(updateNisab, CACHE_DURATION);
    }

    init();
})();
