# VIONEX Feature Source Map & Capability Lineage

**Project:** VIONEX Video Platform  
**Document Status:** Approved Baseline Specification  
**Classification:** Research Artifact — Architecture Mapping

---

## 1. Lineage Taxonomy

Every platform capability in VIONEX is traced to its technical inspiration, categorized by:
- `SOURCE_AVIDEO`: Inspired by AVideo's platform breadth / live streaming / embed model.
- `SOURCE_PEERTUBE`: Inspired by PeerTube's TypeScript architecture / HLS transcoding profiles / WebRTC P2P / federation abstraction.
- `SOURCE_PLAYTUBE`: Inspired by PlayTube's Shorts vertical feed / creator wallet / community posts / consumer interaction UX.
- `SOURCE_MEDIACMS`: Inspired by MediaCMS's media state machine / chapter engine / in-browser trim / Whisper transcription.
- `SOURCE_MYTUBE`: Inspired by MyTube's direct presigned multipart uploads / event-driven decoupled workers / CDN caching strategy / deduplicated view counting.
- `NEW_IMPLEMENTATION`: Wholly original VIONEX architecture (ResourceGovernor, Tri-Mode deployment, Chromaprint copyright match engine, Argon2id auth with device session revocation, hybrid candidate recommendation ranking).
- `MULTIPLE_SOURCES`: Hybrid pattern synthesizing the best concepts from multiple projects.

---

## 2. Comprehensive Capability Mapping

### A. Media Ingestion & Uploads
1. **Resumable Chunked Multipart Upload** -> `MULTIPLE_SOURCES` (PeerTube + MyTube + MediaCMS)  
   *Pattern:* Two-phase session creation (`/api/v1/uploads/session`), presigned chunk allocation, client-side parallel PUT with checksum verification, server-side assembly or S3 multipart completion.
2. **Pre-upload Quarantine & Magic Byte Sniffing** -> `NEW_IMPLEMENTATION`  
   *Pattern:* Inspects file headers for valid MP4/MKV/WebM ISO base media box signatures before passing to FFmpeg; prevents MIME spoofing, polyglots, and decompression bombs.
3. **Upload Progress & Network Resumption** -> `SOURCE_MYTUBE`  
   *Pattern:* Client stores upload session UUID in local storage; on network interrupt, client queries `/api/v1/uploads/:id/status` to determine received bytes and resume without restarting.

### B. Media Processing & Adaptive Bitrate
4. **Finite Media State Machine** -> `SOURCE_MEDIACMS`  
   *Pattern:* States: `CREATED -> UPLOADING -> UPLOADED -> VALIDATING -> QUARANTINED -> TRANSCODING -> PACKAGING -> READY -> PUBLISHED -> FAILED`. Persisted in database with retry counter.
5. **Aligned Keyframe Transcoding Ladder** -> `SOURCE_PEERTUBE`  
   *Pattern:* FFmpeg `-g 60 -keyint_min 60 -sc_threshold 0` producing aligned HLS renditions (240p, 360p, 480p, 720p, 1080p, 1440p, 2160p) without upscaling.
6. **Low-Resource Governor (ResourceGovernor)** -> `NEW_IMPLEMENTATION`  
   *Pattern:* Dynamically checks CPU/RAM and queue depth; downgrades noncritical resolutions (e.g. queues 1080p/4K for off-peak hours) on low-spec zero-cost VPS instances.
7. **Interactive Chapter Markers & VTT Sprite Sheets** -> `MULTIPLE_SOURCES` (MediaCMS + PeerTube)  
   *Pattern:* Background extraction of preview sprite sheet (`sprites.vtt` + `sprites.webp`) for player timeline scrubbing thumbnails.
8. **Automated Whisper Speech-to-Text Transcription** -> `SOURCE_MEDIACMS`  
   *Pattern:* Isolated worker extracts 16kHz mono audio, passes to local Whisper model, generates `.vtt` subtitles, and indexes text for global video search.

### C. Video Playback & Delivery
9. **Universal HLS.js Player with QoE Monitoring** -> `MULTIPLE_SOURCES` (PeerTube + MyTube)  
   *Pattern:* Custom React video player with keyboard shortcuts, picture-in-picture, theater mode, speed control, dual audio track selection, and buffer stall telemetry.
10. **Browser-Assisted WebRTC P2P Delivery** -> `SOURCE_PEERTUBE`  
    *Pattern:* Optional P2P datachannel swarm via lightweight signaling tracker; seamless fallback to CDN origin if peer delivery fails within 1.5x segment duration.
11. **P2P Circuit Breaker & QoE Protection** -> `NEW_IMPLEMENTATION`  
    *Pattern:* Automatic runtime disablement of P2P if buffering ratio exceeds 2% or viewer network reports meter/cellular connection.
12. **Expiring Tokenized Playback Authorization** -> `SOURCE_MYTUBE`  
    *Pattern:* Private, unlisted, and members-only videos require signed HMAC playback tokens (`?token=...&exp=...`) verified by media edge handlers.

