import { Worker, Job } from 'bullmq';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { prisma } from '@vionex/database';
import { MediaProcessor, ResourceGovernor } from '@vionex/media';
import { createStorageProvider } from '@vionex/storage';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const mediaProcessor = new MediaProcessor();
const storage = createStorageProvider();

export const mediaWorker = new Worker(
  'video-processing',
  async (job: Job) => {
    const { videoId, rawFilePath } = job.data;
    console.log(`[MediaWorker] Processing job ${job.id} for video: ${videoId}`);

    await prisma.video.update({
      where: { id: videoId },
      data: { state: 'PROCESSING' }
    });

    try {
      // 1. Probe source
      const probe = await mediaProcessor.probeMedia(rawFilePath);
      console.log(`[MediaWorker] Probed video ${videoId}: ${probe.width}x${probe.height}, ${probe.duration}s`);

      // 2. Resource Governor check
      const freeMem = os.freemem();
      const eligibleProfiles = ResourceGovernor.getEligibleProfiles(probe.width, probe.height, freeMem);
      console.log(`[MediaWorker] Transcoding profiles: ${eligibleProfiles.map(p => p.resolution).join(', ')}`);

      await prisma.video.update({
        where: { id: videoId },
        data: { state: 'TRANSCODING', duration: probe.duration }
      });

      // 3. Transcode HLS renditions
      const outputDir = path.join(process.cwd(), `data/transcoded/${videoId}`);
      fs.mkdirSync(outputDir, { recursive: true });

      const renditionsResult = [];
      for (const profile of eligibleProfiles) {
        const playlistPath = await mediaProcessor.generateHLS(rawFilePath, outputDir, profile);
        renditionsResult.push({
          profile,
          relativePlaylistPath: `${profile.resolution}.m3u8`
        });

        await prisma.videoRendition.upsert({
          where: { videoId_resolution: { videoId, resolution: profile.resolution } },
          create: {
            videoId,
            resolution: profile.resolution,
            width: profile.width,
            height: profile.height,
            bitrate: profile.videoBitrateKbps,
            hlsUrl: `/hls/${videoId}/${profile.resolution}.m3u8`
          },
          update: {
            width: profile.width,
            height: profile.height,
            bitrate: profile.videoBitrateKbps,
            hlsUrl: `/hls/${videoId}/${profile.resolution}.m3u8`
          }
        });
      }

      // 4. Generate Master Playlist
      const masterContent = mediaProcessor.generateMasterManifest(renditionsResult);
      const masterPath = path.join(outputDir, 'master.m3u8');
      fs.writeFileSync(masterPath, masterContent, 'utf-8');

      // 5. Thumbnails & Preview Sprites
      const thumbPath = path.join(outputDir, 'thumbnail.jpg');
      await mediaProcessor.extractThumbnail(rawFilePath, thumbPath, Math.min(2.0, probe.duration / 2));
      const sprites = await mediaProcessor.generateSpriteSheet(rawFilePath, outputDir, probe.duration);

      // 6. Complete and Publish
      await prisma.video.update({
        where: { id: videoId },
        data: {
          state: 'READY',
          hlsMasterUrl: `/hls/${videoId}/master.m3u8`,
          thumbnailUrl: `/hls/${videoId}/thumbnail.jpg`,
          previewSpriteUrl: `/hls/${videoId}/${sprites.vttUrl}`,
          publishedAt: new Date()
        }
      });

      console.log(`[MediaWorker] Video ${videoId} successfully published!`);
      return { success: true, videoId };
    } catch (err: any) {
      console.error(`[MediaWorker] Failed processing video ${videoId}:`, err);
      await prisma.video.update({
        where: { id: videoId },
        data: { state: 'FAILED' }
      });
      throw err;
    }
  },
  {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
    concurrency: 1 // ResourceGovernor limits concurrent heavy ffmpeg jobs
  }
);
