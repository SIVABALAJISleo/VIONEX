# VIONEX Communication: Authoritative Source of Truth Matrix

This document defines the strict, non-ambiguous authoritative owner for every data class, entity, and state across the VIONEX Communication Expansion.

**Architectural Rule**: No data field or operational entity may have two competing authoritative owners.

---

## 1. Domain Ownership Breakdown

| Domain | Entity / Field | Authoritative System | Persistence / Storage | Replica / Cache | Consistency Model |
|---|---|---|---|---|---|
| **Identity & Authentication** | User ID, email, username, password hash, role | **VIONEX Core** | PostgreSQL (`User`, `UserSecurity`) | Redis session tokens | Strong ACID consistency |
| **Active Web Sessions** | Session token, IP, User Agent, device type | **VIONEX Core** | PostgreSQL (`UserSession`) | Fastify in-memory / cookie | Strong consistency |
| **Communication Identity** | `matrixUserId`, public key fingerprint | **VIONEX Comm Adapter** | PostgreSQL (`CommunicationIdentity`) | Matrix Homeserver | Bi-directional mapping |
| **Cryptographic Device Keys** | Curve25519 identity key, Ed25519 signing key | **Matrix Client Engine** | Browser IndexedDB (WASM Crypto) | Matrix Key Server (public part only) | Eventual sync across user devices |
| **E2EE Private Keys** | Olm/Megolm one-time keys, session ratchet state | **Client Device Only** | Client Secure Enclave / IndexedDB | **NEVER STORED ON SERVERS** | Client-local state |
| **Encrypted Messages** | 1:1 and Group Message Ciphertext, event stream | **Matrix Protocol Layer** | Matrix Server Event Store | Client local IndexedDB cache | Linearized event DAG |
| **Message Delivery Receipts** | Sent, Delivered, Read timestamps & device IDs | **Matrix Event Engine** | Matrix Event Store | Client UI state | Idempotent event receipts |
| **Realtime Voice/Video Media** | RTP audio/video packets, simulcast renditions | **LiveKit SFU** | Ephemeral in-memory WebRTC pipe | None (Zero recording without consent) | UDP low-latency real-time |
| **Call Session Records** | Call ID, duration, caller/callee IDs, completion status | **VIONEX Comm API** | PostgreSQL (`CallSession`, `CallParticipant`) | None | Strong transaction upon call termination |
| **Status / Stories** | Media URL, text, caption, timestamp, 24h expiration | **VIONEX Comm API** | PostgreSQL (`Status`) | Redis 24h TTL cache | Strong ACID, server-enforced TTL |
| **Status Audience ACL** | Target user whitelist / blacklist | **VIONEX Comm API** | PostgreSQL (`StatusAudience`) | Redis permission bitmap | Server-side query filtering |
| **Status Views & Reactions** | Viewer ID, viewed timestamp, emoji | **VIONEX Comm API** | PostgreSQL (`StatusView`, `StatusReaction`) | In-memory count aggregator | Unique constraints prevent duplication |
| **Community Spaces** | Community name, avatar, topic channels, roles | **VIONEX Comm API** | PostgreSQL (`Community`, `CommunityTopic`) | None | Strong ACID consistency |
| **Community Membership** | Member ID, assigned role (Owner, Admin, Member) | **VIONEX Comm API** | PostgreSQL (`CommunityMember`) | In-memory RBAC token | Strong ACID consistency |
| **Broadcast Channels** | Channel slug, name, icon, verified status | **VIONEX Comm API** | PostgreSQL (`ChannelBroadcast`) | Redis slug lookup cache | Strong consistency |
| **Channel Broadcast Posts** | Post content, attached VIONEX media refs, views | **VIONEX Comm API** | PostgreSQL (`ChannelPost`) | Redis fanout feed cache | Eventual fanout |
| **Channel Follower Graph** | Follower user ID, timestamp | **VIONEX Comm API** | PostgreSQL (`ChannelFollower`) | Redis set | Strong consistency |
| **Business Account & Profile** | Business name, category, hours, welcome/away msg | **VIONEX Comm API** | PostgreSQL (`BusinessAccount`) | None | Strong consistency |
| **Business Catalog Items** | Product title, price in cents, SKU, availability | **VIONEX Comm API** | PostgreSQL (`BusinessCatalogItem`) | Search index | Strong consistency |
| **Business Agent Assignment** | Agent user ID, assigned role | **VIONEX Comm API** | PostgreSQL (`BusinessAgent`) | In-memory permissions | Strong consistency |
| **VIONEX Video Content Refs** | Video ID, title, channel handle, thumbnail, duration | **VIONEX Core Platform** | PostgreSQL (`Video`, `Channel`) | Redis cache / CDN edge | Read-only reference in messages |
| **Media Attachments** | Image, video, audio, document blobs | **VIONEX Storage Layer** | S3 / Local Media Quarantine & Vault | CDN signed URLs | Content-addressable SHA256 storage |
| **Notification Pipeline** | Push tokens, user preferences, unread badges | **VIONEX Notification Layer** | PostgreSQL (`Notification`, `NotificationPreference`) | Redis Pub/Sub | Near real-time dispatch |

---

## 2. Cryptographic Zero-Knowledge Boundary

```
[CLIENT DEVICE]
  │ Private Olm/Megolm Device Keys
  │ Plaintext Message Composition
  │ Media Decryption Buffer
  ▼ (Client-side WASM Encryption)
[CIPHERTEXT OVER THE WIRE]
  │ TLS 1.3 Transport Encryption
  ▼
[VIONEX COMMUNICATION GATEWAY & MATRIX HOMESERVER]
  │ Stores: Ciphertext Event DAG only
  │ Operates: Identity authorization, token issuance, routing
  │ CANNOT: Decrypt message content, inspect audio/video, access keys
  ▼
[RECIPIENT CLIENT DEVICE]
  │ (Client-side WASM Decryption using Local Private Keys)
  ▲
```
