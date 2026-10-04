'use client';

import React from 'react';
import { usePlayer } from '@/lib/PlayerContext';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Space / K', desc: 'Play / Pause video' },
  { key: 'J / L', desc: 'Seek backward / forward 10 seconds' },
  { key: 'Left / Right', desc: 'Seek backward / forward 5 seconds' },
  { key: 'M', desc: 'Mute / unmute audio' },
  { key: 'F', desc: 'Toggle Fullscreen' },
  { key: 'I', desc: 'Toggle Miniplayer' },
  { key: 'T', desc: 'Toggle Theater mode' },
  { key: 'C', desc: 'Toggle Subtitles (Closed Captions)' },
  { key: '< / >', desc: 'Decrease / Increase playback speed' },
  { key: '0 .. 9', desc: 'Seek to 0% .. 90% of video' },
  { key: '?', desc: 'Show keyboard shortcuts cheat sheet' },
];

export default function KeyboardShortcutsModal() {
  const { showShortcutsModal, setShowShortcutsModal } = usePlayer();

  if (!showShortcutsModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-[#0F0F0F]">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#FF0000]" />
            <h3 className="font-bold text-base text-[#0F0F0F]">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="p-1.5 rounded-full text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]"
            >
              <span className="text-xs text-[#0F0F0F]">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#E5E5E5] text-[11px] font-mono font-bold text-[#0F0F0F] border border-[#CCCCCC] shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E5E5E5]">
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="px-5 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-xs font-semibold text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
