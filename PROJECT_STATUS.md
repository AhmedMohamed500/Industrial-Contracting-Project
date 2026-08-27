# Project Overview

Frontend-only Arabic Industrial Contracting ERP trial. The repository began empty. Phase 1 local foundation is implemented; later operational and accounting phases are not.

# Current Architecture

Next-compatible React UI → application services → domain/repository interfaces → Dexie/IndexedDB repositories. No component accesses IndexedDB tables directly.

# No Backend Policy

No backend, API persistence, cloud database, paid service, or persistence environment variables. Data stays in the current browser. Local profiles are a trial simulation, not authentication.

# Implemented Modules

- Arabic RTL first-run wizard with draft recovery.
- Multiple isolated companies and company switcher.
- Company, branch, fiscal year, generated accounting periods, optional tax, treasury, warehouse, and first-project foundation.
- Setup progress and honest zero-data dashboard.
- Versioned local backup/restore and audit event foundation.

# Pending Modules

All phase 2–17 modules are pending. Disabled navigation items are not implemented screens.

# Accounting Cycle Status

Pending Phase 2. No accounts, mappings, opening balances, journals, ledgers, trial balance, or posting engine exist yet. No financial transaction can be posted.

# Project Cycle Status

Only an optional project master placeholder can be created during setup. Contracts, hierarchy, BOQ, budget, baseline, variations, claims, and costing are pending Phase 3.

# Procurement Status

Pending Phase 4.

# Inventory Status

Warehouse master foundation exists. Items, receipts, stock ledger, valuation, transfers, and issues are pending Phases 5–6.

# Subcontractor Status

Pending Phase 7.

# Client Status

Pending Phase 3 masters and Phase 8 certificates/revenue.

# Treasury Status

Cashbox/bank master foundation can be created. Transactions, cheques, petty cash, and reconciliation are pending Phase 9.

# Closing Cycle Status

Pending Phases 10–11.

# Reporting Status

Pending. Dashboard financial values are explicitly zero with no-transaction states.

# Accounting Posting Matrix

Designed in `AUDIT_ARCHITECTURE.md` and `docs/ACCOUNTING_POSTING_MATRIX.md`; no posting implementation yet.

# Local Data Model

IndexedDB schema version 1: companies, branches, fiscal years, periods, taxes, treasury accounts, warehouses, projects, local profiles, drafts, settings, and audit events. Company-owned records include `companyId`.

# Completed Work

Repository audit, architecture package, application scaffold, Phase 1 data/domain/repository layers, guided UI, local persistence, company isolation, backup/restore, and initial automated tests.

# Known Issues

- Browser data can be cleared and is device-specific; backups are the user’s responsibility.
- Logo upload is not included in Phase 1.
- The scaffold dependency tree reports upstream audit advisories; no force upgrade was applied because it could break framework compatibility.
- Vercel connection cannot be represented in source alone and must be verified against the account/project after push.

# Pending Work

Phase 2 accounting core is next. Do not start source-document modules before accounting balances and controls pass tests.

# Tests

Automated coverage includes period generation, backup compatibility, empty database behavior, atomic setup, optional zero records, and duplicate company-code rejection. Current command results are recorded at the end of the phase/commit report.

# GitHub

Official repository: https://github.com/AhmedMohamed500/Industrial-Contracting-Project.git

# Vercel Deployment

Target is a frontend-only deployment from `main`. No Vercel database, storage, or backend feature is allowed.

# Future Backend Migration

Add API repository implementations behind current contracts, server authentication/authorization, concurrency controls, and database transactions. UI and application rules should remain largely unchanged.
