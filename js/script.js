// js/script.js - تحديث مع إضافة الترجمات للأدوات
(function() {
    // دالة لتنسيق الأرقام بالشكل المغربي
    function formatNumber(num) {
        if (num === undefined || num === null) return '';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) + ', ' +
        date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    // قاموس الترجمة الكامل مع الأدوات
    const translations = {
        tagline: { ar: "مرجع زكاة المسلم", en: "Muslim's Zakat Reference" },
        since: { ar: "منذ 2026 · المرجع الشامل للزكاة", en: "Since 2026 · The Comprehensive Zakat Reference" },
        headline: { ar: "GT-ZAKAT · زكاتك بين يديك", en: "GT-ZAKAT · Zakat at Your Fingertips" },
        subheadline: { ar: "احسب زكاتك بدقة مع تحديث لحظي لأسعار الذهب والفضة حسب عملة بلدك", en: "Calculate your zakat accurately with live gold & silver prices in your currency" },
        calculatorTitle: { ar: "حاسبة الزكاة الشاملة", en: "Comprehensive Zakat Calculator" },
        zakatTypesHeading: { ar: "اختر نوع الزكاة للتفاصيل:", en: "Select zakat type for details:" },
        moneyOption: { ar: "زكاة المال", en: "Zakat on Cash" },
        goldOption: { ar: "الذهب والفضة", en: "Gold & Silver" },
        grainsOption: { ar: "الحبوب والثمار", en: "Grains & Fruits" },
        salaryOption: { ar: "زكاة الراتب", en: "Salary Zakat" },
        tradeOption: { ar: "عروض التجارة", en: "Trade Goods" },
        fitrahOption: { ar: "زكاة الفطر", en: "Zakat al-Fitr" },
        moneyDesc: { ar: "النقود والمدخرات", en: "Cash & Savings" },
        goldDesc: { ar: "الحلي والسبائك", en: "Jewelry & Bullion" },
        grainsDesc: { ar: "الزروع والتمور", en: "Crops & Dates" },
        salaryDesc: { ar: "الرواتب المدخرة", en: "Saved Salaries" },
        tradeDesc: { ar: "البضائع والأسهم", en: "Inventory & Stocks" },
        fitrahDesc: { ar: "صدقة الفطر", en: "Fitrah Charity" },
        malikiTab: { ar: "مالكي", en: "Maliki" },
        hanafiTab: { ar: "حنفي", en: "Hanafi" },
        shafiiTab: { ar: "شافعي", en: "Shafi'i" },
        hanbaliTab: { ar: "حنبل", en: "Hanbali" },
        selectCountry: { ar: "اختر الدولة / العملة:", en: "Select Country / Currency:" },
        manualPriceToggle: { ar: "إدخال سعر يدوي", en: "Enter Manual Price" },
        manualGoldPrice: { ar: "سعر جرام الذهب (بعملتك المحلية):", en: "Gold price per gram (in your currency):" },
 manualSilverPrice: { ar: "سعر جرام الفضة (بعملتك المحلية):", en: "Silver price per gram (in your currency):" },
 manualNote: { ar: "* سيتم استخدام الأسعار اليدوية بدلاً من التحديث التلقائي", en: "* Manual prices will override automatic updates" },
 cashLabel: { ar: "النقد (بالعملة)", en: "Cash (in currency)" },
 goldLabel: { ar: "الذهب (جرام)", en: "Gold (grams)" },
 silverLabel: { ar: "الفضة (جرام)", en: "Silver (grams)" },
 tradeGoodsLabel: { ar: "قيمة عروض التجارة", en: "Trade Goods Value" },
 cashTooltip: { ar: "المبلغ النقدي الذي تملكه من نقود ورقية أو معدنية أو أرصدة بنكية. يحول إلى عملتك المحلية ويدخل في حساب الزكاة.", en: "The amount of cash you own in paper currency, coins, or bank balances. Converted to your local currency and included in zakat calculation." },
 goldTooltip: { ar: "وزن الذهب الذي تملكه بالجرام، سواء كان سبائك أو حلياً (مع مراعاة خلاف المذاهب في حلي الزينة). يحسب بقيمته السوقية.", en: "Weight of gold you own in grams, whether bullion or jewelry (considering the schools' differences on ornamental jewelry). Valued at market price." },
 silverTooltip: { ar: "وزن الفضة الذي تملكه بالجرام. تدخل في حساب الزكاة بنفس أحكام الذهب، وغالباً ما يكون نصابها أقل.", en: "Weight of silver you own in grams. Subject to the same rules as gold, often with a lower nisab." },
 tradeGoodsTooltip: { ar: "عروض التجارة: البضائع المعدة للبيع، الأسهم، العقارات التجارية، وأي سلع تم شراؤها بقصد الاتجار. إذا بلغت قيمتها مع النقود النصاب وحال الحول، فتجب الزكاة 2.5%", en: "Trade goods: merchandise for sale, stocks, commercial real estate, any items purchased for resale. If their value plus cash reaches nisab and a year passes, zakat is due at 2.5%" },
 nisabInfo: { ar: "📊 معلومات النصاب:", en: "📊 Nisab Information:" },
 nisabGold: { ar: "نصاب الذهب (85 جرام):", en: "Gold nisab (85g):" },
 nisabSilver: { ar: "نصاب الفضة (595 جرام):", en: "Silver nisab (595g):" },
 preferredNisab: { ar: "النصاب الأحوط (الفضة):", en: "Preferred nisab (silver):" },
 calculate: { ar: "احسب زكاتك بدقة", en: "Calculate Zakat Accurately" },
 maNote: { ar: "* المغرب: يُفضل اعتبار نصاب الفضة (حوالي 2,600 درهم) توسعةً على الفقراء .", en: "* Morocco: Silver nisab (approx. 2,600 MAD) is preferred to benefit more poor." },
 madhhabTitle: { ar: "المذاهب الأربعة", en: "The Four Schools" },
 malikiDesc: { ar: "ينتشر في المغرب العربي، يعتبر نصاب الفضة أحوط .", en: "Prevalent in Maghreb, prefers silver nisab." },
 hanafiDesc: { ar: "ينتشر في المشرق، يعتبر نصاب الذهب .", en: "Prevalent in the East, uses gold nisab." },
 shafiiDesc: { ar: "ينتشر في مصر وجنوب شرق آسيا، يضم الذهب والفضة .", en: "Prevalent in Egypt & SE Asia, combines gold & silver." },
 hanbaliDesc: { ar: "ينتشر في السعودية، يضم الجميع .", en: "Prevalent in Saudi Arabia, combines all." },
 sourcesTitle: { ar: "نصوص وأدلة كاملة", en: "Complete Texts and Evidence" },
 source1: { ar: "آية الزكاة (التوبة 103)", en: "Zakat Verse (At-Tawbah 103)" },
 source2: { ar: "حديث بني الإسلام (البخاري 8)", en: "Hadith on Islam's Pillars (Bukhari 8)" },
 source3: { ar: "الإسلام سؤال وجواب", en: "Islam Q&A" },
 source4: { ar: "أسعار الذهب العالمية (GoldAPI)", en: "Global Gold Prices (GoldAPI)" },
 apiSourceNote: { ar: "* يتم تحديث أسعار الذهب والفضة تلقائياً عبر خدمة GoldAPI.io (مزود خارجي).", en: "* Gold & silver prices are automatically updated via GoldAPI.io (external provider)." },
 footer: { ar: "GT-ZAKAT · جميع النصوص مع مصادرها ·", en: "GT-ZAKAT · All texts with their sources ·" },
 developer: { ar: "تطوير SalehGNUTUX · مشروع مفتوح المصدر", en: "Developed by SalehGNUTUX · Open Source Project" }
    };

    // عناصر الصفحة
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const logoHome = document.getElementById('logoHome');
    const madhhabTabs = document.querySelectorAll('.madhhab-tab');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDisplay = document.getElementById('resultDisplay');
    const cashInput = document.getElementById('cashInput');
    const goldInput = document.getElementById('goldInput');
    const silverInput = document.getElementById('silverInput');
    const tradeInput = document.getElementById('tradeInput');
    const currencySelect = document.getElementById('currencySelect');
    const nisabGoldSpan = document.getElementById('nisabGoldDisplay');
    const nisabSilverSpan = document.getElementById('nisabSilverDisplay');
    const nisabGoldCurrency = document.getElementById('nisabGoldCurrency');
    const nisabSilverCurrency = document.getElementById('nisabSilverCurrency');
    const preferredNisabRow = document.getElementById('preferredNisabRow');
    const preferredNisabDisplay = document.getElementById('preferredNisabDisplay');
    const preferredNisabCurrency = document.getElementById('preferredNisabCurrency');
    const countryNote = document.getElementById('countrySpecificNote');
    const priceSource = document.getElementById('priceSource');
    const updateStatus = document.getElementById('updateStatus');
    const lastUpdateNote = document.getElementById('lastUpdateNote');
    const goldCaratInfo = document.getElementById('goldCaratInfo');
    const toggleManualBtn = document.getElementById('toggleManualBtn');
    const manualPriceSection = document.getElementById('manualPriceSection');
    const manualGoldPrice = document.getElementById('manualGoldPrice');
    const manualSilverPrice = document.getElementById('manualSilverPrice');

    let currentLang = 'ar';
    let useManualPrices = false;
    let currentPrices = { gold: 500, silver: 26, source: 'auto', lastUpdated: new Date() };

    // الوضع المظلم
    function setTheme(theme) {
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }
    setTheme('auto');
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    });

    // الترجمة
    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        langToggle.innerText = lang === 'ar' ? 'English' : 'العربية';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
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

        updateCountryNote();
    }

    function updateCountryNote() {
        const selected = currencySelect.options[currencySelect.selectedIndex];
        const country = selected.dataset.country;
        let noteKey = 'maNote';
        if (country === 'dz') noteKey = 'dzNote';
        else if (country === 'tn') noteKey = 'tnNote';
        else noteKey = 'maNote';
        if (translations[noteKey] && translations[noteKey][currentLang]) {
            countryNote.innerText = translations[noteKey][currentLang];
        }
    }

    // تحديث النصاب
    async function updateNisab() {
        const selected = currencySelect.options[currencySelect.selectedIndex];
        const goldPrice = useManualPrices && manualGoldPrice.value ? parseFloat(manualGoldPrice.value) : (parseFloat(selected.dataset.goldPrice) || 500);
        const silverPrice = useManualPrices && manualSilverPrice.value ? parseFloat(manualSilverPrice.value) : (parseFloat(selected.dataset.silverPrice) || 26);
        const goldCarats = parseInt(selected.dataset.goldCarats) || 24;
        const currencyName = selected.text.split('(')[1]?.replace(')', '') || selected.value;

        const nisabGold = (85 * goldPrice * (goldCarats / 24));
        const nisabSilver = 595 * silverPrice;

        nisabGoldSpan.innerText = formatNumber(nisabGold);
        nisabSilverSpan.innerText = formatNumber(nisabSilver);
        nisabGoldCurrency.innerText = currencyName;
        nisabSilverCurrency.innerText = currencyName;
        goldCaratInfo.innerText = `(عيار ${goldCarats})`;

        if (selected.dataset.preferredNisab === 'silver') {
            preferredNisabRow.style.display = 'block';
            preferredNisabDisplay.innerText = formatNumber(nisabSilver);
            preferredNisabCurrency.innerText = currencyName;
        } else {
            preferredNisabRow.style.display = 'none';
        }

        const madhhab = selected.dataset.madhhab || 'maliki';
        madhhabTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.madhhab === madhhab) tab.classList.add('active');
        });

            currentPrices.lastUpdated = new Date();
            lastUpdateNote.innerText = `آخر تحديث: ${formatDate(currentPrices.lastUpdated)}`;
            priceSource.innerText = useManualPrices ? (currentLang === 'ar' ? 'يدوي' : 'Manual') : 'GoldAPI';
            updateStatus.innerText = currentLang === 'ar' ? '✓ محدث' : '✓ Updated';
    }

    // حساب الزكاة
    function calculateZakat() {
        const cash = parseFloat(cashInput.value) || 0;
        const gold = parseFloat(goldInput.value) || 0;
        const silver = parseFloat(silverInput.value) || 0;
        const trade = parseFloat(tradeInput.value) || 0;

        const selected = currencySelect.options[currencySelect.selectedIndex];
        const goldPrice = useManualPrices && manualGoldPrice.value ? parseFloat(manualGoldPrice.value) : (parseFloat(selected.dataset.goldPrice) || 500);
        const silverPrice = useManualPrices && manualSilverPrice.value ? parseFloat(manualSilverPrice.value) : (parseFloat(selected.dataset.silverPrice) || 26);
        const goldCarats = parseInt(selected.dataset.goldCarats) || 24;
        const currency = selected.value;

        const goldPureWeight = gold * (goldCarats / 24);
        const goldValue = goldPureWeight * goldPrice;
        const silverValue = silver * silverPrice;
        const totalWealth = cash + goldValue + silverValue + trade;

        const activeMadhhab = document.querySelector('.madhhab-tab.active')?.dataset.madhhab || 'maliki';
        const nisabGold = 85 * goldPrice;
        const nisabSilver = 595 * silverPrice;
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

        const source = priceSource.innerText;
        const updateTime = formatDate(currentPrices.lastUpdated);

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
            resultDisplay.innerHTML = currentLang === 'ar' ? resultAr : resultEn;
        } else {
            const resultAr = `❌ لم تبلغ النصاب بعد<br>
            <small>النصاب المعتبر (${nisabType}): ${formatNumber(nisabValue)} ${currency}<br>
            مجموع مالك: ${formatNumber(totalWealth)} ${currency}<br>
            المصدر: ${source} · آخر تحديث: ${updateTime}</small>`;
            const resultEn = `❌ Wealth below nisab<br>
            <small>Nisab (${nisabType}): ${formatNumber(nisabValue)} ${currency}<br>
            Your wealth: ${formatNumber(totalWealth)} ${currency}<br>
            Source: ${source} · Last update: ${updateTime}</small>`;
            resultDisplay.innerHTML = currentLang === 'ar' ? resultAr : resultEn;
        }
    }

    // ربط الأحداث
    currencySelect.addEventListener('change', updateNisab);
    calculateBtn.addEventListener('click', calculateZakat);
    toggleManualBtn.addEventListener('click', () => {
        useManualPrices = !useManualPrices;
        manualPriceSection.style.display = useManualPrices ? 'block' : 'none';
        toggleManualBtn.style.background = useManualPrices ? 'var(--md-primary)' : 'transparent';
        toggleManualBtn.style.color = useManualPrices ? 'white' : 'var(--md-primary)';
        updateNisab();
    });
    if (manualGoldPrice) manualGoldPrice.addEventListener('input', () => { if (useManualPrices) updateNisab(); });
    if (manualSilverPrice) manualSilverPrice.addEventListener('input', () => { if (useManualPrices) updateNisab(); });

    madhhabTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            madhhabTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    logoHome.addEventListener('click', (e) => { e.preventDefault(); location.reload(); });
    langToggle.addEventListener('click', () => applyLanguage(currentLang === 'ar' ? 'en' : 'ar'));

    // تهيئة
    applyLanguage('ar');
    updateNisab();
    setInterval(updateNisab, 10 * 60 * 1000);
})();
