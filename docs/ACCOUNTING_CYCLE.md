# Accounting Cycle

## الحالة الحالية

**Core implemented locally in IndexedDB schema v2.** تعمل شاشات دليل الحسابات والربط والأرصدة الافتتاحية والقيود واليومية والأستاذ وميزان المراجعة والقوائم الأساسية. التسويات الآلية وCash Flow وProject/Cost Center P&L والإقفال الدوري ما زالت دفعات لاحقة.

## الدورة العاملة

Company/Fiscal Year/Periods → Chart of Accounts → Accounting Mapping → Opening Balance أو Manual Journal → Draft → Approve → Post → General Journal → General Ledger → Trial Balance → Income Statement / Balance Sheet.

## قواعد الترحيل

- القيد يحتوي سطرين على الأقل وإجمالي المدين يساوي الدائن حتى منزلتين.
- كل سطر يحمل مدينًا أو دائنًا، لا كليهما ولا قيمة سالبة.
- الحساب موجود في نفس الشركة ونشط وPosting Account.
- متطلبات project/cost center/cost code تُفحص عند الترحيل.
- تاريخ القيد داخل فترة موجودة ومفتوحة.
- Draft قابل للتعديل، Approved قابل للترحيل أو الإلغاء، Posted غير قابل للتعديل.
- تصحيح Posted يتم بقيد Reversal مقابل؛ لا حذف للتاريخ.
- الأستاذ وميزان المراجعة والقوائم تقرأ القيود المرحلة فقط.

## ما لم يُنفذ بعد

Automatic journals from procurement/inventory/IPC/treasury، accrual schedules، prepayment amortization، straight-line depreciation، provisions، period close/reopen permissions، year-end closing، cash-flow classification، foreign currency revaluation، وsubledger reconciliations. تُضاف مع وحداتها ولا تُحاكى بأرقام.
