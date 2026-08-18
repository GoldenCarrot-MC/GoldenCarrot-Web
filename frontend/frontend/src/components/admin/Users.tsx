import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Edit2, Key, Power, PowerOff, Shield, ShieldAlert, AlertTriangle, Users as UsersIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function Users() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [editModalUser, setEditModalUser] = useState<User | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; desc: string; onConfirm: () => void } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit, search: debouncedSearch, role: roleFilter, status: statusFilter });
      setUsers(res.users);
      setTotal(res.total);
    } catch (err) {
      toast.error(t('admin.users.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleFilter, statusFilter, debouncedSearch]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(users.map(u => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleResetPassword = (user: User) => {
    if (!isAdmin) return toast.error(t('admin.common.adminOnly'));
    setConfirmModal({
      isOpen: true,
      title: t('admin.users.resetPassword'),
      desc: t('admin.users.resetPasswordConfirm', { username: user.username }),
      onConfirm: async () => {
        try {
          const res = await adminApi.resetPassword(user.id);
          toast.success(t('admin.users.resetPasswordSuccess', { password: res.newPassword }));
        } catch (err) {
          toast.error(t('admin.users.resetPasswordFailed'));
        }
      }
    });
  };

  const handleToggleStatus = (user: User) => {
    if (!isAdmin) return toast.error(t('admin.common.adminOnly'));
    setConfirmModal({
      isOpen: true,
      title: user.isActive ? t('admin.users.disableUser') : t('admin.users.enableUser'),
      desc: t(user.isActive ? 'admin.users.disableUserConfirm' : 'admin.users.enableUserConfirm', { username: user.username }),
      onConfirm: async () => {
        try {
          await adminApi.toggleUserStatus(user.id);
          toast.success(t('admin.users.statusUpdated'));
          fetchUsers();
        } catch (err) {
          toast.error(t('admin.users.statusUpdateFailed'));
        }
      }
    });
  };

  const handleExport = async () => {
    if (!isAdmin) return toast.error(t('admin.common.adminOnly'));
    try {
      const res = await adminApi.exportUsers();
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t('admin.users.exportSuccess'));
    } catch (err) {
      toast.error(t('admin.users.exportFailed'));
    }
  };

  const handleBatchStatus = (status: 'active' | 'disabled') => {
    if (!isAdmin) return toast.error(t('admin.common.adminOnly'));
    setConfirmModal({
      isOpen: true,
      title: status === 'active' ? t('admin.users.batchEnable') : t('admin.users.batchDisable'),
      desc: t(status === 'active' ? 'admin.users.batchEnableConfirm' : 'admin.users.batchDisableConfirm', { count: selectedIds.size }),
      onConfirm: async () => {
        try {
          await adminApi.batchUsers({ ids: Array.from(selectedIds), action: 'status', value: status });
          toast.success(t('admin.users.batchSuccess'));
          setSelectedIds(new Set());
          fetchUsers();
        } catch (err) {
          toast.error(t('admin.users.batchFailed'));
        }
      }
    });
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editModalUser || !isAdmin) return;
    try {
      await adminApi.updateUser(editModalUser.id, editModalUser);
      toast.success(t('admin.users.userUpdated'));
      setEditModalUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(t('admin.users.userUpdateFailed'));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">{t('admin.users.title')}</h1>
        <div className="flex items-center gap-3">
          {isAdmin && selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-4 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-sm text-slate-400">{t('admin.users.selectedCount', { count: selectedIds.size })}</span>
              <button onClick={() => handleBatchStatus('active')} className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">{t('admin.common.enable')}</button>
              <button onClick={() => handleBatchStatus('disabled')} className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">{t('admin.common.disable')}</button>
            </div>
          )}
          {isAdmin && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] text-slate-200 rounded-lg hover:bg-[#2e2e3e] transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" />
              <span>{t('admin.users.exportCsv')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('admin.users.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-w-[120px]"
          >
            <option value="">{t('admin.users.allRoles')}</option>
            <option value="user">{t('admin.roles.user')}</option>
            <option value="moderator">{t('admin.roles.moderator')}</option>
            <option value="admin">{t('admin.roles.admin')}</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-w-[120px]"
          >
            <option value="">{t('admin.users.allStatus')}</option>
            <option value="active">{t('admin.common.active')}</option>
            <option value="disabled">{t('admin.common.disabled')}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-[#1e1e2e] text-slate-400 bg-white/5">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={users.length > 0 && selectedIds.size === users.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-600 bg-transparent text-golden-500 focus:ring-golden-500"
                  />
                </th>
                <th className="p-4 font-medium">{t('admin.common.username')}</th>
                <th className="p-4 font-medium">{t('admin.common.email')}</th>
                <th className="p-4 font-medium">{t('admin.common.role')}</th>
                <th className="p-4 font-medium">{t('admin.common.status')}</th>
                <th className="p-4 font-medium">{t('admin.users.joined')}</th>
                <th className="p-4 font-medium text-right">{t('admin.common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e] animate-pulse">
                    <td className="p-4"><div className="w-4 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-32 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                    <td className="p-4"><div className="w-8 h-4 bg-[#2e2e3e] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <UsersIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <p>{t('admin.users.noData')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1e1e2e] hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(u.id)}
                        onChange={() => handleSelect(u.id)}
                        className="rounded border-slate-600 bg-transparent text-golden-500 focus:ring-golden-500"
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-200">{u.username}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                        ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          u.role === 'moderator' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}
                      >
                        {u.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : u.role === 'moderator' ? <Shield className="w-3 h-3" /> : null}
                        {t(`admin.roles.${u.role}`)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                        ${u.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        {u.isActive ? t('admin.common.active') : t('admin.common.disabled')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      {isAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditModalUser(u)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors" title={t('admin.common.edit')}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleResetPassword(u)} className="p-1.5 text-slate-400 hover:text-golden-500 transition-colors" title={t('admin.users.resetPassword')}>
                            <Key className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleStatus(u)} className={`p-1.5 transition-colors ${u.isActive ? 'text-slate-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`} title={u.isActive ? t('admin.common.disable') : t('admin.common.enable')}>
                            {u.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
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
              <option value={10}>{t('admin.common.perPage', { count: 10 })}</option>
              <option value={20}>{t('admin.common.perPage', { count: 20 })}</option>
              <option value={50}>{t('admin.common.perPage', { count: 50 })}</option>
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">{t('admin.users.editUser')}</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.username')}</label>
                  <input 
                    type="text" 
                    value={editModalUser.username}
                    onChange={e => setEditModalUser({...editModalUser, username: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.email')}</label>
                  <input 
                    type="email" 
                    value={editModalUser.email}
                    onChange={e => setEditModalUser({...editModalUser, email: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.role')}</label>
                  <select 
                    value={editModalUser.role}
                    onChange={e => setEditModalUser({...editModalUser, role: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                  >
                    <option value="user">{t('admin.roles.user')}</option>
                    <option value="moderator">{t('admin.roles.moderator')}</option>
                    <option value="admin">{t('admin.roles.admin')}</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setEditModalUser(null)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                    {t('admin.common.cancel')}
                  </button>
                  <button type="submit" className="px-4 py-2 bg-golden-500 text-black font-medium rounded-lg hover:bg-golden-400 transition-colors">
                    {t('admin.common.saveChanges')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && confirmModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] rounded-2xl border border-red-500/30 w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">{confirmModal.title}</h3>
              </div>
              <p className="text-slate-300 mb-8">{confirmModal.desc}</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmModal(null)} 
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors bg-white/5"
                >
                  {t('admin.common.cancel')}
                </button>
                <button 
                  onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} 
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-400 transition-colors"
                >
                  {t('admin.common.confirmAction')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
