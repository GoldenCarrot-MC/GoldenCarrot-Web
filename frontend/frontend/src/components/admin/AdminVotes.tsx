import { useState, useEffect } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';

export default function AdminVotes() {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replyPostId, setReplyPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const { data } = await adminApi.getVotes();
      setVotes(data);
    } catch (error) {
      toast.error('获取投票列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateVoteStatus(id, status);
      toast.success('状态已更新');
      fetchVotes();
    } catch (error) {
      toast.error('更新失败');
    }
  };

  const handleVisibilityToggle = async (id: string) => {
    try {
      await adminApi.toggleVoteVisibility(id);
      toast.success('可见性已更新');
      fetchVotes();
    } catch (error) {
      toast.error('更新失败');
    }
  };

  const handleReply = async () => {
    if (!replyPostId || !replyContent) return;
    try {
      await adminApi.replyVote(replyPostId, replyContent);
      toast.success('回复成功');
      setReplyPostId(null);
      setReplyContent('');
    } catch (error) {
      toast.error('回复失败');
    }
  };

  if (loading) return <div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">投票管理</h1>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a24] text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">ID / 类型</th>
                <th className="px-6 py-4 font-medium">标题</th>
                <th className="px-6 py-4 font-medium">作者</th>
                <th className="px-6 py-4 font-medium">投票数</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium">可见性</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {votes.map((vote) => (
                <tr key={vote.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-golden-500">{vote.postId}</div>
                    <div className="text-xs text-slate-500">{vote.type}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-200">{vote.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{vote.author?.username}</td>
                  <td className="px-6 py-4 text-sm font-bold text-golden-500">{vote.votes}</td>
                  <td className="px-6 py-4">
                    <select
                      value={vote.status}
                      onChange={(e) => handleStatusChange(vote.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                    >
                      <option value="open">Open</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleVisibilityToggle(vote.id)}
                      className={`px-3 py-1 rounded text-xs ${vote.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {vote.isVisible ? '显示' : '隐藏'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setReplyPostId(vote.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      回复
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {replyPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-golden-500/30 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">管理员回复</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white mb-4"
              rows={4}
              placeholder="回复内容..."
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setReplyPostId(null)} className="px-4 py-2 text-slate-400">取消</button>
              <button onClick={handleReply} className="px-4 py-2 bg-golden-500 text-black rounded font-bold">回复</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
