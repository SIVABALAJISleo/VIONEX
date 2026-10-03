# Open-Source License Compatibility & Clean-Room Verification

**Project:** VIONEX Video Platform  
**Document Status:** Final Legal & Architectural Certification  
**Author:** Antigravity Open-Source Compliance Auditor

---

## 1. The Clean-Room Guarantee

A primary mission directive for VIONEX is building an **original, production-ready video platform** without copying proprietary or copyleft code.

### Policy Enforcement:
1. **Zero Source Code Transplantation:** Not a single source file, function, template, or SQL query from AVideo (GPL-2.0+), PeerTube (AGPL-3.0), PlayTube (Commercial/Modified), or MediaCMS (AGPL-3.0) has been copied into VIONEX.
2. **Abstract Requirement Extraction:** Upstream projects served exclusively as *functional specifications* and *architectural research inputs*.
3. **TypeScript First:** All business logic, schemas, controllers, and components are authored cleanly in modern TypeScript.
4. **No Viral License Contamination:** Because no AGPL/GPL source code is bundled or statically linked into the VIONEX codebase, VIONEX retains full ownership and licensing flexibility (e.g. permissive MIT / Apache-2.0 commercial publication).

---

## 2. Subprocess & Inter-Process Communication (IPC) Boundary

Where specialized media processing binaries are required:
- **FFmpeg & FFprobe:** Executed exclusively as standalone CLI processes via `child_process.execFile` with strict argument arrays.
- **Chromaprint / fpcalc:** Executed exclusively via standard input/output streams for audio fingerprint extraction.
- **No Shared Memory or Linking:** No C/C++ header bindings or static libraries are linked, preserving clean compliance with LGPL boundary requirements.
