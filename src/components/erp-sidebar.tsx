'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArchiveRestore, BarChart3, BookOpen, Boxes, Building2, Calculator, CheckCircle2, ChevronDown, ClipboardList, FileCheck2, FileSpreadsheet, FileText, Handshake, Landmark, ListTree, Settings, ShieldCheck, ShoppingCart, Tags, TrendingUp, Truck, Users, X } from 'lucide-react';

const groups = [
  { title: 'الإدارة', items: [
    ['الرئيسية','/setup',BarChart3], ['ابدأ من هنا','/setup#start',CheckCircle2],
    ['تهيئة النظام','/setup#setup-progress',Settings], ['الشركات والفروع','/setup#companies',Building2],
  ]},
  { title: 'المشروعات والعقود', items: [
    ['المشروعات','/erp/projects',Building2], ['العقود','/erp/contracts',Handshake],
    ['المناقصات والتسعير','/erp/tenders',FileSpreadsheet], ['BOQ','/erp/boq',ListTree],
    ['الميزانيات','/erp/budgets',Calculator], ['مراكز التكلفة','/erp/cost-centers',Boxes],
    ['أكواد التكلفة','/erp/cost-codes',Tags], ['التغييرات والمطالبات','/erp/variations',TrendingUp],
    ['WBS','/erp/wbs',ListTree], ['متابعة المشروع','/erp/project-control',BarChart3], ['Earned Value','/erp/earned-value',TrendingUp],
    ['التجهيز والسحب','/erp/mobilization',Truck], ['توزيع الأعباء','/erp/overhead-allocation',Calculator], ['تحميلات بين المشروعات','/erp/inter-project',FileSpreadsheet],
  ]},
  { title: 'الأطراف', items: [
    ['العملاء','/erp/clients',Users], ['الموردون','/erp/suppliers',Users], ['مقاولو الباطن','/erp/subcontractors',Users],
  ]},
  { title: 'التوريد والمشتريات', items: [
    ['مراقبة التوريدات','/erp/supply-control',TrendingUp], ['خطط التوريد','/erp/supply-plans',Truck], ['دفعات التوريد','/erp/supply-lots',Boxes], ['تتبع الكميات','/erp/quantity-tracking',BarChart3], ['احتياجات المواد','/erp/material-requirements',Boxes],
    ['طلبات الشراء PR','/erp/purchase-requisitions',ClipboardList], ['طلبات عروض الأسعار RFQ','/erp/rfqs',FileSpreadsheet],
    ['مقارنة عروض الموردين','/erp/supplier-quotes',Calculator], ['أوامر الشراء PO','/erp/purchase-orders',ShoppingCart], ['المطابقة الثلاثية','/erp/three-way-match',FileCheck2], ['أوامر الخدمات','/erp/service-orders',Handshake], ['إشعارات الخصم والإضافة','/erp/commercial-notes',FileText],
  ]},
  { title: 'المخزون والتسليم', items: [
    ['الأصناف','/erp/items',Tags], ['الوحدات','/erp/units',Calculator], ['استلامات الموردين','/erp/goods-receipts',ArchiveRestore],
    ['سجل المخزون','/erp/stock-ledger',BookOpen], ['تسليمات العميل','/erp/client-deliveries',Truck],
    ['تقييم المخزون','/erp/inventory-valuation',Calculator], ['مطابقة المخزون مع GL','/erp/inventory-reconciliation',FileCheck2],
    ['طلبات خامات المواقع','/erp/site-requests',ClipboardList], ['حجز الخامات','/erp/reservations',Boxes],
    ['تحويلات المخازن','/erp/warehouse-transfers',Truck], ['صرف للمشروعات','/erp/material-issues',ArchiveRestore],
    ['التسويات','/erp/stock-adjustments',Calculator], ['الجرد','/erp/stock-counts',FileSpreadsheet], ['الهالك','/erp/waste',X],
    ['الفحص والقبول','/erp/delivery-inspections',FileCheck2], ['مرتجعات المورد','/erp/purchase-returns',ArchiveRestore],
  ]},
  { title: 'التنفيذ والمستخلصات', items: [
    ['عقود مقاولي الباطن','/erp/subcontracts',Handshake], ['مستخلصات العملاء IPC','/erp/client-ipc',FileCheck2],
    ['Materials on Site','/erp/materials-on-site',Boxes], ['التسليم الجزئي والنهائي','/erp/handovers',CheckCircle2],
    ['إطلاق الاحتجاز','/erp/retention-releases',Landmark],
    ['فترة ضمان العيوب DLP','/erp/defects-liability',ShieldCheck],
  ]},
  { title: 'الموارد والأصول', items: [
    ['المصروفات','/erp/expenses',FileText], ['العمالة وكشوف الوقت','/erp/timesheets',Users],
    ['المعدات','/erp/equipment',Truck], ['الأصول الثابتة','/erp/fixed-assets',Building2],
    ['الإهلاك','/erp/depreciation',Calculator], ['الضمانات البنكية','/erp/bank-guarantees',ShieldCheck],
  ]},
  { title: 'الفوترة والخزينة', items: [
    ['مستخلصات وفواتير العملاء','/erp/client-invoices',FileText], ['فواتير الموردين','/erp/supplier-invoices',FileText],
    ['مستخلصات مقاولي الباطن','/erp/subcontract-certificates',FileCheck2], ['الخزينة والتحصيل والسداد','/erp/treasury',Landmark],
    ['الصناديق والحسابات','/erp/bank-accounts',Landmark], ['التحويلات البنكية','/erp/bank-transfers',TrendingUp],
    ['الشيكات','/erp/cheques',FileText], ['العهد والنثريات','/erp/petty-cash',Calculator], ['التسوية البنكية','/erp/bank-reconciliation',FileCheck2],
  ]},
  { title: 'التقارير والإقفال', items: [
    ['مركز التقارير','/erp/report-center',BarChart3], ['أرباح وخسائر المشروعات','/erp/project-pnl',TrendingUp], ['التدفقات النقدية','/erp/cash-flow',Landmark],
    ['أداء وربحية المشروعات','/erp/project-performance',TrendingUp], ['التوقع النقدي','/erp/cash-forecast',BarChart3],
    ['أداء الموردين','/erp/supplier-performance',Users], ['إقفال الفترات','/erp/period-close',ArchiveRestore],
    ['إقفال المشروعات','/erp/project-closeout',CheckCircle2],
    ['مساعدة النظام','/erp/help',BookOpen],
  ]},
  { title: 'المالية', items: [
    ['دليل الحسابات','/erp/accounts',ListTree], ['الربط المحاسبي','/erp/mapping',FileCheck2],
    ['الأرصدة الافتتاحية','/erp/opening-balances',Calculator], ['القيود اليومية','/erp/journals',FileText],
    ['التسويات المحاسبية','/erp/adjustments',Calculator],
    ['اليومية العامة','/erp/general-journal',FileSpreadsheet], ['الأستاذ العام','/erp/ledger',BookOpen],
    ['ميزان المراجعة','/erp/trial-balance',Landmark], ['القوائم المالية','/erp/financial-statements',ArchiveRestore],
  ]},
] as const;

