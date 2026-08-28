# Project Status

## Status Legend

- **Implemented:** موجود ويعمل ومغطى بفحص مناسب.
- **Partial:** أساس أو جزء محدود متاح، والدورة الكاملة غير متاحة.
- **Planned:** تصميم/أنواع/توثيق أو عنصر تنقل فقط، بلا تشغيل أو persistence.
- **Not Started:** لا يوجد تنفيذ بعد.

## Foundation & Local Trial — Implemented

- صفحة تسويقية عربية RTL في `/` ومسار ERP في `/setup`.
- إعداد الشركة والسنة والفترات الشهرية والتعريفات الأساسية الاختيارية.
- شركات متعددة مع عزل `companyId` وتبديل الشركة وإضافة الفروع.
- حفظ مسودة الإعداد ونسخة JSON احتياطية واستعادة متوافقة مع الإصدار.
- IndexedDB/Dexie schema v5 مع ترقيات additive تحافظ على جداول وبيانات v1/v2.
- حالات صفرية صادقة؛ لا توجد معاملات أو أرصدة أو مشروعات تجريبية مصطنعة.

## Theme & Navigation — Implemented

- **Implemented:** لوحة ألوان أهدأ، خلفية `#F6F8FB`، شريط جانبي `#17324D`، active `#244560`، primary `#287C8E`، accent `#35A89A`، وحدود `#DDE5EC`.
- القائمة لم تعد roadmap: لا عناصر رمادية ولا «قريبًا». لا يظهر فيها الآن إلا الإدارة والنواة المحاسبية القابلتان للنقر والعمل؛ تُضاف المجموعات التشغيلية عند اكتمال كل دفعة.

## Contract Types — Implemented Core

Industrial Contracting, Supply Only, Supply & Installation, Maintenance, Service Contract متاحة في المشروعات والعقود والمناقصات المحفوظة محليًا. سياسات التسليم والفوترة الخاصة بكل نوع تأتي مع الوحدات التشغيلية التالية.

## Supply Management — Partial / Planning Implemented

خطط التوريد المراجعة واحتياجات المواد بمصدر وتاريخ وكمية مرتبطة بالمشروع/العقد/BOQ تعمل محليًا. دفعات التوريد والشحن والتسليم والفحص والقبول والمرتجعات وتخصيص التكلفة تأتي في الدفعات التالية.

## Accounting Cycle — Implemented Core / Partial Statements

- **Implemented:** دليل حسابات هرمي يدوي، بحث وتصنيف وحالة ومتطلبات dimensions، وقالب مقاولات اختياري لا يُنشأ إلا بعد تأكيد.
- **Implemented:** ربط AR/AP/Inventory/GRNI/VAT/Revenue/Costs/Cash/Bank/Retention/Advances وغيرها بدون IDs ثابتة.
- **Implemented:** مركز أرصدة افتتاحية وقيود يدوية بحالات draft → approved → posted، مع cancel قبل الترحيل وreversal بعده.
- **Implemented:** منع ترحيل القيد غير المتوازن أو إلى حساب تجميعي/متوقف أو فترة مغلقة.
- **Implemented:** اليومية العامة، الأستاذ الجاري، وميزان مراجعة مشتق من القيود المرحلة.
- **Partial:** Income Statement وBalance Sheet مشتقتان من التصنيفات؛ Cash Flow وProject/Cost Center P&L والتسويات الدورية تأتي مع الوحدات التابعة.

## Project & Contract Cycle — Implemented Core / Partial Operations

- **Implemented:** CRUD للعملاء والموردين ومقاولي الباطن والمشروعات والعقود، مع تحقق الأكواد وربط الشركة والعميل والمشروع.
- **Implemented:** مناقصات وتحويل ذري ومتكرر بأمان للمناقصة الفائزة إلى مشروع وعقد؛ BOQ وموازنات ومراكز/أكواد تكلفة وتغييرات تعيد حساب العقد عند الاعتماد.
- **Planned:** WBS/MOS، mobilization/demobilization، overhead، inter-project/intercompany، actual cost والربحية والإقفال.

## Procurement — Implemented Core / Planned Fulfillment

يعمل PR بحالات draft → submitted → approved، ثم RFQ لموردين مسجلين، وعروض أسعار ومقارنة، واختيار ذري متكرر بأمان ينشئ PO، ثم اعتماد PO. الاستلام/التسليم وفاتورة المورد والدفع لم تُنفذ بعد.

## Inventory — Implemented Core

- **Implemented:** item master، استلامات مرتبطة بـPO معتمد، ترحيل للمخزن، stock ledger ورصيد مشتق، تسليم العميل، direct delivery بلا حركات مخزن وهمية، فحص وقبول ومرتجعات مورد.
- **Planned:** weighted-average valuation، reservations، transfers، adjustments، serial/batch والتكامل المحاسبي.

## Client, Supplier & Subcontractors — Implemented Masters / Planned Transactions

بيانات العملاء والموردين ومقاولي الباطن وشروط السداد وحد الائتمان تعمل محليًا. المستخلصات والتحصيل وأداء المورد ومستندات مقاول الباطن والاحتجاز والدفعات المقدمة وcredit/debit notes مخططة.

## Treasury, Forecast & Closeout — Partial / Planned

- **Partial:** cashbox/bank masters اختيارية.
- **Planned:** receipts/payments/cheques/reconciliation، cash forecast، practical completion، handovers، DLP، retention/guarantee release، final account، project close.

## Reporting — Partial

اليومية والأستاذ وميزان المراجعة وقائمة الدخل والميزانية تعمل من القيود المحلية الفعلية. التقارير التشغيلية غير منفذة بعد. كل الرسومات التسويقية لا تُحفظ.

## Local Data Model — Implemented

Dexie schema version 5 يحتفظ بجداول v1–v4 ويضيف inventoryItems وgoodsReceipts وstockMovements وclientDeliveries وdeliveryInspections وpurchaseReturns. Backup v5 يشملها ويقبل الإصدارات الأقدم.

## Quality Coverage

الاختبارات تغطي الأساس والمحاسبة والتجاري والمشتريات، والترحيل المخزني، منع تجاوز الكميات، التسليم المباشر بلا حركة وهمية، والفحص والمرتجعات.

## Known Limitations

- البيانات محلية لجهاز ومتصفح واحد، ومسح التخزين قد يحذفها.
- local profile ليس authentication.
- لا Backend أو مزامنة أو multi-user أو صلاحيات إنتاجية.
- نماذج TypeScript والصفحة التسويقية لا تعني أن الوحدات التشغيلية متاحة.

## Deployment

`main` هو فرع الإنتاج على https://industrial-contracting-project.vercel.app. لا Vercel DB أو Storage أو server persistence.
