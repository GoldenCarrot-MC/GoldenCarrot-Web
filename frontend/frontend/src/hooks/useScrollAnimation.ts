import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  useEffect(() => {
    // This hook could be used to initialize global GSAP scroll animations
    // Currently relying more on framer-motion for component-level, but keeping this for complex timelines
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}