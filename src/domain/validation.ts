import { z } from 'zod';
import type { SetupPayload } from './foundation';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const companySchema = z.object({
  arabicName: requiredText('اسم الشركة بالعربية مطلوب'),
  englishName: z.string(),
  code: requiredText('كود الشركة مطلوب').regex(/^[A-Za-z0-9_-]+$/, 'استخدم حروفاً إنجليزية وأرقاماً وشرطة فقط'),
  taxRegistrationNumber: z.string(), commercialRegistration: z.string(),
  country: requiredText('الدولة مطلوبة'), baseCurrency: requiredText('العملة مطلوبة'),
  address: z.string(), phone: z.string(), email: z.union([z.literal(''), z.string().email('البريد الإلكتروني غير صحيح')]),
});

export const fiscalYearSchema = z.object({
  name: requiredText('اسم السنة المالية مطلوب'), startDate: requiredText('تاريخ البداية مطلوب'), endDate: requiredText('تاريخ النهاية مطلوب'),
}).refine((value) => value.endDate >= value.startDate, { message: 'تاريخ النهاية يجب أن يكون بعد البداية', path: ['endDate'] });

export function validateSetupStep(step: number, payload: SetupPayload): string[] {
  const issues: string[] = [];
  const collect = (result: z.ZodSafeParseResult<unknown>) => {
    if (!result.success) issues.push(...result.error.issues.map((issue) => issue.message));
  };
  if (step === 0) collect(companySchema.safeParse(payload.company));
  if (step === 1) collect(fiscalYearSchema.safeParse(payload.fiscalYear));
  if (step === 2 && payload.chartMode === 'template' && !payload.chartTemplateConfirmed) issues.push('يجب تأكيد إنشاء القالب قبل المتابعة');
  if (step === 4 && payload.tax.enabled) {
    if (!payload.tax.name.trim()) issues.push('اسم الضريبة مطلوب');
    const rate = Number(payload.tax.rate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) issues.push('نسبة الضريبة يجب أن تكون بين 0 و100');
  }
  if (step === 5 && payload.treasury.enabled && !payload.treasury.name.trim()) issues.push('اسم الخزينة أو الحساب البنكي مطلوب');
  if (step === 6 && payload.warehouse.enabled && (!payload.warehouse.name.trim() || !payload.warehouse.code.trim())) issues.push('اسم وكود المخزن مطلوبان');
  if (step === 7 && payload.project.enabled && (!payload.project.name.trim() || !payload.project.code.trim())) issues.push('اسم وكود المشروع مطلوبان');
  return issues;
}
