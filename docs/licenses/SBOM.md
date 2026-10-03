# VIONEX Software Bill of Materials (SBOM)

**Specification Version:** SPDX 2.3 / CycloneDX 1.5 Compatible  
**Project:** VIONEX Video Platform (v0.1.0-alpha)  
**Creation Date:** October 3, 2026  
**Auditor:** Antigravity Open-Source Compliance & DevSecOps Lead  
**Compliance Verification:** Clean-Room Original Implementation

---

## 1. Component Inventory

| Component Name | Version | Ecosystem | License | Primary Purpose | Security Gate Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Node.js** | 22.x LTS | Runtime | MIT | Server Execution Environment | Approved |
| **TypeScript** | 5.7.x | npm | Apache-2.0 | Type Safety & Build System | Approved |
| **Fastify** | 5.x | npm | MIT | High-Performance REST API Core | Approved |
| **Next.js** | 15.x | npm | MIT | Modern Web Application / App Router | Approved |
| **React** | 19.x | npm | MIT | User Interface Declarative Engine | Approved |
| **Tailwind CSS** | 4.x | npm | MIT | Utility-First Design System | Approved |
| **Prisma ORM** | 6.x | npm | Apache-2.0 | PostgreSQL Client & Schema Modeling | Approved |
| **PostgreSQL** | 16.x | DB Engine | PostgreSQL (MIT-style) | Primary ACID Relational Store | Approved |
| **BullMQ** | 5.x | npm | MIT | Distributed Durable Job Queues | Approved |
| **ioredis** | 5.x | npm | MIT | Redis 7 Client & Event Bus | Approved |
| **FFmpeg** | 6.1 / 7.x | Binary | LGPL-2.1+ (or GPL-2.0+) | Transcoding, Demuxing, Packaging | Approved (Isolated Worker) |
| **hls.js** | 1.5.x | npm | Apache-2.0 | Standards-Compliant Video Player | Approved |
| **p2p-media-loader** | 2.x | npm | Apache-2.0 | WebRTC Browser-Assisted P2P Swarming | Approved (Optional Module) |
| **Zod** | 3.23.x | npm | MIT | Runtime Schema Validation & Invariant Checking | Approved |
| **Argon2** | 0.41.x | npm | MIT | Memory-Hard Password Hashing | Approved |
| **jsonwebtoken** | 9.x | npm | MIT | Signed JWT Stateless Tokens | Approved |
| **lucide-react** | 0.460.x | npm | ISC | Accessible Modern UI Icons | Approved |
| **nanoid** | 5.x | npm | MIT | Secure URL-Safe Unique Identifiers | Approved |
| **chromaprint (fpcalc)**| 1.5.x | Binary | LGPL-2.1+ | Audio Fingerprint Extraction (Copyright) | Approved (Isolated CLI) |

---

## 2. License Compatibility & Distribution Analysis

All primary dependencies utilize permissive open-source licenses (**MIT**, **Apache-2.0**, **ISC**, **PostgreSQL License**).  
Binary tools (**FFmpeg**, **Chromaprint**) are executed strictly as independent subprocesses across standard operating system process boundaries via argument arrays without linking proprietary C libraries into the Node.js memory address space. This preserves complete compliance with LGPL/GPL dynamic linking and execution guidelines.
