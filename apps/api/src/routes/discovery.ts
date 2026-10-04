import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { RecommendationEngine } from '@vionex/recommendations';

export async function discoveryRoutes(app: FastifyInstance) {
  // 1. Personalized Home Feed
  app.get('/home', async (request, reply) => {
    let userId: string | undefined;
    try {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { AuthService } = await import('@vionex/auth');
        const payload = AuthService.verifyAccessToken(token);
        if (payload) userId = payload.userId;
      }
    } catch {}

    const candidates = await RecommendationEngine.getHomeFeedCandidates(userId);
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
      personalized: Boolean(userId),
      userId: userId || null,
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

  // 3. Search Autocomplete
  app.get('/search/suggest', async (request, reply) => {
    const { q } = request.query as { q?: string };
    if (!q) return reply.send({ success: true, suggestions: [] });

    const videos = await prisma.video.findMany({
      where: {
        title: { startsWith: q, mode: 'insensitive' },
        visibility: 'PUBLIC',
        state: 'PUBLISHED'
      },
      select: { title: true },
      take: 8
    });

    return reply.send({
      success: true,
      suggestions: videos.map(v => v.title)
    });
  });
}
