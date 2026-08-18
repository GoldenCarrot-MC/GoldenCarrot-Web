import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ServerError: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono z-[100]">
      {/* Smoke animation via CSS */}
      <style>
        {`
          @keyframes smoke {
            0% { transform: translateY(0) scale(1); opacity: 0.8; filter: blur(5px); }
            100% { transform: translateY(-100px) scale(3); opacity: 0; filter: blur(20px); }
          }
          .smoke-particle {
            position: absolute;
            background: rgba(100, 100, 100, 0.4);
            border-radius: 50%;
            animation: smoke 4s infinite linear;
          }
        `}
      </style>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none z-0">
        <div className="smoke-particle w-12 h-12 left-[20%] animation-delay-0" />
        <div className="smoke-particle w-16 h-16 left-[50%] animation-delay-1000" />
        <div className="smoke-particle w-10 h-10 left-[80%] animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-lg w-full p-8 rounded-xl relative z-10 text-center border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-8 relative inline-block">
          {/* Broken Golden Carrot SVG */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,191,0,0.4)]">
            <path d="M20 80 L45 55 L35 45 L10 70 Z" fill="#D4AF37" stroke="#B8860B" strokeWidth="2" />
            <path d="M55 45 L80 20 L70 10 L45 35 Z" fill="#D4AF37" stroke="#B8860B" strokeWidth="2" />
            <path d="M75 15 L85 5 L95 15 Z" fill="#22C55E" />
            <path d="M35 55 L55 35" stroke="#FF4444" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
          </svg>
        </div>

        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200 mb-4">
          500
        </h1>
        <h2 className="text-2xl font-bold text-white mb-2">{t('errors.500.title')}</h2>
        <p className="text-slate-400 mb-8">{t('errors.500.desc')}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-bold"
          >
            <RefreshCcw size={18} />
            {t('errors.refresh')}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-golden-500/20 hover:bg-golden-500/30 text-golden-500 border border-golden-500/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-bold"
          >
            <Home size={18} />
            {t('errors.backHome')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
