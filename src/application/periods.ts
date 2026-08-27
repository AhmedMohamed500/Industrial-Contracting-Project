import type { AccountingPeriod } from '../domain/foundation';

export function generateMonthlyPeriods(companyId: string, fiscalYearId: string, startDate: string, endDate: string, now: string): AccountingPeriod[] {
  const periods: AccountingPeriod[] = [];
  const end = new Date(`${endDate}T00:00:00Z`);
  let cursor = new Date(`${startDate}T00:00:00Z`);
  while (cursor <= end) {
    const periodStart = new Date(cursor);
    const naturalEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
    const periodEnd = naturalEnd > end ? end : naturalEnd;
    periods.push({
      id: crypto.randomUUID(), companyId, fiscalYearId,
      name: new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(periodStart),
      startDate: periodStart.toISOString().slice(0, 10), endDate: periodEnd.toISOString().slice(0, 10),
      status: 'open', createdAt: now, updatedAt: now,
    });
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }
  return periods;
}
