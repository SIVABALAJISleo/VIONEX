# ADR-001: Modular Monolith with Isolated Workers over Premature Microservices

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Modern video platforms require diverse capabilities: high-throughput REST APIs, WebSocket real-time chat, heavy CPU media transcoding, AI transcription, and scheduled batch jobs. Splitting these into 20+ independent microservices prematurely introduces massive deployment overhead, network serialization latency, Kubernetes complexity, and distributed transaction fragility, conflicting with our zero-cost self-hosting objective.

## Decision
VIONEX adopts a **Modular Monolith API with Isolated Background Workers**:
1. Single unified Fastify API service handling HTTP, WebSocket, auth, and database transactions.
2. Independent Node.js worker services (`media-worker`, `live-worker`, `fingerprint-worker`) communicating via BullMQ and Redis 7.
3. Clean module boundaries enforced via internal TypeScript packages (`packages/auth`, `packages/database`, `packages/media`).

## Consequences
- Single container can deploy the entire stack for low-cost self-hosting.
- At high scale, workers scale out independently on dedicated compute instances without altering application code.
