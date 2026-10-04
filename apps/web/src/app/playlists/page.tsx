'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ListVideo, Plus, Play, Trash2, Lock, Globe, X } from 'lucide-react';
import { getPlaylists, savePlaylist, deletePlaylist, PlaylistItem } from '@/lib/data';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setPlaylists(getPlaylists());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPl: PlaylistItem = {
      id: `pl-${Date.now()}`,
      title: title.trim(),
      description: desc.trim() || undefined,
      videoCount: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
      updatedAt: 'Just now',
      isPrivate,
      videos: []
    };
    savePlaylist(newPl);
    setPlaylists(getPlaylists());
    setTitle('');
    setDesc('');
    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this playlist?')) {
      deletePlaylist(id);
      setPlaylists(getPlaylists());
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[80vh] space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ListVideo className="w-6 h-6 text-[#0F0F0F]" />
            Playlists
          </h1>
          <p className="text-xs text-[#606060] mt-0.5">{playlists.length} playlists created</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((pl) => (
          <div key={pl.id} className="group flex flex-col gap-2 relative">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm">
              <img src={pl.thumbnailUrl} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

              {/* Video Count Overlay on Right */}
              <div className="absolute bottom-0 right-0 top-0 w-24 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-1">
                <ListVideo className="w-5 h-5 text-white" />
                <span className="text-xs font-bold">{pl.videoCount}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-300">videos</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2 pt-1">
              <div>
                <h3 className="font-semibold text-sm text-[#0F0F0F] line-clamp-1">{pl.title}</h3>
                <p className="text-xs text-[#606060] flex items-center gap-1 mt-0.5">
                  {pl.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  <span>{pl.isPrivate ? 'Private' : 'Public'} • {pl.updatedAt}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(pl.id)}
                className="p-1 rounded-full hover:bg-[#F2F2F2] text-[#606060] hover:text-[#C5221F]"
                title="Delete playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-[#E5E5E5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <h3 className="font-bold text-sm text-[#0F0F0F]">Create new playlist</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#606060] hover:text-[#0F0F0F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0F0F0F] block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter playlist title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F0F0F] block mb-1">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add a description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0F0F0F]">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="accent-[#065FD4] w-4 h-4"
                />
                <span>Make private (only visible to you)</span>
              </label>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-full hover:bg-[#F2F2F2] text-xs font-semibold text-[#0F0F0F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#065FD4] text-white text-xs font-semibold"
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