export function ErpSidebar({open,onClose}:{open:boolean;onClose:()=>void}) {
  const pathname = usePathname();
  const activeGroup = groups.find(group => group.items.some(([,href]) => href === '/setup' ? pathname === '/setup' : pathname === href));
  const [openGroup,setOpenGroup] = useState<string | null>(() => activeGroup?.title ?? groups[0].title);

  return <aside className={`${open?'fixed inset-y-0 right-0 z-50 flex shadow-2xl':'hidden'} w-[292px] shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-[#F8FAFC] p-4 text-slate-800 lg:flex lg:shadow-none`}>
    <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4"><Link href="/setup" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2F8F83] font-black text-white shadow-sm">م</span><div><p className="font-extrabold text-slate-900">منظومة المقاولات</p><p className="text-[10px] font-medium tracking-wide text-slate-500">LOCAL TRIAL EDITION</p></div></Link><button type="button" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 lg:hidden" onClick={onClose} aria-label="إغلاق القائمة"><X size={20}/></button></div>
    <nav className="space-y-2">{groups.map(group=>{
      const expanded = openGroup === group.title;
      const containsActiveItem = activeGroup?.title === group.title;
      const sectionId = `sidebar-${group.title.replace(/\s+/g,'-')}`;
      return <section key={group.title} className={`overflow-hidden rounded-2xl border transition ${containsActiveItem?'border-[#A8D9D2] bg-white shadow-sm':'border-slate-200 bg-white/80'}`}>
        <button type="button" aria-expanded={expanded} aria-controls={sectionId} onClick={()=>setOpenGroup(expanded?null:group.title)} className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-right text-sm font-extrabold transition hover:bg-slate-50 ${containsActiveItem?'text-[#20766D]':'text-slate-700'}`}>
          <span>{group.title}</span><ChevronDown size={17} className={`shrink-0 text-slate-400 transition-transform duration-200 ${expanded?'rotate-180':''}`}/>
        </button>
        <div id={sectionId} className={`grid transition-[grid-template-rows,opacity] duration-200 ${expanded?'grid-rows-[1fr] opacity-100':'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><div className="space-y-1 border-t border-slate-100 px-2 py-2">{group.items.map(([label,href,Icon])=>{const active=href==='/setup'?pathname==='/setup':pathname===href;return <Link onClick={()=>{setOpenGroup(group.title);onClose()}} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active?'bg-[#E4F3F0] font-bold text-[#176B63]':'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon size={17} className={active?'text-[#2F8F83]':'text-slate-400'}/><span>{label}</span></Link>})}</div></div></div>
      </section>})}</nav>
    <div className="mt-5 rounded-2xl border border-[#CDE7E3] bg-[#EDF7F5] p-4 text-slate-700"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={16} className="text-[#2F8F83]"/>بيانات محلية فقط</div><p className="mt-2 text-[11px] leading-5 text-slate-500">كل القيود والبيانات محفوظة في IndexedDB على هذا الجهاز.</p></div>
  </aside>;
}
