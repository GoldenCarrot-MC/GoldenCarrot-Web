import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/services/api';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'banned' | 'unknown';
type QuestionType = 'single_choice' | 'multiple_choice' | 'text';

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  input?: {
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
    multiline?: boolean;
    placeholder?: string;
  };
}

interface QuestionnaireAnswer {
  type: QuestionType;
  selectedOptionIds: number[];
  textAnswer: string;
}

interface QuestionnaireResult {
  passed: boolean;
  score: number;
  passScore: number;
  manualReviewRequired?: boolean;
  answers: Record<string, QuestionnaireAnswer>;
  token: string;
  submittedAt: number;
  expiresAt: number;
}

const fieldClassName =
  'w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-electricBlue/70 focus:bg-white/[0.075]';

const statusTone: Record<ApplicationStatus, string> = {
  pending: 'border-golden-500/25 bg-golden-500/10 text-golden-300',
  approved: 'border-electricBlue/25 bg-electricBlue/10 text-electricBlue',
  rejected: 'border-red-400/25 bg-red-400/10 text-red-300',
  banned: 'border-red-500/25 bg-red-500/10 text-red-300',
  unknown: 'border-white/10 bg-white/5 text-slate-300',
};

export default function Whitelist() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ username: '', email: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, QuestionnaireAnswer>>({});
  const [questionnaireEnabled, setQuestionnaireEnabled] = useState(false);
  const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(true);
  const [questionnaireResult, setQuestionnaireResult] = useState<QuestionnaireResult | null>(null);
  const [statusUsername, setStatusUsername] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeStage, setActiveStage] = useState('basic');

  const choiceQuestions = useMemo(
    () => questions.filter((question) => question.type === 'single_choice' || question.type === 'multiple_choice'),
    [questions],
  );
  const textQuestions = useMemo(() => questions.filter((question) => question.type === 'text'), [questions]);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      setIsLoadingQuestionnaire(true);
      try {
        const { data } = await apiClient.get('/questionnaire/config', { params: { language: i18n.language } });
        const loadedQuestions = Array.isArray(data.data?.questions) ? data.data.questions : [];
        setQuestionnaireEnabled(Boolean(data.data?.enabled));
        setQuestions(loadedQuestions);
        setAnswers(Object.fromEntries(loadedQuestions.map((question: Question) => [question.id, {
          type: question.type,
          selectedOptionIds: [],
          textAnswer: '',
        }])));
        setQuestionnaireResult(null);
      } catch {
        setQuestionnaireEnabled(false);
        setQuestions([]);
      } finally {
        setIsLoadingQuestionnaire(false);
      }
    };

    void loadQuestionnaire();
  }, [i18n.language]);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateChoiceAnswer = (question: Question, optionId: number) => {
    const current = answers[question.id] ?? { type: question.type, selectedOptionIds: [], textAnswer: '' };
    const selectedOptionIds = question.type === 'single_choice'
      ? [optionId]
      : current.selectedOptionIds.includes(optionId)
        ? current.selectedOptionIds.filter((id) => id !== optionId)
        : [...current.selectedOptionIds, optionId];
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: { ...current, selectedOptionIds } }));
  };

  const updateTextAnswer = (question: Question, textAnswer: string) => {
    const current = answers[question.id] ?? { type: question.type, selectedOptionIds: [], textAnswer: '' };
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: { ...current, textAnswer } }));
  };

  const isQuestionnaireValid = () => questions.every((question) => {
    const answer = answers[question.id];
    if (!answer) return !question.required;
    if (question.type === 'text') {
      const length = answer.textAnswer.trim().length;
      return length >= (question.input?.minLength ?? (question.required ? 1 : 0)) && length <= (question.input?.maxLength ?? Infinity);
    }
    const selected = answer.selectedOptionIds.length;
    return selected >= (question.input?.minSelections ?? (question.required ? 1 : 0)) && selected <= (question.input?.maxSelections ?? Infinity);
  });

  const submitQuestionnaire = async (): Promise<QuestionnaireResult | null> => {
    if (!questionnaireEnabled || !questions.length) return null;
    if (!isQuestionnaireValid()) {
      setMessage(t('whitelist.answerRequired'));
      setActiveStage('choices');
      return null;
    }
    const formattedAnswers = Object.fromEntries(questions.map((question) => [String(question.id), answers[question.id]]));
    try {
      const { data } = await apiClient.post('/questionnaire/submit', { answers: formattedAnswers, language: i18n.language });
      if (!data.success) {
        setMessage(data.message || t('whitelist.questionnaireSubmitFailed'));
        return null;
      }
      const result: QuestionnaireResult = {
        passed: Boolean(data.passed),
        score: data.score,
        passScore: data.passScore,
        manualReviewRequired: Boolean(data.manualReviewRequired),
        answers: formattedAnswers,
        token: data.token,
        submittedAt: data.submittedAt,
        expiresAt: data.expiresAt,
      };
      setQuestionnaireResult(result);
      return result;
    } catch {
      setMessage(t('whitelist.questionnaireSubmitFailed'));
      return null;
    }
  };

  const submitApplication = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setApplicationStatus(null);
    setIsSubmitting(true);
    try {
      let result = questionnaireResult;
      if (questionnaireEnabled && !result) {
        result = await submitQuestionnaire();
        if (!result || (!result.passed && !result.manualReviewRequired)) {
          setApplicationStatus('rejected');
          setActiveStage('status');
          return;
        }
      }
      const payload: Record<string, unknown> = {
        username: form.username.trim(),
        email: form.email.trim(),
        language: i18n.language,
      };
      if (result) payload.questionnaire = result;
      const { data } = await apiClient.post('/register', {
        ...payload,
      });
      setMessage(data.message || t('whitelist.successMessage'));
      setApplicationStatus(data.success ? 'pending' : 'rejected');
      setStatusUsername(form.username.trim());
      setActiveStage('status');
      if (data.success) setForm({ username: '', email: '' });
    } catch (error: any) {
      setMessage(error.response?.data?.message || error.response?.data?.error || t('whitelist.submitFailed'));
      setApplicationStatus('rejected');
      setActiveStage('status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkStatus = async (event: FormEvent) => {
    event.preventDefault();
    if (!statusUsername.trim()) return;
    setMessage('');
    setIsChecking(true);
    try {
      const { data } = await apiClient.get('/review/status', {
        params: { username: statusUsername.trim(), language: i18n.language },
      });
      setApplicationStatus((data.status || 'unknown') as ApplicationStatus);
      setMessage(data.message || '');
    } catch (error: any) {
      setApplicationStatus(null);
      setMessage(error.response?.data?.message || t('whitelist.statusNotFound'));
    } finally {
      setIsChecking(false);
    }
  };

  const statusLabel = applicationStatus ? t(`whitelist.status.${applicationStatus}`) : '';

  return (
    <main className="grid min-h-[calc(100vh-5rem)] bg-[#070908] text-slate-200 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="auth-visual relative min-h-[360px] overflow-hidden lg:min-h-[calc(100vh-5rem)]"
      >
        <div className="auth-visual__mesh" />
        <div className="relative z-[2] flex min-h-[360px] flex-col justify-between p-7 text-[#07100d] sm:p-10 lg:min-h-[calc(100vh-5rem)] lg:p-14">
          <div className="flex items-center gap-3 font-display text-lg font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#07100d] text-golden-500 shadow-lg">
              <ShieldCheck size={21} />
            </span>
            <span>Golden Genesis</span>
          </div>

          <div className="mt-16 max-w-xl lg:mt-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em]">{t('whitelist.formKicker')}</p>
            <h1 className="font-display text-4xl font-bold leading-[1.04] sm:text-5xl lg:text-6xl">
              {t('whitelist.title')} {t('whitelist.titleAccent')}
            </h1>
            <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-[#15231e]/80 sm:text-base">
              {t('whitelist.description')}
            </p>

            <div className="mt-10 grid gap-2 border-t border-[#07100d]/20 pt-6">
              {[
                ['basic', t('whitelist.stageBasic')],
                ['choices', t('whitelist.stageChoices')],
                ['essay', t('whitelist.stageEssay')],
                ['status', t('whitelist.stageStatus')],
              ].map(([id, label], index) => (
                <button key={id} type="button" onClick={() => { setActiveStage(id); document.getElementById(`whitelist-${id}`)?.scrollIntoView({ behavior: 'smooth' }); }} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${activeStage === id ? 'bg-[#07100d]/15' : 'opacity-60 hover:opacity-100'}`}>
                  <span className="font-mono text-xs">0{index + 1}</span>{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        id="whitelist-basic"
        className="flex items-center bg-[#070908] px-6 py-12 sm:px-10 lg:px-14 lg:py-16"
      >
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-electricBlue">
              <ShieldCheck size={15} />
              {t('whitelist.processTitle')}
            </p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{t('whitelist.formTitle')}</h2>
          </div>

          <form onSubmit={submitApplication} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">{t('whitelist.username')}</span>
                <span className="group relative block">
                  <UserRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue" />
                  <input
                    required
                    minLength={3}
                    maxLength={16}
                    pattern="[a-zA-Z0-9_]+"
                    autoComplete="username"
                    value={form.username}
                    onChange={(event) => updateForm('username', event.target.value)}
                    placeholder={t('whitelist.usernamePlaceholder')}
                    className={fieldClassName}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">{t('whitelist.email')}</span>
                <span className="group relative block">
                  <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-electricBlue" />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => updateForm('email', event.target.value)}
                    placeholder={t('whitelist.emailPlaceholder')}
                    className={fieldClassName}
                  />
                </span>
              </label>
            </div>

            <section id="whitelist-choices" className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white"><ClipboardCheck size={18} className="text-electricBlue" />{t('whitelist.choicesTitle')}</h3>
              {isLoadingQuestionnaire ? <p className="mt-3 text-sm text-slate-500">{t('whitelist.loading')}</p> : !questionnaireEnabled || !choiceQuestions.length ? <p className="mt-3 text-sm text-slate-500">{t('whitelist.noChoices')}</p> : <div className="mt-5 space-y-5">{choiceQuestions.map((question, index) => <fieldset key={question.id}><legend className="mb-2 text-sm font-semibold text-white"><span className="mr-2 font-mono text-xs text-electricBlue">Q{index + 1}</span>{question.question}{question.required && <span className="ml-1 text-red-300">*</span>}</legend><div className="grid gap-2 sm:grid-cols-2">{question.options?.map((option) => { const selected = answers[question.id]?.selectedOptionIds.includes(option.id); return <label key={option.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${selected ? 'border-electricBlue/60 bg-electricBlue/10' : 'border-white/10 bg-white/[0.03]'}`}><input type={question.type === 'single_choice' ? 'radio' : 'checkbox'} name={`question-${question.id}`} checked={selected} onChange={() => updateChoiceAnswer(question, option.id)} className="accent-[#86D9C8]" />{option.text}</label>; })}</div></fieldset>)}</div>}
            </section>

            <section id="whitelist-essay" className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white"><FileText size={18} className="text-golden-400" />{t('whitelist.essayTitle')}</h3>
              {isLoadingQuestionnaire ? <p className="mt-3 text-sm text-slate-500">{t('whitelist.loading')}</p> : !questionnaireEnabled || !textQuestions.length ? <p className="mt-3 text-sm text-slate-500">{t('whitelist.noEssay')}</p> : <div className="mt-5 space-y-5">{textQuestions.map((question, index) => <label key={question.id} className="block"><span className="mb-2 block text-sm font-semibold text-white"><span className="mr-2 font-mono text-xs text-golden-400">Q{choiceQuestions.length + index + 1}</span>{question.question}{question.required && <span className="ml-1 text-red-300">*</span>}</span><textarea required={question.required} minLength={question.input?.minLength} maxLength={question.input?.maxLength} rows={5} value={answers[question.id]?.textAnswer || ''} onChange={(event) => updateTextAnswer(question, event.target.value)} placeholder={question.input?.placeholder || t('whitelist.essayPlaceholder')} className={`${fieldClassName} resize-y leading-6`} /></label>)}</div>}
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-golden-500 px-5 py-3 font-semibold text-[#07100d] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              {isSubmitting ? t('whitelist.submitting') : t('whitelist.submit')}
            </button>
          </form>

          <div id="whitelist-status" className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 size={18} className="text-electricBlue" />
              <h3 className="font-semibold text-white">{t('whitelist.statusTitle')}</h3>
            </div>
            <form onSubmit={checkStatus} className="flex gap-2">
              <input
                value={statusUsername}
                onChange={(event) => setStatusUsername(event.target.value)}
                placeholder={t('whitelist.statusPlaceholder')}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-electricBlue/70"
              />
              <button
                type="submit"
                disabled={isChecking}
                aria-label={t('whitelist.check')}
                title={t('whitelist.check')}
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-white/15 text-electricBlue transition-colors hover:border-electricBlue hover:bg-electricBlue hover:text-[#07100d] disabled:opacity-50"
              >
                {isChecking ? <Loader2 className="animate-spin" size={17} /> : <Search size={17} />}
              </button>
            </form>

            {applicationStatus && (
              <div className={`mt-5 flex items-center gap-3 rounded-lg border p-4 ${statusTone[applicationStatus]}`}>
                <Check size={18} />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] opacity-70">{t('whitelist.currentStatus')}</p>
                  <p className="mt-1 font-semibold">{statusLabel}</p>
                </div>
              </div>
            )}
            {questionnaireResult && <div className="mt-5 flex items-center gap-3 rounded-lg border border-electricBlue/25 bg-electricBlue/10 p-4 text-electricBlue"><CheckCircle2 size={18} /><span>{t('whitelist.score', { score: questionnaireResult.score, passScore: questionnaireResult.passScore })}</span></div>}
            {message && <p className="mt-4 border-l-2 border-electricBlue/60 pl-3 text-sm leading-6 text-slate-300">{message}</p>}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
