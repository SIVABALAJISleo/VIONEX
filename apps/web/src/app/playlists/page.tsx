'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ListVideo, Plus, Play, Lock, Globe, Trash2, X } from 'lucide-react';
import { getPlaylists, savePlaylist, PlaylistItem, INITIAL_VIDEOS } from '@/lib/data';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(() => getPlaylists());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setPlaylists(getPlaylists());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const randomThumb = INITIAL_VIDEOS[Math.floor(Math.random() * INITIAL_VIDEOS.length)].thumbnailUrl;
    const pl: PlaylistItem = {
      id: `pl-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      thumbnailUrl: randomThumb,
      videoCount: 2,
      videos: [INITIAL_VIDEOS[0].id, INITIAL_VIDEOS[1].id],
      isPrivate,
      updatedAt: 'Just now'
    };

    savePlaylist(pl);
    setPlaylists(getPlaylists());
    setNewTitle('');
    setNewDesc('');
    setIsPrivate(false);
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ListVideo className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Playlists</h1>
            <p className="text-xs text-slate-400">Your created and saved playlists collections</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Grid of Playlists */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="group bg-[#14161d] border border-[#232733] hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/20"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={pl.thumbnailUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Overlay Badge */}
                <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                  <ListVideo className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{pl.videos?.length || pl.videoCount} videos</span>
                </div>

                {/* Quick Play Hover Button */}
                <Link
                  href={pl.videos && pl.videos.length > 0 ? `/watch/${pl.videos[0]}` : '#'}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </Link>
              </div>

              {/* Playlist Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {pl.title}
                    </h3>
                    {pl.isPrivate ? (
                      <span title="Private">
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </span>
                    ) : (
                      <span title="Public">
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </span>
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
                    href={pl.videos && pl.videos.length > 0 ? `/watch/${pl.videos[0]}` : '#'}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View full playlist
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <ListVideo className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No playlists created yet</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Create custom playlists to organize your favorite music, tutorials, and game clips.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161d] border border-[#2e3444] rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1f232e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-indigo-400" />
              Create New Playlist
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Deep Dives"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1b1e28] border border-[#2e3444] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this collection about?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1b1e28] border border-[#2e3444] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1e28] border border-[#2e3444]">
                <div className="flex items-center gap-2.5">
                  {isPrivate ? (
                    <Lock className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-indigo-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isPrivate ? 'Private Playlist' : 'Public Playlist'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isPrivate ? 'Only you can view' : 'Anyone can view'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-slate-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1f232e] hover:bg-[#282d3b] text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
