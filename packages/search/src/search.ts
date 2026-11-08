import { TaxonomyService } from './taxonomy';

export interface SearchableItem {
  id: string;
  title: string;
  description?: string | null;
  tags?: string[];
  summary?: string | null;
  whyCommunity?: string | null;
  category?: string;
  taxonomyAreaId?: string | null;
  taxonomyCategoryId?: string | null;
  contentType?: string | null;
  level?: string | null;
  shelfLife?: string | null;
  communityScore?: number;
  publishedAt?: Date | string | null;
  viewsCount?: bigint | number;
}

export interface SearchFilterOptions {
  query?: string;
  areaId?: string;
  categoryId?: string;
  contentType?: string;
  level?: string;
  shelfLife?: string;
  minCommunityScore?: number;
  hideStaleNews?: boolean;
}

export interface ScoredSearchResult<T extends SearchableItem> {
  item: T;
  score: number;
  matchedCategories: string[];
  matchedTerms: string[];
}

export class SearchEngine {
  private taxonomyService: TaxonomyService;

  constructor() {
    this.taxonomyService = TaxonomyService.getInstance();
  }

  public scoreAndRank<T extends SearchableItem>(
    items: T[],
    options: SearchFilterOptions,
    limit: number = 30
  ): ScoredSearchResult<T>[] {
    const rawQuery = (options.query || '').trim().toLowerCase();
    const queryTokens = rawQuery
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 2);

    // Expand query with matching taxonomy synonyms
    const matchedTaxonomyCats = this.taxonomyService.searchCategories(rawQuery, 3);
    const expandedSynonyms = new Set<string>();
    for (const cat of matchedTaxonomyCats) {
      for (const syn of this.taxonomyService.expandKeywords(cat.id)) {
        expandedSynonyms.add(syn);
      }
    }

    const results: ScoredSearchResult<T>[] = [];
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    for (const item of items) {
      // 1. Hard filters
      if (options.areaId && item.taxonomyAreaId !== options.areaId) continue;
      if (options.categoryId && item.taxonomyCategoryId !== options.categoryId) continue;
      if (options.contentType && item.contentType && item.contentType !== options.contentType) continue;
      if (options.level && item.level && item.level !== options.level) continue;
      if (options.shelfLife && item.shelfLife && item.shelfLife !== options.shelfLife) continue;

      if (options.minCommunityScore && (item.communityScore || 0) < options.minCommunityScore) {
        continue;
      }

      // Check stale news
      if (options.hideStaleNews !== false && item.shelfLife === 'news' && item.publishedAt) {
        const pubTime = new Date(item.publishedAt).getTime();
        if (now - pubTime > thirtyDaysMs) {
          continue; // Automatically filter out transient news that expired
        }
      }

      // 2. Score calculations
      let textScore = 0;
      const matchedTerms: string[] = [];

      const titleLower = (item.title || '').toLowerCase();
      const descLower = (item.description || '').toLowerCase();
      const whyLower = (item.whyCommunity || '').toLowerCase();
      const tagsJoined = (item.tags || []).join(' ').toLowerCase();

      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          let termMatched = false;
          // Exact title match gets highest weight
          if (titleLower.includes(token)) {
            textScore += 5;
            termMatched = true;
          }
          if (whyLower.includes(token)) {
            textScore += 3;
            termMatched = true;
          }
          if (tagsJoined.includes(token)) {
            textScore += 2;
            termMatched = true;
          }
          if (descLower.includes(token)) {
            textScore += 1;
            termMatched = true;
          }
          if (termMatched) {
            matchedTerms.push(token);
          }
        }

        // Check taxonomy synonym matches
        let taxonomyScore = 0;
        for (const syn of expandedSynonyms) {
          if (titleLower.includes(syn) || tagsJoined.includes(syn) || whyLower.includes(syn)) {
            taxonomyScore += 1.5;
          }
        }

        // Normalize text score
        const maxExpectedText = queryTokens.length * 5;
        const normText = Math.min(1.0, textScore / (maxExpectedText || 1));
        const normTaxonomy = Math.min(1.0, taxonomyScore / 5);

        // Community score weight (normalized up to 30.0 score)
        const commScore = Math.min(1.0, (item.communityScore || 0) / 30);

        // Evergreen longevity bonus
        const longevityBonus = item.shelfLife === 'evergreen' ? 0.15 : 0;

        const totalScore = normText * 0.5 + normTaxonomy * 0.2 + commScore * 0.2 + longevityBonus;

        if (textScore > 0 || taxonomyScore > 0) {
          results.push({
            item,
            score: totalScore,
            matchedCategories: matchedTaxonomyCats.map((c) => c.name),
            matchedTerms
          });
        }
      } else {
        // Query is empty: sort by pure quality (community score + freshness/evergreen)
        const commScore = (item.communityScore || 0) / 30;
        const evergreenBonus = item.shelfLife === 'evergreen' ? 0.3 : 0;
        const viewsFactor = Math.log10(Number(item.viewsCount || 1) + 1) / 10;
        const totalScore = commScore * 0.5 + evergreenBonus + viewsFactor * 0.2;

        results.push({
          item,
          score: totalScore,
          matchedCategories: [],
          matchedTerms: []
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

