'use client';

import React, { useState } from 'react';
import { Settings, User, Sliders, Shield, Bell, Moon, Play, Check } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'playback' | 'appearance' | 'privacy' | 'notifications'>('account');
  const [displayName, setDisplayName] = useState('Creator');
  const [handle, setHandle] = useState('creator');
  const [bio, setBio] = useState('High performance video engineering and streaming enthusiast.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [autoplay, setAutoplay] = useState(true);
  const [ambientMode, setAmbientMode] = useState(true);
  const [p2pEnabled, setP2pEnabled] = useState(true);
  const [highQuality, setHighQuality] = useState('auto');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const TABS = [
    { id: 'account', label: 'Account & Profile', icon: User },
    { id: 'playback', label: 'Playback & Streaming', icon: Play },
    { id: 'appearance', label: 'Appearance & UI', icon: Moon },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-[#232733] pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize playback preferences, profile details, and notifications
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Menu */}
        <div className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#181a24]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Form Body */}
        <div className="md:col-span-3 bg-[#14161d] border border-[#232733] rounded-3xl p-6 shadow-xl">
          {activeTab === 'account' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              <h2 className="text-lg font-bold text-white">Public Profile</h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center font-bold text-white text-xl">
                  {displayName[0]}
                </div>
                <div>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full bg-[#1f232e] hover:bg-[#282d3b] border border-[#2e3444] text-xs font-semibold text-white transition-colors"
                  >
                    Change Avatar
                  </button>
                  <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or WebP (Max 2MB)</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Handle URL</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-[#181a24] border border-r-0 border-[#232733] rounded-l-xl text-xs text-slate-500 font-mono">
                      vionex.tv/@
                    </span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 rounded-r-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#232733]">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Save Changes
                </button>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Preferences saved!
                  </span>
                )}
              </div>
            </form>
          )}

          {activeTab === 'playback' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-bold text-white">Playback & Performance</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181a24] border border-[#232733]">
                  <div>
                    <h3 className="font-semibold text-xs text-white">Autoplay Next Video</h3>
                    <p className="text-[11px] text-slate-400">Play the next recommended video automatically</p>
                  </div>
                  <button
                    onClick={() => setAutoplay(!autoplay)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      autoplay ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      autoplay ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181a24] border border-[#232733]">
                  <div>
                    <h3 className="font-semibold text-xs text-white">WebRTC P2P-Assisted Streaming</h3>
                    <p className="text-[11px] text-slate-400">Swarm video segments with nearby peers to lower latency and bandwidth</p>
                  </div>
                  <button
                    onClick={() => setP2pEnabled(!p2pEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      p2pEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      p2pEnabled ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-semibold text-slate-300">Default Streaming Quality</label>
                  <select
                    value={highQuality}
                    onChange={(e) => setHighQuality(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="auto">Auto (Adaptive Bitrate HLS)</option>
                    <option value="1080p">High (1080p Full HD)</option>
                    <option value="720p">Medium (720p HD)</option>
                    <option value="480p">Data Saver (480p)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-bold text-white">Appearance & Display</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181a24] border border-[#232733]">
                  <div>
                    <h3 className="font-semibold text-xs text-white">Ambient Glow Lighting</h3>
                    <p className="text-[11px] text-slate-400">Reflect video colors into the player surrounding background</p>
                  </div>
                  <button
                    onClick={() => setAmbientMode(!ambientMode)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      ambientMode ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      ambientMode ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b0c10] border border-[#232733] space-y-2">
                  <div className="text-xs font-semibold text-white">Active Theme: Cyber Dark (Default)</div>
                  <p className="text-[11px] text-slate-400">
                    VIONEX is built natively for OLED dark mode with reduced blue-light strain and tailored contrast.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-bold text-white">Privacy & Account Security</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert('Search history cleared!')}
                  className="w-full text-left p-3 rounded-2xl bg-[#181a24] hover:bg-[#202330] border border-[#232733] transition-colors"
                >
                  <div className="text-xs font-semibold text-white">Clear Search History</div>
                  <div className="text-[11px] text-slate-400">Delete all past search queries stored on this device</div>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Diagnostic cookies reset!')}
                  className="w-full text-left p-3 rounded-2xl bg-[#181a24] hover:bg-[#202330] border border-[#232733] transition-colors"
                >
                  <div className="text-xs font-semibold text-white">Reset Player Telemetry Cache</div>
                  <div className="text-[11px] text-slate-400">Clear anonymous buffer health diagnostic logs</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181a24] border border-[#232733]">
                  <div>
                    <h3 className="font-semibold text-xs text-white">Desktop Push Notifications</h3>
                    <p className="text-[11px] text-slate-400">Alert me when channels I follow go live</p>
                  </div>
                  <button
                    onClick={() => setDesktopNotifs(!desktopNotifs)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      desktopNotifs ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      desktopNotifs ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181a24] border border-[#232733]">
                  <div>
                    <h3 className="font-semibold text-xs text-white">Email Digest</h3>
                    <p className="text-[11px] text-slate-400">Weekly highlights from subscribed creators</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      emailNotifs ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      emailNotifs ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
