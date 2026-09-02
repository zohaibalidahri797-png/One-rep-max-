import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Activity, Dumbbell, BookOpen, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: '1RM Calculator', path: '/one-rep-max-calculator/' },
    { name: 'Exercises', path: '/exercises/' },
    { name: 'Guides', path: '/guides/' },
    { name: 'FAQ', path: '/faq/' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0b0d]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('/')}
            className="group flex items-center space-x-2 text-left focus:outline-none"
            aria-label="One Rep Max Calculator Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#181b20] border border-white/15 flex items-center justify-center group-hover:border-[#22c55e]/50 transition-colors">
              <span className="font-heading font-extrabold text-xs tracking-tighter text-[#22c55e]">1RM</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm tracking-wider uppercase text-[#f7f7f8] group-hover:text-white transition-colors">
                ONE REP MAX
              </span>
              <span className="text-[10px] tracking-widest text-[#94a3b8] uppercase font-mono-num -mt-1">
                PRECISION STRENGTH
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Desktop Navigation">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-xs uppercase tracking-widest font-semibold transition-all relative py-1.5 ${
                    isActive
                      ? 'text-[#22c55e]'
                      : 'text-[#94a3b8] hover:text-[#f7f7f8]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22c55e] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              id="nav-calculate-cta"
              onClick={() => handleLinkClick('/one-rep-max-calculator/')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]"
            >
              <span>Calculate 1RM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#181b20] border border-white/10 text-[#f7f7f8] hover:text-[#22c55e] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden bg-[#0a0b0d]/98 border-b border-white/10 px-6 pt-4 pb-8 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2"
        >
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                id={`mobile-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleLinkClick(link.path)}
                className={`text-left text-sm uppercase tracking-wider font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  currentPath === link.path
                    ? 'bg-[#181b20] text-[#22c55e] border border-[#22c55e]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              id="mobile-nav-cta"
              onClick={() => handleLinkClick('/one-rep-max-calculator/')}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] flex items-center justify-center space-x-2"
            >
              <span>Calculate Your 1RM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
