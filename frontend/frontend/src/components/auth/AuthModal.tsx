import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sprout, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgotPassword';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen } = useStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuthModalOpen) {
      const timer = window.setTimeout(() => setMode('login'), 300);
      return () => window.clearTimeout(timer);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const content = {
    login: {
      title: t('auth.welcomeBack'),
      description: t('auth.loginDesc'),
    },
    register: {
      title: t('auth.registerTitle'),
      description: t('auth.registerDesc'),
    },
    forgotPassword: {
      title: t('auth.forgotPassword'),
      description: t('auth.forgotPasswordDesc'),
    },
  }[mode];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 backdrop-blur-md sm:p-5">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.99 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="relative grid h-full w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-white/10 bg-[#070908] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:h-[min(700px,calc(100vh-40px))] sm:max-w-6xl sm:rounded-lg sm:border lg:grid-cols-[1.08fr_0.92fr] lg:grid-rows-1"
        >
          <section className="auth-visual relative min-h-[168px] overflow-hidden lg:min-h-0">
            <div className="auth-visual__mesh" />
            <div className="relative z-[2] flex h-full flex-col justify-between p-6 text-[#07100d] sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 font-display text-lg font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#07100d] text-golden-500 shadow-lg">
                  <Sprout size={21} />
                </span>
                <span>Golden Carrot</span>
              </div>
              <div className="hidden max-w-md lg:block">
                <div className="mb-5 h-1 w-12 bg-[#07100d]" />
                <p className="text-4xl font-display font-bold leading-[1.08] text-[#07100d]">
                  {t('auth.brandTagline')}
                </p>
              </div>
            </div>
          </section>

          <section className="relative min-h-0 overflow-y-auto bg-[#070908]">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              aria-label={t('auth.close')}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex min-h-full w-full max-w-[500px] flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
              <div className="mb-8 pr-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-electricBlue">
                  {t('auth.secureAccess')}
                </p>
                <h2 id="auth-modal-title" className="font-display text-3xl font-bold text-white sm:text-4xl">
                  {content.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{content.description}</p>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' && <LoginForm key="login" onSwitchMode={setMode} />}
                {mode === 'register' && (
                  <RegisterForm key="register" onSwitchMode={setMode} onSuccess={() => setMode('login')} />
                )}
                {mode === 'forgotPassword' && (
                  <ForgotPasswordForm key="forgot" onSwitchMode={setMode} />
                )}
              </AnimatePresence>
            </div>
          </section>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
