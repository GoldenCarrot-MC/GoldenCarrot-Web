import { motion } from 'framer-motion';
import { TeamSection } from '@/components/TeamSection';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-12 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header / Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white tracking-tight">
            {t('aboutUs.title1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-400 to-golden-600">{t('aboutUs.title2')}</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-golden-400 to-golden-600 mx-auto rounded-full mb-8" />
          <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
            {t('aboutUs.desc')}
          </p>
        </motion.div>
      </div>

      {/* Team Section Integration */}
      <div className="mt-8">
        <TeamSection />
      </div>
    </div>
  );
}
