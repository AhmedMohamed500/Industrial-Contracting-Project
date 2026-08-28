# Treasury and Cash Forecast Workflow

## الحالة

**Implemented core:** source-allocated client receipts and supplier/subcontractor payments through cash/bank mappings, open-period GL posting, balance caps, and paid-state updates. Transfers, cheques, reconciliation, and cash forecast remain planned.

Receipts, payments, transfers, cheques, petty cash, and bank reconciliation use company-scoped accounts, open periods, approvals, and source allocations. Reconciliation never changes books silently; differences require controlled entries.

Cash forecast entries link expected date, inflow/outflow, source document, project/contract when relevant, amount, currency, confidence, and scenario. Examples include client invoice/IPC collection, supplier PO/invoice payment, subcontract certificate, payroll/equipment, tax, retention and guarantee release.

Profit, accounting cash balance, current liquidity, and forecast cash position are separate measures. Actual receipt/payment replaces or closes forecast exposure without deleting its history.
