import { notFound } from 'next/navigation';
import { AccountingApp, type AccountingModule } from '../../../src/components/accounting/accounting-app';
import { CommercialApp, type CommercialModule } from '../../../src/components/commercial/commercial-app';
import { ProcurementApp, type ProcurementModule } from '../../../src/components/procurement/procurement-app';
import { InventoryApp, type InventoryModule } from '../../../src/components/inventory/inventory-app';

const modules: AccountingModule[] = ['accounts','mapping','opening-balances','journals','general-journal','ledger','trial-balance','financial-statements'];
const commercialModules: CommercialModule[] = ['clients','suppliers','subcontractors','projects','contracts','boq','budgets','cost-centers','cost-codes','tenders','variations'];
const procurementModules: ProcurementModule[] = ['supply-plans','material-requirements','purchase-requisitions','rfqs','supplier-quotes','purchase-orders'];
const inventoryModules: InventoryModule[] = ['items','goods-receipts','stock-ledger','client-deliveries','delivery-inspections','purchase-returns'];

export default async function AccountingModulePage({params}:{params:Promise<{module:string}>}) {
  const { module } = await params;
  if (modules.includes(module as AccountingModule)) return <AccountingApp module={module as AccountingModule}/>;
  if (commercialModules.includes(module as CommercialModule)) return <CommercialApp module={module as CommercialModule}/>;
  if (procurementModules.includes(module as ProcurementModule)) return <ProcurementApp module={module as ProcurementModule}/>;
  if (inventoryModules.includes(module as InventoryModule)) return <InventoryApp module={module as InventoryModule}/>;
  notFound();
}
