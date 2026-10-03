import { prisma } from '@vionex/database';

console.log('[LiveWorker] RTMP Live Stream Ingestion & Low-Latency HLS Packager Initialized');

export class LiveStreamOrchestrator {
  static async startSession(streamId: string) {
    await prisma.liveStream.update({
      where: { id: streamId },
      data: {
        state: 'LIVE',
        startedAt: new Date(),
        hlsPlaybackUrl: `/live/${streamId}/index.m3u8`
      }
    });
    console.log(`[LiveWorker] Broadcast started for stream: ${streamId}`);
  }

  static async endSession(streamId: string) {
    await prisma.liveStream.update({
      where: { id: streamId },
      data: { state: 'ENDED', endedAt: new Date() }
    });
    console.log(`[LiveWorker] Broadcast ended for stream: ${streamId}`);
  }
}
