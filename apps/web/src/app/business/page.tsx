'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Phone,
  Globe,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface BusinessCatalogItem {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  sku: string;
}

interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  phone: string;
  isVerified: boolean;
  hours: string;
  catalog: BusinessCatalogItem[];
}

const BUSINESS_DATA: BusinessProfile[] = [
  {
    id: 'biz-vionex-gear',
    name: 'VIONEX Pro Creator Equipment Store',
    category: 'Camera Gear & Audio Tech',
    description: 'Official gear partner providing studio-grade cardioid microphones, broadcast capture cards, and high-bitrate streaming hardware.',
    website: 'https://store.vionex.com',
    phone: '+1 (800) 555-0199',
    isVerified: true,
    hours: 'Mon - Fri: 09:00 - 18:00 UTC (Fast Responses)',
    catalog: [
      {
        id: 'p-mic',
        title: 'VIONEX Studio Condenser Mic Pro (XLR/USB)',
        description: 'Ultra-low noise floor with integrated 24-bit/96kHz DAC and hardware limiter.',
        price: '$189.00',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300',
        sku: 'VNX-MIC-PRO'
      },
      {
        id: 'p-deck',
        title: 'VIONEX 12-Key Macro Stream Deck',
        description: 'Dynamic LCD tactile keys with native OBS, Fastify, and WebRTC integration.',
        price: '$149.00',
        imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=300',
        sku: 'VNX-DECK-12'
      }
    ]
  }
];

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(BUSINESS_DATA);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F] tracking-tight">Business Messaging</h1>
          <p className="text-xs text-[#606060] mt-1">
            Connect directly with verified creators, production houses, and official business accounts.
          </p>
        </div>

        <Link
          href="/messages"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open Customer Inbox</span>
        </Link>
      </div>

      <div className="space-y-8">
        {businesses.map(b => (
          <div key={b.id} className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-[#F2F2F2]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#0F0F0F]">{b.name}</h2>
                  <CheckCircle2 className="w-4 h-4 text-[#065FD4] fill-current text-white" />
                </div>
                <span className="text-xs font-semibold text-[#065FD4]">{b.category}</span>
                <p className="text-xs text-[#606060] mt-2 max-w-xl leading-relaxed">{b.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#606060]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{b.hours}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{b.website}</span>
                  </span>
                </div>
              </div>

              <Link
                href="/messages"
                className="px-5 py-2.5 rounded-full bg-[#065FD4] hover:bg-[#004BB5] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Business</span>
              </Link>
            </div>

            {/* Catalog Shelf */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-[#0F0F0F]" />
                <h3 className="text-sm font-bold text-[#0F0F0F]">Product Catalog</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {b.catalog.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-[#E5E5E5] bg-neutral-50 hover:border-neutral-400 transition-colors">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-lg object-cover bg-white border border-neutral-200" />
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-xs font-bold text-[#0F0F0F] line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-[#606060] line-clamp-2 mt-0.5">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#0F0F0F] font-mono">{item.price}</span>
                        <Link
                          href="/messages"
                          className="text-[11px] font-bold text-[#065FD4] hover:underline"
                        >
                          Inquire in Chat
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
