# Local Storage Architecture

IndexedDB is the source of truth; localStorage is not used for transactional data. Dexie schema version 1 is lazy-opened in the browser. React components depend on repository contracts rather than Dexie.

Company-owned records contain `companyId`, internal UUIDs, timestamps, and human codes. First-run creation runs in one IndexedDB transaction. Setup drafts survive refresh. Backup JSON includes schema/app versions and creation time; incompatible versions are rejected. Browser deletion, private-mode limits, and device loss remain user risks.
