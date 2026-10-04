import { api, ApiResponse } from './client';

// 1. AUTH & SESSIONS
export const authApi = {
  async register(data: { email: string; username: string; displayName: string; password: string }) {
    const res = await api.post('/auth/register', data);
    if (res.success && res.token) api.setToken(res.token);
    return res;
  },

  async login(data: { emailOrUsername: string; password: string }) {
    const res = await api.post('/auth/login', data);
    if (res.success && res.token) api.setToken(res.token);
    return res;
  },

  async logout() {
    const res = await api.post('/auth/logout');
    api.setToken(null);
    return res;
  },

  async me() {
    return api.get('/auth/me');
  }
};

// 2. CHANNELS
export const channelsApi = {
  async getByHandle(handle: string) {
    return api.get(`/channels/${handle}`);
  },

  async subscribe(channelId: string) {
    return api.post(`/channels/${channelId}/subscribe`);
  },

  async unsubscribe(channelId: string) {
    return api.delete(`/channels/${channelId}/subscribe`);
  },

  async updateChannel(channelId: string, data: any) {
    return api.put(`/channels/${channelId}`, data);
  }
};

// 3. VIDEOS & PLAYBACK
export const videosApi = {
  async list(params?: { category?: string; page?: number; limit?: number }) {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return api.get(`/videos${qs}`);
  },

  async getById(id: string) {
    return api.get(`/videos/${id}`);
  },

  async getSignedPlaybackToken(videoId: string) {
    return api.post(`/videos/${videoId}/playback-token`);
  },

  async update(videoId: string, data: any) {
    return api.put(`/videos/${videoId}`, data);
  },

  async delete(videoId: string) {
    return api.delete(`/videos/${videoId}`);
  }
};