### D. User Accounts, Security & Channels
13. **Argon2id Secure Authentication & Device Sessions** -> `NEW_IMPLEMENTATION`  
    *Pattern:* OWASP-compliant password hashing, device fingerprinting, active session inventory, and single-click remote session revocation.
14. **Granular Multi-Channel Management** -> `MULTIPLE_SOURCES` (PlayTube + PeerTube)  
    *Pattern:* One user account can own and operate multiple channels with distinct handles, banners, verification badges, and customizable section layouts.
15. **Channel Role-Based Access Control (RBAC)** -> `SOURCE_AVIDEO`  
    *Pattern:* Roles: `OWNER`, `MANAGER`, `EDITOR`, `MODERATOR`, `ANALYST` with database-enforced row-level permissions.

### E. Social Layer, Comments & Feeds
16. **Deduplicated View Counting Engine** -> `SOURCE_MYTUBE`  
    *Pattern:* Structured telemetry buffer in Redis storing `(video_id, viewer_hash, timestamp)`; validates 30s continuous watch threshold before incrementing database counter.
17. **Nested Comments, Pinning & Creator Hearts** -> `SOURCE_PLAYTUBE`  
    *Pattern:* Hierarchical comment threads with creator badges, pinned remarks, heart reactions, and anti-spam duplicate message suppression.
18. **Shorts Vertical Video Experience** -> `SOURCE_PLAYTUBE`  
    *Pattern:* 9:16 aspect ratio feed, mobile touch snap-scrolling, viewport-based pre-buffering of subsequent video assets, and quick-action overlay.
19. **Community Posts & Interactive Polls** -> `SOURCE_PLAYTUBE`  
    *Pattern:* Channel community feed supporting text announcements, image galleries, and expiring vote polls with real-time percentage tallies.

### F. Live Streaming & Real-time Layer
20. **RTMP Stream Ingest to Live HLS** -> `MULTIPLE_SOURCES` (AVideo + PeerTube)  
    *Pattern:* Node-Media-Server RTMP listener validating stream keys; real-time FFmpeg segmentation into low-latency HLS with rolling 5-segment manifest.
21. **Automated Live Replay Processing** -> `SOURCE_AVIDEO`  
    *Pattern:* Upon RTMP connection close, stream segments are concatenated into a permanent VOD master file and enqueued into the standard transcoding pipeline.
22. **Real-time Live Chat & Moderation** -> `MULTIPLE_SOURCES` (AVideo + PlayTube)  
    *Pattern:* Redis Pub/Sub WebSocket layer supporting slow mode, subscriber-only chat, banned word filtering, and moderator message purge.

### G. Discovery, Search & Recommendations
23. **PostgreSQL Trigram & Full-Text Search** -> `NEW_IMPLEMENTATION`  
    *Pattern:* Multi-signal weighted search indexing titles, descriptions, tags, transcript keywords, and channel handles with typo tolerance and category filters.
24. **Multi-Stage Explainable Recommendation Engine** -> `NEW_IMPLEMENTATION`  
    *Pattern:* Candidate generation (collaborative signals + creator affinity + topic vectors) followed by sequence-aware ranking with explicit explainability tags (`SIMILAR_TO_WATCHED`, `TRENDING_IN_CATEGORY`).

### H. Trust, Safety & Copyright Management
25. **Content & Channel Report Escalation Pipeline** -> `SOURCE_PEERTUBE`  
    *Pattern:* Triage workflow (`SUBMITTED -> REVIEWING -> ACTIONED -> APPEALED`) with moderator actions (age-gate, demonetize, strike, suspend).
26. **Audio Chromaprint & Perceptual Hash Copyright Engine** -> `NEW_IMPLEMENTATION`  
    *Pattern:* Audio fingerprint extraction via Chromaprint and video perceptual hashes matched against rights-owner reference assets; flags potential matches for human review without automated false takedowns.

### I. Creator Studio & Monetization
27. **Creator Analytics Dashboard** -> `MULTIPLE_SOURCES` (PlayTube + MediaCMS)  
    *Pattern:* Real-time views, audience retention curves, traffic source breakdowns, watch duration histograms, and CSV data export.
28. **Provider-Agnostic Monetization & Immutable Ledger** -> `SOURCE_PLAYTUBE`  
    *Pattern:* Ledger-based transaction accounting for channel memberships, paid video unlocks, tips, and payout disbursements with webhook verification.

### J. Storage, Infrastructure & Zero-Cost Mode
29. **StorageProvider Universal Abstraction** -> `MULTIPLE_SOURCES` (MediaCMS + MyTube)  
    *Pattern:* Unified interface (`putObject`, `getObject`, `deleteObject`, `generateSignedUrl`) supporting local disk (zero-cost self-host) and S3/R2/OCI (cloud scale).
30. **Tri-Mode Operational Governor** -> `NEW_IMPLEMENTATION`  
    *Pattern:* `FREE_MODE` (optimized for zero-dollar hosting on Oracle Cloud / self-hosted VPS), `STANDARD_MODE` (single-server Docker), and `SCALE_MODE` (distributed workers, S3/R2 storage, CloudFront CDN).
