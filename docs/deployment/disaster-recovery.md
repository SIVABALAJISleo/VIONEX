# VIONEX Backup & Disaster Recovery Specification

**Document:** Operations & Disaster Recovery  
**Status:** Approved Operational Guide

---

## 1. Zero-Cost Backup Strategy
In zero-cost deployment mode (e.g. Oracle Always Free), backup storage must fit within allocated quotas:
- Daily compressed PostgreSQL dump via `pg_dump -Fc` uploaded to free tier bucket or offsite storage.
- Storage directory snapshot tracking media manifests and metadata.

## 2. Recovery Procedures
1. **Database Restore:**
   ```bash
   pg_restore -U vionex -d vionex_db -c /backups/vionex_db_backup.dump
   ```
2. **Media Manifest Verification:**
   Run `scripts/verify-storage-integrity.ts` to audit all video records against physical files.
