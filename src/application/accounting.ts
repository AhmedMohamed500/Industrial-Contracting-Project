import type { Account, FinancialStatements, JournalLine, TrialBalanceRow } from '../domain/accounting';

export const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function journalTotals(lines: Pick<JournalLine, 'debit' | 'credit'>[]) {
  return {
    debit: money(lines.reduce((sum, line) => sum + Number(line.debit || 0), 0)),
    credit: money(lines.reduce((sum, line) => sum + Number(line.credit || 0), 0)),
  };
}

export function validateJournalLines(lines: Pick<JournalLine, 'accountId' | 'debit' | 'credit'>[], accounts: Account[]): string[] {
  const errors: string[] = [];
  if (lines.length < 2) errors.push('القيد يجب أن يحتوي على سطرين على الأقل');
  const byId = new Map(accounts.map((account) => [account.id, account]));
  lines.forEach((line, index) => {
    const account = byId.get(line.accountId);
    if (!account) errors.push(`الحساب غير موجود في السطر ${index + 1}`);
    else {
      if (account.status !== 'active') errors.push(`الحساب ${account.code} غير نشط`);
      if (!account.isPosting) errors.push(`الحساب ${account.code} تجميعي ولا يقبل الترحيل`);
      if (account.projectRequired && !('projectId' in line && line.projectId)) errors.push(`المشروع مطلوب للحساب ${account.code}`);
      if (account.costCenterRequired && !('costCenterId' in line && line.costCenterId)) errors.push(`مركز التكلفة مطلوب للحساب ${account.code}`);
      if (account.costCodeRequired && !('costCodeId' in line && line.costCodeId)) errors.push(`كود التكلفة مطلوب للحساب ${account.code}`);
    }
    const debit = Number(line.debit || 0);
    const credit = Number(line.credit || 0);
    if (debit < 0 || credit < 0) errors.push(`لا تقبل القيم السالبة في السطر ${index + 1}`);
    if ((debit > 0 && credit > 0) || (debit === 0 && credit === 0)) errors.push(`أدخل مدينًا أو دائنًا فقط في السطر ${index + 1}`);
  });
  const totals = journalTotals(lines);
  if (totals.debit <= 0 || totals.debit !== totals.credit) errors.push(`القيد غير متوازن: مدين ${totals.debit.toFixed(2)} مقابل دائن ${totals.credit.toFixed(2)}`);
  return [...new Set(errors)];
}

export function buildFinancialStatements(rows: TrialBalanceRow[]): FinancialStatements {
  const group = (category: TrialBalanceRow['category']) => rows.filter((row) => row.category === category);
  const balance = (row: TrialBalanceRow) => row.debitBalance - row.creditBalance;
  const assets = group('asset');
  const liabilities = group('liability');
  const equity = group('equity');
  const revenue = group('revenue');
  const expenses = group('expense');
  const totalAssets = money(assets.reduce((sum, row) => sum + balance(row), 0));
  const totalLiabilities = money(liabilities.reduce((sum, row) => sum + row.creditBalance - row.debitBalance, 0));
  const totalEquity = money(equity.reduce((sum, row) => sum + row.creditBalance - row.debitBalance, 0));
  const totalRevenue = money(revenue.reduce((sum, row) => sum + row.creditBalance - row.debitBalance, 0));
  const totalExpenses = money(expenses.reduce((sum, row) => sum + row.debitBalance - row.creditBalance, 0));
  const netIncome = money(totalRevenue - totalExpenses);
  return { assets, liabilities, equity, revenue, expenses, netIncome, totalAssets, totalLiabilitiesAndEquity: money(totalLiabilities + totalEquity + netIncome) };
}
