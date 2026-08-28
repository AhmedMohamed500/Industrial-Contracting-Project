'use client';

import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, Boxes, Building2, CalendarRange, CheckCircle2, ChevronDown, Download, HardHat, Landmark, Menu, Plus, Upload, Users, WalletCards, X } from 'lucide-react';
import type { BranchRepository } from '../domain/repositories';
import type { Company, FoundationSnapshot } from '../domain/foundation';
import { exportBackup, restoreBackup } from '../application/backup-service';
import { ErpSidebar } from './erp-sidebar';

type Props = { companies: Company[]; snapshot: FoundationSnapshot; branchRepository: BranchRepository; onCompanyChange: (id: string) => void; onNewCompany: () => void; onReload: () => void; };

export function Workspace({ companies, snapshot, branchRepository, onCompanyChange, onNewCompany, onReload }: Props) {
  const [mobileNav, setMobileNav] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [branch, setBranch] = useState({ code: '', name: '', address: '' });
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const progress = useMemo(() => [
    ['الشركة', true], ['السنة المالية', snapshot.fiscalYears.length > 0], ['دليل الحسابات', false], ['الربط المحاسبي', false], ['الضرائب', snapshot.taxes.length > 0],
    ['الخزينة / البنك', snapshot.treasuryAccounts.length > 0], ['المخزن', snapshot.warehouses.length > 0], ['العميل', false], ['المشروع', snapshot.projects.length > 0], ['الأرصدة الافتتاحية', false],
  ] as const, [snapshot]);
  const done = progress.filter(([,value])=>value).length;

  async function downloadBackup() {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = `industrial-erp-backup-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href);
    setMessage('تم إنشاء نسخة احتياطية محلية. احتفظ بالملف في مكان آمن.');
  }

  async function importBackup(file: File) {
    try { await restoreBackup(JSON.parse(await file.text())); setMessage('تمت استعادة النسخة بنجاح.'); onReload(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'تعذرت استعادة النسخة'); }
  }

  async function addBranch() {
    if (!branch.code.trim() || !branch.name.trim()) { setMessage('كود واسم الفرع مطلوبان'); return; }
    try {
      await branchRepository.create({ companyId: snapshot.company.id, code: branch.code.trim().toUpperCase(), name: branch.name.trim(), address: branch.address.trim() || undefined, status: 'active' });
      setBranch({code:'',name:'',address:''}); setBranchOpen(false); setMessage('تم إنشاء الفرع محلياً.'); onReload();
    } catch { setMessage('تعذر إنشاء الفرع. تحقق من عدم تكرار الكود.'); }
  }

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-[#1C2B3A]" dir="rtl">
      <div className="flex min-h-screen">
        <ErpSidebar open={mobileNav} onClose={()=>setMobileNav(false)}/>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={()=>setMobileNav(true)} aria-label="فتح القائمة"><Menu/></button><div><p className="text-sm font-extrabold">{snapshot.company.arabicName}</p><p className="text-[11px] text-slate-500">{snapshot.company.code} · {snapshot.company.baseCurrency}</p></div></div><div className="flex items-center gap-2"><label className="relative hidden sm:block"><select aria-label="اختيار الشركة" value={snapshot.company.id} onChange={(e)=>onCompanyChange(e.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs font-bold outline-none">{companies.map((company)=><option key={company.id} value={company.id}>{company.arabicName}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500"/></label><button onClick={onNewCompany} className="flex items-center gap-1 rounded-xl bg-[#0c5f8f] px-3 py-2 text-xs font-bold text-white"><Plus size={15}/>شركة جديدة</button></div></header>

          <div id="start" className="mx-auto max-w-[1320px] p-4 sm:p-8">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold text-[#16836f]">مركز البدء</p><h1 className="text-2xl font-black text-[#0c3156] sm:text-3xl">صباح العمل، أساس شركتك جاهز</h1><p className="mt-2 text-sm text-slate-500">القيم المالية ستبقى صفراً حتى تسجل معاملاتك بنفسك.</p></div><div className="flex gap-2"><button onClick={downloadBackup} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold"><Download size={16}/>نسخة احتياطية</button><button onClick={()=>fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold"><Upload size={16}/>استعادة</button><input ref={fileRef} className="hidden" type="file" accept="application/json" onChange={(e)=>e.target.files?.[0]&&importBackup(e.target.files[0])}/></div></div>
            {message&&<div className="mb-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"><span>{message}</span><button onClick={()=>setMessage('')}><X size={16}/></button></div>}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['النقدية والبنوك','0.00',Landmark],['العملاء المستحقون','0.00',Users],['الموردون المستحقون','0.00',WalletCards],['تكلفة المشروعات','0.00',HardHat]].map(([label,value,Icon])=><article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[#0c5f8f]">{typeof Icon!=='string'&&<Icon size={19}/>}</span><span className="text-[10px] text-slate-400">لا معاملات بعد</span></div><p className="mt-5 text-xs font-bold text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-black text-[#0c3156]">{value as string} <span className="text-xs font-normal text-slate-400">{snapshot.company.baseCurrency}</span></p></article>)}</div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-extrabold text-[#0c3156]">تقدم إعداد الشركة</h2><p className="mt-1 text-xs text-slate-500">أكمل المتطلبات قبل بدء الدورة المحاسبية</p></div><span className="text-sm font-black text-[#16836f]">{done}/{progress.length}</span></div><div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#22a58b]" style={{width:`${done/progress.length*100}%`}}/></div><div className="grid gap-3 sm:grid-cols-2">{progress.map(([label,complete])=><div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"><span className="text-sm font-bold">{label}</span>{complete?<CheckCircle2 size={18} className="text-emerald-600"/>:<AlertTriangle size={18} className="text-amber-500"/>}</div>)}</div></article>
              <article className="rounded-2xl bg-[#0c3156] p-6 text-white"><p className="text-xs font-bold text-[#6de0c7]">الخطوة التالية الموصى بها</p><h2 className="mt-3 text-xl font-black">إعداد دليل الحسابات</h2><p className="mt-3 text-sm leading-7 text-blue-100/70">أنشئ الحسابات ثم اربط حسابات التحكم قبل تسجيل أي مستند مالي. هذه الوظيفة ضمن المرحلة المحاسبية التالية.</p><div className="mt-6 rounded-xl bg-white/8 p-4 text-xs leading-6 text-blue-50"><strong>لماذا؟</strong><br/>لمنع أي قيد على حساب غير صحيح أو غير محدد.</div></article>
            </div>

            <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-extrabold text-[#0c3156]">الشركات والفروع</h2><p className="mt-1 text-xs text-slate-500">كل فرع مرتبط بهذه الشركة ولا يظهر في الشركات الأخرى.</p></div><button onClick={()=>setBranchOpen(!branchOpen)} className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold"><Plus size={15}/>إضافة فرع</button></div>{branchOpen&&<div className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[.6fr_1fr_1.2fr_auto]"><input className="field-input" dir="ltr" placeholder="كود الفرع" value={branch.code} onChange={(e)=>setBranch({...branch,code:e.target.value})}/><input className="field-input" placeholder="اسم الفرع" value={branch.name} onChange={(e)=>setBranch({...branch,name:e.target.value})}/><input className="field-input" placeholder="العنوان (اختياري)" value={branch.address} onChange={(e)=>setBranch({...branch,address:e.target.value})}/><button onClick={addBranch} className="rounded-xl bg-[#16836f] px-5 text-sm font-bold text-white">حفظ</button></div>}{snapshot.branches.length===0?<div className="rounded-xl border border-dashed border-slate-200 py-9 text-center"><Building2 className="mx-auto text-slate-300"/><p className="mt-3 text-sm font-bold text-slate-600">لا توجد فروع بعد</p><p className="mt-1 text-xs text-slate-400">أنشئ فرعاً فقط عندما تحتاج لفصل تشغيلي أو تقريري.</p></div>:<div className="divide-y divide-slate-100">{snapshot.branches.map((item)=><div key={item.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-slate-400">{item.code} · {item.address||'لا يوجد عنوان'}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">نشط</span></div>)}</div>}</article>

            <div className="mt-6 grid gap-4 md:grid-cols-3"><Summary title="السنة والفترات" icon={<CalendarRange/>} value={`${snapshot.fiscalYears.length} سنة · ${snapshot.periods.length} فترة`} detail={snapshot.fiscalYears[0]?.name||'لا توجد سنة'}/><Summary title="الخزائن والبنوك" icon={<Landmark/>} value={`${snapshot.treasuryAccounts.length} سجل`} detail={snapshot.treasuryAccounts[0]?.name||'لم تتم الإضافة'}/><Summary title="المخازن" icon={<Boxes/>} value={`${snapshot.warehouses.length} مخزن`} detail={snapshot.warehouses[0]?.name||'لم تتم الإضافة'}/></div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Summary({title,icon,value,detail}:{title:string;icon:React.ReactNode;value:string;detail:string}) { return <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#0c5f8f]">{icon}</span><div><p className="text-xs font-bold text-slate-500">{title}</p><p className="mt-1 text-sm font-extrabold">{value}</p><p className="mt-0.5 text-[10px] text-slate-400">{detail}</p></div></article> }
