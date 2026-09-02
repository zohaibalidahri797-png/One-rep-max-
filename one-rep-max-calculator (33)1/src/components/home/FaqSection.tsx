import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_LIST } from '../../utils/constants';

export const FaqSection: React.FC = () => {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  return (
    <section
      id="faq-section"
      className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#0c0e12]"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-mono font-bold tracking-[0.2em] uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE & FAQ</span>
          </div>

          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
            STRENGTH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
              INTELLIGENCE
            </span>
          </h2>

          <p className="text-base text-[#94a3b8] max-w-xl mx-auto">
            Everything you need to know about submaximal testing accuracy, formula mechanics, and percentage programming.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#111317] border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    {faq.question}
                  </h3>
                  <div
                    className={`p-1.5 rounded-lg bg-[#181b20] text-[#22c55e] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
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
          })}
        </div>
      </div>
    </section>
  );
};
