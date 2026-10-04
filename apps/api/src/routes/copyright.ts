import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { authenticate } from '../services/auth-middleware';

export async function copyrightRoutes(app: FastifyInstance) {
  // 1. Register a Reference Asset (Rights-holder)
  app.post('/references', { preHandler: [authenticate] }, async (request, reply) => {
    const { title, artist, rightsOwner, fingerprint, duration } = request.body as any;

    if (!title || !fingerprint) {
      return reply.status(400).send({ success: false, message: 'Title and fingerprint required' });
    }

    const ref = await prisma.copyrightReference.create({
      data: {
        rightsOwner: rightsOwner || artist || 'VIONEX Media Rights Inc.',
        title,
        audioFpHash: fingerprint,
        territories: ['GLOBAL']
      }
    });

    return reply.status(201).send({ success: true, reference: ref });
  });

  // 2. Scan / Match Video Against Reference Catalog
  app.post('/match', async (request, reply) => {
    const { videoId, audioFingerprint } = request.body as any;
    if (!videoId || !audioFingerprint) {
      return reply.status(400).send({ success: false, message: 'videoId and audioFingerprint required' });
    }

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return reply.status(404).send({ success: false, message: 'Video not found' });
    }

    // Match against catalog using fingerprint similarity
    const references = await prisma.copyrightReference.findMany();
    let bestMatch: any = null;
    let highestConfidence = 0.0;

    for (const ref of references) {
      const refTokens = new Set(ref.audioFpHash.split(/[\s,]+/));
      const targetTokens = audioFingerprint.split(/[\s,]+/);
      let matches = 0;
      for (const t of targetTokens) {
        if (refTokens.has(t)) matches++;
      }
      const similarity = targetTokens.length > 0 ? (matches / targetTokens.length) : 0;
      if (similarity > 0.3 && similarity > highestConfidence) {
        highestConfidence = similarity;
        bestMatch = ref;
      }
    }

    if (!bestMatch) {
      return reply.send({ success: true, matched: false });
    }

    // Create match and claim in database
    const claim = await prisma.copyrightMatch.create({
      data: {
        videoId,
        referenceId: bestMatch.id,
        confidenceScore: highestConfidence,
        matchStartSec: 12.0,
        matchEndSec: 45.0,
        status: 'CLAIMED'
      },
      include: {
        reference: true
      }
    });

    return reply.send({
      success: true,
      matched: true,
      claimId: claim.id,
      confidence: highestConfidence,
      status: claim.status,
      referenceTitle: bestMatch.title
    });
  });

  // 3. File Dispute (Creator counter-notice)
  app.post('/claims/:claimId/dispute', { preHandler: [authenticate] }, async (request, reply) => {
    const { claimId } = request.params as { claimId: string };
    const { reason, legalRationale } = request.body as any;

    const claim = await prisma.copyrightMatch.findUnique({ where: { id: claimId } });
    if (!claim) {
      return reply.status(404).send({ success: false, message: 'Claim not found' });
    }

    const updated = await prisma.copyrightMatch.update({
      where: { id: claimId },
      data: {
        status: 'DISPUTED'
      }
    });

    return reply.send({
      success: true,
      status: updated.status,
      message: 'Dispute submitted. Rights holder has 30 days to review or release.'
    });
  });

  // 4. Resolve Claim (Release / Uphold)
  app.post('/claims/:claimId/resolve', { preHandler: [authenticate] }, async (request, reply) => {
    const { claimId } = request.params as { claimId: string };
    const { resolution } = request.body as any;

    const updated = await prisma.copyrightMatch.update({
      where: { id: claimId },
      data: {
        status: resolution === 'RELEASED' ? 'RELEASED' : 'TAKEDOWN'
      }
    });

    return reply.send({
      success: true,
      status: updated.status,
      message: `Claim successfully resolved: ${updated.status}`
    });
  });
}
