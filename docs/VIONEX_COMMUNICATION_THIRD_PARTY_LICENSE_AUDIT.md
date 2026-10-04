# VIONEX Communication: Third-Party License & Governance Audit

This audit evaluates all third-party open-source components, libraries, and protocols proposed for the VIONEX Communication Expansion to ensure legal compatibility with VIONEX commercial licensing and distribution.

---

## 1. Inventory & License Summary

| Component | Repository / Package | Upstream License | Distribution Mode | Commercial Use Permitted? | Source Disclosure Obligation |
|---|---|---|---|---|---|
| **Matrix JS SDK** | `matrix-org/matrix-js-sdk` | Apache 2.0 | Client-side dependency | **YES** | No source disclosure of proprietary VIONEX app code required. Notice and license text preservation only. |
| **Matrix Crypto WASM** | `matrix-org/matrix-sdk-crypto-wasm` | Apache 2.0 | Client-side binary / WASM | **YES** | No copyleft viral triggers. Complies with commercial web app embedding. |
| **Matrix Protocol Specification** | `matrix.org/docs/spec` | Apache 2.0 / Open Standard | Open Protocol Standard | **YES** | Open standard with zero patent or royalty obligations. |
| **LiveKit Client SDK** | `livekit/client-sdk-js` | Apache 2.0 | Client-side WebRTC engine | **YES** | Permissive commercial license; no source disclosure of application code. |
| **LiveKit Server** | `livekit/livekit` | Apache 2.0 | Independent backend SFU daemon | **YES** | Permissive server license. May be operated as a commercial SaaS service. |
| **Coturn (STUN/TURN)** | `coturn/coturn` | BSD 3-Clause | Network infrastructure daemon | **YES** | Standard BSD terms. Notice file preservation required. |
| **Fastify** | `fastify/fastify` | MIT | Backend API runtime | **YES** | Standard MIT terms. |
| **Prisma ORM** | `prisma/prisma` | Apache 2.0 | Database abstraction | **YES** | Permissive enterprise license. |
| **Next.js** | `vercel/next.js` | MIT | Frontend framework | **YES** | Standard MIT terms. |

---

## 2. Special Governance Review: Synapse (AGPLv3)

### Findings:
1. **Upstream License Change**: In 2023, the Element Foundation transitioned Synapse's server license from Apache 2.0 to AGPLv3.
2. **Impact on VIONEX Core**:
   - VIONEX connects to Matrix homeservers strictly over standard **HTTP REST & WebSocket APIs** (Client-Server API v0.6+).
   - Under standard software copyright interpretations, communicating over standard HTTP client-server network boundaries does not trigger copyleft source-disclosure obligations for client applications or independent microservices (`apps/web`, `apps/api`, `packages/database`).
   - For self-hosted on-premise deployments, if modifications to the Synapse server itself are made, those modifications must remain open source under AGPLv3.
3. **Recommendation**:
   - Run Matrix services as isolated, independent microservice containers (`vionex-matrix-synapse`).
   - Keep VIONEX application logic inside `packages/communication` communicating strictly via the standard Matrix Client-Server specification.
   - Alternatively, support Matrix homeserver backends licensed under Apache 2.0 (such as Conduit / Dendrite) for air-gapped commercial deployments requiring zero AGPL components.

---

## 3. Patent & Trademark Governance

1. **Brand Protection**: The VIONEX Communication expansion introduces proprietary VIONEX branding ("VIONEX Messenger", "VIONEX Calls", "VIONEX Status"). No WhatsApp, Meta, or third-party proprietary trade dress, copyrighted icons, or trademarks are used.
2. **Cryptographic Standards**: Utilizes publicly standardized cryptographic algorithms:
   - Curve25519 (RFC 7748) for Key Exchange
   - Ed25519 (RFC 8032) for Digital Signatures
   - AES-256-GCM / ChaCha20-Poly1305 (RFC 8439) for Authenticated Symmetric Encryption
   - Double Ratchet Algorithm (Signal / Matrix open cryptographic specifications)

---

## 4. Certification & Compliance Approval

All components evaluated pass architectural compliance for enterprise production use.
