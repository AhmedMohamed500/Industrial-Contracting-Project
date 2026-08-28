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
- IndexedDB/Dexie schema v2 مع ترقية additive تحافظ على جداول وبيانات v1.
- حالات صفرية صادقة؛ لا توجد معاملات أو أرصدة أو مشروعات تجريبية مصطنعة.

## Theme & Navigation — Implemented

- **Implemented:** لوحة ألوان أهدأ، خلفية `#F6F8FB`، شريط جانبي `#17324D`، active `#244560`، primary `#287C8E`، accent `#35A89A`، وحدود `#DDE5EC`.
- القائمة لم تعد roadmap: لا عناصر رمادية ولا «قريبًا». لا يظهر فيها الآن إلا الإدارة والنواة المحاسبية القابلتان للنقر والعمل؛ تُضاف المجموعات التشغيلية عند اكتمال كل دفعة.

## Contract Types — Planned

Industrial Contracting, Supply Only, Supply & Installation, Maintenance, Service Contract. توجد نماذج TypeScript تخطيطية، ولا توجد شاشة أو جدول persistence أو دورة اعتماد.

## Supply Management — Planned

تم توثيق معمارية SupplyContract وSupplyBOQItem وSupplySchedule وSupplyLot وSupplyRequirement وSupplyDelivery وSupplyDeliveryLine وSupplyInspection وSupplyReturn وSupplyCostAllocation، مع repository contracts تخطيطية فقط. لا توجد جداول Dexie أو بيانات تشغيلية أو مستندات قابلة للحفظ.

## Accounting Cycle — Implemented Core / Partial Statements

- **Implemented:** دليل حسابات هرمي يدوي، بحث وتصنيف وحالة ومتطلبات dimensions، وقالب مقاولات اختياري لا يُنشأ إلا بعد تأكيد.
- **Implemented:** ربط AR/AP/Inventory/GRNI/VAT/Revenue/Costs/Cash/Bank/Retention/Advances وغيرها بدون IDs ثابتة.
- **Implemented:** مركز أرصدة افتتاحية وقيود يدوية بحالات draft → approved → posted، مع cancel قبل الترحيل وreversal بعده.
- **Implemented:** منع ترحيل القيد غير المتوازن أو إلى حساب تجميعي/متوقف أو فترة مغلقة.
- **Implemented:** اليومية العامة، الأستاذ الجاري، وميزان مراجعة مشتق من القيود المرحلة.
- **Partial:** Income Statement وBalance Sheet مشتقتان من التصنيفات؛ Cash Flow وProject/Cost Center P&L والتسويات الدورية تأتي مع الوحدات التابعة.

## Project & Contract Cycle — Partial / Planned

- **Partial:** مشروع أول اختياري كـmaster بسيط أثناء الإعداد.
- **Planned:** العقود، الأنواع، WBS، BOQ، الميزانية، baseline، التغييرات، MOS، mobilization/demobilization، overhead، inter-project/intercompany، التكلفة والربحية.

## Procurement — Planned

PR → RFQ → عروض → مقارنة → PO → receipt/direct delivery → supplier invoice → payment. لا يوجد تنفيذ أو persistence.

## Inventory — Partial / Planned

- **Partial:** warehouse master فقط.
- **Planned:** items، reservations، receipts، stock ledger، valuation، transfers، issues، returns، adjustments، direct site receiving.

## Client, Supplier & Subcontractors — Not Started / Planned

مستخلصات/فواتير العميل والتحصيل، أداء المورد، مقاول الباطن، الاحتجاز، الدفعات المقدمة، credit/debit notes كلها مخططة فقط.

## Treasury, Forecast & Closeout — Partial / Planned

- **Partial:** cashbox/bank masters اختيارية.
- **Planned:** receipts/payments/cheques/reconciliation، cash forecast، practical completion، handovers، DLP، retention/guarantee release، final account، project close.

## Reporting — Partial

اليومية والأستاذ وميزان المراجعة وقائمة الدخل والميزانية تعمل من القيود المحلية الفعلية. التقارير التشغيلية غير منفذة بعد. كل الرسومات التسويقية لا تُحفظ.

## Local Data Model — Implemented

Dexie schema version 2 يحتفظ بكل جداول v1 ويضيف accounts وaccountingMappings وjournalEntries وjournalLines. الترقية additive ولا تمس سجلات الشركات الحالية. Backup v2 يشمل جداول المحاسبة، وRestore يقبل ملفات v1 القديمة.

## Quality Coverage

الاختبارات تغطي الفترات، توافق Backup v1/v2، الأساس الذري، منع تكرار الشركة، قالب الحسابات الاختياري، رفض القيد غير المتوازن، الترحيل، اتزان Trial Balance، والعكس بقيد مقابل.

## Known Limitations

- البيانات محلية لجهاز ومتصفح واحد، ومسح التخزين قد يحذفها.
- local profile ليس authentication.
- لا Backend أو مزامنة أو multi-user أو صلاحيات إنتاجية.
- نماذج TypeScript والصفحة التسويقية لا تعني أن الوحدات التشغيلية متاحة.

## Deployment

`main` هو فرع الإنتاج على https://industrial-contracting-project.vercel.app. لا Vercel DB أو Storage أو server persistence.
