import { describe, expect, it } from 'vitest';
import { generateMonthlyPeriods } from '../src/application/periods';

describe('generateMonthlyPeriods', () => {
  it('covers a fiscal year without extending beyond its end date', () => {
    const periods = generateMonthlyPeriods('company-1', 'year-1', '2027-01-01', '2027-12-31', '2026-08-27T00:00:00.000Z');
    expect(periods).toHaveLength(12);
    expect(periods[0]).toMatchObject({ startDate: '2027-01-01', endDate: '2027-01-31', status: 'open' });
    expect(periods[11]).toMatchObject({ startDate: '2027-12-01', endDate: '2027-12-31' });
  });

  it('supports a short non-calendar fiscal range', () => {
    const periods = generateMonthlyPeriods('company-1', 'year-1', '2027-03-15', '2027-05-10', '2026-08-27T00:00:00.000Z');
    expect(periods.map((period) => [period.startDate, period.endDate])).toEqual([
      ['2027-03-15', '2027-03-31'], ['2027-04-01', '2027-04-30'], ['2027-05-01', '2027-05-10'],
    ]);
  });
});
