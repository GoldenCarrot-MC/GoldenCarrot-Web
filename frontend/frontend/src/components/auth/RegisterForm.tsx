import { useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Loader2, Mail, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth';
import i18n from '@/i18n';

const getRegisterSchema = () => z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]{3,16}$/, i18n.t('auth.errUsernameFormat')),
  email: z.string().email(i18n.t('auth.errEmailFormat')),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/, i18n.t('auth.errPasswordFormat')),
  confirmPassword: z.string(),
  captchaCode: z.string().length(4, i18n.t('auth.errCaptchaFormat')),
}).refine(data => data.password === data.confirmPassword, {
  message: i18n.t('auth.passwordMismatch'),
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;

interface Props {
  onSwitchMode: (mode: 'login') => void;
  onSuccess: (account: string) => void;
}

const fieldClassName =
  'w-full rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-electricBlue/70 focus:bg-white/[0.075]';

export function RegisterForm({ onSwitchMode, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [captcha, setCaptcha] = useState<{ id: string; svg: string } | null>(null);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(getRegisterSchema()),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '', captchaCode: '' },
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const passwordMatched = confirmPassword.length > 0 && confirmPassword === password;
  const strength = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
  ].filter(Boolean).length;

  const fetchCaptcha = async () => {
    try {
      setIsCaptchaLoading(true);
      const res = await authService.getCaptcha();
      setCaptcha({ id: res.data.captchaId, svg: res.data.svg });
    } catch {
      setError(t('auth.errCaptchaLoadFailed'));
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  const continueToVerification = async () => {
    const isValid = await trigger(['username', 'email', 'password', 'confirmPassword']);
    if (!isValid) return;
    setError('');
    setStep(2);
    if (!captcha) await fetchCaptcha();
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      if (!captcha) {
        await fetchCaptcha();
        return;
      }
      await authService.register({ ...data, captchaId: captcha.id });
      onSuccess(data.username);
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.errRegisterFailed'));
      setIsShake(true);
      window.setTimeout(() => setIsShake(false), 500);
      await fetchCaptcha();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={isShake ? { opacity: 1, x: [-8, 8, -8, 8, 0] } : { opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6 flex items-center gap-3" aria-label={t('auth.stepProgress', { current: step })}>
        {[1, 2].map(item => (
          <div key={item} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item <= step ? 'bg-golden-500 text-[#07100d]' : 'border border-white/15 text-slate-500'
              }`}
            >
              {item}
            </span>
            <span className={`hidden text-xs sm:block ${item <= step ? 'text-slate-200' : 'text-slate-600'}`}>
              {item === 1 ? t('auth.registerStepOne') : t('auth.registerStepTwo')}
            </span>
            {item === 1 && <span className="h-px flex-1 bg-white/10" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <p className="text-sm leading-6 text-slate-400">{t('auth.registerStepOneDesc')}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField
                  id="register-username"
                  label={t('auth.username')}
                  error={errors.username?.message}
                  icon={<User size={17} />}
                >
                  <input
                    id="register-username"
                    {...register('username')}
                    autoComplete="username"
                    placeholder={t('auth.usernamePlaceholder')}
                    className={fieldClassName}
                  />
                </AuthField>

                <AuthField
                  id="register-email"
                  label={t('auth.email')}
                  error={errors.email?.message}
                  icon={<Mail size={17} />}
                >
                  <input
                    id="register-email"
                    {...register('email')}
                    autoComplete="email"
                    placeholder={t('auth.emailPlaceholder')}
                    className={fieldClassName}
                  />
                </AuthField>
              </div>

              <AuthField
                id="register-password"
                label={t('auth.password')}
                error={errors.password?.message}
                icon={<KeyRound size={17} />}
              >
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="new-password"
                  placeholder={t('auth.passwordPlaceholder')}
                  className={`${fieldClassName} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={t('auth.togglePasswordVisibility')}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-slate-500 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </AuthField>

              <AuthField
                id="register-confirm-password"
                label={t('auth.confirmPassword')}
                error={errors.confirmPassword?.message}
                icon={<ShieldCheck size={17} />}
              >
                <input
                  id="register-confirm-password"
                  type="password"
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className={`${fieldClassName} ${confirmPassword ? (passwordMatched ? 'border-electricBlue/50' : 'border-red-400/40') : ''}`}
                />
              </AuthField>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t('auth.passwordStrength')}</span>
                  <span className="text-slate-300">
                    {strength === 3 ? t('auth.strengthHigh') : strength === 2 ? t('auth.strengthMedium') : strength === 1 ? t('auth.strengthLow') : t('auth.strengthNone')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(item => (
                    <span key={item} className={`h-1 rounded-full ${strength >= item ? 'bg-golden-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={continueToVerification}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-golden-500 px-4 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white"
              >
                {t('auth.continue')}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{t('auth.securityCheck')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{t('auth.verificationDesc')}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_168px]">
                <AuthField
                  id="register-captcha"
                  label={t('auth.captcha')}
                  error={errors.captchaCode?.message}
                  icon={<ShieldCheck size={17} />}
                >
                  <input
                    id="register-captcha"
                    {...register('captchaCode')}
                    inputMode="numeric"
                    maxLength={4}
                    autoFocus
                    placeholder={t('auth.captchaPlaceholder')}
                    className={fieldClassName}
                  />
                </AuthField>

                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-200">{t('auth.captchaImage')}</span>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    disabled={isCaptchaLoading}
                    className="relative flex h-[46px] w-full items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white text-[#07100d] transition-colors hover:border-electricBlue disabled:opacity-60"
                    aria-label={t('auth.refresh')}
                  >
                    {isCaptchaLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : captcha ? (
                      <span className="w-full px-2" dangerouslySetInnerHTML={{ __html: captcha.svg }} />
                    ) : (
                      <RefreshCw size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  <ArrowLeft size={18} />
                  {t('auth.previousStep')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCaptchaLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-golden-500 px-4 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {isSubmitting ? t('auth.creating') : t('auth.createAccount')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t('auth.hasAccount')}{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="font-medium text-electricBlue transition-colors hover:text-golden-500"
        >
          {t('auth.backToLogin')}
        </button>
      </p>
    </motion.div>
  );
}

interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  icon: ReactNode;
  children: ReactNode;
}

function AuthField({ id, label, error, icon, children }: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue">
          {icon}
        </span>
        {children}
      </div>
      {error && <span className="mt-2 block text-xs text-red-400">{error}</span>}
    </div>
  );
}
