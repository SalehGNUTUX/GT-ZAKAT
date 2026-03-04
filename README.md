# GT-ZAKAT - مرجع زكاة المسلم

![GT-ZAKAT Logo](GT-ZAKAT-logo/512x512/gt-zakat-logo.png)

## 📖 نبذة عن المشروع

**GT-ZAKAT** هو موقع مرجعي شامل للمسلمين للتعرف على أنواع الزكاة في الإسلام، مع آلة حاسبة دقيقة للزكاة تراعي المذاهب الأربعة (المالكي، الحنفي، الشافعي، الحنبلي) وتعمل بتحديث لحظي لأسعار الذهب والفضة حسب عملة المستخدم.

### ✨ المميزات الرئيسية

- **حاسبة زكاة ذكية**: تدخل المال، الذهب، الفضة، وعروض التجارة وتحسب الزكاة بدقة
- **دعم 22 عملة عربية**: من المغرب إلى الخليج، مع تحديث أسعار الصرف عبر API
- **المذاهب الأربعة**: يمكن اختيار المذهب للحصول على النصاب المناسب
- **ثنائي اللغة**: واجهة عربية وإنجليزية مع حفظ التفضيلات
- **الوضع المظلم**: يدعم الوضع الفاتح والداكن مع اكتشاف تلقائي
- **PWA متكامل**: يمكن تثبيته كتطبيق على سطح المكتب والهاتف
- **مصادر موثوقة**: جميع النصوص القرآنية والأحاديث مزودة بروابط المصادر
- **أيقونات متعددة المقاسات**: دعم كامل لجميع الشاشات والأجهزة

## 🗂️ هيكل المشروع

```
GT-ZAKAT/
├── index.html                 # الصفحة الرئيسية
├── manifest.json              # ملف تعريف PWA
├── service-worker.js          # Service Worker للتخزين المؤقت
├── favicon.ico                # أيقونة الموقع
├── css/
│   └── style.css              # ملف الأنماط الرئيسي
├── js/
│   └── script.js              # ملف JavaScript الرئيسي
├── pages/                      # الصفحات الفرعية
│   ├── zakat-money.html       # زكاة المال
│   ├── zakat-gold.html        # زكاة الذهب والفضة
│   ├── zakat-grains.html      # زكاة الحبوب والثمار
│   ├── zakat-salary.html      # زكاة الراتب
│   ├── zakat-trade.html       # زكاة عروض التجارة
│   └── zakat-fitrah.html      # زكاة الفطر
└── GT-ZAKAT-logo/              # أيقونات الموقع بمقاسات مختلفة
    ├── 16x16/
    ├── 32x32/
    ├── 128x128/
    ├── 256x256/
    └── 512x512/
        └── gt-zakat-logo.png
```

## 🚀 كيفية التشغيل

