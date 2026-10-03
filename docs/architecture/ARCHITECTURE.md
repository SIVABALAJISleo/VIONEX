# VIONEX System Architecture & Technical Specification

**System Name:** VIONEX Video Platform  
**Target Parity:** 90–95% User-Facing YouTube-Equivalent Capability  
**Architecture Style:** Modular Monolith API with Decoupled Asynchronous Workers  
**Language & Runtime:** TypeScript / Node.js 22 LTS (Backend & Workers), Next.js 15 / React 19 (Frontend)  
**Database & Queues:** PostgreSQL 16, Redis 7, BullMQ  
**Media Pipeline:** FFmpeg 6.1/7.x, HLS.js, WebRTC Datachannels, Chromaprint

---

## 1. High-Level Architecture Overview

VIONEX is architected to eliminate the primary failure modes discovered across legacy and modern video platforms:
1. **No Monolithic Synchronous Transcoding:** Video uploads never process synchronously inside the HTTP web request. All encoding, probing, fingerprinting, and transcription jobs execute on asynchronous worker queues with strict resource boundaries.
2. **Universal Storage Abstraction:** Storage operations run through a provider interface supporting both zero-cost local directory layouts (for low-spec VPS/self-hosting) and enterprise S3/Cloudflare R2/OCI object storage without requiring code changes.
3. **Decoupled Playback Delivery:** Master manifests (`master.m3u8`) and rendition playlists (`720p.m3u8`) enforce short TTLs and signed HMAC playback tokens, while media segments (`seg_001.m4s` / `.ts`) are immutable and cached forever at the edge or exchanged over WebRTC P2P swarms.
4. **Resilient Data Architecture:** Single source of truth in normalized PostgreSQL with foreign key constraints, check constraints, and indexed queries. Real-time telemetry (views, likes, chat) routes through Redis buffers before atomic batch aggregation.

```
                      +---------------------------------------+
                      |   Client Application (Next.js 15)     |
                      |  React 19 / Tailwind / HLS.js / P2P   |
                      +-------------------+-------------------+
                                          |
                      +-------------------+-------------------+
                      |      NGINX Reverse Proxy / CDN        |
                      +---------+-------------------+---------+
                                |                   |
                 [HTTP / WebSocket API]      [Static / HLS Playback]
                                |                   |
          +---------------------+----+     +--------+------------------+
          |   VIONEX API Core        |     |  StorageProvider Engine   |
          |   (Fastify / TypeScript) |     |  Local Disk / S3 / R2     |
          +-------------+------------+     +---------------------------+
                        |
       +----------------+----------------+
       |                                 |
+------+------+                   +------+------+
| PostgreSQL  | (ACID Relational) | Redis 7     | (Pub/Sub, Rate Limits,
| 16 Database |                   | & BullMQ    |  Telemetry Buffers)
+-------------+                   +------+------+
                                         |
               +-------------------------+-------------------------+
               |                         |                         |
        +------+------+           +------+------+           +------+------+
        | Media Worker|           | Live Worker |           | Fingerprint |
        | (FFmpeg ABR)|           | (RTMP/HLS)  |           | & AI Worker |
        +-------------+           +-------------+           +-------------+
```

---

## 2. Monorepo Organization & Service Boundaries

VIONEX is structured as an npm/pnpm workspace monorepo:

```
VIONEX/
├── apps/
│   ├── api/                 # Fastify REST & WebSocket API Server
│   └── web/                 # Next.js 15 App Router Frontend & Creator Studio
├── services/
│   ├── media-worker/        # Transcoding, HLS packaging, sprites, thumbnails
│   ├── live-worker/         # RTMP ingest, low-latency HLS packager, live chat
│   ├── recommendation-worker/# Candidate generation, trending, personalization
│   ├── transcription-worker/# Whisper-compatible speech-to-text subtitle worker
│   ├── fingerprint-worker/  # Audio Chromaprint & perceptual hash copyright engine
│   └── notification-worker/ # Real-time event bus, web push, email dispatch
├── packages/
│   ├── shared-types/        # Shared TypeScript interfaces, enums, DTOs
│   ├── validation/          # Zod schemas for all requests, events, and forms
│   ├── database/            # Prisma schema, client, migrations, seed data
│   ├── media/               # FFmpeg profiles, ABR ladders, HLS manifest generators
│   ├── auth/                # Argon2id hashing, JWT rotation, session management
│   ├── storage/             # Universal StorageProvider (Local, S3, R2, OCI)
│   ├── player/              # Player configuration, shortcuts, QoE telemetry
│   ├── recommendations/     # Two-tower candidate generation algorithms
│   ├── moderation/          # Report triage, strike engine, policy rules
│   ├── analytics/           # View deduplication, watch time aggregator
│   ├── payments/            # Double-entry ledger, webhook signatures, wallets
│   ├── feature-flags/       # Runtime feature toggles (P2P, live, monetization)
│   └── observability/       # Structured logger, metrics, health checks
├── infra/
│   ├── docker/              # Dockerfile.api, Dockerfile.web, Dockerfile.worker
│   ├── nginx/               # Production NGINX reverse proxy configuration
│   ├── free/                # Zero-cost deployment guide & Compose profile
│   └── scale/               # Multi-node Kubernetes / AWS / OCI scale profile
└── docs/
    ├── architecture/        # Architecture diagrams, specifications, data flows
    ├── decisions/           # ADR-001 through ADR-012
    ├── parity/              # Feature matrix, audit reports, history
    └── security/            # Threat models, audit reports, SBOM
```

