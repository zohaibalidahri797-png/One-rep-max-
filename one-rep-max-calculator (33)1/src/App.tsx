/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { GuidesPage } from './pages/GuidesPage';
import { FaqPage } from './pages/FaqPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  // Normalize current path from window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path.endsWith('/') ? path : `${path}/`;
    }
    return '/';
  });

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path.endsWith('/') ? path : `${path}/`);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    const normalized = path.endsWith('/') ? path : `${path}/`;
    setCurrentPath(normalized);
    if (typeof window !== 'undefined' && window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SEO document title and meta tag updates per route
  useEffect(() => {
    let is404 = false;
    let title = 'One Rep Max Calculator — Precision 1RM Strength Analytics';
    let description = 'Calculate your true One Rep Max with 7 scientific formulas, percentage matrices, warm-ups, and plate loader.';

    if (currentPath === '/') {
      title = 'One Rep Max Calculator — Precision 1RM Strength Analytics';
      description = 'Calculate your true One Rep Max with 7 scientific formulas, percentage matrices, warm-ups, and plate loader.';
    } else if (currentPath === '/one-rep-max-calculator/') {
      title = 'One Rep Max Calculator - Calculate Your 1RM';
      description = 'Free scientific One Rep Max calculator supporting Epley, Brzycki, Mayhew, Lombardi, Wathan, O\'Conner, and Lander formulas with Olympic plate loading.';
    } else if (currentPath === '/exercises/') {
      title = 'Major Lifts & Biomechanical Standards — One Rep Max Calculator';
      description = 'Explore 1RM standards, technical form cues, and formula recommendations for Bench Press, Squat, Deadlift, and Overhead Press.';
    } else if (currentPath === '/guides/') {
      title = 'Strength Training & Periodization Guides — One Rep Max Calculator';
      description = 'Deep-dive evidence-based articles on percentage-based training (PBT), the mathematics of 1RM, and RPE autoregulation.';
    } else if (currentPath === '/faq/') {
      title = '1RM Knowledge Base & FAQ — One Rep Max Calculator';
      description = 'Comprehensive answers to common questions about 1RM estimation accuracy, submaximal testing, and rep windows.';
    } else if (currentPath === '/about/') {
      title = 'About Our Platform — One Rep Max Calculator';
      description = 'Discover the mission and sports science principles behind One Rep Max Calculator.';
    } else if (currentPath === '/contact/') {
      title = 'Contact & Lifter Feedback — One Rep Max Calculator';
      description = 'Get in touch with the engineering and biomechanics team behind One Rep Max Calculator.';
    } else if (currentPath === '/privacy-policy/') {
      title = 'Privacy Policy — One Rep Max Calculator';
      description = 'Read the privacy policy and data governance practices for One Rep Max Calculator.';
    } else if (currentPath === '/terms/') {
      title = 'Terms of Service — One Rep Max Calculator';
      description = 'Review the terms of service and usage conditions for One Rep Max Calculator.';
    } else if (currentPath === '/disclaimer/') {
      title = 'Strength Training & Safety Disclaimer — One Rep Max Calculator';
      description = 'Important medical and strength training safety disclaimer for calculating 1RM.';
    } else if (currentPath === '/calculator/' || currentPath === '/calc/') {
      title = 'One Rep Max Calculator - Calculate Your 1RM';
      description = 'Free scientific One Rep Max calculator supporting Epley, Brzycki, Mayhew, Lombardi, Wathan, O\'Conner, and Lander formulas with Olympic plate loading.';
    } else {
      is404 = true;
      title = 'Page Not Found (404) — One Rep Max Calculator';
      description = 'The requested strength analytics page or calculator tool was not found.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
    
    // Dynamic Robots Meta Tag for Indexing Control
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', is404 ? 'noindex, nofollow' : 'index, follow');

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const baseDomain = typeof window !== 'undefined' ? window.location.origin : 'https://onerepmaxcalculator.app';
      if (is404) {
        canonical.setAttribute('href', `${baseDomain}/`);
      } else {
        const cleanPath = currentPath === '/' ? '' : currentPath;
        canonical.setAttribute('href', `${baseDomain}${cleanPath}`);
      }
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      const baseDomain = typeof window !== 'undefined' ? window.location.origin : 'https://onerepmaxcalculator.app';
      const cleanPath = currentPath === '/' ? '' : currentPath;
      ogUrl.setAttribute('content', `${baseDomain}${cleanPath}`);
    }
  }, [currentPath]);

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/one-rep-max-calculator/':
        return <CalculatorPage onNavigate={handleNavigate} />;
      case '/exercises/':
        return <ExercisesPage onNavigate={handleNavigate} />;
      case '/guides/':
        return <GuidesPage onNavigate={handleNavigate} />;
      case '/faq/':
        return <FaqPage onNavigate={handleNavigate} />;
      case '/about/':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/contact/':
        return <ContactPage onNavigate={handleNavigate} />;
      case '/privacy-policy/':
        return <LegalPage type="privacy" onNavigate={handleNavigate} />;
      case '/terms/':
        return <LegalPage type="terms" onNavigate={handleNavigate} />;
      case '/disclaimer/':
        return <LegalPage type="disclaimer" onNavigate={handleNavigate} />;
      default:
        // Handle explicit aliases or render NotFoundPage
        if (currentPath === '/calculator/' || currentPath === '/calc/') {
          return <CalculatorPage onNavigate={handleNavigate} />;
        }
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-[#f7f7f8] flex flex-col justify-between selection:bg-[#22c55e] selection:text-[#0a0b0d]">
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
