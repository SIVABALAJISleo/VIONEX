'use client';

import React, { useState, useEffect, useRef } from 'react';
import Player from '@/components/Player';
import { Radio, Users, Send, DollarSign, Heart, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { INITIAL_LIVE_STREAMS, LiveStreamItem } from '@/lib/data';

export default function LiveStreamingPage() {
  const [currentStream, setCurrentStream] = useState<LiveStreamItem>(INITIAL_LIVE_STREAMS[0]);
  const [messages, setMessages] = useState(INITIAL_LIVE_STREAMS[0].chatMessages);
  const [inputMsg, setInputMsg] = useState('');
  const [likes, setLikes] = useState(3840);
  const [hasLiked, setHasLiked] = useState(false);
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [superAmount, setSuperAmount] = useState('10');
  const [superText, setSuperText] = useState('Keep up the awesome streaming! 🚀');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate periodic incoming chat messages
  useEffect(() => {
    const randomUsers = [
      { name: 'DevSamurai', text: 'This stream bitrate is rock solid! 👏' },
      { name: 'BitBuster', text: 'Can you show the HLS manifest header inspect?' },
      { name: 'CodeQueen', text: 'VIONEX live streaming latency is insane 🔥' },
      { name: 'PixelForge', text: 'Greetings from Berlin!' }
    ];

    const timer = setInterval(() => {
      const pick = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const newMsg = {
        id: 'msg-' + Date.now(),
        author: pick.name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
        message: pick.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev.slice(-40), newMsg]);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const myMsg = {
      id: 'my-' + Date.now(),
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      message: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, myMsg]);
    setInputMsg('');
  };

  const handleSendSuperChat = () => {
    const superMsg = {
      id: 'sc-' + Date.now(),
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      message: superText.trim() || 'Supported the stream!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSuperChat: true,
      amount: `$${superAmount}.00`
    };

    setMessages((prev) => [...prev, superMsg]);
    setShowSuperChatModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner / Stream Selector */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 text-xs font-bold animate-pulse">
            <Radio className="w-4 h-4" />
            <span>LIVE NOW</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Live Broadcasting Hub</h1>
        </div>

        <div className="flex items-center gap-2">
          {INITIAL_LIVE_STREAMS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStream(s);
                setMessages(s.chatMessages);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentStream.id === s.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-[#14161d] text-slate-400 hover:text-white border border-[#232733]'
              }`}
            >
              {s.channel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Player on left, Live Chat on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Player src={currentStream.streamUrl} poster={currentStream.thumbnailUrl} />
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-extrabold text-[11px] tracking-wide shadow-md">
                LIVE
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-xs flex items-center gap-1.5 border border-white/10">
                <Users className="w-3.5 h-3.5 text-red-400" />
                {currentStream.viewers}
              </span>
            </div>
          </div>

          {/* Stream Info & Channel Bar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white leading-tight">
              {currentStream.title}
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#14161d] border border-[#232733]">
              <div className="flex items-center gap-3">
                <img
                  src={currentStream.channel.avatarUrl}
                  alt={currentStream.channel.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500/50"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-base">
                    <span>{currentStream.channel.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xs text-slate-400">
                    Category: <span className="text-indigo-400 font-semibold">{currentStream.category}</span> • {currentStream.startedAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLikes(hasLiked ? likes - 1 : likes + 1);
                    setHasLiked(!hasLiked);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    hasLiked
                      ? 'bg-red-600/20 text-red-400 border-red-500/40'
                      : 'bg-[#1f232e] text-slate-300 hover:text-white border-[#2e3444]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likes.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => setShowSuperChatModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-black font-extrabold text-xs shadow-lg shadow-pink-500/20 transition-all"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Super Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Column */}
        <div className="bg-[#14161d] border border-[#232733] rounded-3xl flex flex-col h-[640px] overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#232733] flex items-center justify-between bg-[#181a24]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Live Stream Chat</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Real-time
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl text-xs transition-all ${
                  m.isSuperChat
                    ? 'bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-indigo-600/20 border border-pink-500/40 shadow-md'
                    : 'bg-[#181a24]/60 hover:bg-[#181a24]'
                }`}
              >
                {m.isSuperChat && (
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-pink-400 mb-1.5 border-b border-pink-500/20 pb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Super Chat
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500 text-black font-mono font-black">
                      {m.amount}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <img src={m.avatar} alt={m.author} className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className={`font-bold ${m.isSuperChat ? 'text-pink-300' : 'text-indigo-400'}`}>
                        {m.author}
                      </span>
                      <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                    </div>
                    <p className="text-slate-200 mt-0.5 break-words">{m.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#181a24] border-t border-[#232733] flex gap-2">
            <input
              type="text"
              placeholder="Send a message to live chat..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Super Chat Modal */}
      {showSuperChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Send Super Chat
              </h3>
              <button
                onClick={() => setShowSuperChatModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Select Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {['5', '10', '25', '50'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSuperAmount(amt)}
                    className={`py-2 rounded-xl font-bold text-xs transition-colors ${
                      superAmount === amt
                        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-black shadow-md'
                        : 'bg-[#181a24] text-slate-300 border border-[#232733]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-slate-300">Your Message</label>
                <input
                  type="text"
                  value={superText}
                  onChange={(e) => setSuperText(e.target.value)}
                  placeholder="Say something nice..."
                  className="w-full px-3 py-2 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#232733]">
              <button
                onClick={() => setShowSuperChatModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSuperChat}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 font-bold text-xs text-black shadow-md"
              >
                Send ${superAmount}.00
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