---

## 3. End-to-End Media Ingestion & Processing Pipeline

The VIONEX media lifecycle guarantees zero server memory bloat and total failure recovery:

1. **Session Initiation:** Client requests upload session via `POST /api/v1/uploads/session` with title, filesize, and MIME type. API verifies per-user storage quota and returns `uploadId` and chunk configuration.
2. **Chunked Direct Transfer:** Client chunks the media file (5MB–20MB chunks) and uploads parts. For S3/R2, chunks upload directly via presigned URLs. For local hosting, chunks stream to a temporary quarantine directory (`/tmp/vionex-quarantine/{uploadId}`).
3. **Completion & Magic Byte Verification:** Client signals `POST /api/v1/uploads/:id/complete`. The API combines parts, validates ISO base media box headers (magic bytes), runs `ffprobe` to verify audio/video streams, dimensions, and duration, and moves the asset to `VALIDATED`.
4. **Asynchronous Job Dispatch:** API enqueues a `TRANSCODE_VIDEO` job onto BullMQ with priority based on account tier and video length.
5. **Resource-Aware Transcoding:** `media-worker` picks up the job. The `ResourceGovernor` verifies available host memory:
   - If memory is constrained (< 1GB free), only 360p and 720p renditions are generated immediately; 1080p is deferred.
   - FFmpeg runs with strictly aligned keyframe intervals (`-g 60 -keyint_min 60 -sc_threshold 0`) producing fragmented MP4/HLS segments.
6. **Auxiliary Asset Generation:**
   - Thumbnails: 3 automated candidate thumbnails extracted at 10%, 50%, and 80% duration.
   - Timeline Preview Sprites: Generates WebP thumbnail sheet + `sprites.vtt` for hover scrubbing.
   - Audio Fingerprint: Audio track extracted and processed via Chromaprint (`fpcalc`) to query copyright reference registry.
   - Whisper Subtitles: Audio enqueued to `transcription-worker` to generate multi-language WebVTT files.
7. **Final Assembly & Publication:** Manifests (`master.m3u8` and resolution playlists) are assembled and synced to persistent storage. Database state transitions to `READY` (or `PUBLISHED` if scheduled publication time has passed). Creator receives in-app and email notification.

---

## 4. Playback, Delivery & P2P Mesh Architecture

VIONEX achieves minimal egress bandwidth through layered caching and optional peer delivery:

1. **Request Authorization:** Viewer requests watch page `/watch/:id`. API verifies viewer permissions (public, unlisted, members-only, private). If authorized, returns an expiring signed playback URL containing HMAC token: `https://origin.vionex.tv/hls/:videoId/master.m3u8?token=...&exp=...`.
2. **Adaptive Bitrate Switching:** The player initializes HLS.js. HLS.js probes initial bandwidth and selects the optimal start rendition (e.g. 720p). If buffer drops below 3 seconds, player shifts down to 480p/360p without interrupting playback.
3. **WebRTC P2P Swarming (Optional):**
   - If enabled in instance settings and client preferences, the player connects to the lightweight VIONEX WebSocket tracker.
   - Peers watching the same video segment exchange `.m4s` chunks over WebRTC datachannels.
   - **Circuit Breaker:** If a peer fails to deliver a chunk within 1.5x segment duration, the player instantly requests the chunk from the origin server, ensuring 0% playback stall.
4. **Deduplicated View Telemetry:**
   - As playback progresses, the player sends lightweight heartbeat beacons every 15 seconds to `/api/v1/analytics/telemetry`.
   - The API verifies continuous playback. Once 30 seconds of cumulative watch time is confirmed for a unique `(videoId, viewerSessionHash, dateBucket)`, a verified view event is queued. Views are batched and flushed to PostgreSQL every 60 seconds.

---

## 5. Security & Authentication Architecture

- **Password Storage:** Argon2id with 64MB memory cost, 3 iterations, and 4 parallelism lanes.
- **Session Tokens:** Stateless 15-minute access JWTs paired with 7-day rotating refresh tokens stored in HTTP-Only, Secure, SameSite=Strict cookies.
- **Device Sessions:** Each login generates a `user_session` record tracking IP address, user-agent, operating system, and last active timestamp. Users can inspect and revoke any session remotely.
- **Authorization Engine:** Centralized policy checker (`canViewVideo`, `canManageChannel`, `canComment`, `canModerate`) enforced at the API route handler before database execution.
- **Media Subprocess Sandbox:** All FFmpeg and ffprobe calls pass sanitized arguments via array parameters (`execFile`) with `shell: false`, maximum execution timeouts, and dedicated non-root execution users.
