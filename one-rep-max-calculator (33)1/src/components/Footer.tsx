import React from 'react';
import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#07080a] border-t border-white/10 pt-20 pb-12 text-[#94a3b8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#181b20] border border-white/15 flex items-center justify-center">
                <span className="font-heading font-extrabold text-sm text-[#22c55e]">1RM</span>
              </div>
              <span className="font-heading font-bold text-lg text-white tracking-wide">
                ONE REP MAX CALCULATOR
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-[#94a3b8]">
              Precision algorithmic strength intelligence for lifters, strength athletes, and coaches. Estimate maximal strength, calibrate velocity zones, and optimize barbell plate distribution.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#64748b]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
              <span>Scientific biomechanics peer-reviewed formulas</span>
            </div>
          </div>

          {/* Nav Col 1: Calculators & Tools */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f7f7f8]">Platform</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/one-rep-max-calculator/"
                  onClick={(e) => handleLinkClick(e, '/one-rep-max-calculator/')}
                  className="hover:text-[#22c55e] transition-colors inline-flex items-center space-x-1"
                >
                  <span>1RM Calculator</span>
                </a>
              </li>
              <li>
                <a
                  href="/exercises/"
                  onClick={(e) => handleLinkClick(e, '/exercises/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Major Lifts & Cues
                </a>
              </li>
              <li>
                <a
                  href="/guides/"
                  onClick={(e) => handleLinkClick(e, '/guides/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Strength Guides
                </a>
              </li>
              <li>
                <a
                  href="/faq/"
                  onClick={(e) => handleLinkClick(e, '/faq/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Knowledge Base & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Supported Formulas */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f7f7f8]">Formulas</h2>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="hover:text-white transition-colors">Epley (1985)</li>
              <li className="hover:text-white transition-colors">Brzycki (1993)</li>
              <li className="hover:text-white transition-colors">Lombardi (1989)</li>
              <li className="hover:text-white transition-colors">Mayhew et al. (1992)</li>
              <li className="hover:text-white transition-colors">O'Conner et al. (1989)</li>
              <li className="hover:text-white transition-colors">Wathan (1994) & Lander</li>
            </ul>
          </div>

          {/* Nav Col 3: Company & Legal */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f7f7f8]">Legal & Trust</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/about/"
                  onClick={(e) => handleLinkClick(e, '/about/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  About Methodology
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => handleLinkClick(e, '/contact/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Support & Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy/"
                  onClick={(e) => handleLinkClick(e, '/privacy-policy/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms/"
                  onClick={(e) => handleLinkClick(e, '/terms/')}
                  className="hover:text-[#22c55e] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer/"
                  onClick={(e) => handleLinkClick(e, '/disclaimer/')}
                  className="hover:text-[#22c55e] transition-colors text-amber-500/80 hover:text-amber-400"
                >
                  Training Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>© {currentYear} One Rep Max Calculator. Built for athletic performance precision.</p>
          <div className="flex items-center space-x-6">
            <span>Client-side execution</span>
            <span>•</span>
            <span>Zero latency</span>
            <span>•</span>
            <span>100% Free & Open</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
