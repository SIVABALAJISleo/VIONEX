'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, MessageSquare, ShieldCheck, Cpu, Send } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does VIONEX Adaptive Bitrate (ABR) Streaming work?',
    a: 'VIONEX transcodes ingested video into multi-rendition HLS (240p up to 4K) using aligned 2-second keyframes. As your network bandwidth fluctuates, the player seamlessly switches resolution levels without buffering pauses or audio desync.',
    category: 'Streaming'
  },
  {
    q: 'What is WebRTC P2P-Assisted Bandwidth Optimization?',
    a: 'When multiple viewers watch the same video segment simultaneously, VIONEX establishes lightweight WebRTC DataChannels between peers. Peers exchange cached video chunks, reducing CDN egress load by up to 80% with an automatic circuit breaker fallback to origin servers.',
    category: 'Streaming'
  },
  {
    q: 'How can creators monetize on VIONEX?',
    a: 'VIONEX features an immutable double-entry ledger supporting multiple revenue streams: paid channel memberships, Super Chats during live streams, pay-per-view video rentals, and privacy-respecting VAST/VMAP video advertisements.',
    category: 'Monetization'
  },
  {
    q: 'Can I self-host VIONEX for my own organization or community?',
    a: 'Yes! VIONEX is 100% open-source and containerized. You can run it on a single $5/mo VPS using Docker Compose, or scale horizontally across Kubernetes clusters with S3-compatible object storage.',
    category: 'Deployment'
  },
  {
    q: 'What video formats and codecs are supported for uploads?',
    a: 'VIONEX accepts MP4, WebM, MKV, MOV, and AVI containers encoded in H.264, H.265/HEVC, VP9, or AV1 up to 10GB per video.',
    category: 'Uploads'
  }
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [feedbackCategory, setFeedbackCategory] = useState('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setSubmitted(true);
    setFeedbackMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 py-6 border-b border-[#232733]">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/10">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Help & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Find answers about streaming, creator tools, playback optimization, and report issues.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="p-4 rounded-2xl bg-[#14161d] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>All VIONEX Services Operational</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              API Cluster, FFmpeg Transcoding Nodes, WebRTC Trackers, and HLS CDN are healthy.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          99.98% Uptime
        </span>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#14161d] border border-[#232733] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-[#232733]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Send Feedback / Contact Support Form */}
      <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5 text-pink-400" />
          <h2 className="text-lg font-bold">Send Feedback or Report an Issue</h2>
        </div>
        <p className="text-xs text-slate-400">
          Our engineering team reviews community bug reports and feature suggestions daily.
        </p>

        <form onSubmit={handleSubmitFeedback} className="space-y-4 max-w-xl">
          <div className="flex gap-2">
            {[
              { id: 'bug', label: 'Bug Report' },
              { id: 'feature', label: 'Feature Request' },
              { id: 'playback', label: 'Playback Issue' }
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFeedbackCategory(type.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  feedbackCategory === type.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-[#181a24] text-slate-400 border-[#232733] hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            required
            placeholder="Describe what happened, steps to reproduce, or your suggestion..."
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            className="w-full p-4 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 rounded-2xl text-xs text-white focus:outline-none transition-colors"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
            {submitted && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4" /> Thank you! Your report has been submitted.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
