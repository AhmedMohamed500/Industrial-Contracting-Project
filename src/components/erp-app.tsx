'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Company, FoundationSnapshot } from '../domain/foundation';
import { IndexedDBBranchRepository, IndexedDBCompanyRepository, IndexedDBFoundationRepository } from '../infrastructure/indexeddb/repositories';
import { SetupWizard } from './setup-wizard';
import { Workspace } from './workspace';

export function ErpApp() {
  const repositories = useMemo(() => ({ foundation: new IndexedDBFoundationRepository(), companies: new IndexedDBCompanyRepository(), branches: new IndexedDBBranchRepository() }), []);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [snapshot, setSnapshot] = useState<FoundationSnapshot>();
  const [loading, setLoading] = useState(true);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (preferredId?: string) => {
    try {
      const list = await repositories.companies.list(); setCompanies(list);
      const activeId = preferredId ?? await repositories.foundation.getActiveCompanyId() ?? list[0]?.id;
      if (activeId) { await repositories.foundation.setActiveCompanyId(activeId); setSnapshot(await repositories.foundation.getSnapshot(activeId)); }
      else setSnapshot(undefined);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر فتح قاعدة البيانات المحلية'); }
    finally { setLoading(false); }
  }, [repositories]);

  useEffect(() => {
    // IndexedDB is an external browser system; the initial read must happen after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f4f7fa]" dir="rtl"><div className="text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#16836f]"/><p className="mt-4 text-sm font-bold text-slate-600">جارٍ فتح البيانات المحلية...</p></div></div>;
  if (error) return <div className="grid min-h-screen place-items-center bg-red-50 p-6 text-center text-red-800" dir="rtl"><div><h1 className="text-xl font-black">تعذر تشغيل التخزين المحلي</h1><p className="mt-2 text-sm">{error}</p></div></div>;
  if (!snapshot || creatingCompany) return <SetupWizard repository={repositories.foundation} onComplete={(id)=>{setCreatingCompany(false);load(id);}} />;
  return <Workspace companies={companies} snapshot={snapshot} branchRepository={repositories.branches} onCompanyChange={load} onNewCompany={()=>setCreatingCompany(true)} onReload={()=>load(snapshot.company.id)} />;
}
