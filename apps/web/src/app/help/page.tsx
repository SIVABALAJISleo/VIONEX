'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, Check } from 'lucide-react';

const FAQS = [
  {
    q: 'How does VIONEX stream videos with Adaptive Bitrate (ABR)?',
    a: 'VIONEX transcodes source media into HLS multi-bitrate representations (1080p, 720p, 480p, 360p) with keyframes strictly aligned every 2 seconds. The HLS.js player monitors network throughput and switches renditions seamlessly.'
  },
  {
    q: 'What is the WebRTC P2P mesh delivery offload?',
    a: 'When multiple peers watch the same high-bitrate stream simultaneously, WebRTC Datachannels exchange media segments peer-to-peer, saving up to 76.2% origin egress bandwidth while keeping latency low.'
  },
  {
    q: 'How does the Two-Tower Deep Learning recommendation ranker work?',
    a: 'VIONEX computes 64-dimensional dense vectors for the Query Tower (user history & session preferences) and the Candidate Tower (video metadata & channel authority), calculating cosine dot-product scores in real time.'
  },
  {
    q: 'How does Live Content ID audio and video fingerprinting work?',
    a: 'Audio streams are decomposed into 32-bit sub-band FFT spectral differences (Chromaprint/AcoustID), and video frames are fingerprinted using 64-bit perceptual dHash. The engine cross-correlates sliding windows against reference databases.'
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSent(true);
    setFeedback('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[85vh] space-y-8">
      <div className="pb-3 border-b border-[#E5E5E5]">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#0F0F0F]" />
          Help & Feedback
        </h1>
        <p className="text-xs text-[#606060] mt-0.5">Explore frequently asked questions and send feedback to the engineering team.</p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#0F0F0F]">Frequently Asked Questions</h2>
        <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-2xl overflow-hidden bg-white shadow-sm">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="p-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-xs text-[#0F0F0F]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#606060]" /> : <ChevronDown className="w-4 h-4 text-[#606060]" />}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-[#606060] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Send Feedback Form */}
      <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#065FD4]" />
          Send feedback to VIONEX
        </h2>
        <p className="text-xs text-[#606060]">Have a suggestion, bug report, or feature request? We read every submission.</p>

        <form onSubmit={handleSubmitFeedback} className="space-y-3">
          <textarea
            rows={4}
            required
            placeholder="Describe your issue or share your ideas..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#CCCCCC] bg-white outline-none text-xs text-[#0F0F0F]"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#909090]">Screenshots and system metrics are automatically attached.</span>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{sent ? 'Sent! Thank you' : 'Send Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
