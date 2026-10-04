'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Lock,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Play,
  Trash2,
  Share2,
  Sparkles,
  QrCode,
  ShieldCheck,
  X,
  Plus
} from 'lucide-react';
import {
  ChatMessage,
  Conversation,
  getStoredConversations,
  getStoredMessages,
  sendChatMessage,
  addMessageReaction,
  deleteChatMessage,
  getLinkedDevices
} from '@/lib/communication';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-mkbhd');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = getStoredConversations();
    setConversations(convs);
    if (convs.length > 0 && !activeConvId) {
      setActiveConvId(convs[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeConvId) {
      setMessages(getStoredMessages(activeConvId));
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const sent = sendChatMessage(activeConvId, inputText.trim());
    setMessages(prev => [...prev, sent]);
    setInputText('');
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setShowCallModal(true);
    setCallDuration(0);
  };

  useEffect(() => {
    let timer: any;
    if (showCallModal) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showCallModal]);

  const formatCallTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-white overflow-hidden select-none">
      {/* LEFT PANE: Conversation List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-[#E5E5E5] flex flex-col bg-white">
        {/* Header */}
        <div className="p-3.5 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F0F0F] tracking-tight">Messages</h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-2.5 h-2.5" />
              <span>E2EE Active</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDeviceModal(true)}
              className="p-2 rounded-full hover:bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F] transition-colors"
              title="Linked Devices & Security"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#E5E5E5]">
          <div className="flex items-center bg-[#F2F2F2] rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#065FD4]">
            <Search className="w-4 h-4 text-[#606060] mr-2" />
            <input
              type="text"
              placeholder="Search chats or creators"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F0F0F] outline-none placeholder-[#606060]"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F2F2F2]">
          {conversations
            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  activeConvId === c.id ? 'bg-[#F2F2F2]' : 'hover:bg-[#F9F9F9]'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  {c.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-[#0F0F0F] truncate">{c.name}</span>
                    <span className="text-[11px] text-[#606060] font-mono">{c.lastMessage?.timestamp || '12:00'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#606060] truncate pr-2">
                      {c.lastMessage?.text || 'Encrypted conversation started'}
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#065FD4] text-white text-[11px] font-bold flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT PANE: Active Chat Room */}
      {activeConv ? (
        <div className="hidden sm:flex flex-1 flex-col bg-[#F9F9F9]">
          {/* Chat Header */}
          <div className="h-16 bg-white border-b border-[#E5E5E5] px-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.avatarUrl}
                alt={activeConv.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#0F0F0F]">{activeConv.name}</span>
                  {activeConv.isVerified && (
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  {activeConv.isOnline ? 'Online (Olm Double Ratchet E2EE)' : activeConv.lastSeenText || 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartCall('voice')}
                className="p-2.5 rounded-full hover:bg-[#F2F2F2] text-[#0F0F0F] transition-colors"
                title="Voice Call (LiveKit SFU)"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStartCall('video')}
                className="p-2.5 rounded-full hover:bg-[#F2F2F2] text-[#0F0F0F] transition-colors"
                title="Video Call (LiveKit SFU 1080p)"
              >
                <Video className="w-5 h-5 text-[#FF0000]" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FAFAFA] to-[#F2F2F2]">
            {/* E2EE Security Shield Notice */}
            <div className="flex justify-center my-3">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm max-w-md text-center">
                <Lock className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                <span>Messages and calls are end-to-end encrypted with Curve25519 & Double Ratchet. No one outside this chat can read or listen to them.</span>
              </div>
            </div>

            {messages.map((m) => {
              const isMe = m.senderId === 'current-user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                      isMe
                        ? 'bg-[#065FD4] text-white rounded-tr-none'
                        : 'bg-white text-[#0F0F0F] border border-[#E5E5E5] rounded-tl-none'
                    }`}
                  >
                    {/* Native VIONEX Video Preview Card */}
                    {m.vionexRef && (
                      <Link
                        href={m.vionexRef.embedRoute}
                        className="block mb-2 rounded-xl overflow-hidden bg-black/10 hover:opacity-95 transition-opacity border border-white/20"
                      >
                        <div className="relative aspect-video">
                          <img
                            src={m.vionexRef.thumbnailUrl}
                            alt={m.vionexRef.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className={`p-2.5 ${isMe ? 'bg-[#004BB5]' : 'bg-[#F2F2F2]'}`}>
                          <p className="font-semibold text-xs truncate leading-snug">{m.vionexRef.title}</p>
                          <span className="text-[10px] opacity-80">vionex.com{m.vionexRef.embedRoute}</span>
                        </div>
                      </Link>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                    <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-80 font-mono">
                      <span>{m.timestamp}</span>
                      {isMe && (
                        <span>
                          {m.state === 'READ' && <CheckCheck className="w-3.5 h-3.5 text-sky-200" />}
                          {m.state === 'DELIVERED' && <CheckCheck className="w-3.5 h-3.5" />}
                          {m.state === 'SENT' && <Check className="w-3.5 h-3.5" />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emoji Reactions */}
                  {m.reactions && Object.keys(m.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1 -translate-y-1">
                      {Object.entries(m.reactions).map(([emoji, users]) => (
                        <span
                          key={emoji}
                          onClick={() => addMessageReaction(activeConvId, m.id, emoji)}
                          className="bg-white border border-[#E5E5E5] rounded-full px-2 py-0.5 text-xs shadow-sm cursor-pointer hover:bg-neutral-50 flex items-center gap-1"
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-bold text-[#606060]">{users.length}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[#E5E5E5] flex items-center gap-2"
          >
            <div className="flex items-center gap-1 text-[#606060]">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#F2F2F2] hover:text-[#0F0F0F] transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#F2F2F2] hover:text-[#0F0F0F] transition-colors"
                title="Attach Document / Media"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Type an encrypted message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#F2F2F2] text-[#0F0F0F] text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#065FD4]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-[#065FD4] hover:bg-[#004BB5] disabled:opacity-40 text-white transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center flex-col text-[#606060]">
          <ShieldCheck className="w-12 h-12 text-[#065FD4] mb-3" />
          <h2 className="text-lg font-bold text-[#0F0F0F]">VIONEX Messenger</h2>
          <p className="text-sm max-w-sm text-center mt-1">
            Send and receive end-to-end encrypted messages with verified creators and community members.
          </p>
        </div>
      )}

      {/* MULTI-DEVICE MANAGEMENT MODAL */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-lg text-[#0F0F0F]">Linked Devices & E2EE</h3>
              </div>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Linking Code Simulation */}
            <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl my-4 border border-dashed border-neutral-300">
              <QrCode className="w-32 h-32 text-neutral-800" />
              <p className="text-xs text-neutral-500 mt-3 text-center">
                Scan with VIONEX Mobile on your Android or iOS device to link without passwords.
              </p>
            </div>

            {/* Device List */}
            <div className="space-y-2.5 mb-6">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Devices</span>
              {getLinkedDevices().map(d => (
                <div key={d.deviceId} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{d.deviceName}</p>
                    <span className="text-xs text-emerald-600 font-mono">{d.lastActive}</span>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDeviceModal(false)}
              className="w-full py-2.5 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* LIVEKIT ACTIVE CALL MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl flex flex-col items-center">
            {/* Call Participant Video Screen */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-6 border border-neutral-800">
              {callType === 'video' && !isCameraOff ? (
                <img
                  src={activeConv.avatarUrl}
                  alt={activeConv.name}
                  className="w-full h-full object-cover blur-sm opacity-50"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={activeConv.avatarUrl}
                    alt={activeConv.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 mb-3"
                  />
                  <span className="font-bold text-lg">{activeConv.name}</span>
                </div>
              )}

              {/* In-Call Telemetry Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>LiveKit SFU 1080p | 48kHz Opus | RTT: 24ms</span>
              </div>

              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                {formatCallTime(callDuration)}
              </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <Mic className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-4 rounded-full transition-colors ${
                  isCameraOff ? 'bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                <Video className="w-6 h-6" />
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="p-4 rounded-full bg-[#FF0000] hover:bg-red-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                title="End Call"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
