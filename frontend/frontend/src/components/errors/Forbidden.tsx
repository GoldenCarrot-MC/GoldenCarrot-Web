import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from 'react-i18next';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [countdown, setCountdown] = useState(10);
  const [isCancelled, setIsCancelled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isCancelled || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isCancelled, navigate]);

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-mono z-[100]">
      {/* Red grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-lg w-full p-8 rounded-xl relative z-10 text-center border-red-500/50 shadow-[0_0_50px_rgba(255,0,0,0.15)] ring-1 ring-golden-500/30"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto w-20 h-20 mb-6 flex items-center justify-center text-red-500 bg-red-500/10 rounded-full border border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
        >
          <ShieldAlert size={40} />
        </motion.div>

        <h1 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
          {t('errors.403.title')}
        </h1>
        <h2 className="text-xl font-bold text-white mb-6">{t('errors.403.subtitle')}</h2>
        
        {user && (
          <div className="bg-black/50 p-3 rounded border border-white/10 mb-8 inline-block">
            <span className="text-slate-400">{t('errors.403.currentUser')}</span>
            <span className="text-golden-500 font-bold ml-2">{user.username}</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-bold w-full sm:w-auto"
          >
            <Home size={18} />
            {t('errors.backHome')}
          </button>
        </div>

        {!isCancelled && (
          <div className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
            <span>{t('errors.autoRedirect', { seconds: countdown })}</span>
            <button 
              onClick={() => setIsCancelled(true)}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 ml-2"
              title={t('errors.cancelRedirect')}
            >
              <XCircle size={14} /> {t('errors.cancel')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
