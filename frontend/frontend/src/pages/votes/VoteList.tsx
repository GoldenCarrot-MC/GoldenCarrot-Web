import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { votesService } from '@/services/votes';
import { format } from 'date-fns';
import { CreatePostModal } from '@/components/votes/CreatePostModal';

export default function VoteList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isBug = location.pathname.includes('/vote/bug');
  const type = isBug ? 'bug' : 'trial';

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('votes');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [type, filter, sort, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await votesService.getPosts({ type, filter, sort, search });
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="relative p-1.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 flex space-x-2">
            <div className="absolute inset-0 bg-gradient-to-r from-golden-500/10 to-transparent rounded-2xl pointer-events-none" />
            <button
              onClick={() => navigate('/vote/bug')}
              className={`relative px-8 py-3 rounded-xl transition-all duration-300 font-medium z-10 ${
                isBug 
                  ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-black shadow-[0_0_20px_rgba(217,255,114,0.28)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Bug 反馈
            </button>
            <button
              onClick={() => navigate('/vote/trial')}
              className={`relative px-8 py-3 rounded-xl transition-all duration-300 font-medium z-10 ${
                !isBug 
                  ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-black shadow-[0_0_20px_rgba(217,255,114,0.28)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              批斗大会
            </button>
          </div>

          <div className="flex space-x-4 items-center w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索 ID / 标题..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-golden-500 focus:ring-1 focus:ring-golden-500/50 w-full transition-all"
              />
            </div>
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="whitespace-nowrap px-6 py-3 bg-golden-500 hover:bg-golden-400 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(217,255,114,0.28)] hover:shadow-[0_0_25px_rgba(217,255,114,0.4)] transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                发起{isBug ? '反馈' : '投票'}
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-8 text-sm">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-slate-300 hover:text-white focus:outline-none focus:border-golden-500/50 transition-colors cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_0.75rem_center] bg-no-repeat">
            <option value="votes">按投票数降序</option>
            <option value="recent">按时间降序</option>
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-slate-300 hover:text-white focus:outline-none focus:border-golden-500/50 transition-colors cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_0.75rem_center] bg-no-repeat">
            <option value="">全部状态</option>
            <option value="unresolved">未解决 (Open)</option>
            <option value="resolved">已解决 (Resolved)</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-golden-500/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(217,255,114,0.08)] flex flex-col h-[280px]"
                  onClick={() => navigate(`/vote/post/${post.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-xs text-golden-500/60 font-mono tracking-wider bg-golden-500/10 px-2 py-1 rounded">#{post.postId}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      post.status === 'open' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : post.status === 'resolved' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {post.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-golden-400 transition-colors mb-3 line-clamp-1 relative z-10">{post.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 relative z-10 flex-grow">
                    {post.content}
                  </p>

                  {post.type === 'trial' && post.gameId && (
                    <div className="mb-4 flex items-center space-x-3 bg-red-500/5 hover:bg-red-500/10 p-3 rounded-xl border border-red-500/10 transition-colors relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-red-500/20 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                        {post.targetAvatar ? (
                          <img src={post.targetAvatar} alt="target" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-red-500 font-bold">?</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-red-500/60 uppercase tracking-wider font-semibold">被批斗用户</span>
                        <span className="text-sm text-red-400 font-bold">{post.gameId}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden shadow-inner">
                        {post.author?.avatar ? (
                          <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400 bg-gradient-to-br from-slate-700 to-slate-800">
                            {post.author?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{post.author?.username}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-golden-500/5 group-hover:bg-golden-500/10 border border-golden-500/10 group-hover:border-golden-500/30 rounded-lg px-3 py-1.5 transition-all min-w-[60px]">
                      <svg className="w-4 h-4 text-golden-500 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-lg font-bold text-golden-500 leading-none">{post.votes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {posts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-500 py-32 bg-slate-900/20 rounded-3xl border border-white/5 border-dashed">
                <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="text-lg">暂无相关数据</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreatePostModal type={type} onClose={() => setIsModalOpen(false)} onSuccess={fetchPosts} />
      )}
    </div>
  );
}
