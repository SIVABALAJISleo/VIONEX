'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Radio, Users, Heart, Share2, Send, DollarSign, CheckCircle2, MessageSquare, ExternalLink, BarChart3, X } from 'lucide-react';
import Player from '@/components/Player';
import { INITIAL_LIVE_STREAMS } from '@/lib/data';
import { calculateStreamEndingSummary, LiveStreamSummary } from '@/lib/live';

export default function LivePage() {
  const [activeStream, setActiveStream] = useState(INITIAL_LIVE_STREAMS[0]);
  const [chatMessages, setChatMessages] = useState(INITIAL_LIVE_STREAMS[0].chatMessages);
  const [newMsg, setNewMsg] = useState('');
  const [superChatAmount, setSuperChatAmount] = useState<string | null>(null);
  const [streamSummary, setStreamSummary] = useState<LiveStreamSummary | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      author: 'You (VIONEX User)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      message: newMsg.trim(),
      timestamp: 'Now',
      isSuperChat: !!superChatAmount,
      amount: superChatAmount || undefined
    };
    setChatMessages([...chatMessages, msg]);
    setNewMsg('');
    setSuperChatAmount(null);
  };

  const handlePopoutChat = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `/embed/live/${activeStream.id}`,
        `VionexChat_${activeStream.id}`,
        'width=420,height=650,menubar=no,toolbar=no,location=no,status=no'
      );
    }
  };

  const handleShowStreamSummary = () => {
    const summary = calculateStreamEndingSummary({
      streamId: activeStream.id,
      title: activeStream.title,
      peakConcurrentViewers: 14850,
      totalViews: 89400,
      durationSeconds: 7500,
    });
    setStreamSummary(summary);
  };

  return (
    <div className="max-w-[1720px] mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[85vh]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Live Player & Stream Info */}
        <div className="flex-1 space-y-4">
          <div className="w-full rounded-2xl overflow-hidden bg-black shadow-sm aspect-video">
            <Player
              src={activeStream.streamUrl}
              poster={activeStream.thumbnailUrl}
              title={activeStream.title}
              channelName={activeStream.channel.name}
              autoPlay={true}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#FF0000] text-white font-bold text-[10px] tracking-wider uppercase animate-pulse">
                  LIVE
                </span>
                <span className="text-xs text-[#606060] flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#FF0000]" />
                  {activeStream.viewers} watching now
                </span>
              </div>
              <button
                onClick={handleShowStreamSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs font-semibold text-[#0F0F0F] transition-colors"
                title="View Stream Ending Statistics Summary"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#065FD4]" />
                <span>Stream Summary</span>
              </button>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">
              {activeStream.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <img
                  src={activeStream.channel.avatarUrl}
                  alt={activeStream.channel.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0F0F0F] flex items-center gap-1">
                    {activeStream.channel.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#606060]" />
                  </h3>
                  <p className="text-xs text-[#606060]">425K subscribers</p>
                </div>
                <button className="ml-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-white text-xs font-semibold">
                  Subscribe
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Stream liked!')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs font-semibold text-[#0F0F0F]"
                >
                  <Heart className="w-4 h-4 text-[#FF0000]" />
                  <span>3.2K</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Live stream link copied!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs font-semibold text-[#0F0F0F]"
                >
                  <Share2 className="w-4 h-4 text-[#0F0F0F]" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Chat Box (YouTube Style) */}
        <div className="w-full lg:w-96 bg-white border border-[#E5E5E5] rounded-2xl flex flex-col h-[600px] shadow-sm">
          <div className="p-3 border-b border-[#E5E5E5] flex items-center justify-between">
            <span className="font-bold text-xs text-[#0F0F0F] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#065FD4]" />
              Top chat
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#606060] font-mono">Live</span>
              <button
                onClick={handlePopoutChat}
                className="p-1 rounded hover:bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F] transition-colors"
                title="Pop out live chat window (LIVE-029)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-[#E5E5E5]">
            {chatMessages.map((m) => (
              <div key={m.id} className="pt-2 text-xs text-[#0F0F0F] space-y-1">
                {m.isSuperChat && (
                  <div className="bg-[#065FD4] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex justify-between">
                    <span>Super Chat</span>
                    <span>{m.amount}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <img src={m.avatar} alt={m.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <span className="font-bold text-[#606060] text-[11px]">{m.author}</span>
                  <span className="text-[#909090] text-[10px]">{m.timestamp}</span>
                </div>
                <p className="leading-snug pl-7">{m.message}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E5E5] space-y-2 bg-[#F9F9F9] rounded-b-2xl">
            {superChatAmount && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#065FD4] bg-blue-50 px-2 py-1 rounded">
                <span>Sending {superChatAmount} Super Chat</span>
                <button type="button" onClick={() => setSuperChatAmount(null)} className="text-red-500 text-xs">Cancel</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Chat publicly..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 bg-white border border-[#CCCCCC] focus:border-[#0F0F0F] rounded-full px-3 py-1.5 text-xs outline-none text-[#0F0F0F]"
              />
              <button
                type="button"
                onClick={() => setSuperChatAmount('$5.00')}
                className="p-1.5 rounded-full hover:bg-[#E5E5E5] text-[#0F0F0F]"
                title="Send Super Chat"
              >
                <DollarSign className="w-4 h-4 text-[#107C41]" />
              </button>
              <button
                type="submit"
                className="p-1.5 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stream Ending Statistics Modal (LIVE-030) */}
      {streamSummary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#CCCCCC] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#065FD4]" />
                <h3 className="font-bold text-base text-[#0F0F0F]">Stream Ending Statistics Summary</h3>
              </div>
              <button
                onClick={() => setStreamSummary(null)}
                className="p-1 rounded-full hover:bg-[#F2F2F2] text-[#606060]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                <div className="text-[#606060]">Peak Concurrent Viewers</div>
                <div className="text-lg font-bold text-[#0F0F0F] mt-1">
                  {streamSummary.metrics.peakConcurrentViewers.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                <div className="text-[#606060]">Total Watch Hours</div>
                <div className="text-lg font-bold text-[#0F0F0F] mt-1">
                  {streamSummary.metrics.totalWatchTimeHours.toLocaleString()} hrs
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                <div className="text-[#606060]">New Subscribers</div>
                <div className="text-lg font-bold text-[#107C41] mt-1">
                  +{streamSummary.metrics.newSubscribersGained.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                <div className="text-[#606060]">Total Chat Messages</div>
                <div className="text-lg font-bold text-[#0F0F0F] mt-1">
                  {streamSummary.metrics.totalChatMessages.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#065FD4] flex items-center justify-between">
              <span>Chat Replay Archive:</span>
              <span className="font-semibold uppercase">{streamSummary.chatArchiveStatus}</span>
            </div>

            <button
              onClick={() => setStreamSummary(null)}
              className="w-full py-2.5 bg-[#0F0F0F] hover:bg-[#272727] text-white text-xs font-semibold rounded-full transition-colors"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
