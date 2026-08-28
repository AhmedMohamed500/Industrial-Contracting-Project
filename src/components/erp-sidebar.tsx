'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArchiveRestore, BarChart3, BookOpen, Boxes, Building2, Calculator, CheckCircle2, ClipboardList, FileCheck2, FileSpreadsheet, FileText, Handshake, Landmark, ListTree, Settings, ShieldCheck, ShoppingCart, Tags, TrendingUp, Truck, Users, X } from 'lucide-react';

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
    ['طلبات خامات المواقع','/erp/site-requests',ClipboardList], ['حجز الخامات','/erp/reservations',Boxes],
    ['تحويلات المخازن','/erp/warehouse-transfers',Truck], ['صرف للمشروعات','/erp/material-issues',ArchiveRestore],
    ['التسويات','/erp/stock-adjustments',Calculator], ['الجرد','/erp/stock-counts',FileSpreadsheet], ['الهالك','/erp/waste',X],
    ['الفحص والقبول','/erp/delivery-inspections',FileCheck2], ['مرتجعات المورد','/erp/purchase-returns',ArchiveRestore],
  ]},
  { title: 'الفوترة والخزينة', items: [
    ['مستخلصات وفواتير العملاء','/erp/client-invoices',FileText], ['فواتير الموردين','/erp/supplier-invoices',FileText],
    ['مستخلصات مقاولي الباطن','/erp/subcontract-certificates',FileCheck2], ['الخزينة والتحصيل والسداد','/erp/treasury',Landmark],
  ]},
  { title: 'التقارير والإقفال', items: [
    ['أداء وربحية المشروعات','/erp/project-performance',TrendingUp], ['التوقع النقدي','/erp/cash-forecast',BarChart3],
    ['أداء الموردين','/erp/supplier-performance',Users], ['إقفال الفترات','/erp/period-close',ArchiveRestore],
    ['إقفال المشروعات','/erp/project-closeout',CheckCircle2],
  ]},
  { title: 'المالية', items: [
    ['دليل الحسابات','/erp/accounts',ListTree], ['الربط المحاسبي','/erp/mapping',FileCheck2],
    ['الأرصدة الافتتاحية','/erp/opening-balances',Calculator], ['القيود اليومية','/erp/journals',FileText],
    ['اليومية العامة','/erp/general-journal',FileSpreadsheet], ['الأستاذ العام','/erp/ledger',BookOpen],
    ['ميزان المراجعة','/erp/trial-balance',Landmark], ['القوائم المالية','/erp/financial-statements',ArchiveRestore],
  ]},
] as const;

export function ErpSidebar({open,onClose}:{open:boolean;onClose:()=>void}) {
  const pathname = usePathname();
  return <aside className={`${open?'fixed inset-y-0 right-0 z-50 flex':'hidden'} w-[282px] shrink-0 flex-col overflow-y-auto bg-[#17324D] p-5 text-white lg:flex`}>
    <div className="mb-7 flex items-center justify-between"><Link href="/setup" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#35A89A] font-black">م</span><div><p className="font-extrabold">منظومة المقاولات</p><p className="text-[10px] text-slate-300">LOCAL TRIAL EDITION</p></div></Link><button type="button" className="lg:hidden" onClick={onClose} aria-label="إغلاق القائمة"><X/></button></div>
    <nav className="space-y-6">{groups.map(group=><div key={group.title}><p className="mb-2 px-3 text-[10px] font-extrabold text-[#72D6C8]">{group.title}</p><div className="space-y-1">{group.items.map(([label,href,Icon])=>{const active=href==='/setup'?pathname==='/setup':pathname===href;return <Link onClick={onClose} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active?'bg-[#244560] font-bold text-white':'text-slate-200 hover:bg-[#244560]/70'}`}><Icon size={17}/><span>{label}</span></Link>})}</div></div>)}</nav>
    <div className="mt-auto rounded-xl border border-white/10 bg-[#244560]/70 p-4"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={16} className="text-[#72D6C8]"/>بيانات محلية فقط</div><p className="mt-2 text-[11px] leading-5 text-slate-300">كل القيود والبيانات محفوظة في IndexedDB على هذا الجهاز.</p></div>
  </aside>;
}
