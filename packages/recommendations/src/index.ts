import { prisma } from '@vionex/database';

export interface ScoredCandidate {
  videoId: string;
  score: number;
  reason:
  | 'SUBSCRIBED_CHANNEL'
  | 'SIMILAR_TO_WATCHED'
  | 'TRENDING'
  | 'CONTINUE_WATCHING'
  | 'TOPIC_AFFINITY'
  | 'CO_RECOMMENDED'
  | 'COMMUNITY_FAVORITE';
  sharedRecommenders?: number;
  whyCommunity?: string | null;
}

export class RecommendationEngine {
  /**
   * HackerTube scoring algorithm:
   * score = rec_months + 0.5 * months with a strong recommendation
   */
  public static calculateCommunityScore(recMonths: number, strongRecMonths: number): number {
    return recMonths + 0.5 * strongRecMonths;
  }

  /**
   * Traverses the Co-Recommendation Graph to find related videos
   * based on shared community recommenders (from HackerTube's graph design).
   */
  public static async getRelatedVideos(videoId: string, limit: number = 20): Promise<ScoredCandidate[]> {
    // 1. Check direct outbound edges in co-recommendation graph
    const directCoRecs = await prisma.coRecommendation.findMany({
      where: { sourceVideoId: videoId },
      include: {
        targetVideo: {
          select: {
            id: true,
            state: true,
            visibility: true,
            whyCommunity: true,
            communityScore: true
          }
        }
      },
      orderBy: [{ sharedRecommenders: 'desc' }, { affinityScore: 'desc' }],
      take: limit
    });

    const results: ScoredCandidate[] = [];
    const seen = new Set<string>([videoId]);

    for (const rec of directCoRecs) {
      if (
        rec.targetVideo &&
        rec.targetVideo.state === 'PUBLISHED' &&
        rec.targetVideo.visibility === 'PUBLIC' &&
        !seen.has(rec.targetVideoId)
      ) {
        seen.add(rec.targetVideoId);
        results.push({
          videoId: rec.targetVideoId,
          score: Math.min(1.0, 0.7 + rec.sharedRecommenders * 0.05),
          reason: 'CO_RECOMMENDED',
          sharedRecommenders: rec.sharedRecommenders,
          whyCommunity: rec.targetVideo.whyCommunity
        });
      }
    }

    // 2. If graph has fewer items than limit, backfill with same taxonomy area/category + community score
    if (results.length < limit) {
      const sourceVideo = await prisma.video.findUnique({
        where: { id: videoId },
        select: { taxonomyAreaId: true, taxonomyCategoryId: true, category: true }
      });

      if (sourceVideo) {
        const backfill = await prisma.video.findMany({
          where: {
            id: { notIn: Array.from(seen) },
            state: 'PUBLISHED',
            visibility: 'PUBLIC',
            OR: [
              sourceVideo.taxonomyCategoryId ? { taxonomyCategoryId: sourceVideo.taxonomyCategoryId } : {},
              sourceVideo.taxonomyAreaId ? { taxonomyAreaId: sourceVideo.taxonomyAreaId } : {},
              { category: sourceVideo.category }
            ]
          },
          orderBy: [{ communityScore: 'desc' }, { viewsCount: 'desc' }],
          take: limit - results.length,
          select: { id: true, whyCommunity: true, communityScore: true }
        });

        for (const v of backfill) {
          seen.add(v.id);
          results.push({
            videoId: v.id,
            score: 0.6 + Math.min(0.2, (v.communityScore || 0) * 0.01),
            reason: 'SIMILAR_TO_WATCHED',
            whyCommunity: v.whyCommunity
          });
        }
      }
    }

    return results;
  }

