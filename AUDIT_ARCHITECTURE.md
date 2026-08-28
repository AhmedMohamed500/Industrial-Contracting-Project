# Phase 0 — Repository Audit and Architecture Package

## 1. Architecture Assessment

The official GitHub repository was empty at audit time: no source tree, history beyond repository initialization, package manifest, data model, tests, or deployable application existed. There was therefore no working implementation to preserve and no legacy migration constraint. The new foundation uses a layered frontend architecture:

`Arabic RTL UI → application services → domain rules/repository contracts → IndexedDB implementations`

Browser components do not call Dexie tables directly. IndexedDB is lazily opened client-side to avoid server rendering failures. The app has no API routes, server actions, remote database, authentication provider, or required environment variables.

## 2. Gap Analysis

Phase 1 is implemented. Phases 2–17 remain pending. The largest gaps are the accounting posting engine and controls, project/BOQ/budget model, procurement documents, inventory valuation, subledgers, client/subcontractor certificates, treasury transactions, closing, and financial reporting. The current zero-valued dashboard deliberately does not simulate those results.

## 3. Current Repository Assessment

The repository now contains a Next-compatible React application, versioned IndexedDB schema, domain models, repository interfaces and implementations, application services, an Arabic setup wizard, a foundation workspace, tests, and project documentation. No prior code was deleted because none existed.

## 4. Proposed Folder Structure

```text
app/                         framework routes and metadata
src/domain/                  entities, invariants, validation, repository contracts
src/application/             use cases, posting/reporting services, backup and dates
src/infrastructure/indexeddb schema, migrations, IndexedDB repositories
src/components/              Arabic RTL product UI
tests/                       rule and repository tests
docs/                        accounting, workflow, storage, and migration guidance
```

Later phases should add `src/domain/accounting`, `src/application/posting`, and repository implementations by module without allowing UI-to-Dexie coupling.

## 5. Complete Module Map and Dependencies

Foundation (company, branch, fiscal year, period) is upstream of every module. Accounting core (accounts, mapping, period control, journal) is upstream of any posting source. Projects depend on company plus clients and drive BOQ, budgets, cost centers, and cost codes. Procurement depends on suppliers/projects and creates commitments; inventory/AP converts receipt/invoice events into stock and payables. Material issue creates project actual cost. Subcontract and client certificates create project cost/revenue plus retention/advance subledgers. Treasury settles receivables/payables. Closing and reporting read posted journals and reconciled subledgers only.

## 6. Local IndexedDB Schema

Schema version 1 includes: `companies`, `branches`, `fiscalYears`, `accountingPeriods`, `taxes`, `treasuryAccounts`, `warehouses`, `projects`, `localProfiles`, `setupDrafts`, `appSettings`, and `auditEvents`. Company-owned records carry `companyId`; internal IDs are UUIDs; human codes are separately indexed. No commercial record is seeded. Later versions must use Dexie version migrations and preserve backup compatibility.

## 7. Repository Interfaces

Current contracts are `CompanyRepository`, `BranchRepository`, and `FoundationRepository`. Concrete implementations are prefixed `IndexedDB`. Future API repositories must implement the same contracts. Each later module receives a focused repository rather than a single universal data-access class.

## 8. Accounting Posting Event Matrix

| Source event | Debit | Credit | Project effect | Inventory effect | Phase |
| --- | --- | --- | --- | --- | --- |
| Opening balance | configured account | opening balance clearing/equity | optional | optional | 2 |
| Goods receipt | Inventory | GRNI | no actual project cost | quantity/value in | 5 |
| Purchase invoice | Inventory/Expense + VAT input | Supplier | possible actual/clearing | value reconciliation | 5 |
| Supplier payment | Supplier | Cash/Bank | cash only | none | 5/9 |
| Material issue | Project Cost/WIP | Inventory | actual material cost | quantity/value out | 6 |
| Subcontract certificate | Project subcontract cost/WIP | Payable/retention/advance recovery | actual subcontract cost | none | 7 |
| Client certificate | AR/retention/advance recovery | Revenue + VAT output | certified revenue | none | 8 |
| Client receipt | Cash/Bank | AR | project cash position | none | 8/9 |

All account references must come from company accounting mappings. No posting function exists yet, so Phase 1 cannot create financial history.

## 9. Project Costing Architecture

