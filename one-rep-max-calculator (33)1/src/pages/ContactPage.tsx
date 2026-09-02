import React, { useState } from 'react';
import { ChevronRight, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">Contact & Feedback</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            Have a question about calculation equations, feature requests, or biomechanical feedback? Send us a message below.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#111317] border border-[#22c55e]/40 rounded-3xl p-10 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white">Message Received</h2>
            <p className="text-sm text-[#94a3b8] max-w-md mx-auto">
              Thank you for reaching out, {name}. Our strength engineering team has logged your message and will review it promptly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase bg-[#181b20] hover:bg-white/10 text-white border border-white/10"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#111317] border border-white/10 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl"
          >
            <div className="space-y-2">
              <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                Lifter Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-[#181b20] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#22c55e] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@training.com"
                className="w-full bg-[#181b20] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#22c55e] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                Message & Feedback
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your suggestions, formula observations, or technical inquiries..."
                className="w-full bg-[#181b20] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#22c55e] focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
