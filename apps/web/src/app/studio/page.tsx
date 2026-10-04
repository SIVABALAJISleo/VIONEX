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
  Tag,
  ShieldAlert,
  MessageSquare,
  Users,
  Check,
  Send,
  PieChart,
  Clock,
  Sparkles,
  Heart,
  Pin,
  Cpu,
  Globe,
  Radio,
  ScanLine,
  Activity,
  Server,
  X,
  Sliders,
  Settings as SettingsIcon,
  HelpCircle
} from 'lucide-react';
import { getStoredVideos, saveCustomVideo, deleteVideo, VideoItem } from '@/lib/data';
import { ContentIDEngine, ContentIDMatchResult } from '@/lib/content-id';
import { GLOBAL_EDGE_POPS, GlobalEdgeDirector } from '@/lib/edge-cdn';
import { TwoTowerEngine, UserContext } from '@/lib/two-tower';

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'upload' | 'analytics' | 'two-tower' | 'comments' | 'copyright' | 'customization'>('content');
  const [uploadStep, setUploadStep] = useState(1);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategory, setVideoCategory] = useState('Technology');
  const [videoVisibility, setVideoVisibility] = useState('PUBLIC');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [encodingStatus, setEncodingStatus] = useState<string>('Idle');
  const [publishedVideoId, setPublishedVideoId] = useState('');

  const [videos, setVideos] = useState<VideoItem[]>([]);

  // Content ID Live Scanner State
  const [isScanningContentID, setIsScanningContentID] = useState(false);
  const [scanTargetVideo, setScanTargetVideo] = useState<string>('');
  const [liveScanResults, setLiveScanResults] = useState<ContentIDMatchResult[] | null>(null);

  // Studio Comments State
  const [studioComments, setStudioComments] = useState([
    {
      id: 'sc-1',
      videoTitle: 'Next-Gen Video Infrastructure',
      author: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      text: 'Are you planning to support AV1 video encoding alongside H.264?',
      timestamp: '2 hours ago',
      hearted: false,
      pinned: false
    },
    {
      id: 'sc-2',
      videoTitle: 'Live Stream Ingestion & DVR Architecture',
      author: 'David Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      text: 'The 76.2% WebRTC peer mesh bandwidth saving on high traffic streams is unbelievable.',
      timestamp: '4 hours ago',
      hearted: true,
      pinned: false
    }
  ]);

  useEffect(() => {
    setVideos(getStoredVideos());
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    setIsUploading(true);
    setUploadStep(2);
    setUploadProgress(15);
    setEncodingStatus('Uploading chunk 1/4 (25MB)...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setEncodingStatus('Transcoding HLS multi-bitrate renditions (1080p, 720p, 480p, 360p)...');
          setTimeout(() => {
            const newId = `vid-custom-${Date.now()}`;
            const newVideo: VideoItem = {
              id: newId,
              title: videoTitle.trim(),
              description: videoDesc.trim() || 'Uploaded through VIONEX Creator Studio.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
              duration: 320,
              durationFormatted: '05:20',
              videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
              channel: {
                handle: 'vionex-labs',
                name: 'VIONEX Engineering',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                isVerified: true
              },
              viewsCount: '1',
              viewsNumeric: 1,
              likesCount: 1,
              publishedAt: 'Just now',
              category: videoCategory,
              tags: [videoCategory, 'StudioUpload', 'HLS'],
              commentsCount: 0
            };
            saveCustomVideo(newVideo);
            setVideos(getStoredVideos());
            setIsUploading(false);
            setUploadProgress(100);
            setEncodingStatus('Completed and Published!');
            setPublishedVideoId(newId);
            setUploadStep(3);
          }, 1200);
          return 95;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteVideo(id);
      setVideos(getStoredVideos());
    }
  };

  const handleRunContentIDScan = () => {
    setIsScanningContentID(true);
    setLiveScanResults(null);
    setTimeout(() => {
      const results = ContentIDEngine.scanMedia(scanTargetVideo || 'Next-Gen Video Infrastructure');
      setLiveScanResults(results);
      setIsScanningContentID(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#F9F9F9] text-[#0F0F0F] select-none">
      {/* Studio Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] hidden md:flex flex-col py-4 px-3 shrink-0">
        <div className="px-3 pb-4 mb-3 border-b border-[#E5E5E5] flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            alt="Studio Avatar"
            className="w-12 h-12 rounded-full object-cover border border-[#E5E5E5]"
          />
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-[#0F0F0F] truncate">Your channel</h2>
            <p className="text-xs text-[#606060] truncate">VIONEX Engineering</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'content', label: 'Content & Videos', icon: Video },
            { id: 'upload', label: 'Upload Video', icon: UploadCloud },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'copyright', label: 'Live Content ID Scanner', icon: ScanLine },
            { id: 'two-tower', label: 'Two-Tower AI & Global CDN', icon: Cpu },
            { id: 'comments', label: 'Comments & Community', icon: MessageSquare },
            { id: 'customization', label: 'Customization', icon: Sliders }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#F2F2F2] text-[#FF0000] border-l-4 border-[#FF0000]'
                    : 'text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF0000]' : 'text-[#606060]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Studio Main Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F0F0F]">
              {activeTab === 'content' && 'Channel Content'}
              {activeTab === 'upload' && 'Upload Video'}
              {activeTab === 'analytics' && 'Channel Analytics'}
              {activeTab === 'copyright' && 'Copyright & Live Content ID'}
              {activeTab === 'two-tower' && 'Two-Tower DNN Model & Global Edge CDN Director'}
              {activeTab === 'comments' && 'Channel Comments'}
              {activeTab === 'customization' && 'Channel Customization'}
            </h1>
            <p className="text-xs text-[#606060] mt-0.5">
              Manage your videos, analyze real-time performance, and audit algorithmic features.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('upload');
              setUploadStep(1);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>

        {/* 1. CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#0F0F0F]">
                  <thead className="bg-[#F9F9F9] text-[#606060] font-semibold border-b border-[#E5E5E5]">
                    <tr>
                      <th className="p-3.5">Video</th>
                      <th className="p-3.5">Visibility</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Views</th>
                      <th className="p-3.5">Likes</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {videos.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="p-3.5 flex gap-3 items-center min-w-[280px]">
                          <img
                            src={v.thumbnailUrl}
                            alt={v.title}
                            className="w-20 h-12 rounded-lg object-cover border border-[#E5E5E5] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-[#0F0F0F] line-clamp-1">{v.title}</p>
                            <p className="text-[11px] text-[#606060] line-clamp-1 mt-0.5">{v.description}</p>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] font-semibold text-[10px]">
                            Public
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-[#606060]">{v.publishedAt}</td>
                        <td className="p-3.5 whitespace-nowrap font-medium">{v.viewsCount}</td>
                        <td className="p-3.5 whitespace-nowrap font-medium">{v.likesCount.toLocaleString()}</td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/watch/${v.id}`}
                              className="p-1.5 rounded-lg hover:bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F]"
                              title="Watch on VIONEX"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteVideo(v.id)}
                              className="p-1.5 rounded-lg hover:bg-[#FCE8E6] text-[#606060] hover:text-[#C5221F]"
                              title="Delete Video"
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
          </div>
        )}

        {/* 2. UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {uploadStep === 1 && (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-[#CCCCCC] rounded-2xl p-8 text-center space-y-3 hover:border-[#065FD4] transition-colors cursor-pointer bg-[#F9F9F9]">
                  <UploadCloud className="w-12 h-12 text-[#065FD4] mx-auto" />
                  <p className="font-bold text-sm text-[#0F0F0F]">Drag and drop video files to upload</p>
                  <p className="text-xs text-[#606060]">Your videos will be private until you publish them.</p>
                  <input type="file" accept="video/*" className="hidden" id="video-file-picker" />
                  <label
                    htmlFor="video-file-picker"
                    className="inline-block px-4 py-2 rounded-full bg-[#065FD4] text-white text-xs font-semibold cursor-pointer hover:bg-[#0551B5]"
                  >
                    Select File
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F0F0F]">Title (required)</label>
                  <input
                    type="text"
                    required
                    placeholder="Add a title that describes your video"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F0F0F]">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Tell viewers about your video"
                    value={videoDesc}
                    onChange={(e) => setVideoDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0F0F0F]">Category</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Coding">Coding</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Science">Science</option>
                      <option value="Music">Music</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0F0F0F]">Visibility</label>
                    <select
                      value={videoVisibility}
                      onChange={(e) => setVideoVisibility(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#065FD4] outline-none text-xs text-[#0F0F0F]"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="UNLISTED">Unlisted</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-bold shadow-md transition-all mt-4"
                >
                  Upload & Process Video
                </button>
              </form>
            )}

            {uploadStep === 2 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-[#065FD4] border-t-transparent animate-spin mx-auto" />
                <h3 className="font-bold text-base text-[#0F0F0F]">{uploadProgress}% Uploaded</h3>
                <p className="text-xs text-[#606060] font-mono">{encodingStatus}</p>
                <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden max-w-md mx-auto">
                  <div
                    className="bg-[#065FD4] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadStep === 3 && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-[#137333] mx-auto" />
                <h3 className="font-bold text-lg text-[#0F0F0F]">Video Published Successfully!</h3>
                <p className="text-xs text-[#606060]">
                  Your video is now live on VIONEX and being distributed across global edge cache nodes.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href={`/watch/${publishedVideoId}`}
                    className="px-5 py-2 rounded-full bg-[#065FD4] text-white text-xs font-semibold hover:bg-[#0551B5]"
                  >
                    Watch Video
                  </Link>
                  <button
                    onClick={() => {
                      setActiveTab('content');
                      setUploadStep(1);
                    }}
                    className="px-5 py-2 rounded-full bg-[#F2F2F2] text-[#0F0F0F] text-xs font-semibold hover:bg-[#E5E5E5]"
                  >
                    Go to Content
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Views', value: '425.8K', change: '+14.2% vs last 28 days', isUp: true },
                { title: 'Watch time (hours)', value: '18.4K', change: '+9.8% vs last 28 days', isUp: true },
                { title: 'Subscribers', value: '+3.4K', change: '+22.5% vs last 28 days', isUp: true },
                { title: 'Estimated Revenue', value: '$2,840.00', change: '+18.1% vs last 28 days', isUp: true }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-2 shadow-sm">
                  <p className="text-xs font-medium text-[#606060]">{card.title}</p>
                  <p className="text-2xl font-bold text-[#0F0F0F]">{card.value}</p>
                  <p className="text-[11px] text-[#137333] font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{card.change}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0F0F0F]">Real-time Performance</h3>
              <div className="h-44 w-full bg-[#F9F9F9] rounded-xl flex items-end justify-between p-4 gap-2 border border-[#E5E5E5]">
                {[45, 60, 55, 75, 90, 85, 110, 130, 120, 140, 165, 180, 150, 195, 210].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#065FD4] rounded-t-sm hover:bg-[#0551B5] transition-all"
                      style={{ height: `${(val / 220) * 120}px` }}
                    />
                    <span className="text-[9px] text-[#909090]">{idx * 2}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. COPYRIGHT & CONTENT ID TAB */}
        {activeTab === 'copyright' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E5E5]">
                <div>
                  <h3 className="font-bold text-base text-[#0F0F0F]">Live Content ID Scanner</h3>
                  <p className="text-xs text-[#606060]">
                    Automated Audio Sub-Band FFT & Perceptual dHash candidate verification against protected reference assets.
                  </p>
                </div>
                <button
                  onClick={handleRunContentIDScan}
                  disabled={isScanningContentID}
                  className="px-4 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  {isScanningContentID ? 'Running Spectral Difference...' : 'Scan Video for Copyright Matches'}
                </button>
              </div>

              {isScanningContentID && (
                <div className="p-6 bg-[#F9F9F9] rounded-xl border border-[#E5E5E5] text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#065FD4] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-[#0F0F0F]">Extracting Chromaprint 32-bit acoustic fingerprints and perceptual 64-bit frame dHashes...</p>
                </div>
              )}

              {liveScanResults && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#0F0F0F] uppercase tracking-wider">Scan Results</h4>
                  {liveScanResults.map((r, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-[#0F0F0F]">{r.owner} — {r.assetTitle}</p>
                        <p className="text-[#606060]">Match: {r.matchedSegmentDetails} • Range: {r.matchStartSec}s - {r.matchEndSec}s • Confidence: {(r.confidenceScore * 100).toFixed(1)}%</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-[#FEF7E0] text-[#B06000]">
                        Action: {r.policyApplied} ({r.status})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. TWO-TOWER AI & GLOBAL EDGE CDN TAB */}
        {activeTab === 'two-tower' && (
          <div className="space-y-6">
            {/* Edge CDN PoPs */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0F0F0F]">Global High-Scale Edge CDN Director</h3>
              <p className="text-xs text-[#606060]">
                Distributed edge caching nodes routing media segments with sub-25ms regional latency.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GLOBAL_EDGE_POPS.map((pop) => (
                  <div key={pop.id} className="p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F0F0F]">{pop.name}</span>
                      <span className="w-2 h-2 rounded-full bg-[#137333]" />
                    </div>
                    <p className="text-[#606060]">{pop.city} ({pop.region})</p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-[#065FD4] font-semibold">
                      <span>Latency: {pop.avgLatencyMs}ms</span>
                      <span>Hit: {(pop.cacheHitRatio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Tower Deep Learning Diagram */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0F0F0F]">Two-Tower Deep Learning Candidate Generation</h3>
              <p className="text-xs text-[#606060]">
                64-dimensional dense normalized embeddings for Query Tower (User History) and Candidate Tower (Video Embeddings).
              </p>
              <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] font-mono text-[11px] text-[#0F0F0F] space-y-2">
                <p>Query Vector: [0.038, -0.012, 0.084, 0.125, -0.041, 0.092, ... 64 dims] (L2 Norm: 1.000)</p>
                <p>Cosine Dot-Product Scoring: Score = (Q • C) * FreshnessDecay * EpsilonBanditDiversity</p>
                <p className="text-[#137333] font-bold">Status: Online & Ranking Home/Watch feeds in real time.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#0F0F0F]">Channel Comments</h3>
            <div className="divide-y divide-[#E5E5E5]">
              {studioComments.map((sc) => (
                <div key={sc.id} className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F0F0F]">{sc.author} • <span className="text-[#606060] font-normal">{sc.videoTitle}</span></span>
                    <span className="text-[#909090] text-[11px]">{sc.timestamp}</span>
                  </div>
                  <p className="text-[#0F0F0F]">{sc.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CUSTOMIZATION TAB */}
        {activeTab === 'customization' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#0F0F0F]">Channel Customization</h3>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#0F0F0F] block mb-1">Channel Name</label>
                <input
                  type="text"
                  defaultValue="VIONEX Engineering"
                  className="p-2.5 rounded-xl border border-[#CCCCCC] w-full max-w-md outline-none text-[#0F0F0F]"
                />
              </div>
              <div>
                <label className="font-bold text-[#0F0F0F] block mb-1">Handle</label>
                <input
                  type="text"
                  defaultValue="@vionex-labs"
                  className="p-2.5 rounded-xl border border-[#CCCCCC] w-full max-w-md outline-none text-[#0F0F0F]"
                />
              </div>
              <button
                onClick={() => alert('Channel settings updated.')}
                className="px-4 py-2 rounded-full bg-[#065FD4] text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
