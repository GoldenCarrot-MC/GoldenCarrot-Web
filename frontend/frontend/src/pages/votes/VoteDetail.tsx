import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { votesService } from '@/services/votes';
import { format } from 'date-fns';
import { toast } from '@/components/ui/Toast';

export default function VoteDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data } = await votesService.getPost(postId!);
      setPost(data);
    } catch (error: any) {
      toast.error('获取详情失败');
      navigate('/vote/bug');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) return toast.error('请先登录');
    try {
      const { data } = await votesService.votePost(post.id);
      toast.success(data.message);
      fetchPost();
    } catch (error: any) {
      toast.error(error.response?.data?.error || '投票失败');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setSubmittingComment(true);
    try {
      await votesService.createComment(post.id, { content: commentContent });
      setCommentContent('');
      toast.success('评论成功');
      fetchPost();
    } catch (error: any) {
      toast.error(error.response?.data?.error || '评论失败');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('链接已复制');
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>;
  if (!post) return null;

  const hasVoted = post.votesList?.some((v: any) => v.userId === user?.id);

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Post Header */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="flex-grow">
              <div className="flex items-center flex-wrap gap-3 mb-6">
                <span className="text-sm font-mono text-golden-500 bg-golden-500/10 px-3 py-1 rounded-lg border border-golden-500/20 shadow-[0_0_10px_rgba(217,255,114,0.08)]">
                  #{post.postId}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium border ${post.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : post.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {post.status.toUpperCase()}
                </span>
                {post.gameId && (
                  <div className="flex items-center space-x-3 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                    <div className="w-6 h-6 rounded-md bg-slate-800 border border-red-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {post.targetAvatar ? (
                        <img src={post.targetAvatar} alt="target" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-red-500 font-bold text-xs">?</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-red-500/70 leading-none uppercase tracking-wider font-semibold mb-0.5">被批斗用户</span>
                      <span className="text-sm text-red-400 font-bold leading-none">{post.gameId}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">{post.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-slate-400 bg-black/20 inline-flex px-4 py-2 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300">
                        {post.author?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-slate-300">{post.author?.username}</span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="font-mono">{format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}</span>
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[140px] w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVote}
                className={`w-full py-6 px-8 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                  hasVoted 
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                    : 'bg-golden-500/10 border-golden-500/50 text-golden-500 shadow-[0_0_30px_rgba(217,255,114,0.16)] hover:bg-golden-500/20 hover:border-golden-500'
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${hasVoted ? 'bg-blue-500/10' : 'bg-golden-500/10'}`} />
                <svg className={`w-8 h-8 mb-2 transition-transform duration-300 group-hover:-translate-y-1 ${hasVoted ? 'text-blue-400' : 'text-golden-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-4xl font-display font-bold mb-1 leading-none">{post.votes}</span>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80 mt-2">{hasVoted ? '已投票' : '投一票'}</span>
              </motion.button>
              
              <button onClick={handleShare} className="mt-4 px-4 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-400 hover:text-white transition-colors flex items-center w-full justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享链接
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 whitespace-pre-wrap text-slate-300 leading-relaxed text-lg relative z-10">
            {post.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl">
          <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
            评论区 
            <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-full text-slate-300 border border-white/5">{post.comments.length}</span>
          </h3>

          {/* Comment Form */}
          {user ? (
            !post.isLocked ? (
              <form onSubmit={handleComment} className="mb-12">
                <div className="relative">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:border-golden-500 focus:ring-1 focus:ring-golden-500/50 transition-all resize-none placeholder-slate-600"
                    rows={4}
                    placeholder="留下你的看法..."
                  />
                  <div className="absolute bottom-4 right-4">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentContent.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-golden-500 to-golden-600 text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(217,255,114,0.28)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submittingComment ? '发送中...' : '发表评论'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 text-center text-red-400/80 mb-12 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                此贴已锁定，无法添加新评论
              </div>
            )
          ) : (
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-8 text-center text-slate-400 mb-12 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              请登录后发表评论
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.map((comment: any) => {
              const isAdmin = comment.author?.role === 'admin' || comment.content.startsWith('[管理员回复]');
              return (
                <div key={comment.id} className={`p-6 rounded-2xl border transition-colors hover:border-white/10 ${isAdmin ? 'bg-golden-500/5 border-golden-500/20' : 'bg-black/20 border-white/5'}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-white/10 shadow-inner">
                      {comment.author?.avatar ? (
                        <img src={comment.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-300 bg-gradient-to-br from-slate-700 to-slate-800">
                          {comment.author?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${isAdmin ? 'text-golden-400' : 'text-slate-300'}`}>
                          {comment.author?.username || 'System'}
                        </span>
                        {isAdmin && (
                          <span className="text-[10px] font-bold tracking-wider bg-golden-500/20 text-golden-500 px-2 py-0.5 rounded border border-golden-500/20">ADMIN</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono mt-0.5">{format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap ml-14 leading-relaxed text-sm md:text-base">
                    {comment.content.replace(/^\[管理员回复\]\s*/, '')}
                  </div>
                </div>
              );
            })}
            
            {post.comments.length === 0 && (
              <div className="text-center text-slate-500 py-16 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                暂无评论，来抢个沙发吧！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
