'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle, BarChart3, Video, DollarSign, Layers } from 'lucide-react';

export default function CreatorStudioPage() {
  const [uploadStep, setUploadStep] = useState(1);
  const [videoTitle, setVideoTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadStep(2);
      }
    }, 400);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Studio</h1>
          <p className="text-xs text-slate-400">Manage videos, examine analytics, and monetize content</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Channel Standing: Good
          </span>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Views (Last 28 Days)</span>
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
          <div className="text-xs text-emerald-400 font-semibold">RPM: $3.98</div>
        </div>
      </div>

      {/* Multi-Step Video Upload Wizard */}
      <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Upload New Video</h2>

        {uploadStep === 1 && (
          <div className="border-2 border-dashed border-[#2e3444] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-500 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Drag and drop video files to upload</p>
              <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MKV, MOV (Up to 10GB)</p>
            </div>
            {isUploading ? (
              <div className="w-64 space-y-2">
                <div className="w-full bg-[#1f232e] h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-xs font-semibold text-indigo-400">Uploading: {uploadProgress}%</span>
              </div>
            ) : (
              <button
                onClick={simulateUpload}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                Select File
              </button>
            )}
          </div>
        )}

        {uploadStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Video Title</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full h-11 px-4 bg-[#0b0c10] border border-[#232733] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your video, add timestamps and links..."
                className="w-full p-4 bg-[#0b0c10] border border-[#232733] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#232733]">
              <button
                onClick={() => setUploadStep(1)}
                className="px-5 py-2 rounded-full border border-[#2e3444] text-xs font-semibold text-slate-300 hover:bg-[#1f232e]"
              >
                Back
              </button>
              <button
                onClick={() => setUploadStep(3)}
                className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
              >
                Publish Video
              </button>
            </div>
          </div>
        )}

        {uploadStep === 3 && (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Video Published Successfully!</h3>
            <p className="text-xs text-slate-400">
              Your video is now live on VIONEX and available across all adaptive bitrate resolutions.
            </p>
            <button
              onClick={() => {
                setUploadStep(1);
                setVideoTitle('');
              }}
              className="mt-4 px-6 py-2 rounded-full bg-[#1f232e] hover:bg-[#282d3b] text-xs font-semibold text-white border border-[#2e3444]"
            >
              Upload Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
