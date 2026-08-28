# Accounting Posting Matrix

## الحالة

**Partial implementation.** Accounting Core and source posting for client/supplier invoices, subcontract certificates, receipts, and payments work through configured mappings and open periods. Inventory/GRNI and other rows remain planned.

| Source event | Indicative debit | Indicative credit | Operational effect | Status |
| --- | --- | --- | --- | --- |
| PO approval | None | None | Committed cost | Planned |
| Warehouse receipt under GRNI | Inventory/asset | GRNI | Received quantity | Planned |
| Direct client delivery | Policy-dependent cost/clearing | Policy-dependent GRNI/payable | Delivered, not warehouse stock | Planned |
| Supplier invoice | Supply cost + VAT input | Supplier payable | AP document | Implemented core |
| Purchase/supply return | Reversal by source policy | Reversal by source policy | Returned quantity | Planned |
| Warehouse transfer | None | None | Location only | Planned |
| Material issue | Project cost/WIP | Inventory | Project actual cost | Planned |
| Supply acceptance | Usually none | Usually none | Accepted quantity | Planned |
| Client invoice / IPC | AR/retention/advance recovery | Revenue + VAT output | Invoiced/certified revenue | Implemented core |
| Client receipt | Cash/Bank | AR | Collected cash | Implemented core |
| Supplier payment | Supplier payable | Cash/Bank | Cash outflow | Implemented core |
| Credit/debit note | Source-policy reversal/adjustment | Source-policy reversal/adjustment | Commercial adjustment | Planned |
| Cost allocation | Project/contract cost | Clearing/overhead | Supply/project actual cost | Planned |
| Retention release | Retention receivable/payable | AR/AP/Cash by event | Closeout obligation | Planned |

Mandatory controls: company scope, source approval, open period, account mappings, balanced entry, currency/rate, tax, idempotency, atomic source+journal transaction, immutable audit, reversal rather than deletion. Schedule, lot, requirement, PO approval, delivery, acceptance, invoicing, and collection remain distinct events.
