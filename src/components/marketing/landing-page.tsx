'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, Boxes, Building2, CheckCircle2, ChevronLeft, Menu, ShieldCheck, TrendingUp, Truck, WalletCards, X } from 'lucide-react';
import { IndexedDBCompanyRepository } from '../../infrastructure/indexeddb/repositories';
import { MarketingSections } from './marketing-sections';

const nav = [['الرئيسية','#home'],['أنواع العقود','#contract-types'],['التوريدات','#supply'],['الدورة التشغيلية','#workflow'],['المحاسبة','#accounting'],['المشروعات','#projects'],['التقارير','#dashboards'],['الأسئلة الشائعة','#faq']];
const pills = ['مقاولات صناعية','توريد فقط','توريد وتركيب','صيانة','عقود خدمات','تقارير وربحية'];

export function LandingPage() {
  const [hasCompany, setHasCompany] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { new IndexedDBCompanyRepository().list().then((items)=>setHasCompany(items.length>0)).catch(()=>undefined); }, []);
  const cta = hasCompany ? 'فتح النظام' : 'جرّب النظام الآن';

  return (
    <main id="home" className="min-h-screen overflow-x-hidden bg-[#F6F8FB] text-[#1C2B3A]" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link href="#home" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#287C8E] text-lg font-black text-white shadow-lg shadow-slate-900/10">م</span><span><strong className="block text-base text-[#17324D]">منظومة المقاولات</strong><small className="block text-[10px] tracking-wide text-[#6E8093]">Industrial Contracting ERP</small></span></Link>
          <nav className="hidden items-center gap-6 xl:flex">{nav.map(([label,href])=><Link key={href} href={href} className="text-xs font-bold text-slate-600 transition hover:text-[#0b7180]">{label}</Link>)}</nav>
          <div className="hidden items-center gap-2 sm:flex"><Link href="/setup" className="rounded-xl border border-[#DDE5EC] px-4 py-2.5 text-xs font-bold text-slate-700">تسجيل الدخول</Link><Link href="/setup" className="rounded-xl bg-[#287C8E] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/10">{cta}</Link></div>
          <button aria-label="فتح القائمة" onClick={()=>setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 xl:hidden"><Menu size={19}/></button>
        </div>
      </header>
      {menuOpen&&<div className="fixed inset-0 z-[60] bg-slate-950/25 backdrop-blur-sm xl:hidden" onClick={()=>setMenuOpen(false)}><nav className="mr-auto flex h-full w-[min(88vw,360px)] flex-col bg-white p-6 shadow-2xl" onClick={(e)=>e.stopPropagation()}><div className="mb-7 flex items-center justify-between"><strong className="text-[#0c3156]">القائمة</strong><button aria-label="إغلاق القائمة" onClick={()=>setMenuOpen(false)}><X/></button></div>{nav.map(([label,href])=><Link onClick={()=>setMenuOpen(false)} key={href} href={href} className="border-b border-slate-100 py-4 text-sm font-bold">{label}</Link>)}<Link href="/setup" className="mt-6 rounded-xl bg-[#0c5f8f] px-5 py-3 text-center text-sm font-extrabold text-white">{cta}</Link></nav></div>}

      <section className="landing-grid relative overflow-hidden pb-20 pt-16 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(32,171,160,.13),transparent_30%),radial-gradient(circle_at_15%_52%,rgba(23,94,139,.1),transparent_28%)]"/>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-bold text-[#287C8E] shadow-sm"><ShieldCheck size={15}/>معمارية موحدة للعقود والمشروعات والتوريدات</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.25] tracking-tight text-[#17324D] sm:text-5xl lg:text-[62px]">كل عقد تحت السيطرة<span className="block text-[#287C8E]">مقاولات، توريد، تركيب، صيانة وخدمات</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6E8093] lg:text-lg">منظومة ERP مخططة لربط التزام العميل بالعقد وBOQ وخطة التوريد والمشتريات والاستلام أو التسليم المباشر والقبول والفوترة والتحصيل وربحية العقد—مع نواة محاسبية هي مرحلة التنفيذ التالية.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/setup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#287C8E] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(40,124,142,.2)] transition hover:-translate-y-0.5">{cta}<ArrowLeft size={18}/></Link><Link href="#supply" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDE5EC] bg-white px-7 py-4 text-sm font-extrabold text-slate-700 shadow-sm"><Truck size={18}/>اكتشف دورة التوريدات<ChevronLeft size={18}/></Link></div>
            <div className="mt-8 flex flex-wrap gap-2">{pills.map((pill)=><span key={pill} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200"><CheckCircle2 size={13} className="text-[#1a9b83]"/>{pill}</span>)}</div>
          </div>

          <DashboardMockup />
        </div>
      </section>
      <MarketingSections cta={cta} />
    </main>
  );
}

function DashboardMockup(){
  const metrics=[['قيمة العقد','48.6M',Building2],['التكلفة الفعلية','21.4M',WalletCards],['التكلفة الملتزم بها','9.8M',Boxes],['الربح المتوقع','8.7M',TrendingUp]] as const;
  return <div className="relative mx-auto w-full max-w-[720px] lg:rotate-[-1deg]"><div className="absolute -inset-8 rounded-[45px] bg-gradient-to-tr from-[#0b5d89]/12 to-[#22a58b]/15 blur-2xl"/><div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-white p-2 shadow-[0_35px_90px_rgba(12,49,86,.18)]"><div className="rounded-[20px] bg-[#f6f9fc] p-4 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black text-[#0c3156]">لوحة متابعة المشروع</p><p className="mt-1 text-[9px] text-slate-400">عرض توضيحي تسويقي — لا يُحفظ كبيانات</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-bold text-emerald-700">المشروع نشط</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{metrics.map(([label,value,Icon])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><Icon size={16} className="mb-3 text-[#16836f]"/><p className="text-[8px] font-bold text-slate-400">{label}</p><p className="mt-1 text-sm font-black text-[#0c3156]">{value}</p></div>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-[1.45fr_.55fr]"><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="mb-5 flex items-center justify-between"><p className="text-[10px] font-bold">ميزانية مقابل التكلفة</p><BarChart3 size={16} className="text-[#0c5f8f]"/></div><div className="flex h-28 items-end gap-3">{[68,44,78,55,86,61,73,48].map((h,i)=><div key={i} className="flex flex-1 items-end gap-1"><span className="w-1/2 rounded-t bg-[#0c5f8f]" style={{height:`${h}%`}}/><span className="w-1/2 rounded-t bg-[#27ad99]" style={{height:`${Math.max(22,h-19)}%`}}/></div>)}</div></div><div className="rounded-xl bg-[#0c3156] p-4 text-white"><p className="text-[9px] text-blue-100/70">الموقف النقدي</p><p className="mt-2 text-xl font-black">+2.4M</p><div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-full w-[64%] rounded-full bg-[#49d6bd]"/></div><p className="mt-2 text-[8px] text-blue-100/60">تحصيلات مقابل مدفوعات</p></div></div></div></div></div>;
}
