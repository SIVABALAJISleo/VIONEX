import { TaxonomyAreaItem, TaxonomyCategoryItem } from '@vionex/shared-types';
import rawTaxonomy from './taxonomy.json';

interface RawCategory {
  id: string;
  name: string;
  description: string;
}

interface RawArea {
  id: string;
  name: string;
  categories: RawCategory[];
}

interface RawTaxonomyData {
  version: string;
  areas: RawArea[];
}

export class TaxonomyService {
  private static instance: TaxonomyService;
  private data: RawTaxonomyData;
  private categoryMap: Map<string, TaxonomyCategoryItem> = new Map();
  private areaMap: Map<string, TaxonomyAreaItem> = new Map();
  private keywordIndex: Map<string, Set<string>> = new Map();

  private constructor() {
    this.data = rawTaxonomy as RawTaxonomyData;
    this.buildIndexes();
  }

  public static getInstance(): TaxonomyService {
    if (!TaxonomyService.instance) {
      TaxonomyService.instance = new TaxonomyService();
    }
    return TaxonomyService.instance;
  }

  private buildIndexes() {
    for (const area of this.data.areas) {
      this.areaMap.set(area.id, {
        id: area.id,
        name: area.name,
        categories: area.categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description
        }))
      });

      for (const cat of area.categories) {
        const enriched: TaxonomyCategoryItem = {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          areaId: area.id,
          areaName: area.name
        };
        this.categoryMap.set(cat.id, enriched);

        // Build inverted keyword index
        const tokens = `${cat.name} ${cat.description} ${area.name}`
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter((t) => t.length > 2);

        for (const token of tokens) {
          if (!this.keywordIndex.has(token)) {
            this.keywordIndex.set(token, new Set());
          }
          this.keywordIndex.get(token)!.add(cat.id);
        }
      }
    }
  }

  public getAllAreas(): TaxonomyAreaItem[] {
    return Array.from(this.areaMap.values());
  }

  public getCategory(id: string): TaxonomyCategoryItem | undefined {
    return this.categoryMap.get(id);
  }

  public getCategoriesByArea(areaId: string): TaxonomyCategoryItem[] {
    const area = this.areaMap.get(areaId);
    if (!area) return [];
    return area.categories.map((c) => this.categoryMap.get(c.id)!);
  }

  public searchCategories(query: string, limit: number = 10): TaxonomyCategoryItem[] {
    if (!query || query.trim().length === 0) return [];
    const queryTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const scores: Map<string, number> = new Map();

    for (const token of queryTokens) {
      // Direct matches
      const matchingIds = this.keywordIndex.get(token);
      if (matchingIds) {
        for (const id of matchingIds) {
          scores.set(id, (scores.get(id) || 0) + 2);
        }
      }

      // Partial / prefix matches
      for (const [kw, ids] of this.keywordIndex.entries()) {
        if (kw.includes(token) && kw !== token) {
          for (const id of ids) {
            scores.set(id, (scores.get(id) || 0) + 1);
          }
        }
      }
    }

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.categoryMap.get(id)!)
      .filter(Boolean);
  }

  public expandKeywords(categoryId: string): string[] {
    const cat = this.categoryMap.get(categoryId);
    if (!cat) return [];
    const tokens = `${cat.name} ${cat.description}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3);
    return Array.from(new Set(tokens));
  }
}

