# ADR-007: Argon2id Hashing and HTTP-Only Cookie JWT Device Sessions

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Authentication vulnerabilities in reference projects ranged from plain MD5/SHA-1 password hashing in legacy forks to insecure localStorage JWT storage susceptible to XSS token theft.

## Decision
VIONEX implements an **Argon2id + HTTP-Only Cookie JWT Session Architecture**:
1. Password hashing uses Argon2id (OWASP recommended parameters: 64MB memory, 3 iterations, 4 parallelism).
2. Short-lived (15 min) access tokens and rotating refresh tokens (7 days) stored exclusively in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
3. Every session is tracked in `user_sessions` with IP, user-agent, and device fingerprint, enabling instant single-click session revocation.

## Consequences
- Immunity to XSS token theft via JavaScript.
- Full compliance with modern web application security standards.
