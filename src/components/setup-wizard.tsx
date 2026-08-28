'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Building2, Check, ChevronLeft, ChevronRight, Database, Landmark, PackageOpen, ShieldCheck } from 'lucide-react';
import { EMPTY_SETUP_PAYLOAD, type SetupPayload } from '../domain/foundation';
import { validateSetupStep } from '../domain/validation';
import type { FoundationRepository } from '../domain/repositories';

const steps = [
  ['بيانات الشركة', 'الهوية والبيانات القانونية'], ['السنة المالية', 'الفترة المحاسبية الأولى'], ['دليل الحسابات', 'طريقة إعداد الحسابات'],
  ['الربط المحاسبي', 'متطلبات الترحيل'], ['الضرائب', 'تعريفات يحددها المستخدم'], ['الخزينة والبنوك', 'مصدر دفع أو تحصيل أول'],
  ['المخازن', 'مخزن رئيسي أو موقع'], ['أول مشروع', 'اختياري للبدء السريع'], ['مراجعة الإعداد', 'فحص النواقص والتحذيرات'], ['بدء العمل', 'إنهاء التهيئة المحلية'],
] as const;

type Props = { repository: FoundationRepository; onComplete: (companyId: string) => void; initialPayload?: SetupPayload; };

const inputClass = 'field-input';
const labelClass = 'field-label';

