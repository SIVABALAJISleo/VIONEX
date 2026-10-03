import { prisma } from '@vionex/database';

export interface ScoredCandidate {
  videoId: string;
  score: number;
  reason: 'SUBSCRIBED_CHANNEL' | 'SIMILAR_TO_WATCHED' | 'TRENDING' | 'CONTINUE_WATCHING' | 'TOPIC_AFFINITY';
}

export class RecommendationEngine {
  static async getHomeFeedCandidates(userId?: string, limit: number = 30): Promise<ScoredCandidate[]> {
    const candidates: Map<string, ScoredCandidate> = new Map();

    // 1. If user is authenticated, pull from subscribed channels
    if (userId) {
      const subs = await prisma.subscription.findMany({
        where: { userId },
        select: { channelId: true }
      });
      const channelIds = subs.map(s => s.channelId);

      if (channelIds.length > 0) {
        const subVideos = await prisma.video.findMany({
          where: {
            channelId: { in: channelIds },
            state: 'PUBLISHED',
            visibility: 'PUBLIC'
          },
          orderBy: { publishedAt: 'desc' },
          take: 15,
          select: { id: true, publishedAt: true }
        });

        for (const v of subVideos) {
          candidates.set(v.id, {
            videoId: v.id,
            score: 0.95,
            reason: 'SUBSCRIBED_CHANNEL'
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
    }

    // 3. Trending & Popular Content (Decayed by freshness)
    const trending = await prisma.video.findMany({
      where: { state: 'PUBLISHED', visibility: 'PUBLIC' },
      orderBy: [{ viewsCount: 'desc' }, { publishedAt: 'desc' }],
      take: 20,
      select: { id: true, viewsCount: true, publishedAt: true }
    });

    for (const v of trending) {
      if (!candidates.has(v.id)) {
        candidates.set(v.id, {
          videoId: v.id,
          score: 0.75,
          reason: 'TRENDING'
        });
      }
    }

    return Array.from(candidates.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
