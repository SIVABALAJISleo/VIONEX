import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { RecommendationEngine } from '@vionex/recommendations';

export async function discoveryRoutes(app: FastifyInstance) {
  // 1. Personalized Home Feed
  app.get('/home', async (request, reply) => {
    const candidates = await RecommendationEngine.getHomeFeedCandidates();
    const videoIds = candidates.map(c => c.videoId);

    const videos = await prisma.video.findMany({
      where: { id: { in: videoIds } },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      }
    });

    return reply.send({
      success: true,
      feed: videos.map(v => ({
        ...v,
        viewsCount: v.viewsCount.toString(),
        originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null
      }))
    });
  });

  // 2. Global Search
  app.get('/search', async (request, reply) => {
    const { q, category } = request.query as { q?: string; category?: string };
    if (!q || q.trim().length === 0) {
      return reply.send({ success: true, results: [] });
    }

    const videos = await prisma.video.findMany({
      where: {
        state: 'PUBLISHED',
        visibility: 'PUBLIC',
        category: category ? category : undefined,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } }
        ]
      },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      },
      take: 20
    });

    return reply.send({
      success: true,
      query: q,
      results: videos.map(v => ({
        ...v,
        viewsCount: v.viewsCount.toString(),
        originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null
      }))
    });
  });

  // 3. Shorts Vertical Feed
  app.get('/shorts', async (request, reply) => {
    const shorts = await prisma.video.findMany({
      where: {
        isShort: true,
        state: 'PUBLISHED',
        visibility: 'PUBLIC'
      },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 15
    });

    return reply.send({
      success: true,
      shorts: shorts.map(s => ({
        ...s,
        viewsCount: s.viewsCount.toString(),
        originalFilesize: s.originalFilesize ? s.originalFilesize.toString() : null
      }))
    });
  });
}
