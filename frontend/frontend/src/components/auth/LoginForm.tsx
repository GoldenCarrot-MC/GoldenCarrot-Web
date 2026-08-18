import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Eye, EyeOff, KeyRound, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import i18n from '@/i18n';

const getLoginSchema = () => z.object({
  account: z.string().min(1, i18n.t('auth.errRequireAccount')),
  password: z.string().min(1, i18n.t('auth.errRequirePassword')),
  rememberMe: z.boolean().default(false),
});

type LoginFormInput = z.input<ReturnType<typeof getLoginSchema>>;
type LoginFormValues = z.output<ReturnType<typeof getLoginSchema>>;

interface Props {
  onSwitchMode: (mode: 'register' | 'forgotPassword') => void;
}

const fieldClassName =
  'w-full rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-electricBlue/70 focus:bg-white/[0.075]';

export function LoginForm({ onSwitchMode }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const { login } = useAuthStore();
  const { setAuthModalOpen } = useStore();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(getLoginSchema()),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      await login(data);
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.errLoginFailed'));
      setIsShake(true);
      window.setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={isShake ? { opacity: 1, x: [-8, 8, -8, 8, 0] } : { opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="login-account" className="mb-2 block text-sm font-medium text-slate-200">
            {t('auth.usernameOrEmail')}
          </label>
          <div className="group relative">
            <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue" />
            <input
              id="login-account"
              {...register('account')}
              autoComplete="username"
              placeholder={t('auth.usernameOrEmailPlaceholder')}
              className={fieldClassName}
            />
          </div>
          {errors.account && <span className="mt-2 block text-xs text-red-400">{errors.account.message}</span>}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-200">
            {t('auth.password')}
          </label>
          <div className="group relative">
            <KeyRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              autoComplete="current-password"
              placeholder={t('auth.enterPassword')}
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
          </div>
          {errors.password && <span className="mt-2 block text-xs text-red-400">{errors.password.message}</span>}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="group flex cursor-pointer items-center gap-2 text-slate-400">
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-600 transition-colors group-hover:border-electricBlue">
              <input type="checkbox" {...register('rememberMe')} className="peer sr-only" />
              <span className="absolute inset-0 rounded bg-golden-500 opacity-0 peer-checked:opacity-100" />
              <Check size={12} className="relative z-[1] text-black opacity-0 peer-checked:opacity-100" />
            </span>
            {t('auth.rememberMe')}
          </label>
          <button
            type="button"
            onClick={() => onSwitchMode('forgotPassword')}
            className="text-electricBlue transition-colors hover:text-golden-500"
          >
            {t('auth.forgotPasswordQuestion')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-golden-500 px-4 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-400">
        {t('auth.newHere')}{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('register')}
          className="font-medium text-electricBlue transition-colors hover:text-golden-500"
        >
          {t('auth.createAccount')}
        </button>
      </p>
    </motion.div>
  );
}
