'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Megaphone,
  MessageSquare,
  Shield,
  Plus,
  ChevronRight,
  Vote,
  Calendar,
  Lock
} from 'lucide-react';

interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  memberCount: string;
  userRole: string;
  topics: {
    id: string;
    name: string;
    description: string;
    isAnnouncementOnly: boolean;
    unreadCount: number;
  }[];
}

const INITIAL_COMMUNITIES: CommunitySpace[] = [
  {
    id: 'comm-vionex-eng',
    name: 'VIONEX Engineering & Media Architecture',
    description: 'Official developer community exploring ABR HLS, WebRTC P2P delivery offloading, and LiveKit SFU.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    memberCount: '14,250 members',
    userRole: 'MEMBER',
    topics: [
      { id: 't1', name: 'announcements', description: 'Platform releases and security bulletins', isAnnouncementOnly: true, unreadCount: 1 },
      { id: 't2', name: 'webrtc-swarming', description: 'P2P Datachannel cache sharing benchmarks', isAnnouncementOnly: false, unreadCount: 4 },
      { id: 't3', name: 'media-codecs', description: 'AV1, VP9, and H.264 GOP alignment discussions', isAnnouncementOnly: false, unreadCount: 0 }
    ]
  },
  {
    id: 'comm-blender-creators',
    name: 'Open CGI Masters & Blender Cycles',
    description: 'Open source particle physics, volumetric smoke simulation, and 4K Blender animation pipelines.',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200',
    memberCount: '89,400 members',
    userRole: 'MEMBER',
    topics: [
      { id: 't4', name: 'announcements', description: 'Curated CGI asset packs', isAnnouncementOnly: true, unreadCount: 0 },
      { id: 't5', name: 'renders-feedback', description: 'Showcase and peer critiques', isAnnouncementOnly: false, unreadCount: 12 }
    ]
  }
];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunitySpace[]>(INITIAL_COMMUNITIES);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F] tracking-tight">Communities</h1>
          <p className="text-xs text-[#606060] mt-1">
            Organized topic groups, creator announcement boards, and collaborative member spaces.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Create Community</span>
        </button>
      </div>

      <div className="space-y-6">
        {communities.map((comm) => (
          <div
            key={comm.id}
            className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white hover:border-neutral-400 transition-colors shadow-sm"
          >
            {/* Community Header */}
            <div className="p-5 bg-gradient-to-r from-neutral-50 to-white border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={comm.avatarUrl}
                  alt={comm.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-neutral-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#0F0F0F]">{comm.name}</h2>
                    <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                      {comm.userRole}
                    </span>
                  </div>
                  <p className="text-xs text-[#606060] mt-0.5 max-w-xl">{comm.description}</p>
                  <span className="text-xs font-semibold text-[#065FD4] mt-1 inline-block">{comm.memberCount}</span>
                </div>
              </div>

              <Link
                href="/messages"
                className="px-4 py-1.5 rounded-full border border-[#065FD4] text-[#065FD4] text-xs font-semibold hover:bg-sky-50 transition-colors"
              >
                Open Space
              </Link>
            </div>

            {/* Topics Shelf */}
            <div className="p-4 divide-y divide-[#F2F2F2]">
              {comm.topics.map((t) => (
                <Link
                  key={t.id}
                  href="/messages"
                  className="flex items-center justify-between py-3 px-2 hover:bg-[#F9F9F9] rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-100 text-[#0F0F0F] group-hover:bg-[#065FD4] group-hover:text-white transition-colors">
                      {t.isAnnouncementOnly ? <Megaphone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F0F0F]">#{t.name}</span>
                        {t.isAnnouncementOnly && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
                            Announcement Only
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#606060] mt-0.5">{t.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#065FD4] text-white text-[11px] font-bold flex items-center justify-center">
                        {t.unreadCount}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#0F0F0F] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
