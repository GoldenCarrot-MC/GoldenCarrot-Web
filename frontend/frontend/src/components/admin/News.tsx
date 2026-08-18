import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Pin, Plus, AlertTriangle, Image as ImageIcon, Link as LinkIcon, Bold, Heading1, Heading2, FileText } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useTranslation } from 'react-i18next';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  status: 'draft' | 'published';
  isPinned: boolean;
  date: string;
}

const MenuBar = ({ editor, t }: { editor: any; t: (key: string) => string }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt(t('admin.news.urlPrompt'));
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt(t('admin.news.urlPrompt'), previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#2e2e3e] bg-black/30 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-golden-500/20 text-golden-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1.5 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-golden-500/20 text-golden-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <Heading1 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-golden-500/20 text-golden-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[#2e2e3e] mx-1" />
      <button type="button" onClick={setLink} className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-golden-500/20 text-golden-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <LinkIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5">
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function News() {
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    status: 'published'
  });

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none text-slate-200',
      },
    },
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getNews();
      setNewsList(data);
    } catch (err) {
      toast.error(t('admin.news.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenModal = (news?: NewsItem) => {
    if (news) {
      setEditingNews(news);
      setFormData({ title: news.title, summary: news.summary, status: news.status });
      editor?.commands.setContent(news.content);
    } else {
      setEditingNews(null);
      setFormData({ title: '', summary: '', status: 'published' });
      editor?.commands.setContent('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    const finalStatus = statusOverride || formData.status;
    const data = {
      ...formData,
      status: finalStatus,
      content: editor?.getHTML()
    };
    
    if (!data.title || !data.content || data.content === '<p></p>') {
      return toast.error(t('admin.news.requiredFields'));
    }

    try {
      if (editingNews) {
        await adminApi.updateNews(editingNews.id, data);
        toast.success(t('admin.news.updated'));
      } else {
        await adminApi.createNews(data);
        toast.success(t('admin.news.created'));
      }
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      toast.error(t('admin.news.saveFailed'));
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await adminApi.toggleNewsPin(id);
      toast.success(t('admin.news.pinUpdated'));
      fetchNews();
    } catch (err) {
      toast.error(t('admin.news.pinFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.news.deleteConfirm'))) return;
    try {
      await adminApi.deleteNews(id);
      toast.success(t('admin.news.deleted'));
      fetchNews();
    } catch (err) {
      toast.error(t('admin.news.deleteFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{t('admin.news.title')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-golden-500 text-black rounded-lg font-medium hover:bg-golden-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.news.newArticle')}</span>
        </button>
      </div>

      <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-[#1e1e2e] text-slate-400 bg-white/5">
            <tr>
              <th className="p-4 font-medium">{t('admin.common.title')}</th>
              <th className="p-4 font-medium">{t('admin.common.author')}</th>
              <th className="p-4 font-medium">{t('admin.common.status')}</th>
              <th className="p-4 font-medium">{t('admin.common.date')}</th>
              <th className="p-4 font-medium text-right">{t('admin.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1e1e2e] animate-pulse">
                  <td className="p-4"><div className="w-48 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-16 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded" /></td>
                  <td className="p-4"><div className="w-24 h-4 bg-[#2e2e3e] rounded ml-auto" /></td>
                </tr>
              ))
            ) : newsList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <FileText className="w-8 h-8 opacity-50" />
                    </div>
                    <p>{t('admin.news.noData')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              newsList.map((news) => (
                <tr key={news.id} className={`border-b border-[#1e1e2e] hover:bg-white/5 transition-colors ${news.isPinned ? 'bg-golden-500/5' : ''}`}>
                  <td className="p-4 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      {news.isPinned && <Pin className="w-3 h-3 text-golden-500 rotate-45" />}
                      <span className="truncate max-w-xs">{news.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{news.author}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
                      ${news.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}
                    >
                      {news.status === 'published' ? t('admin.news.statusPublished') : t('admin.news.statusDraft')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(news.date).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleTogglePin(news.id)} className={`p-1.5 transition-colors ${news.isPinned ? 'text-golden-500 hover:text-slate-400' : 'text-slate-400 hover:text-golden-500'}`} title={t('admin.news.pin')}>
                        <Pin className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal(news)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors" title={t('admin.common.edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(news.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors" title={t('admin.common.delete')}>
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
              className="bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#1e1e2e] flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingNews ? t('admin.news.editArticle') : t('admin.news.newArticleModal')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><AlertTriangle className="hidden" />{t('admin.common.close')}</button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.common.title')}</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                    placeholder={t('admin.news.titlePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.news.summary')}</label>
                  <textarea 
                    value={formData.summary}
                    onChange={e => setFormData({...formData, summary: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-h-[80px]"
                    placeholder={t('admin.news.summaryPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('admin.news.content')}</label>
                  <div className="border border-[#2e2e3e] rounded-lg overflow-hidden bg-black/50">
                    <MenuBar editor={editor} t={t} />
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#1e1e2e] flex justify-end gap-3 bg-[#0a0a0f]">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                  {t('admin.common.cancel')}
                </button>
                <button onClick={() => handleSave('draft')} className="px-4 py-2 bg-white/10 text-slate-200 font-medium rounded-lg hover:bg-white/20 transition-colors">
                  {t('admin.news.saveDraft')}
                </button>
                <button onClick={() => handleSave('published')} className="px-4 py-2 bg-golden-500 text-black font-medium rounded-lg hover:bg-golden-400 transition-colors">
                  {editingNews?.status === 'published' ? t('admin.news.updatePublished') : t('admin.news.publishNow')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
