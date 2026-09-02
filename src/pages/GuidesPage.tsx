import React from 'react';
import { ChevronRight, BookOpen, ArrowRight, Award, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface GuidesPageProps {
  onNavigate: (path: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  const guides = [
    {
      id: 'math-of-1rm',
      title: 'The Mathematics of One Rep Max: Linear vs. Exponential Models',
      category: 'Biomechanics & Math',
      readTime: '6 min read',
      excerpt:
        'A deep comparison between the Boyd Epley linear slope equation and the exponential decay formulations by Jerry Mayhew and Denise Wathan.',
      content: [
        'Linear models like Epley assume each repetition equates to an approximate 3.33% decrement from 100% capacity (1RM = Weight × (1 + Reps/30)). While remarkably robust for sets of 2 to 8 reps, linear equations tend to slightly overestimate capacity past 10 repetitions.',
        'Exponential equations (such as Mayhew and Wathan) introduce logarithmic decay curves (e^(-k*r)) which mirror actual physiological neuromuscular fatigue and cross-bridge detachment rates under prolonged lactic load.',
      ],
    },
    {
      id: 'percentage-based-training',
      title: 'Mastering Percentage-Based Training (PBT) in Modern Periodization',
      category: 'Strength Programming',
      readTime: '8 min read',
      excerpt:
        'How elite strength athletes utilize calculated 1RM percentages across accumulation, intensification, and peaking blocks without testing true maxes.',
      content: [
        'Percentage-Based Training eliminates subjective guesswork. Instead of asking a lifter to "go heavy," a program prescribes 4 sets of 4 at 82.5% of estimated 1RM, guaranteeing the intended mechanical tension stimulus.',
        'By utilizing accurate submaximal tests, athletes can dynamically adjust training loads block-by-block while minimizing central nervous system burnout.',
      ],
    },
    {
      id: 'rpe-vs-percentages',
      title: 'RPE (Rating of Perceived Exertion) vs. Percentage-Based Loading',
      category: 'Autoregulation',
      readTime: '5 min read',
      excerpt:
        'Integrating Mike Tuchscherer’s RPE / RIR (Reps in Reserve) scale with rigid 1RM percentages for optimal daily autoregulation.',
      content: [
        'While static 1RM percentages provide macroscopic structure, human performance fluctuates 3–5% daily due to sleep, nutrition, and systemic recovery debt.',
        'Combining a base percentage target (e.g. 80% 1RM) with an RPE ceiling (e.g. RPE 8 / 2 reps in reserve) ensures safety on high-fatigue days while capitalizing on peak readiness days.',
      ],
    },
  ];

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">Strength Engineering Guides</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            Guides & Research
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] max-w-3xl leading-relaxed">
            Evidence-based literature on load calibration, neuromuscular recruitment, powerlifting mechanics, and barbell mathematics.
          </p>
        </div>

        {/* Guides List */}
        <div className="space-y-8 max-w-4xl">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="bg-[#111317] border border-white/10 hover:border-[#22c55e]/30 rounded-3xl p-8 sm:p-10 space-y-6 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22c55e] px-2.5 py-1 rounded bg-[#22c55e]/10 border border-[#22c55e]/20">
                  {guide.category}
                </span>
                <span className="text-xs font-mono text-[#64748b]">{guide.readTime}</span>
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
                {guide.title}
              </h2>

              <p className="text-base text-[#cbd5e1] leading-relaxed">
                {guide.excerpt}
              </p>

              <div className="space-y-3 pt-2 text-sm text-[#94a3b8] leading-relaxed border-t border-white/5 pt-4">
                {guide.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('/one-rep-max-calculator/')}
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#22c55e] hover:text-[#4ade80] transition-colors"
                >
                  <span>Apply in Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
