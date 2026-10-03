# VIONEX Video Platform

> An original, production-ready, self-hostable, YouTube-equivalent video streaming, sharing, creator studio, and community platform built by synthesizing the strongest capabilities of modern open-source media engineering.

---

## 1. Key Platform Capabilities

- **Adaptive Bitrate Streaming:** FFmpeg-powered aligned keyframe transcoding producing multi-rendition HLS (240p to 4K) with zero playback stutter.
- **Resumable Uploads:** Chunked direct-to-storage multipart ingestion resilient to network drops.
- **Browser-Assisted P2P:** Optional WebRTC datachannel peer swarming with automatic CDN origin fallback circuit breaker.
- **Creator Studio:** Real-time analytics, retention curves, multi-step upload wizard, interactive chapter marking, and subtitle editors.
- **Shorts Vertical Feed:** Dedicated 9:16 mobile-friendly snap-scrolling video experience with pre-buffering.
- **Live Streaming:** RTMP ingest to low-latency HLS with real-time WebSocket live chat and automatic VOD replay archiving.
- **Explainable Recommendations:** Two-tower candidate generation combining collaborative signals, creator affinity, and freshness decay.
- **Lawful Copyright Management:** Chromaprint audio fingerprinting and perceptual visual hashing with human-in-the-loop triage.
- **Provider-Agnostic Monetization:** Immutable double-entry ledger supporting channel memberships, pay-per-view, tips, and VAST ads.
- **Tri-Mode Deployment:** Runs with $0/month infrastructure bill on free-tier compute or scales horizontally to multi-region cloud.

---

## 2. Quickstart (Local Development)

### Prerequisites
- Node.js 22 LTS
- Docker & Docker Compose
- FFmpeg (optional for local non-container transcoding)

### Commands
```bash
# 1. Clone & install dependencies
git clone https://github.com/vionex/vionex.git
cd vionex
npm install

# 2. Start PostgreSQL and Redis infrastructure
docker-compose up -d postgres redis

# 3. Generate Database Client & Run Migrations
npm run prisma:generate -w @vionex/database
npm run prisma:migrate -w @vionex/database

# 4. Start API Server, Media Worker, and Next.js Frontend
npm run dev
```

Visit `http://localhost:3000` to open the platform!
