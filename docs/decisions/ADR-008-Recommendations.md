# ADR-008: Two-Tower Candidate Generation with Explainable Ranking

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Many video scripts either fabricate recommendations with random `ORDER BY RAND()` queries (killing database performance) or over-promise opaque "black-box AI" without verifiable behavior.

## Decision
VIONEX implements a **Two-Tower Candidate Generation & Explainable Ranking Engine**:
1. Stage 1 (Candidate Generation): Pulls candidates from 4 distinct pools: Channel Subscriptions, Topic Similarity, Collaborative Signals (users who watched X also watched Y), and Trending Velocity.
2. Stage 2 (Scoring & Diversity): Applies freshness decay, creator diversity penalties (preventing one creator from dominating the feed), and negative feedback suppression.
3. Every recommendation contains an internal explainability tag (`SIMILAR_TO_WATCHED`, `TRENDING_IN_TOPIC`, `FROM_SUBSCRIBED_CHANNEL`).

## Consequences
- Deterministic, explainable, and tunable feeds.
- Sub-50ms response times without database table scans.