// 4. CHUNKED RESUMABLE UPLOADS
export const uploadsApi = {
  async createSession(metadata: { title: string; filename: string; size: number; mimeType: string }) {
    return api.post('/videos/upload-session', metadata);
  },

  async uploadChunk(sessionId: string, chunkIndex: number, chunk: Blob, checksum: string) {
    const formData = new FormData();
    formData.append('chunkIndex', String(chunkIndex));
    formData.append('checksum', checksum);
    formData.append('file', chunk);

    return fetch(`${api.getToken() ? '/api/v1' : 'http://localhost:4000/api/v1'}/videos/upload/${sessionId}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(r => r.json());
  },

  async completeSession(sessionId: string, totalChecksum: string) {
    return api.post(`/videos/upload/${sessionId}/complete`, { totalChecksum });
  },

  async getStatus(sessionId: string) {
    return api.get(`/videos/upload/${sessionId}/status`);
  }
};

// 5. COMMENTS & THREADS
export const commentsApi = {
  async getForVideo(videoId: string, sort: 'top' | 'newest' = 'top') {
    return api.get(`/comments/video/${videoId}?sort=${sort}`);
  },

  async addComment(videoId: string, text: string) {
    return api.post(`/comments/video/${videoId}`, { text });
  },

  async addReply(commentId: string, text: string) {
    return api.post(`/comments/${commentId}/reply`, { text });
  },

  async likeComment(commentId: string) {
    return api.post(`/comments/${commentId}/like`);
  },

  async pinComment(commentId: string) {
    return api.post(`/comments/${commentId}/pin`);
  },

  async deleteComment(commentId: string) {
    return api.delete(`/comments/${commentId}`);
  }
};

// 6. SOCIAL & ENGAGEMENT (Likes/Dislikes)
export const socialApi = {
  async likeVideo(videoId: string) {
    return api.post(`/social/video/${videoId}/like`);
  },

  async dislikeVideo(videoId: string) {
    return api.post(`/social/video/${videoId}/dislike`);
  },

  async removeReaction(videoId: string) {
    return api.delete(`/social/video/${videoId}/reaction`);
  },

  async getReactionStatus(videoId: string) {
    return api.get(`/social/video/${videoId}/status`);
  }
};

// 7. PLAYLISTS
export const playlistsApi = {
  async list() {
    return api.get('/social/playlists');
  },

  async getById(id: string) {
    return api.get(`/social/playlists/${id}`);
  },

  async create(title: string, isPrivate: boolean = false) {
    return api.post('/social/playlists', { title, isPrivate });
  },

  async addVideo(playlistId: string, videoId: string) {
    return api.post(`/social/playlists/${playlistId}/videos`, { videoId });
  },

  async removeVideo(playlistId: string, videoId: string) {
    return api.delete(`/social/playlists/${playlistId}/videos/${videoId}`);
  }
};

// 8. WATCH HISTORY & WATCH LATER
export const historyApi = {
  async getHistory() {
    return api.get('/social/history');
  },

  async recordHistory(videoId: string, progressSeconds: number) {
    return api.post('/social/history', { videoId, progressSeconds });
  },

  async clearHistory() {
    return api.delete('/social/history');
  },

  async getWatchLater() {
    return api.get('/social/watch-later');
  },

  async toggleWatchLater(videoId: string) {
    return api.post('/social/watch-later', { videoId });
  }
};

// 9. SEARCH & DISCOVERY
export const discoveryApi = {
  async search(query: string, filter?: { type?: string; sort?: string }) {
    const params = new URLSearchParams({ q: query, ...(filter as any) });
    return api.get(`/discovery/search?${params.toString()}`);
  },

  async getAutocomplete(prefix: string) {
    return api.get(`/discovery/autocomplete?q=${encodeURIComponent(prefix)}`);
  },

  async getTrending(category?: string) {
    return api.get(`/discovery/trending${category ? `?category=${category}` : ''}`);
  }
};

// 10. RECOMMENDATIONS
export const recommendationsApi = {
  async getPersonalizedFeed(limit: number = 24) {
    return api.get(`/discovery/recommendations?limit=${limit}`);
  },

  async getRelated(videoId: string) {
    return api.get(`/discovery/related/${videoId}`);
  }
};

// 11. SHORTS
export const shortsApi = {
  async getFeed(cursor?: string) {
    return api.get(`/discovery/shorts${cursor ? `?cursor=${cursor}` : ''}`);
  }
};

// 12. LIVE STREAMING & CHAT
export const liveApi = {
  async getActiveStreams() {
    return api.get('/live/streams');
  },

  async createStream(title: string, category: string) {
    return api.post('/live/stream', { title, category });
  },

  async getStreamById(id: string) {
    return api.get(`/live/stream/${id}`);
  },

  async endStream(id: string) {
    return api.post(`/live/stream/${id}/end`);
  },

  getChatWebSocketUrl(streamId: string) {
    const wsProto = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'localhost:4000' : window.location.host;
    return `${wsProto}//${host}/api/v1/live/chat/${streamId}`;
  }
};

// 13. NOTIFICATIONS
export const notificationsApi = {
  async list() {
    return api.get('/social/notifications');
  },

  async markAsRead(id: string) {
    return api.put(`/social/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.put('/social/notifications/read-all');
  }
};

// 14. ANALYTICS & TELEMETRY
export const analyticsApi = {
  async recordEvent(event: {
    type: 'play' | 'pause' | 'seek' | 'progress' | 'complete' | 'impression';
    videoId: string;
    position?: number;
    duration?: number;
  }) {
    return api.post('/analytics/events', event);
  },

  async getCreatorStats() {
    return api.get('/analytics/creator-overview');
  }
};

// 15. COPYRIGHT & CONTENT ID
export const copyrightApi = {
  async listClaims() {
    return api.get('/discovery/copyright/claims');
  },

  async submitDispute(claimId: string, reason: string) {
    return api.post(`/discovery/copyright/claims/${claimId}/dispute`, { reason });
  }
};

// 16. BILLING & MONETIZATION
export const billingApi = {
  async createCheckout(type: 'superchat' | 'membership', details: any) {
    return api.post('/discovery/billing/checkout', { type, ...details });
  },

  async getEarnings() {
    return api.get('/discovery/billing/earnings');
  }
};

// 17. ADMIN & MODERATION
export const adminApi = {
  async getModerationQueue() {
    return api.get('/discovery/admin/moderation');
  },

  async actionContent(contentId: string, action: string, reason: string) {
    return api.post('/discovery/admin/action', { contentId, action, reason });
  }
};