export function SetupWizard({ repository, onComplete, initialPayload = EMPTY_SETUP_PAYLOAD }: Props) {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState<SetupPayload>(structuredClone(initialPayload));
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    repository.getDraft().then((draft) => { if (draft) { setPayload(draft.payload); setStep(Math.min(draft.currentStep, 9)); } });
  }, [repository]);

  const update = <K extends keyof SetupPayload>(section: K, values: Partial<SetupPayload[K]>) => {
    setPayload((current) => ({ ...current, [section]: { ...(current[section] as object), ...values } }));
  };

  async function next() {
    const issues = validateSetupStep(step, payload);
    setErrors(issues);
    if (issues.length) return;
    const nextStep = Math.min(step + 1, 9);
    await repository.saveDraft({ id: 'first-run', currentStep: nextStep, payload, updatedAt: new Date().toISOString() });
    setStep(nextStep);
  }

  async function finish() {
    setBusy(true); setErrors([]);
    try { onComplete(await repository.completeSetup(payload)); }
    catch (error) { setErrors([error instanceof Error ? error.message : 'تعذر إكمال الإعداد']); }
    finally { setBusy(false); }
  }

  const checks = useMemo(() => [
    ['الشركة', Boolean(payload.company.arabicName && payload.company.code)], ['السنة المالية', Boolean(payload.fiscalYear.name && payload.fiscalYear.startDate && payload.fiscalYear.endDate)],
    ['دليل الحسابات', false], ['الربط المحاسبي', false], ['الضرائب', payload.tax.enabled], ['الخزينة / البنك', payload.treasury.enabled],
    ['المخزن', payload.warehouse.enabled], ['المشروع', payload.project.enabled], ['الأرصدة الافتتاحية', false],
  ] as const, [payload]);

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-[#1C2B3A]" dir="rtl">
      <div className="mx-auto grid min-h-screen max-w-[1540px] grid-cols-1 lg:grid-cols-[330px_1fr]">
        <aside className="relative overflow-hidden bg-[#17324D] p-6 text-white lg:p-9">
          <div className="absolute -left-20 top-24 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative">
            <div className="mb-9 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#35A89A] text-lg font-black">م</span><div><p className="text-lg font-extrabold">منظومة المقاولات</p><p className="text-xs text-slate-300">Industrial Contracting ERP</p></div></div>
            <p className="mb-4 text-xs font-bold text-[#72D6C8]">إعداد النظام لأول مرة</p>
            <nav aria-label="خطوات الإعداد" className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {steps.map(([title, description], index) => (
                <button type="button" key={title} onClick={() => index < step && setStep(index)} className={`flex gap-3 rounded-xl px-3 py-2.5 text-right ${index === step ? 'bg-[#244560]' : index < step ? 'opacity-90' : 'opacity-45'}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${index < step ? 'bg-[#35A89A]' : index === step ? 'border border-[#72D6C8] text-[#72D6C8]' : 'border border-white/25'}`}>{index < step ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span>
                  <span className="hidden lg:block"><span className="block text-sm font-bold">{title}</span><span className="mt-0.5 block text-[11px] leading-4 text-blue-100/65">{description}</span></span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sm:px-10"><div><p className="text-sm font-bold text-slate-800">الإصدار التجريبي المحلي</p><p className="text-xs text-slate-500">بياناتك محفوظة على هذا الجهاز فقط</p></div><div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">الخطوة {step + 1} من 10</div></header>
          <div className="flex flex-1 items-center justify-center p-5 sm:p-10">
            <div className="w-full max-w-[850px]">
              <div className="mb-7"><div className="mb-4 flex items-center gap-3"><span className="h-1.5 w-12 rounded-full bg-[#35A89A]" /><span className="text-xs font-extrabold text-[#287C8E]">{steps[step][1]}</span></div><h1 className="text-3xl font-black tracking-tight text-[#17324D] sm:text-4xl">{steps[step][0]}</h1></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(12,49,86,0.07)] sm:p-8">
                {step === 0 && <CompanyStep payload={payload} update={update} />}
                {step === 1 && <FiscalYearStep payload={payload} update={update} />}
                {step === 2 && <ChoiceStep icon={<Database />} title="طريقة إعداد دليل الحسابات" text="لن ينشئ النظام أي حسابات تلقائياً. إنشاء الدليل الفعلي سيتم في المرحلة المحاسبية التالية." options={[['manual','إنشاء يدوي','ابدأ بدليل فارغ وأنشئ الحسابات بنفسك'],['template','قالب مقاولات اختياري','معاينة قالب لاحقاً ثم تأكيده صراحة']]} value={payload.chartMode} onChange={(value) => setPayload((p)=>({...p,chartMode:value as SetupPayload['chartMode']}))} confirmed={payload.chartTemplateConfirmed} onConfirm={(value) => setPayload((p)=>({...p,chartTemplateConfirmed:value}))} />}
                {step === 3 && <InfoStep icon={<ShieldCheck />} title="الربط المحاسبي غير مكتمل بعد" text="سيظل الترحيل المالي معطلاً حتى إنشاء دليل الحسابات وربط حسابات العملاء والموردين والمخزون والخزينة. لا توجد أرقام حسابات ثابتة داخل النظام." checkbox="أفهم أن العمليات المالية لن تُرحّل قبل اكتمال الربط" checked={payload.mappingAcknowledged} onChange={(value) => setPayload((p) => ({ ...p, mappingAcknowledged: value }))} />}
                {step === 4 && <OptionalStep title="إضافة تعريف ضريبي أول" enabled={payload.tax.enabled} onEnabled={(enabled) => update('tax', { enabled })}><div className="grid gap-4 sm:grid-cols-3"><label className={labelClass}>اسم الضريبة<input className={inputClass} value={payload.tax.name} onChange={(e) => update('tax',{name:e.target.value})} /></label><label className={labelClass}>النوع<select className={inputClass} value={payload.tax.kind} onChange={(e) => update('tax',{kind:e.target.value as SetupPayload['tax']['kind']})}><option value="vat">قيمة مضافة</option><option value="withholding">استقطاع</option><option value="other">أخرى</option></select></label><label className={labelClass}>النسبة %<input className={inputClass} type="number" min="0" max="100" value={payload.tax.rate} onChange={(e) => update('tax',{rate:e.target.value})} /></label></div></OptionalStep>}
                {step === 5 && <OptionalStep title="إضافة خزينة أو حساب بنكي" enabled={payload.treasury.enabled} onEnabled={(enabled) => update('treasury',{enabled})}><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>النوع<select className={inputClass} value={payload.treasury.type} onChange={(e)=>update('treasury',{type:e.target.value as SetupPayload['treasury']['type']})}><option value="cashbox">خزينة</option><option value="bank">حساب بنكي</option></select></label><label className={labelClass}>الاسم<input className={inputClass} value={payload.treasury.name} onChange={(e)=>update('treasury',{name:e.target.value})} /></label>{payload.treasury.type === 'bank' && <><label className={labelClass}>اسم البنك<input className={inputClass} value={payload.treasury.bankName} onChange={(e)=>update('treasury',{bankName:e.target.value})} /></label><label className={labelClass}>رقم الحساب<input className={inputClass} value={payload.treasury.accountNumber} onChange={(e)=>update('treasury',{accountNumber:e.target.value})} /></label></>}</div></OptionalStep>}
                {step === 6 && <OptionalStep title="إضافة مخزن أول" enabled={payload.warehouse.enabled} onEnabled={(enabled) => update('warehouse',{enabled})}><div className="grid gap-4 sm:grid-cols-3"><label className={labelClass}>كود المخزن<input dir="ltr" className={inputClass} value={payload.warehouse.code} onChange={(e)=>update('warehouse',{code:e.target.value})}/></label><label className={labelClass}>اسم المخزن<input className={inputClass} value={payload.warehouse.name} onChange={(e)=>update('warehouse',{name:e.target.value})}/></label><label className={labelClass}>النوع<select className={inputClass} value={payload.warehouse.type} onChange={(e)=>update('warehouse',{type:e.target.value as SetupPayload['warehouse']['type']})}><option value="main">رئيسي</option><option value="site">موقع</option><option value="project">مشروع</option></select></label></div></OptionalStep>}
                {step === 7 && <OptionalStep title="إضافة مشروع أول" enabled={payload.project.enabled} onEnabled={(enabled) => update('project',{enabled})}><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>كود المشروع<input dir="ltr" className={inputClass} value={payload.project.code} onChange={(e)=>update('project',{code:e.target.value})}/></label><label className={labelClass}>اسم المشروع<input className={inputClass} value={payload.project.name} onChange={(e)=>update('project',{name:e.target.value})}/></label></div></OptionalStep>}
                {step === 8 && <ReviewStep checks={checks} />}
                {step === 9 && <FinishStep payload={payload} update={update} />}
                {errors.length > 0 && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><div className="mb-2 flex items-center gap-2 font-bold"><AlertCircle size={17}/>يرجى مراجعة الآتي</div><ul className="list-inside list-disc space-y-1">{errors.map((error)=><li key={error}>{error}</li>)}</ul></div>}
                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><button type="button" disabled={step===0 || busy} onClick={()=>setStep((s)=>s-1)} className="flex items-center gap-1 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-30"><ChevronRight size={17}/>السابق</button>{step < 9 ? <button type="button" onClick={next} className="flex items-center gap-1 rounded-xl bg-[#287C8E] px-7 py-3 text-sm font-extrabold text-white">حفظ والمتابعة<ChevronLeft size={17}/></button> : <button type="button" disabled={busy} onClick={finish} className="rounded-xl bg-[#35A89A] px-7 py-3 text-sm font-extrabold text-white disabled:opacity-50">{busy?'جارٍ إنشاء الشركة...':'إنهاء الإعداد وبدء العمل'}</button>}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function CompanyStep({payload,update}:{payload:SetupPayload;update:<K extends keyof SetupPayload>(s:K,v:Partial<SetupPayload[K]>)=>void}) { const c=payload.company; return <div className="grid gap-5 sm:grid-cols-2"><label className={`${labelClass} sm:col-span-2`}>اسم الشركة بالعربية *<input className={inputClass} value={c.arabicName} onChange={(e)=>update('company',{arabicName:e.target.value})}/></label><label className={labelClass}>الاسم بالإنجليزية<input dir="ltr" className={inputClass} value={c.englishName} onChange={(e)=>update('company',{englishName:e.target.value})}/></label><label className={labelClass}>كود الشركة *<input dir="ltr" className={inputClass} value={c.code} onChange={(e)=>update('company',{code:e.target.value})}/></label><label className={labelClass}>الدولة *<input className={inputClass} value={c.country} onChange={(e)=>update('company',{country:e.target.value})}/></label><label className={labelClass}>العملة الأساسية *<select className={inputClass} value={c.baseCurrency} onChange={(e)=>update('company',{baseCurrency:e.target.value})}><option value="EGP">جنيه مصري (EGP)</option><option value="SAR">ريال سعودي (SAR)</option><option value="AED">درهم إماراتي (AED)</option><option value="USD">دولار أمريكي (USD)</option></select></label><label className={labelClass}>الرقم الضريبي<input className={inputClass} value={c.taxRegistrationNumber} onChange={(e)=>update('company',{taxRegistrationNumber:e.target.value})}/></label><label className={labelClass}>السجل التجاري<input className={inputClass} value={c.commercialRegistration} onChange={(e)=>update('company',{commercialRegistration:e.target.value})}/></label><label className={`${labelClass} sm:col-span-2`}>العنوان<input className={inputClass} value={c.address} onChange={(e)=>update('company',{address:e.target.value})}/></label><label className={labelClass}>الهاتف<input dir="ltr" className={inputClass} value={c.phone} onChange={(e)=>update('company',{phone:e.target.value})}/></label><label className={labelClass}>البريد الإلكتروني<input dir="ltr" className={inputClass} value={c.email} onChange={(e)=>update('company',{email:e.target.value})}/></label></div> }

function FiscalYearStep({payload,update}:{payload:SetupPayload;update:<K extends keyof SetupPayload>(s:K,v:Partial<SetupPayload[K]>)=>void}) { const f=payload.fiscalYear; return <div><p className="mb-5 text-sm leading-7 text-slate-600">سينشئ النظام فترات شهرية مفتوحة داخل النطاق الذي تحدده. لا يمكن الترحيل إلى فترة مغلقة في المراحل المحاسبية.</p><div className="grid gap-5 sm:grid-cols-3"><label className={labelClass}>اسم السنة *<input className={inputClass} placeholder="2027" value={f.name} onChange={(e)=>update('fiscalYear',{name:e.target.value})}/></label><label className={labelClass}>تاريخ البداية *<input type="date" className={inputClass} value={f.startDate} onChange={(e)=>update('fiscalYear',{startDate:e.target.value})}/></label><label className={labelClass}>تاريخ النهاية *<input type="date" className={inputClass} value={f.endDate} onChange={(e)=>update('fiscalYear',{endDate:e.target.value})}/></label></div></div> }

function OptionalStep({title,enabled,onEnabled,children}:{title:string;enabled:boolean;onEnabled:(v:boolean)=>void;children:React.ReactNode}) { return <div><label className="mb-6 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"><span><span className="block text-sm font-bold text-slate-800">{title}</span><span className="mt-1 block text-xs text-slate-500">اختياري الآن ويمكن استكماله لاحقاً</span></span><input type="checkbox" checked={enabled} onChange={(e)=>onEnabled(e.target.checked)} className="h-5 w-5 accent-[#16836f]"/></label>{enabled ? children : <div className="rounded-xl border border-dashed border-slate-200 p-7 text-center text-sm text-slate-500">لن يتم إنشاء أي سجل في هذه الخطوة.</div>}</div> }

function InfoStep({icon,title,text,checkbox,checked,onChange}:{icon:React.ReactNode;title:string;text:string;checkbox:string;checked:boolean;onChange:(v:boolean)=>void}) { return <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6"><div className="mb-3 flex items-center gap-3 text-amber-800">{icon}<h2 className="font-extrabold">{title}</h2></div><p className="text-sm leading-7 text-amber-900/75">{text}</p><label className="mt-5 flex items-center gap-2 text-sm font-bold text-amber-900"><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="h-4 w-4 accent-amber-700"/>{checkbox}</label></div> }

function ChoiceStep({icon,title,text,options,value,onChange,confirmed,onConfirm}:{icon:React.ReactNode;title:string;text:string;options:string[][];value:string;onChange:(v:string)=>void;confirmed?:boolean;onConfirm?:(v:boolean)=>void}) { return <div><div className="mb-5 flex gap-3 text-[#0c3156]">{icon}<div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div><div className="grid gap-3 sm:grid-cols-2">{options.map(([key,label,desc])=><button type="button" key={key} onClick={()=>onChange(key)} className={`rounded-xl border p-5 text-right ${value===key?'border-[#16836f] bg-emerald-50':'border-slate-200'}`}><span className="block font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{desc}</span></button>)}</div>{value==='template'&&onConfirm&&<label className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900"><input type="checkbox" checked={confirmed} onChange={(e)=>onConfirm(e.target.checked)} className="h-4 w-4 accent-amber-700"/>أؤكد أن القالب لن يُنشأ إلا بعد معاينته والموافقة عليه في مرحلة الحسابات</label>}</div> }

function ReviewStep({checks}:{checks:readonly (readonly [string,boolean])[]}) { return <div><p className="mb-5 text-sm leading-7 text-slate-600">يمكن إنهاء التهيئة الأساسية مع وجود عناصر مؤجلة. الترحيل المحاسبي سيظل محمياً حتى اكتمال دليل الحسابات والربط.</p><div className="grid gap-3 sm:grid-cols-2">{checks.map(([label,done])=><div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><span className="text-sm font-bold">{label}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${done?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-800'}`}>{done?'مكتمل':'مطلوب لاحقاً'}</span></div>)}</div></div> }

function FinishStep({payload,update}:{payload:SetupPayload;update:<K extends keyof SetupPayload>(s:K,v:Partial<SetupPayload[K]>)=>void}) { return <div className="text-center"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Building2 size={30}/></div><h2 className="text-2xl font-black text-[#0c3156]">النظام جاهز للبدء</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">سيتم إنشاء الشركة والسنة والفترات وأي عناصر اخترتها في معاملة محلية واحدة. إذا فشل أي جزء فلن تُحفظ بيانات ناقصة.</p><label className="mx-auto mt-6 flex max-w-lg items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-right"><span><span className="block text-sm font-bold">ملف مستخدم محلي تجريبي</span><span className="text-xs text-slate-500">للعرض فقط وليس نظام دخول أو حماية إنتاجياً</span></span><input type="checkbox" checked={payload.profile.enabled} onChange={(e)=>update('profile',{enabled:e.target.checked})} className="h-5 w-5 accent-[#16836f]"/></label>{payload.profile.enabled&&<div className="mx-auto mt-4 grid max-w-lg gap-4 sm:grid-cols-2"><label className={labelClass}>الاسم الظاهر<input className={inputClass} value={payload.profile.displayName} onChange={(e)=>update('profile',{displayName:e.target.value})}/></label><label className={labelClass}>المسمى<input className={inputClass} value={payload.profile.roleLabel} onChange={(e)=>update('profile',{roleLabel:e.target.value})}/></label></div>}<div className="mt-6 flex justify-center gap-5 text-xs text-slate-500"><span className="flex items-center gap-1"><PackageOpen size={14}/>لا بيانات تجريبية</span><span className="flex items-center gap-1"><Landmark size={14}/>لا خادم خلفي</span></div></div> }
