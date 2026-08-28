import { notFound } from 'next/navigation';
import { AccountingApp, type AccountingModule } from '../../../src/components/accounting/accounting-app';
import { CommercialApp, type CommercialModule } from '../../../src/components/commercial/commercial-app';
import { ProcurementApp, type ProcurementModule } from '../../../src/components/procurement/procurement-app';
import { InventoryApp, type InventoryModule } from '../../../src/components/inventory/inventory-app';
import { FinanceApp, type FinanceModule } from '../../../src/components/finance/finance-app';
import { ReportingApp, type ReportingModule } from '../../../src/components/reporting/reporting-app';
import { InventoryOperationsApp, type InventoryOperationsModule } from '../../../src/components/inventory/inventory-operations-app';
import { SupplyControlApp, type SupplyControlModule } from '../../../src/components/supply/supply-control-app';
import { ExecutionApp, type ExecutionModule } from '../../../src/components/execution/execution-app';
import { ResourcesApp, type ResourcesModule } from '../../../src/components/resources/resources-app';
import { BankingApp, type BankingModule } from '../../../src/components/banking/banking-app';

const modules: AccountingModule[] = ['accounts','mapping','opening-balances','journals','general-journal','ledger','trial-balance','financial-statements'];
const commercialModules: CommercialModule[] = ['clients','suppliers','subcontractors','projects','contracts','boq','budgets','cost-centers','cost-codes','tenders','variations'];
const procurementModules: ProcurementModule[] = ['supply-plans','material-requirements','purchase-requisitions','rfqs','supplier-quotes','purchase-orders'];
const inventoryModules: InventoryModule[] = ['items','goods-receipts','stock-ledger','client-deliveries','delivery-inspections','purchase-returns'];
const financeModules: FinanceModule[] = ['client-invoices','supplier-invoices','subcontract-certificates','treasury'];
const reportingModules: ReportingModule[] = ['project-performance','cash-forecast','supplier-performance','period-close','project-closeout'];
const inventoryOperationsModules: InventoryOperationsModule[] = ['units','site-requests','reservations','warehouse-transfers','material-issues','stock-adjustments','stock-counts','waste'];
const supplyControlModules: SupplyControlModule[] = ['supply-control','supply-lots','quantity-tracking','three-way-match','service-orders','commercial-notes'];
const executionModules: ExecutionModule[] = ['subcontracts','client-ipc','materials-on-site','handovers','retention-releases'];
const resourcesModules: ResourcesModule[] = ['expenses','timesheets','equipment','fixed-assets','depreciation','bank-guarantees'];
const bankingModules: BankingModule[] = ['bank-accounts','bank-transfers','cheques','petty-cash','bank-reconciliation'];

export default async function AccountingModulePage({params}:{params:Promise<{module:string}>}) {
  const { module } = await params;
  if (modules.includes(module as AccountingModule)) return <AccountingApp module={module as AccountingModule}/>;
  if (commercialModules.includes(module as CommercialModule)) return <CommercialApp module={module as CommercialModule}/>;
  if (procurementModules.includes(module as ProcurementModule)) return <ProcurementApp module={module as ProcurementModule}/>;
  if (inventoryModules.includes(module as InventoryModule)) return <InventoryApp module={module as InventoryModule}/>;
  if (financeModules.includes(module as FinanceModule)) return <FinanceApp module={module as FinanceModule}/>;
  if (reportingModules.includes(module as ReportingModule)) return <ReportingApp module={module as ReportingModule}/>;
  if (inventoryOperationsModules.includes(module as InventoryOperationsModule)) return <InventoryOperationsApp module={module as InventoryOperationsModule}/>;
  if (supplyControlModules.includes(module as SupplyControlModule)) return <SupplyControlApp module={module as SupplyControlModule}/>;
  if (executionModules.includes(module as ExecutionModule)) return <ExecutionApp module={module as ExecutionModule}/>;
  if (resourcesModules.includes(module as ResourcesModule)) return <ResourcesApp module={module as ResourcesModule}/>;
  if (bankingModules.includes(module as BankingModule)) return <BankingApp module={module as BankingModule}/>;
  notFound();
}
