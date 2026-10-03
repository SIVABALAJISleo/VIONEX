# ADR-006: BullMQ and Redis 7 for Distributed Asynchronous Jobs

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Media pipelines require reliable, prioritized, retryable background job orchestration. Cron jobs (AVideo) lack real-time reactivity, while heavy enterprise brokers (Kafka, RabbitMQ) consume excessive memory in small setups.

## Decision
VIONEX standardizes on **BullMQ with Redis 7**:
1. Priority queues for critical tasks (RTMP live stream startup > short video transcodes > 4K reprocessing).
2. Exponential backoff and dead-letter queues (`DLQ`) for failed FFmpeg transcoding jobs.
3. Graceful job cancellation and resource tracking.

## Consequences
- Millisecond dispatch latency for jobs.
- Lightweight memory footprint (< 50MB for Redis base) enabling zero-cost VPS operation.
