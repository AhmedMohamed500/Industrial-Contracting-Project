import type { Account, AccountingMapping, AccountingMappingKey, AccountingRepository, JournalDraft, JournalEntry, JournalLine, JournalWithLines, LedgerRow, TrialBalanceRow } from '../../domain/accounting';
import type { BaseEntity, EntityStatus } from '../../domain/foundation';
import { money, validateJournalLines } from '../../application/accounting';
import { getDatabase } from './database';

const now = () => new Date().toISOString();
const base = (companyId: string, timestamp = now()): BaseEntity => ({ id: crypto.randomUUID(), companyId, createdAt: timestamp, updatedAt: timestamp });

const template = [
  ['1000','الأصول','asset',false], ['1100','الأصول المتداولة','asset',false,'1000'], ['1110','النقدية','asset',true,'1100'],
  ['1120','البنوك','asset',true,'1100'], ['1130','العملاء','asset',true,'1100'], ['1140','المخزون','asset',true,'1100'],
  ['1150','ضريبة المدخلات','asset',true,'1100'], ['1200','الأصول الثابتة','asset',true,'1000'],
  ['2000','الالتزامات','liability',false], ['2100','الموردون','liability',true,'2000'], ['2110','GRNI','liability',true,'2000'],
  ['2120','ضريبة المخرجات','liability',true,'2000'], ['2130','المستحقات','liability',true,'2000'],
  ['3000','حقوق الملكية','equity',false], ['3100','رأس المال','equity',true,'3000'], ['3200','الأرباح المحتجزة','equity',true,'3000'],
  ['4000','الإيرادات','revenue',false], ['4100','إيرادات المقاولات','revenue',true,'4000'], ['4200','إيرادات التوريدات','revenue',true,'4000'],
  ['5000','التكاليف والمصروفات','expense',false], ['5100','تكلفة الخامات','expense',true,'5000'], ['5200','تكلفة العمالة','expense',true,'5000'],
  ['5300','تكلفة المعدات','expense',true,'5000'], ['5400','تكلفة مقاولي الباطن','expense',true,'5000'], ['5500','تكلفة التوريدات','expense',true,'5000'],
  ['5600','مصروف الإهلاك','expense',true,'5000'],
] as const;

export class IndexedDBAccountingRepository implements AccountingRepository {
  async listAccounts(companyId: string) {
    return (await getDatabase().accounts.where('companyId').equals(companyId).toArray()).sort((a,b)=>a.code.localeCompare(b.code, undefined, { numeric: true }));
  }

  async getAccount(id: string) { return getDatabase().accounts.get(id); }

  async codeExists(companyId: string, code: string, excludingId?: string) {
    const found = await getDatabase().accounts.where('[companyId+code]').equals([companyId, code.trim().toUpperCase()]).first();
    return Boolean(found && found.id !== excludingId);
  }

