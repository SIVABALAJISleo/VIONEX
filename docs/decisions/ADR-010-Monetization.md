# ADR-010: Immutable Double-Entry Ledger for Platform Economy

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Video platforms supporting memberships, paid unlocks, and tips cannot rely on mutable user balance columns (`UPDATE users SET balance = balance + 10`), which are prone to race conditions, double-spending, and financial reconciliation failures.

## Decision
VIONEX implements an **Immutable Double-Entry Ledger**:
1. Every monetary transaction creates balanced `debit` and `credit` entries across accounts (User Wallet, Creator Earnings, Platform Escrow, Platform Fees).
2. Balances are derived from ledger aggregations; historical records are immutable.
3. Webhooks from payment gateways (Stripe, Razorpay) are verified with cryptographic HMAC signatures and idempotency keys before ledger entry.

## Consequences
- Zero race conditions or double-spending vulnerabilities.
- Complete financial auditability and automated tax/revenue reporting.
