# ADR-011: Optional ActivityPub Adapter behind Isolated Service Boundary

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
PeerTube's federation over ActivityPub enables decentralized discovery, but tight coupling to federation protocols adds immense database write volume and operational complexity for single-organization or private video platforms.

## Decision
VIONEX isolates federation behind a **Pluggable Federation Adapter**:
1. The core platform operates as a standalone high-performance video service.
2. An optional `ActivityPubAdapter` translates local video publications into standard ActivityPub Actor/Video objects and dispatches to federated followers.
3. Federation can be completely enabled or disabled via environment variable and system settings with zero impact on core video streaming.

## Consequences
- Retains compatibility with the wider Fediverse without imposing federation overhead on standalone deployments.
