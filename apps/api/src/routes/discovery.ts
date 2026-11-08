import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { RecommendationEngine } from '@vionex/recommendations';
import { TaxonomyService, SearchEngine } from '@vionex/search';

const taxonomyService = TaxonomyService.getInstance();
const searchEngine = new SearchEngine();

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
    const candidateMap = new Map(candidates.map((c) => [c.videoId, c]));
    const videoIds = candidates.map((c) => c.videoId);

    const videos = await prisma.video.findMany({
      where: { id: { in: videoIds } },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      }
    });

    // Preserve candidate ranking order and attach recommendation reasons
    const sortedFeed = videoIds
      .map((id) => videos.find((v) => v.id === id))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .map((v) => {
        const meta = candidateMap.get(v.id);
        return {
          ...v,
          viewsCount: v.viewsCount.toString(),
          originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null,
          recommendationReason: meta?.reason || 'TRENDING',
          sharedRecommenders: meta?.sharedRecommenders || 0,
          pullQuote: v.pullQuoteText
            ? {
                text: v.pullQuoteText,
                author: v.pullQuoteAuthor || undefined,
                year: v.pullQuoteYear || undefined
              }
            : null
        };
      });

    return reply.send({
      success: true,
      personalized: Boolean(userId),
      userId: userId || null,
      feed: sortedFeed
    });
  });

  // 2. Full Taxonomy Tree (16 Areas & 150 Categories)
  app.get('/taxonomy', async (request, reply) => {
    const areas = taxonomyService.getAllAreas();
    return reply.send({
      success: true,
      areas
    });
  });

  // 3. Taxonomy Categories by Area
  app.get('/taxonomy/:areaId', async (request, reply) => {
    const { areaId } = request.params as { areaId: string };
    const categories = taxonomyService.getCategoriesByArea(areaId);
    return reply.send({
      success: true,
      areaId,
      categories
    });
  });

  // 4. Graph-Based Co-Recommendations ("Related Videos")
  app.get('/related/:videoId', async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    const candidates = await RecommendationEngine.getRelatedVideos(videoId, 16);
    const relatedIds = candidates.map((c) => c.videoId);

    const videos = await prisma.video.findMany({
      where: { id: { in: relatedIds } },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      }
    });

    const candidateMap = new Map(candidates.map((c) => [c.videoId, c]));

    const sortedRelated = relatedIds
      .map((id) => videos.find((v) => v.id === id))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .map((v) => ({
        ...v,
        viewsCount: v.viewsCount.toString(),
        originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null,
        sharedRecommenders: candidateMap.get(v.id)?.sharedRecommenders || 0,
        pullQuote: v.pullQuoteText
          ? {
              text: v.pullQuoteText,
              author: v.pullQuoteAuthor || undefined,
              year: v.pullQuoteYear || undefined
            }
          : null
      }));

    return reply.send({
      success: true,
      sourceVideoId: videoId,
      related: sortedRelated
    });
  });

  // 5. Community Picks & Hall of Fame (Highest HackerTube score)
  app.get('/community-picks', async (request, reply) => {
    const { limit = '20', contentType, level } = request.query as {
      limit?: string;
      contentType?: string;
      level?: string;
    };

    const videos = await prisma.video.findMany({
      where: {
        state: 'PUBLISHED',
        visibility: 'PUBLIC',
        communityScore: { gt: 0 },
        contentType: contentType || undefined,
        level: level || undefined
      },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      },
      orderBy: [{ communityScore: 'desc' }, { viewsCount: 'desc' }],
      take: Math.min(50, parseInt(limit, 10) || 20)
    });

    return reply.send({
      success: true,
      count: videos.length,
      picks: videos.map((v) => ({
        ...v,
        viewsCount: v.viewsCount.toString(),
        originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null,
        pullQuote: v.pullQuoteText
          ? {
              text: v.pullQuoteText,
              author: v.pullQuoteAuthor || undefined,
              year: v.pullQuoteYear || undefined
            }
          : null
      }))
    });
  });

  // 6. Intelligent Hybrid Search with Facets & Taxonomy Synonym Expansion
  app.get('/search', async (request, reply) => {
    const {
      q,
      areaId,
      categoryId,
      contentType,
      level,
      shelfLife,
      minScore,
      sort
    } = request.query as {
      q?: string;
      areaId?: string;
      categoryId?: string;
      contentType?: string;
      level?: string;
      shelfLife?: string;
      minScore?: string;
      sort?: 'relevance' | 'score' | 'views' | 'date';
    };

    // Candidate retrieval from database
    const rawCandidates = await prisma.video.findMany({
      where: {
        state: 'PUBLISHED',
        visibility: 'PUBLIC',
        taxonomyAreaId: areaId || undefined,
        taxonomyCategoryId: categoryId || undefined,
        contentType: contentType || undefined,
        level: level || undefined,
        shelfLife: shelfLife || undefined
      },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true }
        }
      },
      take: 100
    });

    // Score and rank using SearchEngine
    const rankedResults = searchEngine.scoreAndRank(
      rawCandidates,
      {
        query: q,
        areaId,
        categoryId,
        contentType,
        level,
        shelfLife,
        minCommunityScore: minScore ? parseFloat(minScore) : undefined
      },
      30
    );

    return reply.send({
      success: true,
      query: q || '',
      total: rankedResults.length,
      results: rankedResults.map((r) => ({
        ...r.item,
        viewsCount: r.item.viewsCount.toString(),
        originalFilesize: r.item.originalFilesize ? r.item.originalFilesize.toString() : null,
        searchRelevanceScore: r.score,
        matchedCategories: r.matchedCategories,
        matchedTerms: r.matchedTerms,
        pullQuote: r.item.pullQuoteText
          ? {
              text: r.item.pullQuoteText,
              author: r.item.pullQuoteAuthor || undefined,
              year: r.item.pullQuoteYear || undefined
            }
          : null
      }))
    });
  });

  // 7. Search Autocomplete with Topics & Category Suggestions
  app.get('/search/suggest', async (request, reply) => {
    const { q } = request.query as { q?: string };
    if (!q || q.trim().length === 0) {
      return reply.send({ success: true, suggestions: [], categories: [] });
    }

    // 1. Suggest matching taxonomy categories
    const matchingCategories = taxonomyService.searchCategories(q, 4).map((c) => ({
      id: c.id,
      name: c.name,
      areaName: c.areaName
    }));

    // 2. Suggest matching video titles
    const videos = await prisma.video.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' },
        visibility: 'PUBLIC',
        state: 'PUBLISHED'
      },
      select: { title: true },
      take: 6
    });

    return reply.send({
      success: true,
      suggestions: videos.map((v) => v.title),
      categories: matchingCategories
    });
  });
}
