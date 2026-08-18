import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  mcId: string | null;
  qq: string | null;
  github: string | null;
  order: number;
}

const getMinecraftAvatarUrl = (mcId?: string | null) => {
  if (!mcId) {
    return null;
  }

  // 使用 Minotar API 获取头像，相对稳定
  return `https://minotar.net/helm/${encodeURIComponent(mcId)}/128.png`;
};

export default function Team() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    mcId: '',
    qq: '',
    github: '',
    order: 0,
  });

  const fetchMembers = async () => {
    try {
      const data = await adminApi.getTeam();
      setMembers(data);
    } catch (error) {
      toast.error(t('admin.team.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await adminApi.updateTeam(editingMember.id, formData);
        toast.success(t('admin.team.updated'));
      } else {
        await adminApi.createTeam(formData);
        toast.success(t('admin.team.created'));
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error(t('admin.team.operationFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.team.deleteConfirm'))) {
      try {
        await adminApi.deleteTeam(id);
        toast.success(t('admin.team.deleted'));
        fetchMembers();
      } catch (error) {
        toast.error(t('admin.team.deleteFailed'));
      }
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === members.length - 1)
    ) return;

    const newMembers = [...members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order
    const tempOrder = newMembers[index].order;
    newMembers[index].order = newMembers[targetIndex].order;
    newMembers[targetIndex].order = tempOrder;

    try {
      await Promise.all([
        adminApi.updateTeam(newMembers[index].id, { order: newMembers[index].order }),
        adminApi.updateTeam(newMembers[targetIndex].id, { order: newMembers[targetIndex].order })
      ]);
      fetchMembers();
    } catch (error) {
      toast.error(t('admin.team.orderUpdateFailed'));
    }
  };

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        avatar: member.avatar || '',
        mcId: member.mcId || '',
        qq: member.qq || '',
        github: member.github || '',
        order: member.order,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        avatar: '',
        mcId: '',
        qq: '',
        github: '',
        order: members.length > 0 ? members[members.length - 1].order + 1 : 0,
      });
    }
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-golden-500 animate-pulse">{t('admin.team.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('admin.team.title')}</h2>
          <p className="text-slate-400 text-sm mt-1">{t('admin.team.subtitle')}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-golden-500 hover:bg-golden-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} />
          {t('admin.team.addMember')}
        </button>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-sm font-medium text-slate-400">
                <th className="p-4 w-20">{t('admin.common.order')}</th>
                <th className="p-4">{t('admin.team.name')}</th>
                <th className="p-4">{t('admin.common.role')}</th>
                <th className="p-4">{t('admin.team.minecraftId')}</th>
                <th className="p-4 text-right">{t('admin.common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1 w-8">
                      <button 
                        onClick={() => moveOrder(index, 'up')}
                        disabled={index === 0}
                        className="text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className="text-xs text-golden-500 font-mono">{member.order}</span>
                      <button 
                        onClick={() => moveOrder(index, 'down')}
                        disabled={index === members.length - 1}
                        className="text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white flex items-center gap-3">
                    {(member.avatar || getMinecraftAvatarUrl(member.mcId)) ? (
                      <img
                        src={member.avatar || getMinecraftAvatarUrl(member.mcId) || undefined}
                        alt={member.name}
                        className="w-8 h-8 rounded bg-black/50 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&backgroundColor=transparent`;
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-xs text-golden-500 border border-white/10">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    {member.name}
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="bg-golden-500/10 text-golden-500 px-2 py-1 rounded text-xs border border-golden-500/20">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{member.mcId || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(member)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title={t('admin.common.edit')}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                        title={t('admin.common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
                    {t('admin.team.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {editingMember ? t('admin.team.editMember') : t('admin.team.addMemberModal')}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.team.name')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.common.role')}</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.team.minecraftIdOptional')}</label>
                    <input
                      type="text"
                      value={formData.mcId}
                      onChange={(e) => setFormData({ ...formData, mcId: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.team.avatarOverrideOptional')}</label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                      placeholder="https://..."
                    />
                    <p className="mt-1 text-xs text-slate-500">{t('admin.team.avatarAutoFromMinecraftId')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.team.qqOptional')}</label>
                    <input
                      type="text"
                      value={formData.qq}
                      onChange={(e) => setFormData({ ...formData, qq: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('admin.team.githubOptional')}</label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-golden-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    {t('admin.common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-golden-500 hover:bg-golden-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {t('admin.common.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
