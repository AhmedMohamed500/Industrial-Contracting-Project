'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArchiveRestore, BarChart3, BookOpen, Boxes, Building2, Calculator, CheckCircle2, FileCheck2, FileSpreadsheet, FileText, Handshake, Landmark, ListTree, Settings, ShieldCheck, Tags, TrendingUp, Users, X } from 'lucide-react';

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
