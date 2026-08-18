import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, Activity, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.menu.dashboard'), path: '/admin/dashboard' },
    { icon: Users, label: t('admin.menu.users'), path: '/admin/users' },
    { icon: ShieldCheck, label: t('admin.menu.whitelist'), path: '/whitelist' },
    { icon: FileText, label: t('admin.menu.news'), path: '/admin/news' },
    { icon: FileText, label: '投票管理', path: '/admin/votes' },
    { icon: Clock, label: '活动日历', path: '/admin/events' },
    { icon: Clock, label: t('admin.menu.timeline'), path: '/admin/timeline' },
    { icon: Users, label: t('admin.menu.team'), path: '/admin/team' },
    ...(isAdmin ? [
      { icon: Activity, label: t('admin.menu.logs'), path: '/admin/logs' },
      { icon: Settings, label: t('admin.menu.settings'), path: '/admin/settings' },
    ] : [])
  ];

  const currentPathKey = (() => {
    const key = location.pathname.split('/').pop() || 'dashboard';
    const allowedKeys = new Set(['dashboard', 'users', 'whitelist', 'news', 'votes', 'events', 'timeline', 'team', 'logs', 'settings']);
    return allowedKeys.has(key) ? key : 'dashboard';
  })();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0b0f0e] border-r border-[#202725]">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className={`font-bold text-xl text-golden-500 flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded bg-golden-500/20 flex items-center justify-center border border-golden-500/50 overflow-hidden">
            <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && <span>{t('admin.layout.brand')}</span>}
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative ${
                isActive 
                  ? 'text-golden-500 bg-golden-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-golden-500 rounded-r-full"
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#202725]">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-400 hover:bg-red-400/10 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{t('admin.layout.logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050708] text-slate-200 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="hidden md:block flex-shrink-0 relative z-20"
      >
        <SidebarContent />
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#151b19] border border-[#2a3431] flex items-center justify-center text-slate-400 hover:text-white"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 border-b border-[#202725] bg-[#0b0f0e]/85 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-slate-400 hidden sm:block">
              {t('admin.layout.panel')} / {t(`admin.menu.${currentPathKey}`)}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-200">{user?.username}</div>
                <div className="text-xs text-golden-500 capitalize">{user?.role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-golden-600 to-golden-400 flex items-center justify-center text-black font-bold shadow-lg shadow-golden-500/20">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#050708] p-4 md:p-6 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
