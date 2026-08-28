import { notFound } from 'next/navigation';
import { AccountingApp, type AccountingModule } from '../../../src/components/accounting/accounting-app';
import { CommercialApp, type CommercialModule } from '../../../src/components/commercial/commercial-app';

const modules: AccountingModule[] = ['accounts','mapping','opening-balances','journals','general-journal','ledger','trial-balance','financial-statements'];
const commercialModules: CommercialModule[] = ['clients','suppliers','subcontractors','projects','contracts','boq','budgets','cost-centers','cost-codes','tenders','variations'];

export default async function AccountingModulePage({params}:{params:Promise<{module:string}>}) {
  const { module } = await params;
  if (modules.includes(module as AccountingModule)) return <AccountingApp module={module as AccountingModule}/>;
  if (commercialModules.includes(module as CommercialModule)) return <CommercialApp module={module as CommercialModule}/>;
  notFound();
}
