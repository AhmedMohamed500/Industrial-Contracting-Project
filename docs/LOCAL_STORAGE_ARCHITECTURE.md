# Local Storage Architecture

## Implemented

IndexedDB is the source of truth; localStorage is not used for transactional data. Dexie schema version 2 is lazy-opened in the browser. React depends on repository contracts rather than tables.

Current tables retain all v1 tables and add accounts, accountingMappings, journalEntries, and journalLines. Company-owned records contain `companyId`, UUIDs, timestamps, and human codes. First-run creation is atomic. Drafts survive refresh. Backup v2 includes accounting tables; legacy v1 backups remain restorable with new tables empty.

## Planned types are not persisted

`src/domain/planned-operations.ts` contains future contract/supply/service/forecast/closeout interfaces only. No matching operational tables exist yet. The accounting v2 migration is additive and preserves existing v1 company data.

Before adding a future table: define real use cases and invariants, add repository contract, design indexes/company scope, create an additive Dexie version migration, update backup validation, add fake-indexedDB migration/rollback tests, and document recovery.

Browser deletion, private mode/quota, attachment size, and device loss remain risks. Production requires backend tenancy, authentication, authorization, concurrency, atomic posting, audit, and managed backups.
