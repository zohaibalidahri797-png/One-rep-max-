import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from '../components/home/HeroSection';
import { BigStatementSection } from '../components/home/BigStatementSection';
import { CalculatorPreviewSection } from '../components/home/CalculatorPreviewSection';
import { FormulasStorySection } from '../components/home/FormulasStorySection';
import { ExercisesStorySection } from '../components/home/ExercisesStorySection';
import { ScienceSplitSection } from '../components/home/ScienceSplitSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FaqSection } from '../components/home/FaqSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    // Initialize Lenis for smooth desktop inertial scrolling safely
    let lenis: Lenis | null = null;
    let rafCallback: ((time: number) => void) | null = null;

    try {
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false, // 100% native mobile touch response without interference
      });

      lenis.on('scroll', ScrollTrigger.update);

      rafCallback = (time: number) => {
        if (lenis) {
          lenis.raf(time * 1000);
        }
      };

      gsap.ticker.add(rafCallback);
    } catch (e) {
      console.warn('Lenis smooth scrolling bypassed:', e);
    }

    // Refresh ScrollTrigger once DOM layout settles
    const timer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch (err) {
        console.warn('ScrollTrigger refresh caught:', err);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch {}
      }
    };
  }, []);

  const handleScrollToScience = () => {
    const el = document.getElementById('science-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] overflow-hidden">
      {/* 1. Hero Section (with 3D Bench Press video & differential depth parallax) */}
      <HeroSection onNavigate={onNavigate} onExploreClick={handleScrollToScience} />

      {/* 2. Chapter 2: Big Statement Section (Light neutral canvas with constructed kinetic typography) */}
      <BigStatementSection />

      {/* 3. Chapter 3: Calculator Preview (3-phase 3D product emergence and receding depth) */}
      <CalculatorPreviewSection onNavigate={onNavigate} />

      {/* 4. Chapter 4: Formulas Story (Physical 3D stacked depth formula deck) */}
      <FormulasStorySection onNavigate={onNavigate} />

      {/* 5. Chapter 5: Exercises Story (Pinned editorial campaign visual transitions) */}
      <ExercisesStorySection onNavigate={onNavigate} />

      {/* 6. Chapter 6: The Science of 1RM (Sticky Split-Scroll Layout with live recruitment meter) */}
      <ScienceSplitSection />

      {/* 7. Chapter 7: How It Works (Continuous 01 -> 02 -> 03 systematic protocol morph) */}
      <HowItWorksSection />

      {/* 8. Frequently Asked Questions (Strength Intelligence Accordions) */}
      <FaqSection />

      {/* 9. Final Dramatic Cinematic Call-To-Action */}
      <FinalCtaSection onNavigate={onNavigate} />
    </div>
  );
};