Cost is classified by company, project, optional WBS, cost center, cost code, BOQ item, and source document. Approved POs/subcontracts create committed cost only. Receipts/invoices follow configured recognition rules. Warehouse transfers never create consumption. Material issues create actual material cost. Forecast separates actual, committed, ETC, EAC, certified revenue, collected cash, and project cash position.

## 10. Document Workflow Matrix

| Document family | Workflow | Accounting point |
| --- | --- | --- |
| Procurement | PR → RFQ → quotation → comparison → PO | commitment at approved PO |
| Inventory/AP | PO → receipt → invoice → payment | receipt/invoice/payment by configuration |
| Material | transfer → site stock → issue/return | issue/return only |
| Subcontract | subcontract → certificate → payment | certificate and payment |
| Client | contract/BOQ → IPC → receipt | posted IPC and receipt |
| Accounting | draft → approved → posted → reversal | posted only |

Valid states will be centrally defined. Posted values are immutable; correction uses reversal or adjustment documents.

## 11. Navigation Map

The shell reserves the Arabic module map from the brief. Phase 1 activates الرئيسية، ابدأ من هنا، تهيئة النظام، والشركات والفروع. Later modules are visibly marked “قريباً” rather than linked to fake screens.

## 12. Accounting Controls

Required controls are balanced journals, unique source posting, open-period validation, configured-account validation, company scoping, source-to-journal traceability, atomic posting, locked posted values, reversal instead of editing, and subsidiary-to-GL reconciliation. Phase 1 enforces company isolation and atomic setup but does not claim accounting controls are implemented.

## 13. Validation Rules

Company/fiscal-year required fields and dates are validated. Codes use stable internal UUIDs and unique human identifiers. Optional records are created only when enabled. Restore validates schema version. Future rules include balanced debit/credit, closed period rejection, duplicate external document warnings, quantity availability, three-way match tolerances, retention/advance bounds, and document state transitions.

## 14. Reporting Map

Operational reports read source repositories; financial reports read posted journals only. Required drilldown is KPI → ledger/subledger → journal → source document. Reports remain pending; current KPI cards show zero and “no transactions” because no posting source exists.

## 15. Phased Implementation Plan

Follow phases 1–17 in the master brief. Phase 2 is next and must stop until journals, ledger, and trial balance reconcile. Each phase adds schema through a versioned migration, updates posting/docs/status, and passes lint, typecheck, tests, and production build before merge.

## 16. Edge Cases

- Non-calendar and short fiscal years; leap years; closed periods.
- Duplicate codes differing only by case.
- Interrupted setup and refresh recovery.
- Backup from a newer or corrupt schema.
- Multiple companies with identical supplier/project codes but no cross-company leakage.
- Atomic rollback after partial posting failure.
- Negative inventory, returns above issue/receipt, and backdated valuation.
- Partial receipts/invoices/payments, over-certification, retention release, advance recovery, tax rounding, and reversals.

## 17. Risks

Browser storage can be cleared by the user/device and is not shared across devices. Local profiles are not security. IndexedDB quota and large attachments require limits. Accounting risk is highest around recognition timing, GRNI, retention, advances, tax, closing, and project WIP. Dependency advisories from the generated frontend toolchain require monitoring; force-upgrading is unsafe without compatibility testing.

## 18. Testing Strategy

Pure rule tests cover dates, balancing, transitions, tax/retention calculations, and valuation. Repository tests run against fake IndexedDB. Posting tests verify atomicity, idempotency, traceability, and rollback. Integration scenarios reproduce the complete workflow from an empty database. Browser checks cover refresh persistence, RTL/responsive navigation, backup/restore, and Vercel client rendering.

## 19. GitHub and Vercel Deployment Plan

`main` is the production branch in the official repository. CI/deployment should run install, lint, typecheck, tests, and build. Vercel serves only the frontend; no database/storage/server persistence or persistence environment variable is permitted. IndexedDB access stays behind client boundaries. A GitHub-connected Vercel project can deploy stable `main` commits.

## 20. Documentation Plan

`PROJECT_STATUS.md` is the authoritative handoff. `README.md` explains the trial. Workflow and accounting documents under `docs/` are updated when their phases change. Documentation must distinguish implemented, partial, planned, and prohibited behavior.

## 21. Architecture Expansion Audit — Contracts and Supply

The existing layered direction remains valid: UI → application use cases → domain/repository contracts → storage implementation. Dexie schema version 2 is an additive migration: all v1 stores remain and accounts, accounting mappings, journal entries, and journal lines are added. The new `src/domain/planned-operations.ts` remains architecture-only and has no operational persistence tables.

