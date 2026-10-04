'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, ExternalLink } from 'lucide-react';
import Player from '@/components/Player';
import { INITIAL_VIDEOS } from '@/lib/data';

export default function LiveEmbedPage() {
  const params = useParams();
  const streamId = (params?.id as string) || 'live_default';
  const video = INITIAL_VIDEOS[0];

  const handleOpenChatPopout = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `/live?chatPopout=true&id=${streamId}`,
        `VionexChat_${streamId}`,
        'width=400,height=620,menubar=no,toolbar=no,location=no,status=no'
      );
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative w-full h-full">
        <Player
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          title={`${video.title} [LIVE EMBED]`}
          channelName="VIONEX Engineering"
          autoPlay={true}
        />

        {/* Live Embed Overlays */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FF0000] text-white px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            LIVE
          </div>
          <button
            onClick={handleOpenChatPopout}
            className="flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
            title="Open Interactive Live Chat in Popout Window"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FF0000]" />
            <span>Open Chat Popout</span>
            <ExternalLink className="w-3 h-3 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
