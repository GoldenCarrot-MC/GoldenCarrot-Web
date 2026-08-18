import { useState, useEffect } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { format } from 'date-fns';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await adminApi.getAdminEvents();
      setEvents(res.data);
    } catch (error) {
      toast.error('获取活动失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEvent.id) {
        await adminApi.updateEvent(currentEvent.id, currentEvent);
      } else {
        await adminApi.createEvent(currentEvent);
      }
      toast.success('保存成功');
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除?')) return;
    try {
      await adminApi.deleteEvent(id);
      toast.success('删除成功');
      fetchEvents();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const openModal = (event: any = null) => {
    setCurrentEvent(event || { title: '', description: '', startDate: '', endDate: '', weight: 0, isVisible: true, imageUrl: '' });
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">活动日历管理</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-golden-500 text-black font-bold rounded-lg shadow-lg shadow-golden-500/20">
          新增活动
        </button>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a24] text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">标题</th>
              <th className="px-6 py-4 font-medium">日期</th>
              <th className="px-6 py-4 font-medium">权重</th>
              <th className="px-6 py-4 font-medium">可见性</th>
              <th className="px-6 py-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-200">{event.title}</td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {format(new Date(event.startDate), 'yyyy-MM-dd')}
                </td>
                <td className="px-6 py-4 text-sm text-golden-500 font-bold">{event.weight}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${event.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {event.isVisible ? '显示' : '隐藏'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(event)} className="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                  <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300 text-sm">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-golden-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{currentEvent.id ? '编辑活动' : '新增活动'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">标题</label>
                <input required type="text" value={currentEvent.title} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">描述</label>
                <textarea required value={currentEvent.description} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" rows={3} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">图片 URL (可选)</label>
                <input type="text" value={currentEvent.imageUrl || ''} onChange={e => setCurrentEvent({...currentEvent, imageUrl: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">开始日期</label>
                  <input required type="datetime-local" value={currentEvent.startDate ? new Date(currentEvent.startDate).toISOString().slice(0, 16) : ''} onChange={e => setCurrentEvent({...currentEvent, startDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">结束日期 (可选)</label>
                  <input type="datetime-local" value={currentEvent.endDate ? new Date(currentEvent.endDate).toISOString().slice(0, 16) : ''} onChange={e => setCurrentEvent({...currentEvent, endDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">权重 (0-10)</label>
                  <input type="number" min="0" max="10" value={currentEvent.weight} onChange={e => setCurrentEvent({...currentEvent, weight: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center text-slate-300">
                    <input type="checkbox" checked={currentEvent.isVisible} onChange={e => setCurrentEvent({...currentEvent, isVisible: e.target.checked})} className="mr-2" />
                    可见
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400">取消</button>
                <button type="submit" className="px-4 py-2 bg-golden-500 text-black rounded font-bold">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
