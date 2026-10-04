/**
 * VIONEX Live Streaming Engine & Chat Replay Architecture
 * Supports low-latency live broadcast management, live chat replay archiving,
 * and comprehensive stream ending analytics.
 */

export interface LiveChatReplayArchiveConfig {
  streamId: string;
  channelId: string;
  enableChatReplay: boolean;
  syncWithVodTimestamp: boolean;
  anonymizeModeratedMessages: boolean;
  exportChatJson: boolean;
  retentionDays: number;
}

export interface StreamEndingMetrics {
  streamId: string;
  title: string;
  durationSeconds: number;
  peakConcurrentViewers: number;
  totalViews: number;
  totalWatchTimeHours: number;
  averageViewDurationSeconds: number;
  totalChatMessages: number;
  chatMessagePeakPerMinute: number;
  newSubscribersGained: number;
  superChatTotalRevenueUSD: number;
  highestViewerRegion: string;
}

export interface LiveStreamSummary {
  streamId: string;
  broadcastEndedAt: string;
  metrics: StreamEndingMetrics;
  chatArchiveStatus: 'ARCHIVED' | 'PROCESSING' | 'DISABLED';
  vodUrl: string;
}

/**
 * Configure or update Live Chat Replay Archiving for a broadcast (CREAT-059)
 */
export function configureLiveChatReplayArchive(config: Partial<LiveChatReplayArchiveConfig>): LiveChatReplayArchiveConfig {
  const defaultConfig: LiveChatReplayArchiveConfig = {
    streamId: config.streamId || 'live_stream_default',
    channelId: config.channelId || 'vionex-labs',
    enableChatReplay: config.enableChatReplay ?? true,
    syncWithVodTimestamp: config.syncWithVodTimestamp ?? true,
    anonymizeModeratedMessages: config.anonymizeModeratedMessages ?? true,
    exportChatJson: config.exportChatJson ?? true,
    retentionDays: config.retentionDays || 365,
  };
  return defaultConfig;
}

/**
 * Calculate Stream Ending Statistics Summary (LIVE-030)
 */
export function calculateStreamEndingSummary(metrics: Partial<StreamEndingMetrics>): LiveStreamSummary {
  const duration = metrics.durationSeconds || 7200; // 2 hours default
  const peakViewers = metrics.peakConcurrentViewers || 14850;
  const views = metrics.totalViews || 84200;
  const avgDuration = metrics.averageViewDurationSeconds || 980;
  const totalWatchHours = Math.round(((views * avgDuration) / 3600) * 10) / 10;

  const resolvedMetrics: StreamEndingMetrics = {
    streamId: metrics.streamId || 'stream_live_101',
    title: metrics.title || 'VIONEX Platform Launch Keynote',
    durationSeconds: duration,
    peakConcurrentViewers: peakViewers,
    totalViews: views,
    totalWatchTimeHours: totalWatchHours,
    averageViewDurationSeconds: avgDuration,
    totalChatMessages: metrics.totalChatMessages || 34200,
    chatMessagePeakPerMinute: metrics.chatMessagePeakPerMinute || 450,
    newSubscribersGained: metrics.newSubscribersGained || 1840,
    superChatTotalRevenueUSD: metrics.superChatTotalRevenueUSD || 2940.50,
    highestViewerRegion: metrics.highestViewerRegion || 'ap-south-1 (Mumbai)',
  };

  return {
    streamId: resolvedMetrics.streamId,
    broadcastEndedAt: new Date().toISOString(),
    metrics: resolvedMetrics,
    chatArchiveStatus: 'ARCHIVED',
    vodUrl: `/watch/${resolvedMetrics.streamId}`,
  };
}

/**
 * Generate Embed Player URL with interactive Live Chat popup integration (LIVE-029)
 */
export function generateLiveEmbedConfig(streamId: string) {
  return {
    embedUrl: `/embed/live/${streamId}`,
    chatPopoutUrl: `/live/chat-popout?id=${streamId}`,
    iframeCode: `<iframe width="100%" height="540" src="https://vionex.video/embed/live/${streamId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    supportsInteractiveChat: true,
  };
}