  async saveAccount(input: Omit<Account, keyof BaseEntity | 'normalBalance'> & { id?: string; companyId: string }) {
    const code = input.code.trim().toUpperCase();
    if (!code || !input.arabicName.trim()) throw new Error('كود واسم الحساب مطلوبان');
    if (await this.codeExists(input.companyId, code, input.id)) throw new Error('كود الحساب مستخدم بالفعل');
    if (input.parentId) {
      const parent = await getDatabase().accounts.get(input.parentId);
      if (!parent || parent.companyId !== input.companyId) throw new Error('الحساب الأب غير صالح');
      if (parent.id === input.id) throw new Error('لا يمكن أن يكون الحساب أبًا لنفسه');
    }
    const timestamp = now();
    const existing = input.id ? await getDatabase().accounts.get(input.id) : undefined;
    const account: Account = {
      ...input,
      id: input.id ?? crypto.randomUUID(),
      code,
      arabicName: input.arabicName.trim(),
      englishName: input.englishName?.trim() || undefined,
      normalBalance: input.category === 'asset' || input.category === 'expense' ? 'debit' : 'credit',
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    await getDatabase().accounts.put(account);
    return account;
  }

  async setAccountStatus(id: string, status: EntityStatus) {
    const db = getDatabase();
    const account = await db.accounts.get(id);
    if (!account) throw new Error('الحساب غير موجود');
    if (status === 'inactive' && await db.journalLines.where('accountId').equals(id).count()) throw new Error('لا يمكن إيقاف حساب له حركات');
    await db.accounts.update(id, { status, updatedAt: now() });
  }

  async createContractingTemplate(companyId: string, currency: string) {
    const db = getDatabase();
    if (await db.accounts.where('companyId').equals(companyId).count()) throw new Error('لا يمكن إنشاء القالب لأن دليل الحسابات غير فارغ');
    const timestamp = now();
    const ids = new Map<string,string>();
    template.forEach(([code]) => ids.set(code, crypto.randomUUID()));
    const accounts: Account[] = template.map(([code, arabicName, category, isPosting, parentCode]) => ({
      id: ids.get(code)!, companyId, code, arabicName, category, isPosting,
      parentId: parentCode ? ids.get(parentCode) : undefined,
      normalBalance: category === 'asset' || category === 'expense' ? 'debit' : 'credit',
      projectRequired: false, costCenterRequired: false, costCodeRequired: false,
      currency, status: 'active', createdAt: timestamp, updatedAt: timestamp,
    }));
    await db.accounts.bulkAdd(accounts);
    return accounts;
  }

  async listMappings(companyId: string) {
    return getDatabase().accountingMappings.where('companyId').equals(companyId).toArray();
  }

  async saveMappings(companyId: string, values: Partial<Record<AccountingMappingKey, string>>) {
    const db = getDatabase();
    const timestamp = now();
    await db.transaction('rw', [db.accountingMappings, db.accounts], async () => {
      for (const [key, accountId] of Object.entries(values) as [AccountingMappingKey,string][]) {
        const existing = await db.accountingMappings.where('[companyId+key]').equals([companyId, key]).first();
        if (!accountId) { if (existing) await db.accountingMappings.delete(existing.id); continue; }
        const account = await db.accounts.get(accountId);
        if (!account || account.companyId !== companyId || !account.isPosting || account.status !== 'active') throw new Error('اختر حساب ترحيل نشطًا للربط');
        const mapping: AccountingMapping = existing
          ? { ...existing, accountId, updatedAt: timestamp }
          : { ...base(companyId, timestamp), key, accountId };
        await db.accountingMappings.put(mapping);
      }
    });
  }

  private async nextNumber(companyId: string, date: string) {
    const year = date.slice(0,4);
    const items = await getDatabase().journalEntries.where('companyId').equals(companyId).toArray();
    const sequence = items.filter(item=>item.number.startsWith(`JRN-${year}-`)).length + 1;
    return `JRN-${year}-${String(sequence).padStart(6,'0')}`;
  }

  async saveJournal(draft: JournalDraft): Promise<JournalWithLines> {
    if (!draft.date || !draft.description.trim()) throw new Error('تاريخ ووصف القيد مطلوبان');
    if (!draft.lines.length) throw new Error('أضف سطور القيد');
    const db = getDatabase();
    const timestamp = now();
    return db.transaction('rw', [db.journalEntries, db.journalLines, db.accountingPeriods], async () => {
      const period = await db.accountingPeriods.where('companyId').equals(draft.companyId).filter(item=>item.startDate<=draft.date && item.endDate>=draft.date).first();
      if (!period) throw new Error('لا توجد فترة محاسبية تغطي تاريخ القيد');
      const existing = draft.id ? await db.journalEntries.get(draft.id) : undefined;
      if (existing && existing.status !== 'draft') throw new Error('يمكن تعديل القيود المسودة فقط');
      const entry: JournalEntry = {
        id: existing?.id ?? crypto.randomUUID(), companyId: draft.companyId,
        number: existing?.number ?? await this.nextNumber(draft.companyId, draft.date),
        date: draft.date, periodId: period.id, description: draft.description.trim(),
        sourceType: draft.sourceType, sourceId: draft.sourceId, status: 'draft',
        createdAt: existing?.createdAt ?? timestamp, updatedAt: timestamp,
      };
      const lines: JournalLine[] = draft.lines.map((line,index)=>({
        ...line, ...base(draft.companyId, timestamp), journalEntryId: entry.id, lineNumber: index + 1,
        debit: money(Number(line.debit || 0)), credit: money(Number(line.credit || 0)),
      }));
      await db.journalEntries.put(entry);
      if (existing) await db.journalLines.where('journalEntryId').equals(entry.id).delete();
      await db.journalLines.bulkAdd(lines);
      return { entry, lines };
    });
  }

  async getJournal(id: string) {
    const entry = await getDatabase().journalEntries.get(id);
    if (!entry) return undefined;
    return { entry, lines: await getDatabase().journalLines.where('journalEntryId').equals(id).sortBy('lineNumber') };
  }

  async listJournals(companyId: string) {
    const entries = (await getDatabase().journalEntries.where('companyId').equals(companyId).toArray()).sort((a,b)=>b.date.localeCompare(a.date)||b.number.localeCompare(a.number));
    return Promise.all(entries.map(async entry=>({entry,lines:await getDatabase().journalLines.where('journalEntryId').equals(entry.id).sortBy('lineNumber')})));
  }

  private async assertValid(id: string) {
    const db = getDatabase();
    const journal = await this.getJournal(id);
    if (!journal) throw new Error('القيد غير موجود');
    const accounts = await db.accounts.where('companyId').equals(journal.entry.companyId).toArray();
    const errors = validateJournalLines(journal.lines, accounts);
    if (errors.length) throw new Error(errors.join(' — '));
    const period = await db.accountingPeriods.get(journal.entry.periodId);
    if (!period || period.status !== 'open') throw new Error('الفترة المحاسبية مغلقة');
    return journal;
  }

  async approveJournal(id: string) {
    const journal = await this.assertValid(id);
    if (journal.entry.status !== 'draft') throw new Error('يمكن اعتماد القيود المسودة فقط');
    await getDatabase().journalEntries.update(id, { status: 'approved', approvedAt: now(), updatedAt: now() });
  }

  async postJournal(id: string) {
    const db = getDatabase();
    await db.transaction('rw', [db.journalEntries, db.journalLines, db.accounts, db.accountingPeriods], async () => {
      const journal = await this.assertValid(id);
      if (journal.entry.status !== 'approved') throw new Error('يجب اعتماد القيد قبل الترحيل');
      await db.journalEntries.update(id, { status: 'posted', postedAt: now(), updatedAt: now() });
    });
  }

  async reverseJournal(id: string, date: string, description?: string) {
    const db = getDatabase();
    return db.transaction('rw', [db.journalEntries, db.journalLines, db.accounts, db.accountingPeriods], async () => {
      const original = await this.getJournal(id);
      if (!original || original.entry.status !== 'posted') throw new Error('يمكن عكس القيود المرحلة فقط');
      const reversal = await this.saveJournal({
        companyId: original.entry.companyId, date,
        description: description?.trim() || `عكس القيد ${original.entry.number}`,
        sourceType: 'reversal', sourceId: original.entry.id,
        lines: original.lines.map(line=>({ accountId: line.accountId, description: line.description, debit: line.credit, credit: line.debit, projectId: line.projectId, costCenterId: line.costCenterId, costCodeId: line.costCodeId, partyType: line.partyType, partyId: line.partyId })),
      });
      await db.journalEntries.update(reversal.entry.id, { status: 'approved', approvedAt: now(), updatedAt: now() });
      await this.postJournal(reversal.entry.id);
      await db.journalEntries.update(id, { status: 'reversed', reversedAt: now(), reversalJournalId: reversal.entry.id, updatedAt: now() });
      return reversal.entry.id;
    });
  }

  async cancelJournal(id: string) {
    const db = getDatabase();
    const entry = await db.journalEntries.get(id);
    if (!entry || !['draft','approved'].includes(entry.status)) throw new Error('لا يمكن إلغاء هذا القيد');
    await db.journalEntries.update(id, { status: 'cancelled', updatedAt: now() });
  }

  async getLedger(companyId: string, accountId: string, from?: string, to?: string): Promise<LedgerRow[]> {
    const db = getDatabase();
    const lines = await db.journalLines.where('accountId').equals(accountId).toArray();
    const entries = new Map((await db.journalEntries.where('companyId').equals(companyId).toArray()).filter(entry=>entry.status==='posted'||entry.status==='reversed').map(entry=>[entry.id,entry]));
    let running = 0;
    return lines.map(line=>({line,entry:entries.get(line.journalEntryId)})).filter((item): item is {line:JournalLine;entry:JournalEntry}=>Boolean(item.entry && (!from||item.entry.date>=from) && (!to||item.entry.date<=to))).sort((a,b)=>a.entry.date.localeCompare(b.entry.date)||a.line.lineNumber-b.line.lineNumber).map(({line,entry})=>{
      running = money(running + line.debit - line.credit);
      return { journalId: entry.id, journalNumber: entry.number, date: entry.date, description: line.description||entry.description, sourceType: entry.sourceType, debit: line.debit, credit: line.credit, runningBalance: running };
    });
  }

  async getTrialBalance(companyId: string, from?: string, to?: string): Promise<TrialBalanceRow[]> {
    const accounts = await this.listAccounts(companyId);
    const rows: TrialBalanceRow[] = [];
    for (const account of accounts.filter(item=>item.isPosting)) {
      const ledger = await this.getLedger(companyId, account.id, from, to);
      const debitMovement = money(ledger.reduce((sum,row)=>sum+row.debit,0));
      const creditMovement = money(ledger.reduce((sum,row)=>sum+row.credit,0));
      const net = money(debitMovement-creditMovement);
      rows.push({ accountId: account.id, accountCode: account.code, accountName: account.arabicName, category: account.category, debitMovement, creditMovement, debitBalance: net>0?net:0, creditBalance: net<0?-net:0 });
    }
    return rows;
  }
}
