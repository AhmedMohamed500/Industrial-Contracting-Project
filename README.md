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

**Planned/next batches:** تخطيط التوريدات والمشتريات والمخزون ومستندات مقاولي الباطن والمستخلصات والخزينة والإقفال والتقارير التشغيلية. القائمة لا تعرض أي business module غير عامل.

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

لا تصل المكونات إلى Dexie مباشرة. قاعدة IndexedDB الحالية هي schema version 4: ترقيات additive تحتفظ ببيانات v1/v2 وتضيف الأطراف والعقود وBOQ والموازنات والأبعاد والمناقصات والتغييرات. خطط التوريد والاحتياجات وPR/RFQ/عروض الموردين/PO محفوظة فعليًا؛ الاستلام والمخزون والتسليم لم تُنفذ بعد.

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
4. **Phase 5 — Receiving, Inventory & Direct Delivery:** الاستلام، الفحص، المخازن، التسليم المباشر، المرتجعات.
5. **Phase 6 — Costing & Revenue:** تكلفة التوريد/المشروع، مستخلصات وفواتير العملاء، التحصيل والربحية.
6. **Phase 7+ — Subcontractors, Treasury, Forecast, Closeout & Reporting:** الموردون ومقاولو الباطن والخزينة والتنبؤ وأداء المورد وإقفال المشروع والقوائم.

كل دفعة تضيف وحداتها القابلة للاستخدام فقط إلى القائمة، وتربط مستنداتها بالنواة المحاسبية الحالية.

## النشر

المصدر الرسمي: https://github.com/AhmedMohamed500/Industrial-Contracting-Project.git

الإنتاج: https://industrial-contracting-project.vercel.app — الصفحة العامة `/`، والدخول للتجربة المحلية `/setup`. ينشر Vercel من `main` بلا تخزين أو Backend.

## التوثيق

ابدأ بـ `PROJECT_STATUS.md` و`AUDIT_ARCHITECTURE.md` و`docs/USER_GUIDE_AR.md`. تدفق التوريد مفصل في `docs/SUPPLY_WORKFLOW.md`. كل ملف يميز بوضوح بين Implemented وPartial وPlanned وNot Started.
