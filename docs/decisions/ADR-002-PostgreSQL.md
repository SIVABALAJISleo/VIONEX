# ADR-002: PostgreSQL 16 as Single Source of Truth with Trigram Search

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Video platforms require complex relational models: user channels, granular collaborator permissions, nested comments, playlist hierarchies, immutable financial ledgers, and copyright claims. Upstream projects that chose NoSQL or fragmented databases suffered from lack of transactional integrity and data consistency bugs.

## Decision
VIONEX standardizes on **PostgreSQL 16**:
1. All core entities modeled with strict foreign keys, check constraints, and unique indices.
2. Initial global video and channel search implemented using PostgreSQL `pg_trgm` (trigram similarity) and `tsvector` full-text search, eliminating the mandatory requirement of running Elasticsearch or Meilisearch in low-resource deployments.
3. Pluggable search adapter interface allowing drop-in connection to Meilisearch or OpenSearch when scaling beyond 1 million videos.

## Consequences
- Guaranteed ACID consistency across permissions, ledger entries, and video states.
- Drastically reduced RAM requirements for zero-cost hosting.
