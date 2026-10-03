'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ListVideo, Plus, Lock, Globe, Play, Sparkles } from 'lucide-react';
import { getPlaylists, savePlaylist, PlaylistItem } from '@/lib/data';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setPlaylists(getPlaylists());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl: PlaylistItem = {
      id: 'pl-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      videoCount: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      updatedAt: 'Created just now',
      isPrivate,
      videos: []
    };

    savePlaylist(newPl);
    setPlaylists([newPl, ...playlists]);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ListVideo className="w-6 h-6 text-indigo-400" />
            <span>Playlists</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize videos into custom collections and queues
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="group flex flex-col bg-[#14161d] border border-[#232733] hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all shadow-md"
          >
            {/* Thumbnail Stack Preview */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <img
                src={pl.thumbnailUrl}
                alt={pl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Video Count Badge */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <ListVideo className="w-3.5 h-3.5 text-indigo-400" />
                <span>{pl.videoCount} videos</span>
              </div>

              {/* Overlay Play Action */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Link
                  href={pl.videos.length > 0 ? `/watch/${pl.videos[0]}` : '#'}
                  className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Playlist Meta */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {pl.title}
                  </h3>
                  {pl.isPrivate ? (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Private" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Public" />
                  )}
                </div>
                {pl.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {pl.description}
                  </p>
                )}
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-[#232733] flex items-center justify-between">
                <span>{pl.updatedAt}</span>
                <Link
                  href={pl.videos.length > 0 ? `/watch/${pl.videos[0]}` : '#'}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  View Playlist
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Create New Playlist
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Playlist Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems & Algorithms"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what this playlist contains..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300 font-semibold">Privacy</span>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    isPrivate
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  <span>{isPrivate ? 'Private' : 'Public'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#232733]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md shadow-indigo-600/20"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
