import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Menu, X, Moon, Sun, Globe, LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isMenuOpen, toggleMenu, theme, toggleTheme, setAuthModalOpen } = useStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPath = location.pathname + location.hash;

  const navLinks = [
    { name: t('nav.home'), to: '/' },
    { name: t('nav.about'), to: '/about' },
    { name: t('nav.news'), to: '/news' },
    { name: t('nav.whitelist'), to: '/whitelist' },
    { name: 'Bug反馈', to: '/vote/bug' },
    { name: '活动日历', to: '/events' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
          scrolled ? "bg-black/35 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] border-white/10 py-3" : "bg-transparent py-4 md:py-6"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 sm:px-8 md:px-12">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="Logo" className="h-8 w-8 object-contain rounded-full" />
            <span className="font-display text-sm font-semibold tracking-[0.22em] text-white sm:text-base">
              GOLDEN CARROT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-all duration-300 group",
                  (currentPath === link.to || (link.to === '/' && currentPath === '/')) ? "text-white" : "text-slate-400"
                )}
              >
                  <span className="relative z-10 group-hover:text-[#d9ff72] transition-colors">
                  {link.name}
                </span>
                {/* Glow effect on hover */}
                <span className="absolute inset-0 bg-golden-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative group">
              <button className="text-slate-300 hover:text-golden-400 flex items-center gap-1 py-2">
                <Globe size={20} />
                <span className="text-sm font-medium hidden lg:inline-block">
                  {i18n.language === 'en' ? t('nav.langEn') : i18n.language === 'zh-TW' ? t('nav.langZhTw') : t('nav.langZh')}
                </span>
              </button>
              <div className="absolute right-0 top-full w-32 bg-slate-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 overflow-hidden">
                <button 
                  onClick={() => changeLanguage('zh')}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors", i18n.language === 'zh' ? "text-golden-500" : "text-slate-300")}
                >
                  {t('nav.langZh')}
                </button>
                <button 
                  onClick={() => changeLanguage('zh-TW')}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors", i18n.language === 'zh-TW' ? "text-golden-500" : "text-slate-300")}
                >
                  {t('nav.langZhTw')}
                </button>
                <button 
                  onClick={() => changeLanguage('en')}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors", i18n.language === 'en' ? "text-golden-500" : "text-slate-300")}
                >
                  {t('nav.langEn')}
                </button>
              </div>
            </div>
            <button onClick={toggleTheme} className="liquid-glass rounded-full p-2.5 text-slate-300 hover:text-[#d9ff72]" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-golden-500 hover:text-golden-400 py-2">
                  <UserIcon size={20} />
                  <span className="font-medium">{user.username}</span>
                </button>
                <div className="absolute right-0 top-full w-40 bg-slate-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 overflow-hidden">
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <Link 
                      to="/admin"
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-golden-500 transition-colors flex items-center gap-2 border-b border-white/10"
                    >
                      <Shield size={16} /> {t('nav.adminPanel')}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-golden-500 transition-colors"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="liquid-glass rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 flex items-center gap-2"
              >
                <LogIn size={16} /> {t('nav.login')}
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="liquid-glass rounded-full p-2.5 text-white lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 border-y border-white/10 bg-[#07090a]/95 px-5 py-8 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2 sm:mx-auto sm:max-w-md">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={toggleMenu}
                    className={cn(
                      "rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-white/5 hover:text-[#d9ff72]",
                      (currentPath === link.to || (link.to === '/' && currentPath === '/')) ? "text-[#d9ff72]" : "text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col items-center gap-6 mt-12">
              {user ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="text-golden-500 font-medium text-xl">{user.username}</span>
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <Link 
                      to="/admin"
                      onClick={toggleMenu}
                      className="text-slate-300 hover:text-golden-500 flex items-center gap-2"
                    >
                      <Shield size={20} /> {t('nav.adminPanel')}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="text-slate-300 hover:text-golden-500"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); toggleMenu(); }}
                    className="text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={20} /> {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthModalOpen(true); toggleMenu(); }}
                  className="px-8 py-3 border-2 border-golden-500 text-golden-500 hover:bg-golden-500 hover:text-black rounded-full transition-colors text-lg font-bold"
                >
                  {t('nav.login')}
                </button>
              )}
              
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full mt-4">
                <Globe size={20} className="text-slate-400" />
                <button 
                  onClick={() => changeLanguage('zh')}
                  className={cn("text-sm font-medium transition-colors", i18n.language === 'zh' ? "text-golden-500" : "text-slate-400 hover:text-white")}
                >
                  {t('nav.langZh')}
                </button>
                <span className="text-slate-600">|</span>
                <button 
                  onClick={() => changeLanguage('zh-TW')}
                  className={cn("text-sm font-medium transition-colors", i18n.language === 'zh-TW' ? "text-golden-500" : "text-slate-400 hover:text-white")}
                >
                  {t('nav.langZhTw')}
                </button>
                <span className="text-slate-600">|</span>
                <button 
                  onClick={() => changeLanguage('en')}
                  className={cn("text-sm font-medium transition-colors", i18n.language === 'en' ? "text-golden-500" : "text-slate-400 hover:text-white")}
                >
                  {t('nav.langEn')}
                </button>
              </div>
              <button onClick={toggleTheme} className="text-white hover:text-golden-400 mt-4">
                {theme === 'dark' ? <Sun size={28} /> : <Moon size={28} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
