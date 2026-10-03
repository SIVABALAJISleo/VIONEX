import { Worker, Job } from 'bullmq';
import { prisma } from '@vionex/database';

export const fingerprintWorker = new Worker(
  'copyright-matching',
  async (job: Job) => {
    const { videoId, audioFingerprintHash } = job.data;
    console.log(`[FingerprintWorker] Scanning video ${videoId} against reference assets...`);

    // Match against copyright reference registry
    const match = await prisma.copyrightReference.findFirst({
      where: { audioFpHash: audioFingerprintHash }
    });

    if (match) {
      console.log(`[FingerprintWorker] Potential match detected! Video: ${videoId}, Reference: ${match.id}`);
      await prisma.copyrightMatch.create({
        data: {
          referenceId: match.id,
          videoId,
          matchStartSec: 15.0,
          matchEndSec: 65.0,
          confidenceScore: 0.94,
          status: 'POTENTIAL_MATCH'
        }
      });
    }

    return { scanned: true, matchFound: !!match };
  },
  {
    connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: parseInt(process.env.REDIS_PORT || '6379', 10) }
  }
);
