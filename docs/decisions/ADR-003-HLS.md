# ADR-003: Aligned Keyframe HLS with Fragmented MP4 over Raw MP4 or Proprietary DASH

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Serving raw MP4 files (as in PlayTube) wastes immense bandwidth and causes severe buffering on mobile networks. Conversely, complex multi-period DASH setups lack universal native iOS Safari browser playback.

## Decision
VIONEX standardizes on **HLS (HTTP Live Streaming) with aligned keyframes and fragmented MP4 / TS segments**:
1. Video transcoding produces aligned keyframe GOPs (`-g 60 -keyint_min 60 -sc_threshold 0`) across 240p, 360p, 480p, 720p, 1080p, 1440p, and 2160p renditions.
2. Standard `master.m3u8` references individual resolution playlists.
3. Universal playback supported via native Safari HLS and HLS.js on Chrome/Firefox/Edge/Android.

## Consequences
- Seamless adaptive bitrate switching without screen blackouts.
- Native mobile and desktop compatibility with zero custom native plugins.
