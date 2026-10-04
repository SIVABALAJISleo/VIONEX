'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Mic,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { AUTHENTIC_CHANNELS } from '@/lib/data';

interface CallRecord {
  id: string;
  name: string;
  avatarUrl: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  time: string;
  durationFormatted: string;
}

const CALL_RECORDS: CallRecord[] = [
  {
    id: 'c1',
    name: AUTHENTIC_CHANNELS.mkbhd.name,
    avatarUrl: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
    type: 'video',
    direction: 'incoming',
    time: 'Today, 18:45',
    durationFormatted: '12m 40s (1080p SFU)'
  },
  {
    id: 'c2',
    name: AUTHENTIC_CHANNELS.fireship.name,
    avatarUrl: AUTHENTIC_CHANNELS.fireship.avatarUrl,
    type: 'voice',
    direction: 'outgoing',
    time: 'Yesterday, 14:10',
    durationFormatted: '4m 12s'
  },
  {
    id: 'c3',
    name: AUTHENTIC_CHANNELS.veritasium.name,
    avatarUrl: AUTHENTIC_CHANNELS.veritasium.avatarUrl,
    type: 'video',
    direction: 'missed',
    time: 'Oct 02, 11:20',
    durationFormatted: 'Missed'
  }
];

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRecord[]>(CALL_RECORDS);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F] tracking-tight">Call History</h1>
          <p className="text-xs text-[#606060] mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>High-definition WebRTC voice and video calls powered by LiveKit SFU.</span>
          </p>
        </div>

        <Link
          href="/messages"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>New Call</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white shadow-sm divide-y divide-[#F2F2F2]">
        {calls.map(c => (
          <div key={c.id} className="flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition-colors">
            <div className="flex items-center gap-3">
              <img src={c.avatarUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
              <div>
                <h3 className="font-bold text-sm text-[#0F0F0F]">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#606060] mt-0.5">
                  {c.direction === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />}
                  {c.direction === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-sky-600" />}
                  {c.direction === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-red-600" />}
                  <span>{c.time} • {c.durationFormatted}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/messages"
                className="p-2.5 rounded-full hover:bg-neutral-100 text-[#0F0F0F] transition-colors"
                title="Call Again"
              >
                {c.type === 'video' ? <Video className="w-5 h-5 text-[#FF0000]" /> : <Phone className="w-5 h-5" />}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
