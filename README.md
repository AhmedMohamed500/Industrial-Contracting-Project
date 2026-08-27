# Industrial Contracting ERP — Frontend-Only Trial

Arabic RTL ERP trial for industrial, electromechanical, MEP, installation, maintenance, steel, piping, and construction contractors. It is intended to let a company evaluate a guided accounting and project workflow before a production backend edition is commissioned.

## Current Scope

Phase 1 provides local company setup, fiscal periods, basic masters, company isolation, setup progress, and backup/restore. It starts empty and never seeds commercial values. Accounting and operational transaction modules are intentionally pending; see `PROJECT_STATUS.md`.

## Architecture and Data

The UI calls application services and repository interfaces. Current repositories persist to IndexedDB through Dexie. There is no backend, cloud database, paid API, or required environment variable. Data remains on the same browser/device and can disappear if browser storage is cleared.

Backups are downloaded JSON envelopes containing `schemaVersion`, `appVersion`, and `createdAt`. Restore replaces local ERP records only after compatibility validation. Keep backup files outside the browser.

## Run Locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Accounting and Project Costing

Financial statements will be generated from posted balanced journals only. Account IDs will come from company mappings, not module constants. Approved purchase orders/subcontracts create committed cost; actual cost is recognized by the configured receipt/invoice/certificate event. Warehouse transfer is not consumption; material issue creates project material cost. Profit and cash position remain separate measures.

## Deployment

Official source: https://github.com/AhmedMohamed500/Industrial-Contracting-Project.git. Production deploys automatically from `main` to https://industrial-contracting-project.vercel.app as a frontend web app. Do not add Vercel storage, databases, server persistence, or backend environment variables.

## Documentation

Start with `AUDIT_ARCHITECTURE.md`, `PROJECT_STATUS.md`, and `docs/USER_GUIDE_AR.md`. Detailed accounting/workflow documents are updated phase by phase and must never imply unfinished modules are available.
