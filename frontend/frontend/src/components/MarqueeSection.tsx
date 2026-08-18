import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1607513746994-51f730a44832?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1623934199716-ba2e153b65e6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610041321427-0248e3a2164e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610041321350-0d1276a6b579?q=80&w=800&auto=format&fit=crop'
];

export function MarqueeSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const TextGroup = () => (
    <div className="flex items-center space-x-6 md:space-x-12 px-3 md:px-6 shrink-0 h-[4rem] md:h-[8rem]">
      {[...Array(4)].map((_, i) => (
        <span 
          key={i} 
          className="text-[3rem] md:text-[6rem] font-display font-black whitespace-nowrap z-30 relative tracking-wider md:tracking-[0.1em] leading-none py-4 flex items-center gap-4 md:gap-8 uppercase" 
        >
          <span className="text-golden-500 tracking-normal drop-shadow-[0_0_20px_rgba(217,255,114,0.55)]">GoldenCarrot</span>
          <span 
            className="text-transparent" 
            style={{ WebkitTextStroke: '2px rgba(217, 255, 114, 0.72)' }}
          >
            Server
          </span>
        </span>
      ))}
    </div>
  );

  const ImageGroup = () => (
    <div className="flex items-center space-x-4 md:space-x-8 px-4 shrink-0">
      {images.map((src, i) => (
        <div 
          key={i} 
          onClick={() => setSelectedImage(src)}
          className="relative w-[240px] md:w-[400px] aspect-[16/9] rounded-xl overflow-hidden group/image shrink-0 border border-golden-500/20 hover:border-golden-500/80 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(217,255,114,0.22)] cursor-pointer"
        >
          {/* Sci-fi Overlay */}
          <div className="absolute inset-0 bg-golden-500/10 mix-blend-overlay group-hover/image:bg-transparent transition-colors duration-500 z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-50 group-hover/image:opacity-30 transition-opacity" />
          
          <img 
            src={src} 
            alt="Server Snapshot" 
            className="w-full h-full object-cover transform group-hover/image:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Neon corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-golden-500 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-golden-500 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20" />

          {/* Click to Enlarge Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20">
            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-golden-500/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-golden-500">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative py-12 md:py-24 bg-black overflow-hidden flex flex-col gap-4 md:gap-8 z-10 border-y border-golden-500/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,255,114,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(217,255,114,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-golden-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-20" />

      {/* Marquee Row 1 (Text, Scrolls Left) */}
      <div className="relative flex overflow-hidden group/row1 z-30">
        <div className="flex w-max animate-marquee pr-6 md:pr-12 items-center" style={{ animationDuration: '40s' }}>
          <TextGroup />
          <TextGroup />
        </div>
      </div>

      {/* Marquee Row 2 (Images, Scrolls Left) */}
      <div className="relative flex overflow-hidden group/row2 mt-4 md:mt-8 z-30">
        <div className="flex w-max animate-marquee group-hover/row2:[animation-play-state:paused] pr-4 md:pr-8 items-center" style={{ animationDuration: '40s' }}>
          <ImageGroup />
          <ImageGroup />
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-golden-500 hover:text-black text-white transition-colors"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(217,255,114,0.12)] border border-golden-500/20 cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