### Accounting Core implementation

`src/domain/accounting.ts` defines company-scoped accounts, mapping keys, journal lifecycle, ledger and trial-balance views. `IndexedDBAccountingRepository` enforces active posting accounts, open periods, balanced entries, status transitions, immutable posted history, and opposite-entry reversals. Ledger, trial balance, Income Statement, and Balance Sheet are derived from posted journal lines rather than editable balance caches. Backup schema v2 includes all accounting stores and accepts legacy v1 envelopes.

Future contract discriminators are `industrial_contracting`, `supply_only`, `supply_and_installation`, `maintenance`, and `service_contract`. Contract type controls workflow policy, not company isolation, ledger rules, or traceability.

### Supply Domain

The planned aggregate starts with `SupplyContract` and `SupplyBOQItem`. Delivery commitments are revisioned through `SupplySchedule` and `SupplyLot`; demand is explicit in `SupplyRequirement`. Fulfillment uses `SupplyDelivery`, `SupplyDeliveryLine`, `SupplyInspection`, and `SupplyReturn`. Landed/allocated amounts use `SupplyCostAllocation`.

Quantity stages remain independent: contracted, scheduled, required, ordered, purchased, in transit, received, delivered, accepted, invoiced, collected, returned, and remaining. Each transition requires a source document and must be reversible without overwriting history.

### Integration with Project and Contract

Supply BOQ lines link to client contract and project dimensions. Supply & Installation keeps supplied, accepted, installed, certified, and invoiced quantities distinct. A supply-only contract may stop at acceptance before invoicing; an industrial contract may feed accepted material to installation/work-measurement flows.

### Integration with Procurement

Supply requirements can create or consolidate purchase requisitions. Approved purchase orders create committed cost, not received stock, accepted client quantity, actual cost, or supplier payable. Supplier, PO line, supply lot, BOQ line, project, and required-by date remain traceable.

### Integration with Inventory and Direct Delivery

Three scenarios are required: supplier → main warehouse → client; supplier → project warehouse → client; and supplier → client directly. Direct delivery records supplier dispatch, client delivery, inspection/acceptance, and cost allocation without manufacturing warehouse receipt/issue entries. Warehouse transfer is not consumption. Returns preserve origin and destination.

### Integration with Accounting

The Phase 2 posting engine remains the next implementation dependency. Future supply posting uses configured control accounts and open periods. Candidate events include receipt/GRNI, supplier invoice, purchase return, client invoice/IPC, collection, credit/debit note, cost allocation, and reversal. Approval of a schedule, lot, requirement, or PO does not create revenue or cash.

### Future Backend Impact

Planned repositories remain asynchronous and company-scoped so API implementations can replace IndexedDB. A production backend must add tenancy enforcement, identity/roles, optimistic concurrency, document numbering, atomic posting, idempotency, attachment storage, approvals, immutable audit, and server-side quantity controls. Local UUIDs and backup schema versions require explicit migration.

## 22. Extended Planned Domains

Architecture-only concepts also cover Service Orders, Site Material Requests, Material Reservations, Direct Site Receiving, Purchase Returns, credit/debit notes, Method Statements, mobilization/demobilization, site/company overhead, inter-project/intercompany movements, project closeout/handovers, DLP, retention/guarantee release, supplier performance, cash forecast, budget revision/change control, document center, and expanded cost types.

None are implemented screens, workflows, posting rules, or Dexie tables. Delivery follows the roadmap after the accounting core.

## 23. Commercial and Project Core Implementation

Schema v3 adds company-scoped parties, contracts, BOQ items, project budget lines, cost dimensions, tenders, and variations while retaining v1/v2 stores. Implemented screens expose working CRUD and state actions only. Tender conversion creates its project and contract in one Dexie transaction and returns the same identifiers when repeated. Approved variation revenue is recomputed from source variations and updates contract revised value atomically. Supply, procurement, inventory, client billing, and actual-cost posting remain outside this batch.

## 24. Supply Planning and Procurement Core

Schema v4 adds supply plans, material requirements, purchase requisitions, RFQs, supplier quotes, and purchase orders. PR state transitions are explicit; RFQ requires an approved PR and valid invited suppliers. Quote selection closes the RFQ, marks one quote selected, and creates one idempotent PO in a single transaction. PO approval represents committed cost only. Dispatch, receipt, inventory, inspection, supplier invoicing, payment, and accounting posting are not inferred from PO approval.
