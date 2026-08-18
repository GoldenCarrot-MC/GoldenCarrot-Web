import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { Activity, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LogItem {
  id: string;
  operatorName: string;
  ip: string;
  module: string;
  action: string;
  target: string;
  result: 'success' | 'error';
  createdAt: string;
}

export default function Logs() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  if (user?.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [moduleFilter, setModuleFilter] = useState('');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [debouncedOperatorSearch, setDebouncedOperatorSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs({ page, limit, module: moduleFilter, operatorName: debouncedOperatorSearch });
      setLogs(res.logs);
      setTotal(res.total);
    } catch (err) {
      toast.error(t('admin.logs.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOperatorSearch(operatorSearch);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [operatorSearch]);

  useEffect(() => {
    fetchLogs();
  }, [page, limit, moduleFilter, debouncedOperatorSearch]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-golden-500" />
        <h1 className="text-2xl font-bold text-white">{t('admin.logs.title')}</h1>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('admin.logs.searchPlaceholder')}
              value={operatorSearch}
              onChange={(e) => setOperatorSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
            />
          </div>
          <select 
            value={moduleFilter} 
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-w-[150px]"
          >
            <option value="">{t('admin.logs.allModules')}</option>
            <option value="Users">{t('admin.menu.users')}</option>
            <option value="News">{t('admin.menu.news')}</option>
            <option value="Settings">{t('admin.menu.settings')}</option>
            <option value="Auth">{t('admin.logs.moduleAuth')}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-[#1e1e2e] text-slate-400 bg-white/5">
              <tr>
                <th className="p-4 font-medium">{t('admin.common.time')}</th>
                <th className="p-4 font-medium">{t('admin.logs.operator')}</th>
                <th className="p-4 font-medium">{t('admin.logs.ipAddress')}</th>
                <th className="p-4 font-medium">{t('admin.logs.module')}</th>
                <th className="p-4 font-medium">{t('admin.logs.action')}</th>
                <th className="p-4 font-medium">{t('admin.logs.target')}</th>
                <th className="p-4 font-medium">{t('admin.logs.result')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e] animate-pulse">
                    <td className="p-4"><div className="w-32 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-32 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Activity className="w-8 h-8 opacity-50" />
                      </div>
                      <p>{t('admin.logs.noData')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#1e1e2e] hover:bg-white/5 transition-colors font-mono text-xs">
                    <td className="p-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-sans font-medium text-golden-500">{log.operatorName}</td>
                    <td className="p-4 text-slate-500">{log.ip || t('admin.common.notAvailable')}</td>
                    <td className="p-4 text-slate-300 font-sans">{log.module}</td>
                    <td className="p-4 text-slate-200">{log.action}</td>
                    <td className="p-4 text-slate-400 truncate max-w-[150px]">{log.target || '-'}</td>
                    <td className="p-4 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${log.result === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                      >
                        {t(`admin.logs.results.${log.result}`)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-slate-400">
            {t('admin.common.showingResults', {
              start: total === 0 ? 0 : ((page - 1) * limit) + 1,
              end: Math.min(page * limit, total),
              total
            })}
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={limit} 
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 bg-black/50 border border-[#2e2e3e] rounded text-slate-200 text-sm focus:outline-none"
            >
              <option value={20}>{t('admin.common.perPage', { count: 20 })}</option>
              <option value={50}>{t('admin.common.perPage', { count: 50 })}</option>
              <option value={100}>{t('admin.common.perPage', { count: 100 })}</option>
            </select>
            <div className="flex items-center gap-1 bg-black/50 border border-[#2e2e3e] rounded">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('admin.common.prev')}
              </button>
              <div className="px-3 py-1 border-x border-[#2e2e3e] text-golden-500 font-medium">{page}</div>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('admin.common.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
