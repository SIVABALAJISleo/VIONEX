'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  CheckCircle,
  BarChart3,
  Video,
  DollarSign,
  Layers,
  Eye,
  Trash2,
  ExternalLink,
  Plus,
  Play,
  TrendingUp,
  Tag
} from 'lucide-react';
import { getStoredVideos, saveCustomVideo, VideoItem } from '@/lib/data';

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'upload' | 'analytics'>('content');
  const [uploadStep, setUploadStep] = useState(1);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategory, setVideoCategory] = useState('Technology');
  const [videoVisibility, setVideoVisibility] = useState('PUBLIC');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publishedVideoId, setPublishedVideoId] = useState('');

  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    setVideos(getStoredVideos());
  }, []);

  const simulateUpload = () => {
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadStep(2);
      }
    }, 300);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'vid-custom-' + Date.now();
    const newVideo: VideoItem = {
      id: newId,
      title: videoTitle.trim() || 'My New Uploaded Video',
      description: videoDesc.trim() || 'Uploaded through VIONEX Creator Studio.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
      duration: 720,
      durationFormatted: '12:00',
      videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      channel: {
        handle: 'creator',
        name: 'Creator Studio',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isVerified: true,
        subscribers: '10.5K subscribers',
        subscribersCount: 10500
      },
      viewsCount: '1 view',
      viewsNumeric: 1,
      likesCount: 1,
      publishedAt: 'Just now',
      category: videoCategory,
      tags: ['New', videoCategory],
      commentsCount: 0
    };

    saveCustomVideo(newVideo);
    setVideos([newVideo, ...videos]);
    setPublishedVideoId(newId);
    setUploadStep(3);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Delete this video permanently?')) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-400" />
            <span>Creator Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage channel content, monitor performance, and publish new videos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Channel Standing: Good
          </span>
          <button
            onClick={() => {
              setActiveTab('upload');
              setUploadStep(1);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Views (28 Days)</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">462,800</div>
          <div className="text-xs text-emerald-400 font-semibold">+18.4% vs last period</div>
        </div>

        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Watch Time (Hours)</span>
            <Video className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">12,450</div>
          <div className="text-xs text-emerald-400 font-semibold">+22.1% vs last period</div>
        </div>

        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Subscribers</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">+3,820</div>
          <div className="text-xs text-emerald-400 font-semibold">+9.5% vs last period</div>
        </div>

        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Estimated Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">$1,845.20</div>
          <div className="text-xs text-emerald-400 font-semibold">RPM: $3.98 • 4.2% CTR</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-[#232733] text-sm font-semibold">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'content' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Channel Content ({videos.length})
          {activeTab === 'content' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'upload' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Upload Wizard
          {activeTab === 'upload' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'analytics' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Analytics & Retention
          {activeTab === 'analytics' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Content Tab: Video Management Table */}
      {activeTab === 'content' && (
        <div className="bg-[#14161d] border border-[#232733] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#232733] flex items-center justify-between">
            <h2 className="font-bold text-sm text-white">Video Catalog</h2>
            <span className="text-xs text-slate-400">Showing {videos.length} videos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a24] text-slate-400 border-b border-[#232733] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Video</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Likes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232733]">
                {videos.map((v) => (
                  <tr key={v.id} className="hover:bg-[#181a24]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                          <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                            {v.durationFormatted}
                          </span>
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/watch/${v.id}`}
                            className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                          >
                            {v.title}
                          </Link>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{v.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                        Public
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {v.category}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {v.publishedAt}
                    </td>
                    <td className="py-3 px-4 text-white font-mono font-medium">
                      {v.viewsCount}
                    </td>
                    <td className="py-3 px-4 text-white font-mono font-medium">
                      {v.likesCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/watch/${v.id}`}
                          title="Watch Video"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-600/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Wizard Tab */}
      {activeTab === 'upload' && (
        <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#232733] pb-4">
            <h2 className="text-lg font-bold text-white">Video Ingestion Wizard</h2>
            <span className="text-xs text-slate-400">Step {uploadStep} of 3</span>
          </div>

          {uploadStep === 1 && (
            <div className="border-2 border-dashed border-[#2e3444] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-500 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Drag and drop video files to upload</p>
                <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MKV, MOV (Up to 10GB)</p>
              </div>
              {isUploading ? (
                <div className="w-72 space-y-2">
                  <div className="w-full bg-[#1f232e] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-indigo-400">
                    Uploading Chunks: {uploadProgress}%
                  </span>
                </div>
              ) : (
                <button
                  onClick={simulateUpload}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Select File from Computer
                </button>
              )}
            </div>
          )}

          {uploadStep === 2 && (
            <form onSubmit={handlePublish} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter a compelling title..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full h-11 px-4 bg-[#0b0c10] border border-[#232733] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your video, add chapters, timestamps, and resources..."
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="w-full p-4 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Coding">Coding</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Visibility</label>
                  <select
                    value={videoVisibility}
                    onChange={(e) => setVideoVisibility(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PUBLIC">Public (Everyone can search & view)</option>
                    <option value="UNLISTED">Unlisted (Anyone with link)</option>
                    <option value="PRIVATE">Private (Only you)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#232733]">
                <button
                  type="button"
                  onClick={() => setUploadStep(1)}
                  className="px-5 py-2 rounded-full border border-[#2e3444] text-xs font-semibold text-slate-300 hover:bg-[#1f232e]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20"
                >
                  Publish Video
                </button>
              </div>
            </form>
          )}

          {uploadStep === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-white">Video Published Successfully!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Transcoding complete! Multi-rendition HLS playlists (1080p, 720p, 480p) have been generated and synced across the VIONEX streaming network.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href={`/watch/${publishedVideoId}`}
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Video Live</span>
                </Link>
                <button
                  onClick={() => {
                    setUploadStep(1);
                    setVideoTitle('');
                    setVideoDesc('');
                    setActiveTab('content');
                  }}
                  className="px-5 py-2 rounded-full bg-[#1f232e] hover:bg-[#282d3b] text-xs font-semibold text-white border border-[#2e3444]"
                >
                  Go to Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Audience Retention Analysis</span>
            </h3>
            <div className="h-44 rounded-2xl bg-[#0b0c10] border border-[#232733] p-4 flex items-end gap-2">
              {[88, 82, 79, 75, 74, 72, 71, 70, 68, 65, 62, 60].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all hover:brightness-125"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] text-slate-500">{i * 2}m</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400">
              Average view duration: <span className="text-white font-bold">14m 20s (68.4%)</span>
            </div>
          </div>

          <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-400" />
              <span>Traffic Source Types</span>
            </h3>
            <div className="space-y-3 pt-2">
              {[
                { label: 'Browse features (Home & Feed)', pct: 44, color: 'bg-indigo-500' },
                { label: 'VIONEX Search', pct: 28, color: 'bg-pink-500' },
                { label: 'Suggested Videos', pct: 18, color: 'bg-violet-500' },
                { label: 'Direct or external links', pct: 10, color: 'bg-amber-500' }
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="font-mono font-bold text-white">{s.pct}%</span>
                  </div>
                  <div className="w-full bg-[#0b0c10] h-2 rounded-full overflow-hidden">
                    <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
