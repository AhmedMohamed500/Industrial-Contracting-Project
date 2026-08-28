# Local Storage Architecture

## Implemented

IndexedDB is the source of truth; localStorage is not used for transactional data. Dexie schema version 4 is lazy-opened in the browser. React depends on repository contracts rather than tables.

Current tables retain v1–v3 and add supplyPlans, materialRequirements, purchaseRequisitions, rfqs, supplierQuotes, and purchaseOrders. Accounts and commercial tables remain intact. Company-owned records contain `companyId`, UUIDs, timestamps, and human codes. First-run creation is atomic. Drafts survive refresh. Backup v4 includes procurement, commercial, and accounting tables; legacy v1/v2 backups remain restorable with newer tables empty.

## Planned types are not persisted

`src/domain/planned-operations.ts` contains future supply/service/forecast/closeout interfaces. Commercial persistence lives in `src/domain/commercial.ts`; procurement persistence lives in `src/domain/procurement.ts`. Receiving/inventory tables do not exist yet. The v3 migration is additive and preserves v1/v2 data.

Before adding a future table: define real use cases and invariants, add repository contract, design indexes/company scope, create an additive Dexie version migration, update backup validation, add fake-indexedDB migration/rollback tests, and document recovery.

Browser deletion, private mode/quota, attachment size, and device loss remain risks. Production requires backend tenancy, authentication, authorization, concurrency, atomic posting, audit, and managed backups.
