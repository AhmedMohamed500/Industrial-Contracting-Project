# Accounting Posting Matrix

All accounts below are configured mappings, never fixed IDs.

| Transaction | Debit | Credit | Project | Inventory |
| --- | --- | --- | --- | --- |
| Goods receipt | Inventory | GRNI | No actual cost | Increase |
| Purchase invoice | Inventory/Expense + VAT input | Supplier/GRNI | Configurable | Value match |
| Supplier payment | Supplier | Cash/Bank | Cash only | None |
| Material issue | Project cost/WIP | Inventory | Actual cost | Decrease |
| Material return | Inventory | Project cost/WIP | Reverse actual | Increase |
| Subcontract certificate | Project subcontract cost/WIP | Payable, retention, advance | Actual cost | None |
| Client IPC | AR, retention, advance recovery | Revenue + VAT output | Certified revenue | None |
| Client receipt | Cash/Bank | AR | Cash position | None |

Status: matrix only. The Phase 2 central posting engine must validate source, period, mappings, balance, idempotency, and atomicity.
