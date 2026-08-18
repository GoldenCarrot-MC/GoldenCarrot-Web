import { Link } from 'react-router-dom';
import { Github, Twitter, MessageSquare, ExternalLink } from 'lucide-react';
import { useServerStatus } from '@/hooks/useServerStatus';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { serverAddress } = useStore();
  const { status } = useServerStatus(serverAddress);
  const { t } = useTranslation();

  // You can adjust these links as needed
  const footerLinks = {
    discover: [
      { name: t('footer.links.download'), to: '#' },
      { name: t('footer.links.bans'), to: '#' },
      { name: t('footer.links.whitelist'), to: '/whitelist' },
    ],
    community: [
      { name: t('footer.links.dating'), to: '#' },
      { name: t('footer.links.judgement'), to: '#' },
      { name: t('footer.links.wall'), to: '#' },
      { name: t('footer.links.suggest'), to: '#' },
    ],
    about: [
      { name: t('footer.links.aboutUs'), to: '/team' },
      { name: t('footer.links.sponsor'), to: '#' },
      { name: t('footer.links.manual'), to: '#', external: true },
    ]
  };

  return (
    <footer className="bg-black/50 border-t border-white/5 pt-16 pb-8 mt-auto backdrop-blur-md relative z-10">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Intro (Takes up 4 cols on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-golden-500/20 rounded-xl flex items-center justify-center overflow-hidden border border-golden-500/50 shadow-[0_0_15px_rgba(217,255,114,0.16)]">
                <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider text-white">
                GOLDEN CARROT
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group">
                <span className="absolute inset-0 rounded-full border border-golden-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="absolute inset-0 rounded-full bg-golden-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <MessageSquare size={18} className="relative z-10 group-hover:text-golden-400 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group">
                <span className="absolute inset-0 rounded-full border border-golden-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="absolute inset-0 rounded-full bg-golden-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Twitter size={18} className="relative z-10 group-hover:text-golden-400 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="#" className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group">
                <span className="absolute inset-0 rounded-full border border-golden-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="absolute inset-0 rounded-full bg-golden-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Github size={18} className="relative z-10 group-hover:text-golden-400 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Columns 2-4: Links (Takes up 2 cols each) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wider">{t('footer.discover')}</h3>
            <ul className="space-y-4">
              {footerLinks.discover.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="relative text-slate-400 text-sm group inline-flex items-center">
                    <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-golden-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:text-golden-400 group-hover:translate-x-2 transition-all duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wider">{t('footer.community')}</h3>
            <ul className="space-y-4">
              {footerLinks.community.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="relative text-slate-400 text-sm group inline-flex items-center">
                    <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-golden-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:text-golden-400 group-hover:translate-x-2 transition-all duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wider">{t('footer.about')}</h3>
            <ul className="space-y-4">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="relative text-slate-400 text-sm group inline-flex items-center">
                    <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-golden-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:text-golden-400 group-hover:translate-x-2 transition-all duration-300 flex items-center gap-1">
                      {link.name}
                      {link.external && <ExternalLink size={12} className="opacity-50" />}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Status Widget (Takes up 2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <h3 className="text-white font-bold mb-6 tracking-wider">{t('footer.status')}</h3>
            <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">
                {status?.online ? t('footer.stable') : t('footer.connecting')}
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t('footer.uptimeMsg1')}<br/>
              {t('footer.uptimeMsg2')}
            </p>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
            <span>© {new Date().getFullYear()} {t('footer.rights')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>{t('footer.designBy')}</span>
            <span className="hidden lg:inline">|</span>
            <span className="flex items-center gap-1">
              {t('footer.drivenBy')} <span className="text-slate-300 font-medium">React</span> & <span className="text-slate-300 font-medium">Node.js</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
