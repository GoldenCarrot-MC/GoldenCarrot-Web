import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';

const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(({ AuthModal }) => ({ default: AuthModal })));

interface MaintenanceProps {
  message?: string;
  until?: string;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ message, until }) => {
  const { user } = useAuthStore();
  const { isAuthModalOpen, setAuthModalOpen } = useStore();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { t } = useTranslation();
  
  const displayMessage = message || t('errors.maintenance.defaultMsg');

  useEffect(() => {
    if (!until) return;

    const target = new Date(until).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(t('errors.maintenance.restoringSoon'));
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(t('errors.maintenance.timeFormat', { hours, minutes, seconds }));
    }, 1000);

    return () => clearInterval(timer);
  }, [until, t]);

  const handleAdminContinue = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (user.role === 'admin' || user.role === 'moderator') {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono z-[100]">
      {isAuthModalOpen && <Suspense fallback={null}><AuthModal /></Suspense>}
      
      {/* Background Gear */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-golden-500/5 z-0"
      >
        <Settings size={600} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-xl w-full p-10 rounded-xl relative z-10 text-center border-golden-500/30 shadow-[0_0_60px_rgba(217,255,114,0.12)]"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="mx-auto w-24 h-24 mb-8 text-golden-500 flex items-center justify-center"
        >
          <Settings size={64} />
        </motion.div>

        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-golden-400 to-golden-600 mb-6 tracking-wider uppercase">
          SYSTEM MAINTENANCE
        </h1>
        
        <p className="text-xl text-white mb-6 font-medium">{displayMessage}</p>

        {until && (
          <div className="bg-black/40 p-4 rounded-lg border border-golden-500/20 mb-8 inline-block min-w-[250px]">
            <div className="text-sm text-golden-500/70 mb-1 uppercase tracking-widest">{t('errors.maintenance.estRestoreTime')}</div>
            <div className="text-2xl font-bold text-golden-400 font-mono">
              {timeLeft || t('errors.maintenance.calculating')}
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-white/5 flex justify-center">
          {(user?.role === 'admin' || user?.role === 'moderator' || !user) && (
            <button
              onClick={handleAdminContinue}
              className="px-6 py-2 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-white/10 rounded transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Lock size={14} />
              {user ? t('errors.maintenance.continueAsAdmin') : t('errors.maintenance.adminLogin')}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
