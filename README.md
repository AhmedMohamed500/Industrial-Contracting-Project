# Industrial Contracting ERP — Frontend-Only Trial

منظومة ERP عربية RTL تعمل محليًا لشركات المقاولات الصناعية والتوريدات والتركيب والصيانة والخدمات. الإصدار الحالي يضم أساس الشركة، النواة المحاسبية، وإدارة الأطراف والمشروعات والعقود والمناقصات وBOQ والموازنات والتغييرات.

## أنواع العقود المستهدفة

- Industrial Contracting — مقاولات صناعية.
- Supply Only — توريد فقط.
- Supply & Installation — توريد وتركيب.
- Maintenance — صيانة.
- Service Contract — عقود خدمات.

نوع العقد سيحدد دورة الكميات والتسليم والقبول والفوترة، مع استخدام نواة واحدة للمشروع والتكلفة والمحاسبة والتتبع.

## الحالة الحالية

**Implemented:** صفحة تسويقية عربية، إعداد الشركة والفترات والتعريفات الأساسية والعزل والنسخ الاحتياطي، ودورة Accounting Core محلية، والعملاء والموردون ومقاولو الباطن، والمشروعات والعقود والمناقصات وتحويل الفوز إلى مشروع وعقد، وBOQ والموازنات ومراكز/أكواد التكلفة والتغييرات.

**Implemented locally:** النواة المحاسبية والمشروعات والتوريد والمشتريات والمخزون والمستخلصات والخزينة والموارد والبنوك والتقارير والإقفال. كل البيانات محلية ولا توجد معاملات افتراضية.

## معمارية التوريدات المخططة

التزام العميل → Supply Contract → BOQ → Supply Schedule / Lot → Supply Requirement → Procurement → Supplier → Receipt أو Direct Delivery → Inspection → Delivery Note → Acceptance → Invoice / IPC → Collection → Supply Profitability.

تظل الكميات منفصلة حسب المرحلة: Contracted, Scheduled, Required, Ordered, Purchased, In Transit, Received, Delivered, Accepted, Invoiced, Collected, Returned, Remaining. لا تُستنتج كمية مرحلة من أخرى بلا مستند.

سيناريوهات التسليم المخططة:

1. المورد → المخزن الرئيسي → العميل.
2. المورد → مخزن المشروع → العميل.
3. المورد → العميل مباشرة.

السيناريو الثالث لا ينشئ دخولًا وخروجًا وهميًا من المخزن؛ يعتمد على إثبات التسليم والقبول وتخصيص التكلفة. التفاصيل في `docs/SUPPLY_WORKFLOW.md`.

## المعمارية والبيانات

`React UI → application services → domain/repository interfaces → Dexie/IndexedDB`

لا تصل المكونات إلى Dexie مباشرة. قاعدة IndexedDB الحالية هي schema version 13: ترقيات additive تحتفظ بالإصدارات السابقة وتضيف المحاسبة والمجالات التشغيلية والموارد والأصول والبنوك والتحكم في المشروع.

لا يوجد Backend أو قاعدة سحابية أو API مدفوع أو متغيرات بيئة مطلوبة. البيانات تبقى على نفس المتصفح والجهاز وقد تختفي عند مسح بيانات المتصفح. ملف JSON الاحتياطي يحمل `schemaVersion` و`appVersion` و`createdAt` ويجب حفظه خارج المتصفح.

## التشغيل المحلي

يتطلب Node.js 22.13 أو أحدث.

```bash
npm install
npm run dev
```

فحوص الجودة:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## خارطة الطريق

1. **Accounting Core — Implemented batch:** COA، mapping، opening/manual journals، posting/reversal، journal/ledger/trial balance/basic statements.
2. **Contract & Project Core — Implemented batch:** الأطراف، أنواع العقود، المشروعات، العقود، BOQ، الميزانيات، مراكز/أكواد التكلفة، المناقصات والتغييرات.
3. **Supply & Procurement Planning — Implemented batch:** خطط التوريد، الاحتياجات، PR واعتمادها، RFQ، عروض الموردين والمقارنة، واختيار العرض وإنشاء PO واعتماده.
4. **Receiving, Inventory & Direct Delivery — Implemented batch:** الأصناف، الاستلام من PO، سجل المخزون، التسليم المباشر بلا حركات وهمية، تسليم العميل، الفحص والمرتجعات.
5. **Billing & Treasury — Implemented batch:** فواتير العملاء والموردين، مستخلصات مقاولي الباطن، الاحتجاز واسترداد المقدم، سندات القبض والصرف، وتحديث الرصيد مع قيود GL مترابطة.
6. **Forecast, Closeout & Reporting — Implemented core:** ربحية وسيولة المشروع من المصادر، توقع نقدي مرجح، أداء الموردين، إقفال الفترات وإقفال المشروع بضوابط.
7. **Execution & IPC — Implemented core:** عقود مقاولي الباطن، MOS، مستخلصات IPC متراكمة مع قيد BOQ، ترحيل فاتورة العميل، التسليم، وإطلاق الاحتجاز.
8. **Resources & Assets — Implemented core:** مصروفات، timesheets، معدات، أصول، إهلاك، وضمانات بنكية.
9. **Banking — Implemented core:** حسابات وصناديق، تحويلات، شيكات، عهد ونثريات، وتسوية بنكية.
10. **Reports & Reconciliation — Implemented:** Cash Flow، Project P&L، report center، drill-down، التسويات، تقييم المخزون ومطابقته مع GL، ومساعدة داخلية.
11. **Project Control — Implemented:** WBS، progress، Earned Value، mobilization/demobilization، overhead، inter-project charges، DLP defects وضوابط الإقفال.

كل دفعة تضيف وحداتها القابلة للاستخدام فقط إلى القائمة، وتربط مستنداتها بالنواة المحاسبية الحالية.

## النشر

المصدر الرسمي: https://github.com/AhmedMohamed500/Industrial-Contracting-Project.git

الإنتاج: https://industrial-contracting-project.vercel.app — الصفحة العامة `/`، والدخول للتجربة المحلية `/setup`. ينشر Vercel من `main` بلا تخزين أو Backend.

## التوثيق

ابدأ بـ `PROJECT_STATUS.md` و`AUDIT_ARCHITECTURE.md` و`docs/USER_GUIDE_AR.md`. تدفق التوريد مفصل في `docs/SUPPLY_WORKFLOW.md`. كل ملف يميز بوضوح بين Implemented وPartial وPlanned وNot Started.
