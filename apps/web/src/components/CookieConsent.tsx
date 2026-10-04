'use client';

import React, { useState, useEffect } from 'react';
import { privacyManager, ConsentPreferences } from '../lib/privacy';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    const current = privacyManager.loadPreferences();
    setPreferences(current);
    if (!privacyManager.hasConsentBeenDetermined()) {
      // Delay presentation slightly for smooth UX
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const updated = privacyManager.acceptAll();
    setPreferences(updated);
    setVisible(false);
  };

  const handleRejectAll = () => {
    const updated = privacyManager.rejectAll();
    setPreferences(updated);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-[#CCCCCC] rounded-2xl shadow-2xl p-5 text-[#0F0F0F]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#FF0000]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0F0F0F]">Before you continue to VIONEX</h3>
              <span className="text-[11px] font-medium text-[#008000] bg-[#E8F5E9] px-2 py-0.5 rounded-full inline-block mt-0.5">
                Zero-Tracking Active
              </span>
            </div>
          </div>
          <button
            onClick={handleRejectAll}
            className="text-[#606060] hover:text-[#0F0F0F] p-1 rounded-full hover:bg-[#F2F2F2] transition-colors"
            title="Dismiss with Zero-Tracking"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#606060] leading-relaxed mb-4">
          VIONEX uses strictly necessary cookies to keep the service secure and deliver video content via our decentralized Edge CDN. Non-essential tracking cookies remain completely disabled until you grant consent.
        </p>

        <div className="flex items-center gap-2 pt-1 border-t border-[#F2F2F2]">
          <button
            onClick={handleRejectAll}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-full border border-[#CCCCCC] hover:bg-[#F2F2F2] text-[#0F0F0F] transition-colors"
          >
            Reject non-essential
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-full bg-[#0F0F0F] hover:bg-[#272727] text-white transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
