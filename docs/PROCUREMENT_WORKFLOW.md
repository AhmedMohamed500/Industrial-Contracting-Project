# Procurement Workflow

## الحالة

**Implemented cycle:** Supply Plan/Requirement → PR → approval → RFQ → supplier quotations/comparison → selected quote → PO → receipt → supplier invoice → payment/return, with PO/GRN/invoice variance reporting and GL source posting.

The implemented local flow preserves requirement, PR, RFQ, quote, and PO references. A PR must be approved before RFQ. Only invited suppliers can quote. Selecting a quote closes its RFQ and creates one idempotent PO in a Dexie transaction. The remaining dispatch/receipt/inspection/invoice/payment flow is planned.

Approved PO creates committed cost only. Receipt, client delivery, client acceptance, supplier invoice, and payment are independent. PO lines should link to supplier, item/service, project, BOQ, supply lot, required-by date, quantity, price, tax, and delivery location.

Supplier performance measures on-time delivery, accepted/rejected quality, returns, commercial variance, responsiveness, and unresolved claims. Consolidating requirements must preserve source traceability and dates.
