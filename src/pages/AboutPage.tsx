import React from 'react';
import { ChevronRight, Shield, Award, Target, Activity, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">About Our Platform</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            Engineered Strength Intelligence
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            One Rep Max Calculator was built with a single mission: to deliver uncompromising mathematical precision, athletic art direction, and scientific utility to lifters worldwide.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111317] border border-white/10 rounded-2xl p-6 space-y-3">
            <Shield className="w-6 h-6 text-[#22c55e]" />
            <h3 className="font-heading font-bold text-xl text-white">Peer-Reviewed Equations</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Every formula implemented is strictly grounded in published sports science literature from Epley (1985), Brzycki (1993), Mayhew et al. (1992), and Wathan (1994).
            </p>
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-2xl p-6 space-y-3">
            <Target className="w-6 h-6 text-[#22c55e]" />
            <h3 className="font-heading font-bold text-xl text-white">Client-Side Speed</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Zero network latency, zero tracking scripts, zero bloat. Real-time calculations execute instantly on your device with offline local storage capability.
            </p>
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-2xl p-6 space-y-3">
            <Activity className="w-6 h-6 text-[#22c55e]" />
            <h3 className="font-heading font-bold text-xl text-white">Practical Utility</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Beyond simple 1RM numbers, we provide the full training pipeline: IWF plate math, 5-phase progressive warm-ups, and periodized percentage matrices.
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="bg-[#111317] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#cbd5e1] leading-relaxed">
          <h2 className="font-heading font-bold text-2xl text-white">Our Philosophy</h2>
          <p>
            Traditional fitness calculators are often plagued by cluttered ads, outdated formulas, and generic templates. We rejected that standard. We believe strength athletes deserve tools that match the discipline, focus, and precision of their training.
          </p>
          <p>
            Whether you are peaking for a powerlifting meet, programming an off-season hypertrophy block, or calibrating your weekly working weights, One Rep Max Calculator gives you reliable data you can trust on the platform.
          </p>
        </div>
      </div>
    </div>
  );
};
