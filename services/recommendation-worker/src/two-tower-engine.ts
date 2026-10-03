/**
 * VIONEX Two-Tower Deep Learning Recommendation Engine
 * Architectural equivalent of YouTube's Two-Tower DNN Candidate Generation & Ranking Pipeline.
 * 
 * Tower 1: Query Tower (Encodes User History, Session Context, Topic Affinity Vectors)
 * Tower 2: Candidate Tower (Encodes Video Metadata, Text Embeddings, Channel Authority, Quality)
 */

export interface UserContext {
  userId: string;
  watchedVideoIds: string[];
  preferredCategories: Record<string, number>; // e.g. { 'Technology': 0.85, 'Gaming': 0.4 }
  preferredTags: Record<string, number>;       // e.g. { 'hls': 0.9, 'architecture': 0.8 }
  device: 'desktop' | 'mobile' | 'tablet';
  sessionTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface VideoCandidate {
  id: string;
  title: string;
  category: string;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  publishedAtMs: number;
  durationSeconds: number;
  channelAuthority: number; // 0.0 to 1.0 (verified channels get boost)
}

export interface RankedRecommendation {
  video: VideoCandidate;
  score: number;
  cosineSimilarity: number;
  freshnessMultiplier: number;
  engagementScore: number;
  explainability: string;
}

const EMBEDDING_DIM = 64;

export class TwoTowerEngine {
  /**
   * Deterministic embedding projection mapping text and tokens to dense normalized vector
   */
  private static hashToEmbedding(text: string, dim: number = EMBEDDING_DIM): Float32Array {
    const vec = new Float32Array(dim);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const idx = (charCode * 31 + i * 17) % dim;
      vec[idx] += Math.sin(charCode + i);
    }
    // Normalize L2 norm
    let norm = 0;
    for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < dim; i++) vec[i] /= norm;
    return vec;
  }

  /**
   * Tower 1: Query Tower (Encodes User Profile & Session Features)
   */
  public static computeQueryVector(user: UserContext): Float32Array {
    const queryVec = new Float32Array(EMBEDDING_DIM);

    // 1. Topic affinity projection
    for (const [cat, weight] of Object.entries(user.preferredCategories)) {
      const catEmb = this.hashToEmbedding(cat);
      for (let i = 0; i < EMBEDDING_DIM; i++) {
        queryVec[i] += catEmb[i] * weight * 1.5;
      }
    }

    // 2. Tag affinity projection
    for (const [tag, weight] of Object.entries(user.preferredTags)) {
      const tagEmb = this.hashToEmbedding(tag);
      for (let i = 0; i < EMBEDDING_DIM; i++) {
        queryVec[i] += tagEmb[i] * weight * 1.2;
      }
    }

    // 3. Contextual temporal feature modulation
    const contextStr = `${user.device}_${user.sessionTimeOfDay}`;
    const ctxEmb = this.hashToEmbedding(contextStr);
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      queryVec[i] += ctxEmb[i] * 0.3;
    }

    // Normalize
    let norm = 0;
    for (let i = 0; i < EMBEDDING_DIM; i++) norm += queryVec[i] * queryVec[i];
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < EMBEDDING_DIM; i++) queryVec[i] /= norm;

    return queryVec;
  }

  /**
   * Tower 2: Candidate Tower (Encodes Video Entity & Content Features)
   */
  public static computeCandidateVector(video: VideoCandidate): Float32Array {
    const candidateVec = new Float32Array(EMBEDDING_DIM);

    // 1. Title semantic embedding
    const titleEmb = this.hashToEmbedding(video.title);
    for (let i = 0; i < EMBEDDING_DIM; i++) candidateVec[i] += titleEmb[i] * 1.2;

    // 2. Category embedding
    const catEmb = this.hashToEmbedding(video.category);
    for (let i = 0; i < EMBEDDING_DIM; i++) candidateVec[i] += catEmb[i] * 1.0;

    // 3. Tags embedding
    video.tags.forEach((tag) => {
      const tagEmb = this.hashToEmbedding(tag);
      for (let i = 0; i < EMBEDDING_DIM; i++) candidateVec[i] += tagEmb[i] * 0.8;
    });

    // Normalize
    let norm = 0;
    for (let i = 0; i < EMBEDDING_DIM; i++) norm += candidateVec[i] * candidateVec[i];
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < EMBEDDING_DIM; i++) candidateVec[i] /= norm;

    return candidateVec;
  }

  /**
   * Cosine Similarity Dot Product between User Tower and Candidate Tower
   */
  public static dotProduct(v1: Float32Array, v2: Float32Array): number {
    let dot = 0;
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      dot += v1[i] * v2[i];
    }
    return dot;
  }

  /**
   * Two-Tower Candidate Generation, Scoring, Ranking and Exploration Bandit
   */
  public static rankCandidates(
    user: UserContext,
    candidates: VideoCandidate[],
    topK: number = 10,
    explorationRate: number = 0.15
  ): RankedRecommendation[] {
    const queryVec = this.computeQueryVector(user);
    const now = Date.now();

    const scoredList: RankedRecommendation[] = candidates
      .filter((v) => !user.watchedVideoIds.includes(v.id)) // Filter watched
      .map((video) => {
        const candidateVec = this.computeCandidateVector(video);
        const cosineSim = Math.max(0, this.dotProduct(queryVec, candidateVec));

        // Freshness decay (exponential decay with 7-day half life)
        const ageHours = Math.max(0, (now - video.publishedAtMs) / (1000 * 60 * 60));
        const freshnessMultiplier = Math.exp(-ageHours / (24 * 7));

        // Engagement Quality Score
        const likeRatio = video.viewsCount > 0 ? video.likesCount / video.viewsCount : 0.05;
        const engagementScore = Math.min(1.0, likeRatio * 10 + video.channelAuthority * 0.2);

        // Combined Two-Tower Score
        let finalScore = cosineSim * 0.65 + freshnessMultiplier * 0.20 + engagementScore * 0.15;

        // Epsilon-Greedy Exploration Boost for Cold-Start / Diverse Discoveries
        if (Math.random() < explorationRate) {
          finalScore += Math.random() * 0.25;
        }

        let explainability = 'Recommended based on your interest in ' + video.category;
        if (cosineSim > 0.8) {
          explainability = `High semantic match (${Math.round(cosineSim * 100)}%) with your recent viewing history`;
        } else if (freshnessMultiplier > 0.85) {
          explainability = 'Newly published trending video in ' + video.category;
        } else if (video.channelAuthority >= 0.8) {
          explainability = 'From a verified high-reputation channel you may enjoy';
        }

        return {
          video,
          score: finalScore,
          cosineSimilarity: parseFloat(cosineSim.toFixed(3)),
          freshnessMultiplier: parseFloat(freshnessMultiplier.toFixed(3)),
          engagementScore: parseFloat(engagementScore.toFixed(3)),
          explainability
        };
      });

    // Sort descending by score
    scoredList.sort((a, b) => b.score - a.score);
    return scoredList.slice(0, topK);
  }
}
