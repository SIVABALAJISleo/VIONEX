/**
 * High-performance vector mathematics for semantic search & embeddings.
 * Designed for 384-dimensional dense vectors (e.g., BAAI/bge-small-en-v1.5).
 */

export class VectorMath {
  public static dotProduct(a: ArrayLike<number>, b: ArrayLike<number>): number {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  public static magnitude(vec: ArrayLike<number>): number {
    let sumSquares = 0;
    for (let i = 0; i < vec.length; i++) {
      sumSquares += vec[i] * vec[i];
    }
    return Math.sqrt(sumSquares);
  }

  public static cosineSimilarity(a: ArrayLike<number>, b: ArrayLike<number>): number {
    const dot = VectorMath.dotProduct(a, b);
    const magA = VectorMath.magnitude(a);
    const magB = VectorMath.magnitude(b);
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
  }

  public static l2Normalize(vec: ArrayLike<number>): Float32Array {
    const mag = VectorMath.magnitude(vec);
    const normalized = new Float32Array(vec.length);
    if (mag === 0) return normalized;
    for (let i = 0; i < vec.length; i++) {
      normalized[i] = vec[i] / mag;
    }
    return normalized;
  }

  public static findKNearest(
    queryVector: ArrayLike<number>,
    candidates: Map<string, ArrayLike<number>>,
    topK: number = 10
  ): { id: string; score: number }[] {
    const normQuery = VectorMath.l2Normalize(queryVector);
    const scored: { id: string; score: number }[] = [];

    for (const [id, vec] of candidates.entries()) {
      const score = VectorMath.dotProduct(normQuery, vec);
      scored.push({ id, score });
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

