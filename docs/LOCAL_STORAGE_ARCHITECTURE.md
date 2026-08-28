# Local Storage Architecture

## Implemented

IndexedDB is the source of truth; localStorage is not used for transactional data. Dexie schema version 6 is lazy-opened in the browser. React depends on repository contracts rather than tables.

Current tables retain v1–v5 and add clientInvoices, supplierInvoices, subcontractCertificates, and cashTransactions. Earlier accounting, commercial, procurement, and inventory tables remain intact. Company-owned records contain `companyId`, UUIDs, timestamps, and human codes. First-run creation is atomic. Drafts survive refresh. Backup v6 includes all current tables; legacy backups remain restorable with newer tables empty.

## Planned types are not persisted

`src/domain/planned-operations.ts` contains future service/forecast/closeout interfaces. Commercial, procurement, and inventory persistence live in their matching domain modules. Billing and treasury persistence lives in `src/domain/finance.ts`; forecast and closeout tables do not exist yet. Every migration through v5 is additive.

Before adding a future table: define real use cases and invariants, add repository contract, design indexes/company scope, create an additive Dexie version migration, update backup validation, add fake-indexedDB migration/rollback tests, and document recovery.

Browser deletion, private mode/quota, attachment size, and device loss remain risks. Production requires backend tenancy, authentication, authorization, concurrency, atomic posting, audit, and managed backups.
