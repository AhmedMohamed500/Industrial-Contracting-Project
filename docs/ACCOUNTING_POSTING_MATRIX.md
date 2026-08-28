# Accounting Posting Matrix

## الحالة

**Planned — Accounting Core is next.** لا يوجد posting engine أو GL أو mappings حاليًا. كل حدث أدناه تصميم يحتاج سياسة شركة وحسابات ربط وفترة مفتوحة واعتمادًا.

| Source event | Indicative debit | Indicative credit | Operational effect | Status |
| --- | --- | --- | --- | --- |
| PO approval | None | None | Committed cost | Planned |
| Warehouse receipt under GRNI | Inventory/asset | GRNI | Received quantity | Planned |
| Direct client delivery | Policy-dependent cost/clearing | Policy-dependent GRNI/payable | Delivered, not warehouse stock | Planned |
| Supplier invoice | GRNI/expense/asset + VAT input | Supplier payable | AP document | Planned |
| Purchase/supply return | Reversal by source policy | Reversal by source policy | Returned quantity | Planned |
| Warehouse transfer | None | None | Location only | Planned |
| Material issue | Project cost/WIP | Inventory | Project actual cost | Planned |
| Supply acceptance | Usually none | Usually none | Accepted quantity | Planned |
| Client invoice / IPC | AR/retention | Revenue + VAT output | Invoiced/certified revenue | Planned |
| Client receipt | Cash/Bank | AR | Collected cash | Planned |
| Supplier payment | Supplier payable | Cash/Bank | Cash outflow | Planned |
| Credit/debit note | Source-policy reversal/adjustment | Source-policy reversal/adjustment | Commercial adjustment | Planned |
| Cost allocation | Project/contract cost | Clearing/overhead | Supply/project actual cost | Planned |
| Retention release | Retention receivable/payable | AR/AP/Cash by event | Closeout obligation | Planned |

Mandatory controls: company scope, source approval, open period, account mappings, balanced entry, currency/rate, tax, idempotency, atomic source+journal transaction, immutable audit, reversal rather than deletion. Schedule, lot, requirement, PO approval, delivery, acceptance, invoicing, and collection remain distinct events.
