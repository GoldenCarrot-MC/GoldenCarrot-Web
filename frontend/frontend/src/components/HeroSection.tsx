import { useEffect, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Play, Sparkles, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeroBackground } from './3d/HeroBackground';
import { useServerStatus } from '@/hooks/useServerStatus';
import { useStore } from '@/store/useStore';

export function HeroSection() {
  const { t } = useTranslation();
  const { serverAddress } = useStore();
  const { status, loading } = useServerStatus(serverAddress);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    document.body.classList.add('cinematic-page');
    return () => document.body.classList.remove('cinematic-page');
  }, []);

  return (
    <section id="home" className="cinematic-hero relative isolate -mt-24 flex min-h-screen overflow-hidden text-white">
      <HeroBackground />
      <div className="cinematic-blur" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-end px-5 pb-10 pt-28 sm:px-8 md:px-12 md:pb-16">
        <div className="max-w-3xl">
          <div className="animate-blur-fade-up mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300 sm:mb-7 sm:text-xs" style={{ animationDelay: '180ms' }}>
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-current text-white" /> {loading ? '—' : status?.online ? `${status.players.online} online` : t('hero.serverOffline')}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-400" /> 24/7 survival</span>
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" /> Season 04</span>
          </div>

          <p className="animate-blur-fade-up mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#d9ff72]" style={{ animationDelay: '260ms' }}>
            <Sparkles className="h-4 w-4" /> Golden Carrot Network
          </p>
          <h1 className="animate-blur-fade-up max-w-4xl text-[clamp(3.1rem,8vw,7.8rem)] font-normal leading-[0.9] tracking-[-0.055em]" style={{ animationDelay: '340ms' }}>
            Build your <span className="text-[#d9ff72]">next world.</span>
          </h1>
          <p className="animate-blur-fade-up mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg md:mt-8" style={{ animationDelay: '440ms' }}>
            {t('hero.desc')}
          </p>

          <div className="animate-blur-fade-up mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4" style={{ animationDelay: '540ms' }}>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d9ff72] sm:px-8 sm:py-3.5">
              <Play className="h-4 w-4 fill-current" /> {t('hero.playNow')}
            </a>
            <button type="button" onClick={handleCopy} className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:px-6 sm:py-3.5">
              {copied ? <Check className="h-4 w-4 text-[#d9ff72]" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : serverAddress}</span>
            </button>
          </div>
        </div>

        <div className="animate-blur-fade-up mt-10 flex items-center justify-between border-t border-white/15 pt-4 text-xs uppercase tracking-[0.2em] text-slate-400 sm:mt-14 sm:pt-5" style={{ animationDelay: '660ms' }}>
          <span>Explore the community</span>
          <div className="flex items-center gap-2">
            <button type="button" className="liquid-glass rounded-full p-2.5 text-white transition hover:bg-white/10" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" className="liquid-glass rounded-full p-2.5 text-white transition hover:bg-white/10" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
