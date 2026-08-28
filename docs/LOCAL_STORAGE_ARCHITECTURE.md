# Local Storage Architecture

## Implemented

IndexedDB is the source of truth; localStorage is not used for transactional data. Dexie schema version 9 is lazy-opened in the browser. React depends on repository contracts rather than tables.

Current tables retain v1–v8 and add supply lot, service order, and commercial note stores. Earlier tables remain intact. Company-owned records contain `companyId`, UUIDs, timestamps, and human codes. First-run creation is atomic. Drafts survive refresh. Backup v9 includes all current tables; legacy backups remain restorable with newer tables empty.

## Planned types are not persisted

Commercial, procurement, inventory, finance, forecast, and closeout persistence live in their matching domain modules. Remaining planned types cover advanced controls and integrations. Every migration through v7 is additive.

Before adding a future table: define real use cases and invariants, add repository contract, design indexes/company scope, create an additive Dexie version migration, update backup validation, add fake-indexedDB migration/rollback tests, and document recovery.

Browser deletion, private mode/quota, attachment size, and device loss remain risks. Production requires backend tenancy, authentication, authorization, concurrency, atomic posting, audit, and managed backups.
