# ADR-012: Tri-Mode Deployment Architecture (Zero-Cost, Standard, Scale)

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Users demand the ability to run VIONEX on free-tier infrastructure (e.g. Oracle Cloud Always Free 4 OCPU / 24GB RAM ARM or cheap $5/mo VPS) while maintaining a seamless migration path to high-scale enterprise cloud infrastructure.

## Decision
VIONEX defines a **Tri-Mode Operational Architecture**:
1. `FREE_MODE`: Single-node Docker Compose. Local NVMe storage, PostgreSQL 16 with pg_trgm, Redis, single-worker FFmpeg with ResourceGovernor limiting transcoding to 1 concurrent job, aggressive WebP thumbnail compression, and WebRTC P2P enabled.
2. `STANDARD_MODE`: Single dedicated server or managed cluster. PostgreSQL, Redis, external S3/Wasabi storage, 2–4 media workers.
3. `SCALE_MODE`: Multi-node cluster. Managed PostgreSQL (Aurora/RDS), Managed Redis (ElastiCache), Cloudflare R2 / S3 storage with CloudFront CDN, auto-scaling worker groups, Meilisearch cluster.

## Consequences
- Guaranteed ability to deploy with a $0/month infrastructure bill while providing an architectural upgrade path to millions of users without code rewrites.
