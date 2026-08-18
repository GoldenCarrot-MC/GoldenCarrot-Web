import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth';
import i18n from '@/i18n';

const getSchema = () => z.object({
  email: z.string().email(i18n.t('auth.errEmailFormat')),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface Props {
  onSwitchMode: (mode: 'login') => void;
}

export function ForgotPasswordForm({ onSwitchMode }: Props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setError('');
      await authService.forgotPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.errRequestFailed'));
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-golden-500/10 text-golden-500">
          <CheckCircle2 size={34} />
        </div>
        <h3 className="text-xl font-bold text-white">{t('auth.emailSent')}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{t('auth.emailSentDesc')}</p>
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-golden-500 px-4 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white"
        >
          <ArrowLeft size={18} />
          {t('auth.backToLogin')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-slate-200">
            {t('auth.email')}
          </label>
          <div className="group relative">
            <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue" />
            <input
              id="reset-email"
              {...register('email')}
              autoComplete="email"
              placeholder={t('auth.emailPlaceholder')}
              className="w-full rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-electricBlue/70 focus:bg-white/[0.075]"
            />
          </div>
          {errors.email && <span className="mt-2 block text-xs text-red-400">{errors.email.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-golden-500 px-4 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {t('auth.sendResetLink')}
        </button>
      </form>

      <button
        type="button"
        onClick={() => onSwitchMode('login')}
        className="mx-auto mt-7 flex items-center gap-2 text-sm text-electricBlue transition-colors hover:text-golden-500"
      >
        <ArrowLeft size={16} />
        {t('auth.backToLogin')}
      </button>
    </motion.div>
  );
}
