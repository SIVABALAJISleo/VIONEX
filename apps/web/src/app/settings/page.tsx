'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, Play, Shield, Globe, Check } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'playback' | 'privacy'>('account');
  const [saved, setSaved] = useState(false);

  // Settings State
  const [ambientLight, setAmbientLight] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[85vh] space-y-6">
      <div className="pb-3 border-b border-[#E5E5E5]">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0F0F0F]" />
          Settings
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Navigation */}
        <aside className="w-full md:w-56 space-y-1 shrink-0">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'playback', label: 'Playback & performance', icon: Play },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy', icon: Shield }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
                    : 'text-[#606060] hover:bg-[#F9F9F9] hover:text-[#0F0F0F]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Settings Cards */}
        <main className="flex-1 bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-6 space-y-6 text-xs text-[#0F0F0F]">
          {activeTab === 'account' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">Your Account</h2>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm">VIONEX Engineering</h3>
                  <p className="text-[#606060]">vionex-labs@vionex.local</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="font-bold block mb-1">Display Name</label>
                  <input
                    type="text"
                    defaultValue="VIONEX Engineering"
                    className="w-full max-w-md p-2 rounded-xl border border-[#CCCCCC] bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Channel Handle</label>
                  <input
                    type="text"
                    defaultValue="@vionex-labs"
                    className="w-full max-w-md p-2 rounded-xl border border-[#CCCCCC] bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playback' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">Playback Settings</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E5E5] cursor-pointer">
                  <div>
                    <p className="font-bold">Ambient mode</p>
                    <p className="text-[#606060]">Gently casts colors from the video into the background.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={ambientLight}
                    onChange={(e) => setAmbientLight(e.target.checked)}
                    className="accent-[#065FD4] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E5E5] cursor-pointer">
                  <div>
                    <p className="font-bold">Autoplay next video</p>
                    <p className="text-[#606060]">When you finish a video, another plays automatically.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="accent-[#065FD4] w-4 h-4"
                  />
                </label>

                <div className="p-3 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                  <p className="font-bold">Default video quality</p>
                  <select
                    value={defaultQuality}
                    onChange={(e) => setDefaultQuality(e.target.value)}
                    className="p-2 rounded-lg border border-[#CCCCCC] bg-white outline-none text-xs"
                  >
                    <option value="Auto">Auto (recommended)</option>
                    <option value="1080p">High definition (1080p)</option>
                    <option value="720p">Standard (720p)</option>
                    <option value="480p">Data saver (480p)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">Notification Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E5E5] cursor-pointer">
                  <div>
                    <p className="font-bold">Desktop notifications</p>
                    <p className="text-[#606060]">Get alerts on your device when subscribed channels upload.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopNotifs}
                    onChange={(e) => setDesktopNotifs(e.target.checked)}
                    className="accent-[#065FD4] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E5E5] cursor-pointer">
                  <div>
                    <p className="font-bold">Email activity updates</p>
                    <p className="text-[#606060]">Receive summary digests of comments and channel stats.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="accent-[#065FD4] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">Privacy & Data</h2>
              <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                <p className="font-bold">Subscriptions & Playlists</p>
                <p className="text-[#606060]">Keep all my saved playlists private.</p>
                <p className="text-[#606060]">Keep all my subscriptions private.</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#065FD4] hover:bg-[#0551B5] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
