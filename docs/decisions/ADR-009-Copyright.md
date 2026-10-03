# ADR-009: Chromaprint Audio Fingerprinting and Perceptual Hashing with Human Triage

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Proprietary Content ID cannot be legally or technically duplicated directly. However, open-source platforms require lawful copyright management to protect creators and respond to infringements.

## Decision
VIONEX implements a **Legally Conservative Copyright Management Engine**:
1. Reference assets uploaded by verified rights owners are fingerprinted using Chromaprint (`fpcalc`) for audio and perceptual hashing (`pHash`) for video frames.
2. Uploaded media is scanned asynchronously against the reference database.
3. Matches are classified as `POTENTIAL_MATCH` and routed to a human review queue. Automated content takedown is strictly prohibited without human verification or formal legal notice.
4. Complete counter-notice and dispute workflows modeled in accordance with statutory copyright safe harbors.

## Consequences
- Powerful automated assistance for rights holders without false-positive automated censorship.
