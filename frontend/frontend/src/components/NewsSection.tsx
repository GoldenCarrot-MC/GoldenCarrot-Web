import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, X } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export function NewsSection() {
  const { t } = useTranslation();
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/news`);
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    retry: false
  });

  return (
    <section id="news" className="py-32 relative z-10 bg-black">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
            {t('nav.news')}
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-6 py-20 text-center text-slate-400 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <Calendar size={48} className="text-white/10" />
            </div>
            {t('newsSection.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item: any, idx: number) => (
              <motion.div
                key={item.id || item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 cursor-pointer group overflow-hidden ${idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                onClick={() => setSelectedNews(item)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-golden-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 border-2 border-golden-500/0 group-hover:border-golden-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
                
                {/* Decoration */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-golden-500/10 rounded-full blur-3xl group-hover:bg-golden-500/20 transition-all duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 text-golden-500/70 text-sm mb-4 font-mono">
                    <Calendar size={16} />
                    {new Date(item.date).toLocaleDateString()}
                    {item.isPinned && (
                      <span className="px-2 py-0.5 bg-golden-500/20 text-golden-400 rounded text-xs ml-auto">
                        置顶
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-white mb-4 group-hover:text-golden-400 transition-colors ${idx === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center text-golden-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    阅读详情 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedNews(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-slate-900/90 border border-golden-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 sm:p-8 border-b border-white/5 bg-slate-900/50">
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 text-golden-500/80 text-sm mb-3 font-mono">
                  <Calendar size={16} />
                  {new Date(selectedNews.date).toLocaleDateString()}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white pr-12">
                  {selectedNews.title}
                </h2>
              </div>
              
              {/* Content */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedNews.content}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
