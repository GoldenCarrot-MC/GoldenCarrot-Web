import { motion } from 'framer-motion';
import { TiltCard } from './ui/TiltCard';
import { AlertTriangle, ArrowUpRight, ClipboardCheck, Clock3, MessageSquareText, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FeaturesSection() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: MessageSquareText,
      title: t('featuresSec.step1Title'),
      description: t('featuresSec.step1Desc'),
      href: 'https://qm.qq.com/q/3GRhPp042Q',
      external: true,
      notice: undefined,
    },
    {
      icon: ClipboardCheck,
      title: t('featuresSec.step2Title'),
      description: t('featuresSec.step2Desc'),
      href: '/whitelist',
      external: false,
      notice: undefined,
    },
    {
      icon: Clock3,
      title: t('featuresSec.step3Title'),
      description: t('featuresSec.step3Desc'),
      href: undefined,
      external: false,
      notice: t('featuresSec.step3Notice'),
    },
    {
      icon: UsersRound,
      title: t('featuresSec.step4Title'),
      description: t('featuresSec.step4Desc'),
      href: undefined,
      external: false,
      notice: undefined,
    },
  ];

  return (
    <section className="py-32 relative z-10 bg-black overflow-hidden">
      {/* Sci-fi Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,255,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,255,114,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-golden-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('featuresSec.title1')}<span className="text-golden-500">{t('featuresSec.title2')}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {t('featuresSec.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[1000px]">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="mb-8 flex items-center justify-between">
                  <div className="relative w-14 h-14 rounded-xl flex items-center justify-center border border-golden-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-golden-500/10" />
                    <div className="absolute inset-0 bg-golden-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <step.icon className="w-7 h-7 text-golden-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="font-mono text-sm text-golden-500/60">0{idx + 1}</span>
                </div>
                {step.href ? (
                  step.external ? (
                    <a href={step.href} target="_blank" rel="noreferrer" className="group/link block">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white transition-colors group-hover/link:text-golden-400">
                        {step.title}<ArrowUpRight className="h-5 w-5" />
                      </h3>
                      <p className="leading-relaxed text-slate-400 transition-colors group-hover/link:text-slate-300">{step.description}</p>
                    </a>
                  ) : (
                    <Link to={step.href} className="group/link block">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white transition-colors group-hover/link:text-golden-400">
                        {step.title}<ArrowUpRight className="h-5 w-5" />
                      </h3>
                      <p className="leading-relaxed text-slate-400 transition-colors group-hover/link:text-slate-300">{step.description}</p>
                    </Link>
                  )
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-golden-400 transition-colors">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </>
                )}
                {step.notice && (
                  <div className="mt-6 flex gap-3 border-l-2 border-golden-500/70 bg-golden-500/5 px-4 py-3 text-sm leading-relaxed text-slate-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-golden-400" />
                    <p>{step.notice}</p>
                  </div>
                )}
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
