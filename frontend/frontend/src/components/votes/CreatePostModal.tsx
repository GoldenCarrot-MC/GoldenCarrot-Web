import { useState } from 'react';
import { motion } from 'framer-motion';
import { votesService } from '@/services/votes';
import { toast } from '@/components/ui/Toast';

export function CreatePostModal({ type, onClose, onSuccess }: { type: string, onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error('标题和内容不能为空');
    if (type === 'trial' && !gameId) return toast.error('被批斗用户名称不能为空');

    setLoading(true);
    try {
      await votesService.createPost({ type, title, content, gameId });
      toast.success('发布成功');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || '发布失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-golden-500/30 rounded-xl p-6 w-full max-w-2xl relative shadow-[0_0_50px_rgba(234,179,8,0.15)]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-golden-500 mb-6">
          {type === 'bug' ? '发起 Bug 反馈' : '发起批斗大会'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors"
              placeholder="简明扼要的标题..."
            />
          </div>

          {type === 'trial' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">被批斗用户名称</label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full bg-slate-800 border border-red-500/30 rounded px-4 py-2 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="例如: Notch"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">详细内容 (支持简单 Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors resize-none"
              placeholder="详细描述问题或批斗理由..."
            />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded text-slate-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-golden-500 text-black font-bold rounded hover:bg-golden-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '提交中...' : '提交'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
