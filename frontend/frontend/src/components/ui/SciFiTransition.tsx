import { motion } from 'framer-motion';

export function SciFiTransition() {
  return (
    <div className="relative w-full h-32 bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-none z-10 border-b border-white/5">
      {/* Central glowing line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-golden-500/50 to-transparent -translate-y-1/2" />
      
      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-golden-500/10 blur-[80px] rounded-full" />
      
      {/* Sci-fi decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 text-golden-500/40 font-mono text-[10px] tracking-[0.3em] bg-black px-4">
        <motion.span 
          animate={{ opacity: [0.3, 1, 0.3] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="hidden sm:block"
        >
          SYS.END
        </motion.span>
        <span className="w-12 h-px bg-golden-500/30 hidden sm:block" />
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 rotate-45 border border-golden-500/50" />
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-8 h-8 rounded-full border border-dashed border-golden-500/30"
          />
        </div>
        <span className="w-12 h-px bg-golden-500/30 hidden sm:block" />
        <motion.span 
          animate={{ opacity: [0.3, 1, 0.3] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
          className="hidden sm:block"
        >
          0x00FF
        </motion.span>
      </div>

      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,transparent,black_50%,transparent)]" />
    </div>
  );
}
