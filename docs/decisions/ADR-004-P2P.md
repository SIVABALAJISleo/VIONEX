# ADR-004: WebRTC Datachannel P2P with Strict CDN Origin Circuit Breaker

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Video egress is the single largest operational cost of running a streaming platform. PeerTube demonstrated the viability of browser-assisted WebRTC P2P sharing, but unconstrained P2P can cause buffer stalls if peers disconnect or throttle uploads.

## Decision
VIONEX implements an **Optional WebRTC Datachannel P2P mesh paired with an automated Circuit Breaker**:
1. Clients watching the same rendition can exchange media segments over WebRTC datachannels coordinated by a lightweight WebSocket tracker.
2. Strict QoE Circuit Breaker: If a requested segment is not delivered by a peer within 1.5x segment duration, the player automatically bypasses P2P and downloads directly from the CDN origin.
3. Telemetry measures exact origin bytes saved and peer contribution.

## Consequences
- 40–70% reduction in origin bandwidth during concurrent events or popular videos.
- 0% degradation in viewer experience under sparse swarms or high peer churn.
