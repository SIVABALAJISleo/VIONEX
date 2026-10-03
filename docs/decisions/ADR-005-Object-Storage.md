# ADR-005: Universal StorageProvider Abstraction (Local Disk, S3, R2, OCI)

**Date:** October 3, 2026  
**Status:** Approved  
**Architect:** Antigravity Autonomous Engineering Organization

## Status: APPROVED
## Context
Hardcoding AWS S3 (like MyTube) prevents zero-cost self-hosting. Hardcoding local filesystem paths (like legacy AVideo) prevents horizontal scaling across cloud instances.

## Decision
VIONEX implements a unified **StorageProvider interface**:
```typescript
interface StorageProvider {
  putObject(key: string, data: Buffer | ReadableStream, options?: PutOptions): Promise<void>;
  getObject(key: string): Promise<ReadableStream>;
  deleteObject(key: string): Promise<void>;
  generatePresignedUploadUrl(key: string, options: PresignedUploadOptions): Promise<string>;
  generateSignedPlaybackUrl(key: string, options: SignedPlaybackOptions): Promise<string>;
}
```
Adapters:
- `LocalStorageProvider`: Manages media assets on local NVMe/SSD storage for development and zero-cost self-hosting.
- `S3StorageProvider`: Connects to AWS S3, Cloudflare R2, MinIO, or Oracle Cloud Object Storage with zero business logic changes.

## Consequences
- Total infrastructure portability without rewriting upload or delivery code.
