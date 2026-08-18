import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServerStatus } from '@/hooks/useServerStatus';
import { useStore } from '@/store/useStore';
import { Copy, Check, Server, Activity, Users, Info, SignalHigh, Globe2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

export function ServerStatusSection() {
  const { t } = useTranslation();
  const { serverAddress } = useStore();
  const { status, loading } = useServerStatus(serverAddress);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(serverAddress);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section id="status" className="py-32 relative z-10 bg-black overflow-hidden">
      {/* Sci-fi Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,255,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,255,114,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-golden-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden border border-golden-500/20 shadow-[0_0_50px_rgba(217,255,114,0.05)]"
        >
          {/* Animated SVG Border Effect using CSS or simple gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-golden-500/0 via-golden-500/10 to-golden-500/0 opacity-50 animate-pulse pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-golden-500/10 border border-golden-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(217,255,114,0.12)] relative group">
                <div className="absolute inset-0 rounded-2xl bg-golden-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                <Server className="text-golden-400 w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide text-center">
                {t('status.serverInfo')}
              </h2>
            </div>
            
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
              {/* Status */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-golden-500/30 transition-colors">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-golden-500/10 transition-colors">
                    <Activity className="w-6 h-6 text-golden-500" />
                  </div>
                  <span className="font-medium text-lg">{t('status.statusLabel')}</span>
                </div>
                {loading ? (
                  <span className="text-slate-400 font-mono animate-pulse">{t('status.checking')}</span>
                ) : status?.online ? (
                  <span className="text-green-400 flex items-center gap-2 font-mono font-bold">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {t('status.online')}
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-2 font-mono font-bold">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    {t('status.offline')}
                  </span>
                )}
              </div>

              {/* Players */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-golden-500/30 transition-colors">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-golden-500/10 transition-colors">
                    <Users className="w-6 h-6 text-golden-500" />
                  </div>
                  <span className="font-medium text-lg">{t('status.playersLabel')}</span>
                </div>
                <span className="text-white font-mono font-bold text-lg">
                  {loading ? '-- / --' : status?.online ? (
                    <><span className="text-golden-400">{status.players.online}</span> <span className="text-slate-500">/</span> {status.players.max}</>
                  ) : '0 / 0'}
                </span>
              </div>

              {/* Version */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-golden-500/30 transition-colors">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-golden-500/10 transition-colors">
                    <Info className="w-6 h-6 text-golden-500" />
                  </div>
                  <span className="font-medium text-lg">{t('status.versionLabel')}</span>
                </div>
                <span className="text-white font-mono font-bold bg-white/10 px-3 py-1 rounded-lg">
                  1.20.4+
                </span>
              </div>

              {/* Network */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-golden-500/30 transition-colors">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-golden-500/10 transition-colors">
                    <Globe2 className="w-6 h-6 text-golden-500" />
                  </div>
                  <span className="font-medium text-lg">Network</span>
                </div>
                <span className="text-white font-mono font-bold flex items-center gap-2">
                  <SignalHigh className="w-4 h-4 text-green-500" />
                  Global
                </span>
              </div>
            </div>

            {/* MOTD */}
            <div className="w-full bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-center text-slate-400 mb-10 shadow-inner">
              <div className="text-xs text-golden-500/50 mb-2 uppercase tracking-widest">Message of the Day</div>
              <div className="text-lg">
                {loading ? <span className="animate-pulse">{t('status.fetchingMotd')}</span> : status?.motd || 'A Golden Carrot Minecraft Server'}
              </div>
            </div>

            {/* Connect Section */}
            <div className="w-full pt-8 border-t border-white/10 flex flex-col items-center">
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em] font-medium mb-6">
                {t('status.connectNow')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="bg-black/50 border border-golden-500/30 px-8 py-4 rounded-xl flex items-center justify-center w-full sm:w-auto shadow-[inset_0_0_20px_rgba(217,255,114,0.05)]">
                  <span className="text-2xl md:text-3xl font-display font-black text-golden-400 tracking-wider">
                    {serverAddress}
                  </span>
                </div>
                
                <Button 
                  variant="primary" 
                  magnetic 
                  onClick={handleCopy} 
                  className="w-full sm:w-auto h-16 px-8 rounded-xl shadow-[0_0_20px_rgba(217,255,114,0.16)] hover:shadow-[0_0_30px_rgba(217,255,114,0.28)] transition-all group"
                >
                  <div className="flex items-center gap-3 text-lg">
                    {showToast ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    <span className="font-bold">{showToast ? t('status.copied') : t('status.copyIp')}</span>
                  </div>
                </Button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.9 }}
            className="fixed bottom-8 left-1/2 z-50 glass-panel bg-golden-500/20 border-golden-500/50 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-5 h-5 text-golden-400" />
            <span className="font-medium">{t('status.addressCopied')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
