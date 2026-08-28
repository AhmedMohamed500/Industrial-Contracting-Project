# Inventory Workflow

## الحالة

**Implemented core:** item master, receipt from approved PO, posted stock movement, stock ledger/on-hand, client delivery, direct delivery without fake stock movement, inspection, and supplier return. Reservations, transfers, adjustments, advanced valuation, and accounting posting remain planned.

Purchase receipt increases controlled stock when goods physically enter a company warehouse. Transfer changes location only and is not consumption. Material issue creates project material consumption/cost; return reverses against its source. Count and adjustment require reason, approval, valuation, and audit.

## Supply delivery scenarios

- Supplier → main warehouse → client: real receipt followed by real delivery/issue.
- Supplier → project warehouse → client: project-scoped receipt followed by delivery.
- Supplier → client direct: Direct Site/Client Receiving and acceptance without fake warehouse movements.

Reserved, available, received, delivered, accepted, returned, and consumed quantities stay separate. Weighted average is the planned initial valuation method; serial/batch tracking is policy-driven. Purchase Return links to original receipt and supplier document.
