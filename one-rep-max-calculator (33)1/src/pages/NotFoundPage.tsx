import React from 'react';
import { Home, Calculator, Compass, BookOpen, HelpCircle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-bold tracking-widest uppercase">
          <span>Error 404 • Page Not Found</span>
        </div>

        <div className="space-y-4">
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl text-white uppercase tracking-tight">
            Lift Off Course
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-md mx-auto">
            The route or barbell coordinate you are looking for does not exist or has been relocated.
          </p>
        </div>

        {/* Primary Return CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all shadow-[0_0_25px_rgba(34,197,94,0.4)] inline-flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95 transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-[#22c55e]" />
            <span>Open 1RM Calculator</span>
          </button>
        </div>

        {/* Helpful links */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#64748b] mb-4">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/exercises/')}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Big 4 Exercises</span>
            </button>
            <button
              onClick={() => onNavigate('/guides/')}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Training Guides</span>
            </button>
            <button
              onClick={() => onNavigate('/faq/')}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>FAQ Knowledge Base</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
