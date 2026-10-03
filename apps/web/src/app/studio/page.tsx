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
  Server
} from 'lucide-react';
import { getStoredVideos, saveCustomVideo, VideoItem } from '@/lib/data';
import { ContentIDEngine, ContentIDMatchResult } from '@/lib/content-id';
import { GLOBAL_EDGE_POPS, GlobalEdgeDirector } from '@/lib/edge-cdn';
import { TwoTowerEngine, UserContext } from '@/lib/two-tower';

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'upload' | 'analytics' | 'two-tower' | 'comments' | 'copyright' | 'community'>('content');
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
      text: 'The 2-second low latency HLS segmenting was flawless during the load test.',
      timestamp: '5 hours ago',
      hearted: true,
      pinned: true
    }
  ]);

  // Copyright Claims State
  const [copyrightClaims, setCopyrightClaims] = useState([
    {
      id: 'cl-1',
      videoTitle: 'Ambient Soundtrack Test Stream',
      claimant: 'Universal Soundtracks Group',
      timestampClaimed: '0:14 - 1:04',
      status: 'Claimed (Monetization shared)',
      confidence: '94%',
      disputed: false
    }
  ]);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);

  // Community Posts State
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 'cp-1',
      content: 'We just rolled out real-time ABR and WebRTC peer delivery! Which feature should we benchmark next?',
      pollOptions: [
        { label: '4K 60FPS Transcoding Pipeline', votes: 142 },
        { label: 'End-to-End Encrypted Private Streams', votes: 98 },
        { label: 'Dynamic Multi-Track Audio Dubbing', votes: 64 }
      ],
      totalVotes: 304,
      publishedAt: 'Yesterday'
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  const [pollOptionsInput, setPollOptionsInput] = useState(['', '']);

  useEffect(() => {
    const list = getStoredVideos();
    setVideos(list);
    if (list.length > 0) {
      setScanTargetVideo(list[0].title);
    }
  }, []);

  const simulateUpload = () => {
    setIsUploading(true);
    setEncodingStatus('Uploading chunks to quarantine storage...');
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setUploadProgress(p);
      if (p === 60) {
        setEncodingStatus('Assembling multipart chunks & FFmpeg transcoding (1080p, 720p, 480p)...');
      }
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setEncodingStatus('Transcoding complete! HLS manifest ready.');
        setUploadStep(2);
      }
    }, 300);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'vid-custom-' + Date.now();
    const newVideo: VideoItem = {
      id: newId,
      title: videoTitle.trim() || 'My New Studio Upload',
      description: videoDesc.trim() || 'Uploaded through VIONEX Creator Studio.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
      duration: 345,
      durationFormatted: '5:45',
      videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      channel: {
        name: 'Creator Studio Pro',
        handle: 'creator',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isVerified: true
      },
      viewsCount: '0',
      viewsNumeric: 0,
      likesCount: 0,
      publishedAt: 'Just now',
      category: videoCategory,
      tags: ['creator', 'studio', 'vionex'],
      commentsCount: 0
    };

    saveCustomVideo(newVideo);
    setVideos(getStoredVideos());
    setPublishedVideoId(newId);
    setUploadStep(3);
  };

  const handleRunContentIDScan = () => {
    setIsScanningContentID(true);
    setTimeout(() => {
      const results = ContentIDEngine.scanMedia(scanTargetVideo);
      setLiveScanResults(results);
      setIsScanningContentID(false);
    }, 1200);
  };

  const handleHeartComment = (id: string) => {
    setStudioComments(
      studioComments.map((c) => (c.id === id ? { ...c, hearted: !c.hearted } : c))
    );
  };

  const handlePinComment = (id: string) => {
    setStudioComments(
      studioComments.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleDisputeSubmit = () => {
    if (!activeClaimId) return;
    setCopyrightClaims(
      copyrightClaims.map((cl) =>
        cl.id === activeClaimId ? { ...cl, status: 'Dispute submitted (Pending review)', disputed: true } : cl
      )
    );
    setDisputeModalOpen(false);
    setDisputeReason('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const validPollOptions = pollOptionsInput
      .filter((opt) => opt.trim().length > 0)
      .map((opt) => ({ label: opt.trim(), votes: 0 }));

    const post = {
      id: 'cp-' + Date.now(),
      content: newPostContent.trim(),
      pollOptions: validPollOptions,
      totalVotes: 0,
      publishedAt: 'Just now'
    };

    setCommunityPosts([post, ...communityPosts]);
    setNewPostContent('');
    setPollOptionsInput(['', '']);
  };

  const edgeTelemetry = GlobalEdgeDirector.getGlobalTelemetry();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-indigo-400" />
            VIONEX Creator Studio Pro
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise video lifecycle: Two-Tower DNN ranking, Global Edge CDN, automated Content ID, and real-time telemetry.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('upload');
            setUploadStep(1);
            setUploadProgress(0);
          }}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#232733] pb-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'content', label: 'Channel Content', icon: Layers },
          { id: 'upload', label: 'Upload & Transcode', icon: UploadCloud },
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
          { id: 'two-tower', label: 'Two-Tower AI & Global CDN', icon: Cpu },
          { id: 'comments', label: 'Comments Moderation', icon: MessageSquare },
          { id: 'copyright', label: 'Live Content ID Scanner', icon: ShieldAlert },
          { id: 'community', label: 'Community Posts', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161d]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Channel Content */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Published Videos ({videos.length})</h2>
            <span className="text-xs text-slate-400 font-mono">Real-time status: Synced across 5 Global Edge PoPs</span>
          </div>

          <div className="bg-[#111318] border border-[#232733] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161922] text-slate-400 font-semibold border-b border-[#232733]">
                  <tr>
                    <th className="p-4">Video</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Likes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2230] text-slate-200">
                  {videos.map((vid) => (
                    <tr key={vid.id} className="hover:bg-[#151821] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-20 aspect-video rounded-lg object-cover border border-[#2e3444] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white truncate block">{vid.title}</span>
                          <span className="text-[11px] text-slate-400">{vid.durationFormatted} • {vid.category}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">
                          Public
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{vid.publishedAt}</td>
                      <td className="p-4 font-mono">{vid.viewsCount}</td>
                      <td className="p-4 font-mono">{vid.likesCount}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/watch/${vid.id}`}
                          className="p-2 rounded-lg bg-[#1f232e] hover:bg-indigo-600 text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Watch</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Upload Flow */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {uploadStep === 1 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Select Video File to Upload</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Supports MP4, MOV, MKV, WebM up to 100GB. Multi-bitrate HLS packaging and automatic Content ID scan included.
                </p>
              </div>

              {!isUploading ? (
                <button
                  onClick={simulateUpload}
                  className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  Choose File & Begin Transcode
                </button>
              ) : (
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>{encodingStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadStep === 2 && (
            <form onSubmit={handlePublish} className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-[#232733] pb-2">
                Video Details & Metadata
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Add a title that catches viewers' attention"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={4}
                  placeholder="Tell viewers about your video"
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value)}
                    className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Science">Science</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Visibility</label>
                  <select
                    value={videoVisibility}
                    onChange={(e) => setVideoVisibility(e.target.value)}
                    className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="UNLISTED">Unlisted</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#232733]">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  Publish Video
                </button>
              </div>
            </form>
          )}

          {uploadStep === 3 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Video Published Successfully!</h3>
              <p className="text-xs text-slate-400">
                Your video is now indexed, transcoded across 4 resolutions, and replicated across the Global Edge CDN.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href={`/watch/${publishedVideoId}`}
                  className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Video</span>
                </Link>
                <button
                  onClick={() => {
                    setUploadStep(1);
                    setVideoTitle('');
                    setVideoDesc('');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#1e2230] hover:bg-[#282d3b] text-slate-200 font-bold text-xs"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Standard Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Views (Last 28 Days)', value: '1.42M', delta: '+14.2%', icon: Eye },
              { label: 'Watch Time (Hours)', value: '84.6K', delta: '+8.7%', icon: Clock },
              { label: 'Subscribers Gained', value: '+4,250', delta: '+22.4%', icon: Users },
              { label: 'Estimated Revenue', value: '$3,840.50', delta: '+18.1%', icon: DollarSign }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-[#14161d] border border-[#232733] space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>{stat.label}</span>
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                  <span className="text-[11px] font-bold text-emerald-400">{stat.delta} vs previous period</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#14161d] border border-[#232733] space-y-4">
              <h3 className="font-bold text-sm text-white">Audience Retention Benchmark</h3>
              <div className="h-44 flex items-end gap-2 pt-6">
                {[98, 88, 82, 79, 75, 71, 68, 64, 62, 59, 58, 55].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] text-slate-500">{idx * 30}s</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#14161d] border border-[#232733] space-y-4">
              <h3 className="font-bold text-sm text-white">Traffic Sources</h3>
              <div className="space-y-3">
                {[
                  { source: 'Two-Tower DNN Home Candidates', pct: '54%' },
                  { source: 'Platform Full-Text Search', pct: '26%' },
                  { source: 'Channel Pages & End Screens', pct: '12%' },
                  { source: 'Direct & External Deep-links', pct: '8%' }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{s.source}</span>
                      <span className="font-mono text-indigo-400">{s.pct}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: s.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Two-Tower AI & Global Edge CDN */}
      {activeTab === 'two-tower' && (
        <div className="space-y-8">
          {/* Two-Tower Neural Network Candidate Generation */}
          <div className="p-6 rounded-3xl bg-[#14161d] border border-indigo-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Two-Tower Deep Learning Recommendation Engine (DNN)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Continuous vector dot-product scoring: Query Tower (User Vectors) × Candidate Tower (Video Embeddings).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                Inference Latency: 4.8ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e1015] border border-[#232733] space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Query Tower (User Context)</span>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>Embedding Dim: <span className="text-indigo-400">64-d Float32</span></div>
                  <div>Category Weights: <span className="text-slate-200">Tech (0.85), Science (0.6)</span></div>
                  <div>Context Factor: <span className="text-emerald-400">Desktop / Evening</span></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1015] border border-[#232733] space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Candidate Tower (Content)</span>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>Title Tokens: <span className="text-indigo-400">HLS / ABR / WebRTC</span></div>
                  <div>Freshness Half-Life: <span className="text-slate-200">7 Days Exp Decay</span></div>
                  <div>Channel Reputation: <span className="text-emerald-400">0.95 (Verified)</span></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1015] border border-[#232733] space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Scoring & Bandit Ranker</span>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>Cosine Similarity: <span className="text-indigo-400">0.942</span></div>
                  <div>Exploration Epsilon: <span className="text-slate-200">15% Diversity</span></div>
                  <div>Candidate Pool: <span className="text-emerald-400">Top 100 Retrieved</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Hyper-Scale Edge CDN Topology */}
          <div className="p-6 rounded-3xl bg-[#14161d] border border-cyan-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Global Edge CDN & Traffic Director</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Google Global Cache (GGC) software-defined equivalent: Multi-PoP SSD caching and WebRTC peer mesh offload.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Origin Offload:</span>
                <span className="text-cyan-400 font-bold">{edgeTelemetry.totalOriginBandwidthSavedPercent}% Saved</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLOBAL_EDGE_POPS.map((pop) => (
                <div key={pop.id} className="p-4 rounded-2xl bg-[#0e1015] border border-[#232733] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{pop.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-slate-400">{pop.city} ({pop.region})</div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <div>Latency: <span className="text-cyan-400 font-bold">{pop.avgLatencyMs}ms</span></div>
                    <div>Hit Ratio: <span className="text-emerald-400 font-bold">{(pop.cacheHitRatio * 100).toFixed(1)}%</span></div>
                    <div>P2P Mesh: <span className="text-indigo-400 font-bold">{(pop.p2pMeshOffloadRatio * 100).toFixed(1)}%</span></div>
                    <div>Egress: <span className="text-slate-200">{pop.activeEgressBandwidthGbps} Gbps</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Creator Studio Comments Management</h2>
          <div className="space-y-3">
            {studioComments.map((sc) => (
              <div key={sc.id} className="p-4 rounded-2xl bg-[#14161d] border border-[#232733] flex items-start gap-4">
                <img src={sc.avatar} alt={sc.author} className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{sc.author}</span>
                    <span className="text-[11px] text-slate-500">{sc.timestamp}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">on: {sc.videoTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300">{sc.text}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleHeartComment(sc.id)}
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        sc.hearted ? 'text-pink-500' : 'text-slate-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${sc.hearted ? 'fill-pink-500' : ''}`} />
                      <span>{sc.hearted ? 'Hearted' : 'Give Heart'}</span>
                    </button>
                    <button
                      onClick={() => handlePinComment(sc.id)}
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        sc.pinned ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{sc.pinned ? 'Pinned' : 'Pin to Top'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Live Content ID Scanner */}
      {activeTab === 'copyright' && (
        <div className="space-y-6">
          {/* Live Content ID Fingerprint Scanner */}
          <div className="p-6 rounded-3xl bg-[#14161d] border border-amber-500/30 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ScanLine className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Live Content ID Automated Fingerprinting Scanner</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Scans acoustic sub-band spectral peaks and visual dHash vectors against the registered reference catalog.
                </p>
              </div>

              <button
                onClick={handleRunContentIDScan}
                disabled={isScanningContentID}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-transform hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>{isScanningContentID ? 'Analyzing Spectrogram...' : 'Run Content ID Scan'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-300 shrink-0">Scan Target Video:</label>
              <select
                value={scanTargetVideo}
                onChange={(e) => setScanTargetVideo(e.target.value)}
                className="bg-[#0b0c10] border border-[#2e3444] rounded-xl px-4 py-2 text-xs text-white outline-none flex-1"
              >
                {videos.map((v) => (
                  <option key={v.id} value={v.title}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Scan Waveform Visualization */}
            {isScanningContentID && (
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-[#232733] space-y-3 animate-pulse">
                <span className="text-[11px] font-mono text-amber-400 block">
                  Computing 32-bit Chromaprint FFT hashes and perceptual frame gradients...
                </span>
                <div className="h-14 flex items-end gap-1.5">
                  {[45, 80, 60, 95, 30, 70, 85, 40, 90, 65, 50, 75, 88, 35, 92, 58].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-amber-500/80 rounded-t-sm transition-all duration-150"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Match Results Display */}
            {liveScanResults && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300">Scan Results:</h4>
                {liveScanResults.length > 0 ? (
                  liveScanResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#0e1015] border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Matched: {res.assetTitle}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Rightsholder: <span className="text-white">{res.owner}</span> • {res.matchedSegmentDetails}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                          Confidence: {Math.round(res.confidenceScore * 100)}%
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">
                          Policy: {res.policyApplied}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>No copyright infringements found. Video cleared for 100% creator monetization!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Existing Claims Registry */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Active Content ID Claims</h4>
            {copyrightClaims.map((claim) => (
              <div key={claim.id} className="p-5 rounded-2xl bg-[#14161d] border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-white">{claim.videoTitle}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Claimant: <span className="text-slate-200">{claim.claimant}</span> • Segment: <span className="font-mono text-indigo-400">{claim.timestampClaimed}</span>
                  </p>
                  <div className="text-[11px] text-amber-400 font-semibold">{claim.status} (Confidence: {claim.confidence})</div>
                </div>

                {!claim.disputed && (
                  <button
                    onClick={() => {
                      setActiveClaimId(claim.id);
                      setDisputeModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors"
                  >
                    File Dispute
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Community Posts */}
      {activeTab === 'community' && (
        <div className="space-y-6 max-w-2xl">
          <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-[#14161d] border border-[#232733] space-y-4">
            <h3 className="font-bold text-sm text-white">Publish Community Update or Poll</h3>
            <textarea
              rows={3}
              placeholder="What's happening? Share an update with your subscribers..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
            />
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold">Poll Options (Optional)</span>
              {pollOptionsInput.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptionsInput];
                    next[i] = e.target.value;
                    setPollOptionsInput(next);
                  }}
                  className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {communityPosts.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-[#14161d] border border-[#232733] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white">Channel Announcement</span>
                  <span>{p.publishedAt}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{p.content}</p>
                {p.pollOptions && p.pollOptions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {p.pollOptions.map((opt, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-[#0b0c10] border border-[#232733] flex justify-between text-xs">
                        <span className="text-slate-300">{opt.label}</span>
                        <span className="text-indigo-400 font-mono">{opt.votes} votes</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copyright Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">File Copyright Dispute</h3>
            <p className="text-xs text-slate-400">
              Provide justification (Fair Use, Public Domain, Licensed Rights):
            </p>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain why this claim is invalid..."
              className="w-full bg-[#0b0c10] border border-[#2e3444] rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
