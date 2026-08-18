import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TimelineItem {
  id: string;
  year: number;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function Timeline() {
  const { t } = useTranslation();
  const [timelineList, setTimelineList] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    icon: 'Circle',
    order: 0
  });

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTimelines();
      setTimelineList(data);
    } catch (err) {
      toast.error(t('admin.timeline.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleOpenModal = (item?: TimelineItem) => {
    if (item) {
      setEditingTimeline(item);
      setFormData({ 
        year: item.year, 
        title: item.title, 
        description: item.description,
        icon: item.icon || 'Circle',
        order: item.order || 0
      });
    } else {
      setEditingTimeline(null);
      setFormData({ 
        year: new Date().getFullYear(), 
        title: '', 
        description: '',
        icon: 'Circle',
        order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.year) {
      return toast.error(t('admin.timeline.requiredFields'));
    }

    try {
      if (editingTimeline) {
        await adminApi.updateTimeline(editingTimeline.id, formData);
        toast.success(t('admin.timeline.updated'));
      } else {
        await adminApi.createTimeline(formData);
        toast.success(t('admin.timeline.created'));
      }
      setIsModalOpen(false);
      fetchTimeline();
    } catch (err) {
      toast.error(t('admin.timeline.saveFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.timeline.deleteConfirm'))) return;
    try {
      await adminApi.deleteTimeline(id);
      toast.success(t('admin.timeline.deleted'));
      fetchTimeline();
    } catch (err) {
      toast.error(t('admin.timeline.deleteFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{t('admin.timeline.title')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-golden-500 text-black rounded-lg font-medium hover:bg-golden-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.timeline.newEvent')}</span>
        </button>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-[#1e1e2e] text-slate-400 bg-white/5">
            <tr>
              <th className="p-4 font-medium">{t('admin.common.year')}</th>
              <th className="p-4 font-medium">{t('admin.common.title')}</th>
              <th className="p-4 font-medium">{t('admin.common.description')}</th>
              <th className="p-4 font-medium">{t('admin.common.order')}</th>
              <th className="p-4 font-medium text-right">{t('admin.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1e1e2e] animate-pulse">
                  <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-48 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-64 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-12 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded ml-auto" /></td>
                </tr>
              ))
            ) : timelineList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock className="w-8 h-8 opacity-50" />
                    </div>
                    <p>{t('admin.timeline.noData')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              timelineList.map((item) => (
                <tr key={item.id} className="border-b border-[#1e1e2e] hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-golden-500">{item.year}</td>
                  <td className="p-4 text-slate-200">
                    <span className="truncate max-w-[200px] block">{item.title}</span>
                  </td>
                  <td className="p-4 text-slate-400">
                    <span className="truncate max-w-xs block">{item.description}</span>
                  </td>
                  <td className="p-4 text-slate-400">{item.order}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors" title={t('admin.common.edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors" title={t('admin.common.delete')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#1e1e2e] flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingTimeline ? t('admin.timeline.editEvent') : t('admin.timeline.newEventModal')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><AlertTriangle className="hidden" />{t('admin.common.close')}</button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">{t('admin.common.year')}</label>
                    <input 
                      type="number" 
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                      className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">{t('admin.common.order')}</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.title')}</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    placeholder={t('admin.timeline.titlePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.description')}</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-h-[100px]"
                    placeholder={t('admin.timeline.descriptionPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.timeline.iconName')}</label>
                  <input 
                    type="text" 
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    placeholder={t('admin.timeline.iconPlaceholder')}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#1e1e2e] flex justify-end gap-3 bg-[#0a0a0f]">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                  {t('admin.common.cancel')}
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-golden-500 text-black font-medium rounded-lg hover:bg-golden-400 transition-colors">
                  {editingTimeline ? t('admin.timeline.updateEvent') : t('admin.timeline.createEvent')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