  /**
   * Generates a blended, highly personalized and scalable Home Feed:
   * 1. Subscribed channels
   * 2. Continue watching
   * 3. Graph-based co-recommendations from recently watched items
   * 4. Top community-scored evergreen content (HackerTube curation)
   * 5. Freshness-decayed trending content
   */
  public static async getHomeFeedCandidates(userId?: string, limit: number = 30): Promise<ScoredCandidate[]> {
    const candidates: Map<string, ScoredCandidate> = new Map();

    if (userId) {
      // 1. Subscribed channels
      const subs = await prisma.subscription.findMany({
        where: { userId },
        select: { channelId: true }
      });
      const channelIds = subs.map((s) => s.channelId);

      if (channelIds.length > 0) {
        const subVideos = await prisma.video.findMany({
          where: {
            channelId: { in: channelIds },
            state: 'PUBLISHED',
            visibility: 'PUBLIC'
          },
          orderBy: { publishedAt: 'desc' },
          take: 10,
          select: { id: true, whyCommunity: true }
        });

        for (const v of subVideos) {
          candidates.set(v.id, {
            videoId: v.id,
            score: 0.95,
            reason: 'SUBSCRIBED_CHANNEL',
            whyCommunity: v.whyCommunity
          });
        }
      }

      // 2. Continue watching / Watch progress
      const inProgress = await prisma.watchProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { videoId: true }
      });

      for (const p of inProgress) {
        if (!candidates.has(p.videoId)) {
          candidates.set(p.videoId, {
            videoId: p.videoId,
            score: 0.98,
            reason: 'CONTINUE_WATCHING'
          });
        }
      }

      // 3. Co-recommendations from user's recently watched progress/history
      const recentIds = inProgress.map((p) => p.videoId);
      for (const watchedId of recentIds) {
        const coRecs = await prisma.coRecommendation.findMany({
          where: { sourceVideoId: watchedId },
          take: 4,
          orderBy: { sharedRecommenders: 'desc' },
          select: { targetVideoId: true, sharedRecommenders: true }
        });

        for (const c of coRecs) {
          if (!candidates.has(c.targetVideoId)) {
            candidates.set(c.targetVideoId, {
              videoId: c.targetVideoId,
              score: 0.88 + Math.min(0.08, c.sharedRecommenders * 0.01),
              reason: 'CO_RECOMMENDED',
              sharedRecommenders: c.sharedRecommenders
            });
          }
        }
      }
    }

    // 4. Community Favorites (HackerTube scoring & Evergreen content)
    const communityFavorites = await prisma.video.findMany({
      where: {
        state: 'PUBLISHED',
        visibility: 'PUBLIC',
        communityScore: { gt: 0 }
      },
      orderBy: [{ communityScore: 'desc' }, { publishedAt: 'desc' }],
      take: 15,
      select: { id: true, communityScore: true, whyCommunity: true, shelfLife: true }
    });

    for (const v of communityFavorites) {
      if (!candidates.has(v.id)) {
        // Boost evergreen gems, slightly reduce score for older news
        const evergreenBonus = v.shelfLife === 'evergreen' ? 0.05 : 0;
        candidates.set(v.id, {
          videoId: v.id,
          score: Math.min(0.92, 0.82 + (v.communityScore || 0) * 0.005 + evergreenBonus),
          reason: 'COMMUNITY_FAVORITE',
          whyCommunity: v.whyCommunity
        });
      }
    }

    // 5. Trending & Popular (Decayed by freshness)
    const trending = await prisma.video.findMany({
      where: { state: 'PUBLISHED', visibility: 'PUBLIC' },
      orderBy: [{ viewsCount: 'desc' }, { publishedAt: 'desc' }],
      take: 15,
      select: { id: true, viewsCount: true, publishedAt: true, whyCommunity: true }
    });

    for (const v of trending) {
      if (!candidates.has(v.id)) {
        candidates.set(v.id, {
          videoId: v.id,
          score: 0.75,
          reason: 'TRENDING',
          whyCommunity: v.whyCommunity
        });
      }
    }

    return Array.from(candidates.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Helper to register co-recommendations when users engage with multiple videos
   */
  public static async recordCoRecommendation(
    sourceVideoId: string,
    targetVideoId: string,
    sharedCountDelta: number = 1
  ): Promise<void> {
    if (sourceVideoId === targetVideoId) return;

    await prisma.coRecommendation.upsert({
      where: {
        sourceVideoId_targetVideoId: {
          sourceVideoId,
          targetVideoId
        }
      },
      create: {
        sourceVideoId,
        targetVideoId,
        sharedRecommenders: sharedCountDelta,
        affinityScore: 1.0
      },
      update: {
        sharedRecommenders: { increment: sharedCountDelta },
        affinityScore: { increment: 0.1 }
      }
    });
  }
}
