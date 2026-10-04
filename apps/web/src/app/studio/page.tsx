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
  HelpCircle,
  Download,
  FileText,
  ShieldCheck,
  Archive,
  RefreshCw
} from 'lucide-react';
import { getStoredVideos, saveCustomVideo, deleteVideo, VideoItem } from '@/lib/data';
import { ContentIDEngine, ContentIDMatchResult } from '@/lib/content-id';
import { GLOBAL_EDGE_POPS, GlobalEdgeDirector } from '@/lib/edge-cdn';
import { TwoTowerEngine, UserContext } from '@/lib/two-tower';
import { generateChannelExportArchive, downloadChannelExport } from '@/lib/creator-export';
import { configureLiveChatReplayArchive, LiveChatReplayArchiveConfig } from '@/lib/live';
import { generateTaxComplianceReport, processMockBillingTransaction, TaxComplianceReport } from '@/lib/monetization-compliance';

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'upload' | 'analytics' | 'two-tower' | 'comments' | 'copyright' | 'monetization' | 'customization'>('content');
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

  // Chat Replay Config State (CREAT-059)
  const [chatReplayConfig, setChatReplayConfig] = useState<LiveChatReplayArchiveConfig>(
    configureLiveChatReplayArchive({ channelId: 'vionex-labs' })
  );

  // Monetization Tax Report State (MONET-029)
  const [taxReport, setTaxReport] = useState<TaxComplianceReport>(
    generateTaxComplianceReport('vionex-labs', 2025)
  );
  const [testBillingStatus, setTestBillingStatus] = useState<string | null>(null);

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

  const handleTakeoutExport = () => {
    const bundle = generateChannelExportArchive('vionex-labs', 'VIONEX Engineering');
    downloadChannelExport(bundle);
  };

  const handleRunZeroFeeBillingTest = () => {
    const testResult = processMockBillingTransaction(49.99, 'Channel Membership Sandbox Renewal');
    setTestBillingStatus(`Success: Processed ${testResult.receiptNumber} with $0.00 fee (Test Mode Active).`);
    setTimeout(() => setTestBillingStatus(null), 5000);
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
            { id: 'monetization', label: 'Monetization & Taxes', icon: DollarSign },
            { id: 'comments', label: 'Comments & Community', icon: MessageSquare },
            { id: 'customization', label: 'Customization & Takeout', icon: Sliders }
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
              {activeTab === 'monetization' && 'Monetization & Financial Tax Compliance'}
              {activeTab === 'comments' && 'Channel Comments'}
              {activeTab === 'customization' && 'Channel Customization & Takeout Backup'}
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
                            className="w-20 aspect-video rounded-lg object-cover border border-[#E5E5E5]"
                          />
                          <div>
                            <span className="font-semibold block truncate max-w-xs">{v.title}</span>
                            <span className="text-[11px] text-[#606060]">{v.category}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F5E9] text-[#137333]">
                            Public
                          </span>
                        </td>
                        <td className="p-3.5 text-[#606060]">{v.publishedAt}</td>
                        <td className="p-3.5 font-medium">{v.viewsCount}</td>
                        <td className="p-3.5 font-medium">{v.likesCount}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteVideo(v.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#606060] hover:text-[#FF0000] transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-4">
            <h2 className="text-base font-bold text-[#0F0F0F]">Upload New Video</h2>
            {uploadStep === 1 && (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F0F0F] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#0F0F0F] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F0F0F] mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={videoDesc}
                    onChange={(e) => setVideoDesc(e.target.value)}
                    placeholder="Tell viewers about your video"
                    className="w-full p-2.5 rounded-xl border border-[#CCCCCC] focus:border-[#0F0F0F] text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F0F0F] mb-1">Category</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CCCCCC] text-xs outline-none bg-white"
                    >
                      <option>Technology</option>
                      <option>Engineering</option>
                      <option>Gaming</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F0F0F] mb-1">Visibility</label>
                    <select
                      value={videoVisibility}
                      onChange={(e) => setVideoVisibility(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CCCCCC] text-xs outline-none bg-white"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="UNLISTED">Unlisted</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Upload & Transcode
                </button>
              </form>
            )}

            {uploadStep === 2 && (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#065FD4] flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-[#0F0F0F]">{encodingStatus}</h3>
                <div className="w-full bg-[#E5E5E5] rounded-full h-2 overflow-hidden max-w-sm mx-auto">
                  <div className="bg-[#065FD4] h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-xs text-[#606060] font-mono">{uploadProgress}% Complete</span>
              </div>
            )}

            {uploadStep === 3 && (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#137333] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-[#0F0F0F]">Your video is now published!</h3>
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/watch/${publishedVideoId}`}
                    className="px-4 py-2 bg-[#0F0F0F] text-white text-xs font-semibold rounded-full hover:bg-[#272727]"
                  >
                    View Video
                  </Link>
                  <button
                    onClick={() => {
                      setUploadStep(1);
                      setVideoTitle('');
                      setVideoDesc('');
                    }}
                    className="px-4 py-2 border border-[#CCCCCC] text-xs font-semibold rounded-full hover:bg-[#F2F2F2]"
                  >
                    Upload Another
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
                { title: 'Views', value: '425.8K', change: '+18.4% vs last 28 days' },
                { title: 'Watch time (hours)', value: '38.4K', change: '+22.1% vs last 28 days' },
                { title: 'Subscribers', value: '+3.2K', change: '+12.0% vs last 28 days' },
                { title: 'Estimated Revenue', value: '$4,820.50', change: '+15.8% vs last 28 days' }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm space-y-1">
                  <div className="text-xs text-[#606060]">{card.title}</div>
                  <div className="text-2xl font-bold text-[#0F0F0F]">{card.value}</div>
                  <div className="text-[11px] text-[#137333] font-semibold">{card.change}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COPYRIGHT & CONTENT ID TAB */}
        {activeTab === 'copyright' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0F0F0F]">Live Content ID Automated Fingerprinting Scanner</h3>
                <p className="text-xs text-[#606060] mt-0.5">
                  Sliding-window acoustic sub-band fingerprint matching and visual perceptual dHash correlation.
                </p>
              </div>
              <button
                onClick={handleRunContentIDScan}
                disabled={isScanningContentID}
                className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isScanningContentID ? 'Scanning Waveforms...' : 'Run Content ID Scan'}
              </button>
            </div>

            {liveScanResults && (
              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-xs text-[#0F0F0F]">Fingerprint Matching Results</h4>
                {liveScanResults.map((r) => (
                  <div key={r.matchId} className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0F0F0F]">{r.assetTitle}</span>
                      <span className="text-[#606060] block">Owner: {r.owner} • Match Confidence: {(r.confidenceScore * 100).toFixed(1)}%</span>
                      <span className="text-[#606060] block text-[11px]">Segment: {r.matchedSegmentDetails}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-[#FEF7E0] text-[#B06000]">
                        Policy: {r.policyApplied}
                      </span>
                      <button
                        onClick={() => alert(`Copyright Dispute filed for ${r.assetTitle}. Status escalated to manual review.`)}
                        className="px-3 py-1 rounded-full border border-[#CCCCCC] hover:bg-white text-xs font-semibold text-[#0F0F0F]"
                      >
                        File Copyright Dispute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TWO-TOWER AI & GLOBAL EDGE CDN TAB */}
        {activeTab === 'two-tower' && (
          <div className="space-y-6">
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

        {/* 6. MONETIZATION & TAX COMPLIANCE TAB (MONET-029, MONET-030) */}
        {activeTab === 'monetization' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#107C41]" />
                    Financial & Tax Compliance Reports (IRS Form 1099 / EU VAT)
                  </h3>
                  <p className="text-xs text-[#606060] mt-0.5">
                    Official tax year {taxReport.taxYear} revenue ledger reconciliation and withholding statement.
                  </p>
                </div>
                <button
                  onClick={() => alert(`Tax Statement ${taxReport.reportId} exported as CSV/PDF.`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#CCCCCC] hover:bg-[#F2F2F2] text-xs font-semibold text-[#0F0F0F]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Tax Audit Statement</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] text-xs">
                  <div className="text-[#606060]">Total Gross Platform Earnings</div>
                  <div className="text-xl font-bold text-[#0F0F0F] mt-1">${taxReport.totalGrossEarningsUSD.toLocaleString()} USD</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] text-xs">
                  <div className="text-[#606060]">Net Creator Payout</div>
                  <div className="text-xl font-bold text-[#107C41] mt-1">${taxReport.totalCreatorNetUSD.toLocaleString()} USD</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] text-xs">
                  <div className="text-[#606060]">IRS 1099-NEC Eligibility</div>
                  <div className="text-xl font-bold text-[#065FD4] mt-1">Eligible (Over $600)</div>
                </div>
              </div>

              {/* Revenue Ledger Table */}
              <div className="overflow-x-auto border border-[#E5E5E5] rounded-xl mt-4">
                <table className="w-full text-left text-xs text-[#0F0F0F]">
                  <thead className="bg-[#F9F9F9] text-[#606060] font-semibold border-b border-[#E5E5E5]">
                    <tr>
                      <th className="p-3">Revenue Stream</th>
                      <th className="p-3">Gross Amount</th>
                      <th className="p-3">Creator Share</th>
                      <th className="p-3">Split Ratio</th>
                      <th className="p-3">Accounting Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {taxReport.ledger.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F9F9F9]">
                        <td className="p-3 font-semibold">{item.source}</td>
                        <td className="p-3">${item.grossAmountUSD.toFixed(2)}</td>
                        <td className="p-3 text-[#107C41] font-bold">${item.creatorShareUSD.toFixed(2)}</td>
                        <td className="p-3 font-mono">{item.splitRatio}</td>
                        <td className="p-3 text-[#137333]">Audited & Settled</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zero-Fee Automated Billing Test Mode (MONET-030) */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#065FD4]" />
                    Zero-Transaction-Fee Local Test Mode for Billing Integrations
                  </h3>
                  <p className="text-xs text-[#606060] mt-0.5">
                    Execute simulated atomic transactions (Memberships, Super Thanks) with $0.00 platform fees for CI/CD test automation.
                  </p>
                </div>
                <button
                  onClick={handleRunZeroFeeBillingTest}
                  className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-white text-xs font-semibold transition-all"
                >
                  Run Zero-Fee Test Transaction
                </button>
              </div>

              {testBillingStatus && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-[#137333] font-semibold animate-in fade-in">
                  {testBillingStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. COMMENTS TAB */}
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

        {/* 8. CUSTOMIZATION & TAKEOUT TAB (CREAT-059, CREAT-060) */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            {/* Takeout Export Archive (CREAT-060) */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                    <Archive className="w-5 h-5 text-[#065FD4]" />
                    Channel Takeout Backup & Export Archive
                  </h3>
                  <p className="text-xs text-[#606060] mt-0.5">
                    Download complete snapshot of your channel metadata, videos catalog, community polls, and analytics history.
                  </p>
                </div>
                <button
                  onClick={handleTakeoutExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Channel Backup Archive (JSON)</span>
                </button>
              </div>
            </div>

            {/* Live Chat Replay Archive Configuration (CREAT-059) */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-base text-[#0F0F0F]">Live Chat Replay Archive Configuration</h3>
              <p className="text-xs text-[#606060]">
                Configure how live chat messages are preserved and synchronized with post-broadcast VOD recordings.
              </p>
              <div className="space-y-3 max-w-md pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chatReplayConfig.enableChatReplay}
                    onChange={(e) => setChatReplayConfig({ ...chatReplayConfig, enableChatReplay: e.target.checked })}
                    className="w-4 h-4 rounded text-[#065FD4]"
                  />
                  <span className="font-semibold text-[#0F0F0F]">Enable Live Chat Replay on VOD</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chatReplayConfig.syncWithVodTimestamp}
                    onChange={(e) => setChatReplayConfig({ ...chatReplayConfig, syncWithVodTimestamp: e.target.checked })}
                    className="w-4 h-4 rounded text-[#065FD4]"
                  />
                  <span className="font-semibold text-[#0F0F0F]">Synchronize chat messages with video timestamps</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chatReplayConfig.anonymizeModeratedMessages}
                    onChange={(e) => setChatReplayConfig({ ...chatReplayConfig, anonymizeModeratedMessages: e.target.checked })}
                    className="w-4 h-4 rounded text-[#065FD4]"
                  />
                  <span className="font-semibold text-[#0F0F0F]">Exclude removed/moderated messages from archive</span>
                </label>
              </div>
            </div>

            {/* Basic Customization */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-base text-[#0F0F0F]">Channel Profile Settings</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="font-bold text-[#0F0F0F] block mb-1">Channel Name</label>
                  <input
                    type="text"
                    defaultValue="VIONEX Engineering"
                    className="p-2.5 rounded-xl border border-[#CCCCCC] w-full outline-none text-[#0F0F0F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F0F0F] block mb-1">Handle</label>
                  <input
                    type="text"
                    defaultValue="@vionex-labs"
                    className="p-2.5 rounded-xl border border-[#CCCCCC] w-full outline-none text-[#0F0F0F]"
                  />
                </div>
                <button
                  onClick={() => alert('Channel settings updated.')}
                  className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
