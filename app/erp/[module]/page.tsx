import { notFound } from 'next/navigation';
import { AccountingApp, type AccountingModule } from '../../../src/components/accounting/accounting-app';
import { CommercialApp, type CommercialModule } from '../../../src/components/commercial/commercial-app';
import { ProcurementApp, type ProcurementModule } from '../../../src/components/procurement/procurement-app';

const modules: AccountingModule[] = ['accounts','mapping','opening-balances','journals','general-journal','ledger','trial-balance','financial-statements'];
const commercialModules: CommercialModule[] = ['clients','suppliers','subcontractors','projects','contracts','boq','budgets','cost-centers','cost-codes','tenders','variations'];
const procurementModules: ProcurementModule[] = ['supply-plans','material-requirements','purchase-requisitions','rfqs','supplier-quotes','purchase-orders'];

export default async function AccountingModulePage({params}:{params:Promise<{module:string}>}) {
  const { module } = await params;
  if (modules.includes(module as AccountingModule)) return <AccountingApp module={module as AccountingModule}/>;
  if (commercialModules.includes(module as CommercialModule)) return <CommercialApp module={module as CommercialModule}/>;
  if (procurementModules.includes(module as ProcurementModule)) return <ProcurementApp module={module as ProcurementModule}/>;
  notFound();
}
