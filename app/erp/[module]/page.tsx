import { notFound } from 'next/navigation';
import { AccountingApp, type AccountingModule } from '../../../src/components/accounting/accounting-app';

const modules: AccountingModule[] = ['accounts','mapping','opening-balances','journals','general-journal','ledger','trial-balance','financial-statements'];

export default async function AccountingModulePage({params}:{params:Promise<{module:string}>}) {
  const { module } = await params;
  if (!modules.includes(module as AccountingModule)) notFound();
  return <AccountingApp module={module as AccountingModule}/>;
}
