import React, { useState } from 'react';
import { FAQ_LIST } from '../utils/constants';
import { ChevronRight, ChevronDown, Search, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQ_LIST.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">Frequently Asked Questions</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            Questions & Answers
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            Everything you need to know regarding 1RM estimation accuracy, formula selection, repetition fatigue, and plate math.
          </p>

          {/* Search bar */}
          <div className="relative pt-4 max-w-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions (e.g. formula, 5 reps, plate math)..."
              className="w-full bg-[#111317] border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-[#22c55e] focus:outline-none transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none pt-4 text-[#94a3b8]">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-[#111317] border border-white/10 rounded-2xl p-8 text-center text-[#94a3b8]">
              No questions matched your search criteria.
            </div>
          ) : (
            filtered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#111317] border border-white/10 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </h2>
                    <div className={`p-1.5 rounded-lg bg-[#181b20] text-[#22c55e] transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#94a3b8] leading-relaxed border-t border-white/5 pt-4">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* CTA */}
        <div className="bg-[#111317] border border-white/10 rounded-3xl p-8 text-center space-y-4">
          <h2 className="font-heading font-bold text-2xl text-white">Ready to test your numbers?</h2>
          <p className="text-sm text-[#94a3b8] max-w-md mx-auto">
            Input your recent working set into our multi-formula calculation engine.
          </p>
          <button
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] transition-all inline-flex items-center space-x-2"
          >
            <span>Open 1RM Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
