import React from 'react';
import { ChevronRight, AlertTriangle, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    disclaimer: 'Strength Training & Safety Disclaimer',
  };

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">{titles[type]}</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
            {titles[type]}
          </h1>
          <p className="text-sm font-mono text-[#64748b]">
            Last Revised: August 2026 • Version 2.4
          </p>
        </div>

        {type === 'disclaimer' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-8 space-y-6 text-sm text-[#f7f7f8] leading-relaxed">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="font-heading font-bold text-xl text-white">Non-Medical & Safety Notice</h2>
            </div>
            <p>
              The One Rep Max Calculator website provides theoretical, statistical estimations of maximal strength derived from mathematical formulas. These calculations are strictly for educational and athletic programming guidance and do NOT constitute individualized medical, biomechanical, or health advice.
            </p>
            <p>
              Heavy barbell lifting, maximum effort testing, and high-intensity resistance training carry inherent risks of musculoskeletal strain, cardiovascular stress, and physical injury. Always warm up thoroughly, ensure appropriate safety pins/spotters are in place, and consult a qualified medical professional or certified strength coach before undertaking heavy training.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="bg-[#111317] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#cbd5e1] leading-relaxed">
            <h2 className="font-heading font-bold text-2xl text-white">1. Client-Side Data Processing</h2>
            <p>
              One Rep Max Calculator operates as a private, client-side application. We do not store your lifted weights, repetitions, or personal PR notes on remote servers. All personal records (PRs) saved via the bookmark tool are stored locally within your device’s browser localStorage.
            </p>
            <h2 className="font-heading font-bold text-2xl text-white">2. No Third-Party Tracking Cookies</h2>
            <p>
              We do not utilize invasive advertising pixels, third-party tracking scripts, or data brokers. Your strength data remains solely on your machine.
            </p>
            <h2 className="font-heading font-bold text-2xl text-white">3. Local Storage Management</h2>
            <p>
              You can clear your stored PRs at any time by deleting individual items in the Saved Strength Log or by clearing your browser site data.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="bg-[#111317] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#cbd5e1] leading-relaxed">
            <h2 className="font-heading font-bold text-2xl text-white">1. License & Usage</h2>
            <p>
              One Rep Max Calculator is provided free of charge for personal, coaching, and athletic training use. You agree to use the calculations responsibly and in accordance with standard gym safety etiquette.
            </p>
            <h2 className="font-heading font-bold text-2xl text-white">2. Accuracy & Calculations</h2>
            <p>
              While all peer-reviewed formulas are mathematically accurate to their published scientific specifications, biological performance fluctuates. We make no guarantee that an estimated 1RM will be lifted successfully in practice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
