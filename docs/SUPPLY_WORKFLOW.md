# دورة إدارة التوريدات — Supply Workflow

## الحالة

**Planned architecture only.** لا توجد حاليًا شاشات أو معاملات أو جداول IndexedDB للتوريدات. النماذج في `src/domain/planned-operations.ts` تحدد لغة المجال وحدود المستودعات المستقبلية فقط.

## الهدف

ربط ما التزم به العميل بما تم تخطيطه وشراؤه وتسليمه وقبوله وفوترته وتحصيله، مع قياس تكلفة وربحية كل عقد وبند BOQ ودفعة توريد.

## الدورة من العميل إلى التحصيل

1. **Client obligation:** تاريخ وكمية وموقع وشرط قبول مطلوب من العميل.
2. **Supply Contract:** نوع العقد والقيمة والعملة وشروط التسليم والقبول وأساس الفوترة.
3. **Supply BOQ:** البنود والوحدات والكميات والأسعار والضرائب.
4. **Supply Schedule:** baseline ومراجعات خطة التوريد.
5. **Supply Lot:** دفعة محددة لبند وموعد وموقع تسليم.
6. **Supply Requirement:** احتياج مع required-by date ومصدر واضح.
7. **Procurement:** PR ثم RFQ وعروض ومقارنة وPO.
8. **Supplier execution:** تجهيز وشحن وتتبع in-transit.
9. **Receipt or Direct Delivery:** استلام في مخزن أو موقع العميل مباشرة.
10. **Inspection:** مقبول أو مقبول بملاحظات أو مرفوض؛ مع كميات منفصلة.
11. **Delivery Note:** إثبات ما وصل للعميل.
12. **Acceptance:** ما اعتمده العميل فعلًا، وليس مجرد ما شُحن.
13. **Invoice / IPC:** الفوترة حسب شرط العقد.
14. **Collection:** تخصيص التحصيل على الفاتورة أو المستخلص.
15. **Profitability:** الإيراد والتكلفة والالتزام والتوقع والسيولة منفصلة.

## مراحل الكمية

| المرحلة | معناها | مستند المصدر المتوقع |
| --- | --- | --- |
| Contracted | الكمية الأصلية أو المعدلة تعاقديًا | Contract + approved variation |
| Scheduled | المدرج بخطة توريد معتمدة | Supply Schedule / Lot |
| Required | الاحتياج المطلوب في تاريخ محدد | Supply Requirement |
| Ordered | المدرج في أمر شراء معتمد | Purchase Order |
| Purchased | المنفذ تجاريًا وفق سياسة الشركة | PO / supplier document |
| In Transit | المشحون ولم يصل | Dispatch / shipment |
| Received | استلمته الشركة أو الموقع | GRN / direct site receipt |
| Delivered | وصل للعميل | Delivery Note |
| Accepted | اعتمده الفحص أو العميل | Inspection / Acceptance |
| Invoiced | تمت فوترته للعميل | Invoice / IPC |
| Collected | تم تحصيل قيمته المخصصة | Receipt allocation |
| Returned | أُعيد للمورد أو بعد التسليم | Supply/Purchase Return |
| Remaining | الباقي وفق منظور التقرير | قيمة مشتقة معلنة الصيغة |

لا يجوز نسخ قيمة مرحلة إلى أخرى تلقائيًا بلا مستند. يجب أن يحدد كل تقرير صيغة Remaining: متبقي للتخطيط أو الشراء أو التسليم أو القبول أو الفوترة أو التحصيل.

## سيناريوهات التسليم

### المورد → المخزن الرئيسي → العميل

GRN في المخزن الرئيسي، ثم مستند تسليم أو صرف موجه للعميل، ثم قبول. الأثر المخزني حقيقي لأن الشركة سيطرت فعليًا على المخزون.

### المورد → مخزن المشروع → العميل

الاستلام مرتبط بمخزن المشروع مع الحفاظ على project/BOQ/lot. النقل بين مخازن الشركة لا يمثل استهلاكًا ولا تسليمًا للعميل.

### المورد → العميل مباشرة

يسجل dispatch ثم direct delivery وinspection/acceptance وتخصيص التكلفة. لا يُنشأ GRN ثم issue وهميان لمخزن لم تمر به البضاعة.

## الفحص والمرتجعات

الفحص يسجل inspected وaccepted وrejected دون تعديل مستند التسليم الأصلي. المرتجع يحدد السطر والكمية والسبب والوجهة والمستند المرجعي. يعكس الأثر المخزني أو المالي وفق الحالة وسياسة الترحيل، ولا يمحو التاريخ.

## تكلفة وربحية التوريد

التكلفة تشمل سعر الشراء والنقل والتأمين والفحص والجمارك والمناولة والمرتجعات والتكاليف المباشرة أو الموزعة. المقاييس منفصلة: Contract value، approved variations، committed purchase cost، actual/recognized cost، forecast/EAC، invoiced/certified revenue، collected cash، expected profit/margin، وcash position/forecast.

الربح ليس السيولة، وPO ليس تكلفة فعلية، والتسليم ليس قبولًا، والقبول ليس تحصيلًا.

## التكامل المحاسبي المخطط

لا يحدث ترحيل قبل اكتمال Accounting Core. عند التنفيذ يحدد posting matrix الحدث وفق سياسة الشركة: receipt/GRNI، supplier invoice، return، client invoice/IPC، collection، cost allocation، credit/debit note، reversal. كل قيد متوازن وذري وidempotent وداخل فترة مفتوحة وبحسابات mapping لا constants.

## ضوابط واعتمادات مستقبلية

- منع تجاوز الكميات مع tolerances معتمدة.
- فصل منشئ المستند عن المعتمد حيث يلزم.
- revision history للجدول والعقد وBOQ.
- document numbering حسب الشركة أو الفرع.
- serial/batch عند الحاجة.
- traceability من KPI إلى source document ثم journal.
- supplier performance للموعد والجودة والتجاري.
- cash forecast بتاريخ وثقة ومصدر لكل inflow/outflow.

## خارطة التنفيذ

Accounting Core أولًا، ثم Contract/Project Core، ثم Supply Planning/Procurement، ثم Receiving/Inventory/Direct Delivery، ثم Client Billing/Collection/Profitability. لا تضاف جداول Dexie قبل وجود use cases وقواعد انتقال واختبارات وترحيل schema موثق.
