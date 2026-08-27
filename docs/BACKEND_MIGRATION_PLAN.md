# Future Backend Migration Plan

The production edition should add API repository implementations behind the existing interfaces. Migration steps: freeze/version local schema, export validated local data, provision production database, map UUIDs and company tenancy, import with reconciliation totals, add real identity/roles/approvals, implement server transactions and idempotency, run parallel accounting validation, then switch repository composition from IndexedDB to API.

Do not embed HTTP calls in React components or change domain calculations merely to migrate storage.
