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
  { key: 'T', desc: 'Toggle Theater / Cinema mode' },
  { key: 'C', desc: 'Toggle Closed Captions (Subtitles)' },
  { key: '< / >', desc: 'Decrease / Increase playback speed' },
  { key: '0 .. 9', desc: 'Seek to 0% .. 90% of video' },
  { key: '?', desc: 'Show keyboard shortcuts cheat sheet' },
];

export default function KeyboardShortcutsModal() {
  const { showShortcutsModal, setShowShortcutsModal } = usePlayer();

  if (!showShortcutsModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#232733] pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-[#1f232e] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e1015] border border-[#232733]"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#1e2230] text-[11px] font-mono font-bold text-indigo-300 border border-[#2e3444] shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