### عبر الإنترنت
الموقع متاح على: [https://salehgnutux.github.io/GT-ZAKAT/](https://salehgnutux.github.io/GT-ZAKAT/)

### محلياً على جهازك
```bash
# استنساخ المستودع
git clone https://github.com/SalehGNUTUX/GT-ZAKAT.git

# الدخول إلى المجلد
cd GT-ZAKAT

# فتح الموقع (باستخدام أي متصفح)
firefox index.html
# أو
chromium index.html
```

## 📱 استخدام الموقع

### حاسبة الزكاة
1. اختر **المذهب** (مالكي، حنفي، شافعي، حنبلي)
2. اختر **الدولة/العملة** من القائمة المنسدلة
3. أدخل القيم:
   - النقد (بالعملة المحلية)
   - الذهب (بالجرام)
   - الفضة (بالجرام)
   - عروض التجارة (اختياري)
4. اضغط "احسب زكاتك بدقة"
5. تظهر النتيجة مع تفاصيل النصاب والمصدر

### إدخال يدوي للأسعار
- اضغط على "إدخال سعر يدوي"
- أدخل سعر جرام الذهب والفضة يدوياً

### تغيير اللغة
- اضغط على زر "English" للتبديل للإنجليزية
- اللغة تحفظ تلقائياً وتستمر في جميع الصفحات

### الوضع المظلم
- اضغط على أيقونة الشمس/القمر للتبديل بين الوضعين
- الوضع يحفظ تلقائياً

## 🔧 التقنيات المستخدمة

- **HTML5**: هيكل الموقع
- **CSS3**: تصميم Material مع دعم الوضع المظلم
- **JavaScript**: المنطق والحسابات والتفاعل
- **APIs المستخدمة**:
  - **Fixer.io**: لأسعار صرف العملات
  - **GoldAPI.io**: لأسعار الذهب والفضة
  - **localStorage**: لحفظ تفضيلات المستخدم

## 🌐 المصادر الشرعية

جميع النصوص مزودة بروابط لمصادر موثوقة:
- **القرآن الكريم**: [quran.com](https://quran.com)
- **الحديث الشريف**: [sunnah.com](https://sunnah.com)
- **الفتاوى**: [islamqa.info](https://islamqa.info)

روابط البحث المخصصة لكل صفحة:
- زكاة المال: [islamqa.info/search?q=زكاة+المال](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%A7%D9%84%D9%85%D8%A7%D9%84)
- زكاة الذهب: [islamqa.info/search?q=زكاة+الذهب](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%A7%D9%84%D8%B0%D9%87%D8%A8)
- زكاة الحبوب: [islamqa.info/search?q=زكاة+الحبوب](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%A7%D9%84%D8%AD%D8%A8%D9%88%D8%A8)
- زكاة الراتب: [islamqa.info/search?q=زكاة+الراتب](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%A7%D9%84%D8%B1%D8%A7%D8%AA%D8%A8)
- زكاة التجارة: [islamqa.info/search?q=زكاة+عروض+التجارة](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%B9%D8%B1%D9%88%D8%B6+%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D8%A9)
- زكاة الفطر: [islamqa.info/search?q=زكاة+الفطر](https://islamqa.info/ar/search?q=%D8%B2%D9%83%D8%A7%D8%A9+%D8%A7%D9%84%D9%81%D8%B7%D8%B1)

## 📦 التثبيت كتطبيق (PWA)

### على سطح المكتب (Chrome)
1. افتح الموقع في متصفح Chrome
2. اضغط على أيقونة التثبيت في شريط العنوان
3. اختر "تثبيت"

### على الهاتف (Android)
1. افتح الموقع في Chrome
2. اضغط على القائمة (ثلاث نقاط)
3. اختر "تثبيت التطبيق"

## 🐧 تحويل الموقع إلى تطبيق سطح مكتب

### باستخدام Nativefier (الأسهل)
```bash
# تثبيت Nativefier
sudo npm install -g nativefier

# إنشاء AppImage
nativefier --name "GT-ZAKAT" --platform linux "https://salehgnutux.github.io/GT-ZAKAT/" --icon "GT-ZAKAT-logo/512x512/gt-zakat-logo.png"

# تشغيل التطبيق
./GT-ZAKAT-linux-x64/GT-ZAKAT
```

### باستخدام Electron (للتحكم الكامل)
```bash
# إنشاء مجلد المشروع
mkdir GT-ZAKAT-electron
cd GT-ZAKAT-electron
npm init -y
npm install electron electron-builder --save-dev

# انسخ ملفات الموقع إلى مجلد src/
cp -r ../GT-ZAKAT/* src/

# أنشئ ملف main.js (انظر المثال في الوثائق)
# ثم ابنِ التطبيق
npm run dist
```

## 👨‍💻 المطور

- **الاسم**: SalehGNUTUX
- **المستودع**: [github.com/SalehGNUTUX/GT-ZAKAT](https://github.com/SalehGNUTUX/GT-ZAKAT)
- **الموقع**: [salehgnutux.github.io/GT-ZAKAT](https://salehgnutux.github.io/GT-ZAKAT/)

## 📄 الترخيص

هذا المشروع مفتوح المصدر تحت رخصة MIT. يمكنك استخدامه وتعديله بحرية مع ذكر المصدر.

## 🤝 المساهمة

نرحب بمساهماتكم! يمكنك:
1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📞 الدعم

للاستفسارات أو المشاكل:
- افتح Issue في GitHub
- راسل المطور عبر الصفحة الشخصية

---

**GT-ZAKAT** - مرجعك الشامل للزكاة، بدقة ويسر.

