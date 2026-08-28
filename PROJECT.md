# منظومة المقاولات الصناعية

## Industrial Contracting ERP

منظومة ERP عربية موجهة للمقاولات الصناعية والتوريد فقط والتوريد والتركيب والصيانة وعقود الخدمات، إلى جانب قطاعات MEP والكهرباء والميكانيكا وSteel Structure وPiping وFire Fighting وتركيبات المصانع.

## الروابط

- الموقع المباشر: https://industrial-contracting-project.vercel.app
- المستودع الرسمي: https://github.com/AhmedMohamed500/Industrial-Contracting-Project
- الفرع الإنتاجي: `main`

## المسارات

- `/` — صفحة الهبوط التجارية العربية.
- `/setup` — الدخول إلى النظام ومعالج الإعداد لأول مرة.

## حالة المشروع

المشروع حاليًا نسخة تجريبية Frontend-Only. المرحلة الأولى الخاصة بالأساس المحلي منفذة. معمارية العقود والتوريدات موثقة وممثلة بأنواع TypeScript مخططة فقط، بينما الحسابات والمعاملات والمشروعات والمشتريات والمخزون والمستخلصات والتقارير ستُنفذ لاحقًا. Accounting Core هو المرحلة التالية.

## المنفذ حاليًا

- صفحة هبوط عربية RTL متجاوبة.
- شرح دورة المشروع والمحاسبة والمشتريات والمخازن والمستخلصات والربحية.
- معالج إعداد من 10 خطوات.
- إنشاء أكثر من شركة مع فصل البيانات محليًا.
- السنوات المالية والفترات المحاسبية.
- الفروع وتعريفات الضرائب والخزائن والبنوك والمخازن والمشروع الأول.
- Setup Progress وحالات فارغة بدون أرقام وهمية.
- حفظ البيانات في IndexedDB باستخدام Dexie.
- استعادة مسودة الإعداد بعد تحديث الصفحة.
- Backup وRestore محليان مع فحص إصدار المخطط.
- Audit Event foundation.
- اكتشاف وجود شركة محلية لعرض زر «فتح النظام» بدل «جرّب النظام الآن».

## سياسة البيانات

- لا يوجد Backend في النسخة الحالية.
- لا توجد قاعدة بيانات سحابية.
- لا توجد خدمات مدفوعة أو APIs مطلوبة.
- لا تُرسل بيانات ERP إلى خادم خارجي.
- البيانات محفوظة في متصفح المستخدم وعلى نفس الجهاز فقط.
- لا يتم إنشاء شركات أو أرصدة أو مشروعات أو معاملات افتراضية.
- أرقام صفحات التسويق أمثلة بصرية فقط ولا تُحفظ في IndexedDB.
- التخزين المحلي غير مناسب للتشغيل الإنتاجي متعدد المستخدمين.

## المعمارية

```text
Arabic RTL UI
    ↓
Application Services
    ↓
Domain Rules + Repository Interfaces
    ↓
IndexedDB Repository Implementations
```

مكونات React لا تصل إلى جداول Dexie مباشرة. عند بناء النسخة الإنتاجية يمكن إضافة `ApiRepository` خلف العقود الحالية دون إعادة بناء الواجهة ومنطق الأعمال.

## التقنيات

- Next.js
- React
- TypeScript strict mode
- Tailwind CSS
- Dexie / IndexedDB
- Zod
- Lucide Icons
- Vitest
- Vercel frontend deployment

## نموذج البيانات المحلي — Schema Version 1

- Companies
- Branches
- Fiscal Years
- Accounting Periods
- Taxes
- Treasury Accounts
- Warehouses
- Projects
- Local Profiles
- Setup Drafts
- App Settings
- Audit Events

كل سجل تجاري تابع لشركة يحمل `companyId`، ويستخدم النظام UUID داخليًا مع أكواد بشرية مستقلة.

## الحماية المحاسبية المخططة

- منع ترحيل قيد غير متوازن.
- منع الترحيل إلى فترة مغلقة.
- منع تكرار ترحيل المستند نفسه.
- استخدام حسابات الربط المعرّفة لكل شركة بدل أرقام حسابات ثابتة.
- قفل القيم المالية بعد الترحيل.
- التصحيح عن طريق العكس أو مستند تصحيح.
- تتبع المصدر من التقرير إلى المستند ثم القيد والأستاذ.

## قواعد تكلفة المشروع

- أمر الشراء أو عقد المقاول المعتمد يؤثر في Committed Cost فقط.
- النقل إلى مخزن الموقع لا يُعد استهلاكًا.
- Material Issue هو الذي ينشئ تكلفة خامات فعلية للمشروع.
- الربحية والسيولة مؤشرين منفصلين.
- يجب الفصل بين Actual Cost وCommitted Cost وForecast وCertified Revenue وCollected Cash.

## التشغيل محليًا

يتطلب Node.js 22.13 أو أحدث.

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## فحوصات الجودة

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

الحالة الحالية:

- Lint: ناجح.
- TypeScript: ناجح.
- Tests: 7 اختبارات ناجحة.
- Production Build: ناجح.
- Vercel Production: Ready.

## المراحل التالية

1. Accounting Core: دليل الحسابات، الربط، الأرصدة الافتتاحية، القيود، الأستاذ، وميزان المراجعة.
2. Project Foundation: العملاء والعقود وBOQ والميزانيات ومراكز وأكواد التكلفة.
3. Procurement: PR وRFQ والعروض والمقارنة وأوامر الشراء والالتزامات.
4. Inventory and AP: الاستلام والمخزون والتقييم والفواتير والموردون والمدفوعات.
5. Project Material Cost: التحويلات والصرف والمرتجعات والهالك والتكلفة الفعلية.
6. Subcontractors and Client IPC.
7. Treasury and Reconciliation.
8. Advanced Accounting and Closing.
9. Financial Statements and Project Control.

## ملفات مرجعية

- `README.md` — تشغيل المشروع والنظرة العامة.
- `PROJECT_STATUS.md` — حالة التنفيذ الدقيقة وما هو مكتمل أو مؤجل.
- `AUDIT_ARCHITECTURE.md` — التدقيق المعماري وخريطة الوحدات والمخاطر.
- `docs/USER_GUIDE_AR.md` — دليل المستخدم العربي.
- `docs/ACCOUNTING_POSTING_MATRIX.md` — مصفوفة الترحيل المحاسبي المخططة.
- `docs/LOCAL_STORAGE_ARCHITECTURE.md` — معمارية التخزين المحلي.

## النسخة الإنتاجية المستقبلية

بعد اعتماد التجربة داخل الشركة، تُبنى نسخة Backend بقاعدة بيانات مركزية، مصادقة وصلاحيات حقيقية، معاملات خادم، سجل تدقيق إنتاجي، نسخ احتياطية مركزية، ودعم آمن لعدة مستخدمين وأجهزة.
