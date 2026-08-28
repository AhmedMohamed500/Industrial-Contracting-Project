# Project and Contract Workflow

## الحالة

**Implemented core:** parties, projects, contracts, tenders, BOQ, budget versions, cost dimensions, and variations persist in IndexedDB. **Planned:** downstream supply, procurement, billing, actual costs, and closeout.

## Contract families

Industrial Contracting، Supply Only، Supply & Installation، Maintenance، Service Contract. Each contract shares company/client/project/currency/value/variation dimensions but applies its own quantity, delivery, acceptance, service, and invoicing policy.

## Current flow

Implemented: client → tender/pricing → won conversion → project + contract → BOQ → budget versions → approved variation. Planned: supply plan → procurement → actuals → delivery/acceptance → invoice/collection → profitability → closeout.

Supply & Installation must not merge supplied, accepted, installed, certified, and invoiced quantities. Every cost retains source-document, project, WBS, cost center, cost code, BOQ, contract, and date where applicable.

## Change and closeout

Budget versions and variation revenue/cost/budget/time impacts are implemented. Approved variation revenue updates the revised contract value. Closeout remains planned.
