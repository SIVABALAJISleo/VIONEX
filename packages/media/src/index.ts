import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface VideoResolutionProfile {
  resolution: string;
  width: number;
  height: number;
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  maxRateKbps: number;
  bufSizeKbps: number;
}

export const TRANSCODING_PROFILES: VideoResolutionProfile[] = [
  { resolution: '240p',  width: 426,  height: 240,  videoBitrateKbps: 400,   audioBitrateKbps: 64,  maxRateKbps: 450,   bufSizeKbps: 800 },
  { resolution: '360p',  width: 640,  height: 360,  videoBitrateKbps: 800,   audioBitrateKbps: 96,  maxRateKbps: 900,   bufSizeKbps: 1600 },
  { resolution: '480p',  width: 854,  height: 480,  videoBitrateKbps: 1400,  audioBitrateKbps: 128, maxRateKbps: 1600,  bufSizeKbps: 2800 },
  { resolution: '720p',  width: 1280, height: 720,  videoBitrateKbps: 2800,  audioBitrateKbps: 128, maxRateKbps: 3200,  bufSizeKbps: 5600 },
  { resolution: '1080p', width: 1920, height: 1080, videoBitrateKbps: 5000,  audioBitrateKbps: 192, maxRateKbps: 5500,  bufSizeKbps: 10000 },
  { resolution: '1440p', width: 2560, height: 1440, videoBitrateKbps: 9000,  audioBitrateKbps: 256, maxRateKbps: 10000, bufSizeKbps: 18000 },
  { resolution: '2160p', width: 3840, height: 2160, videoBitrateKbps: 16000, audioBitrateKbps: 320, maxRateKbps: 18000, bufSizeKbps: 32000 }
];

export interface MediaProbeResult {
  duration: number;
  width: number;
  height: number;
  codec: string;
  bitrate: number;
  hasAudio: boolean;
}

export class MediaProcessor {
  private ffmpegPath: string;
  private ffprobePath: string;

  constructor(ffmpegPath: string = 'ffmpeg', ffprobePath: string = 'ffprobe') {
    this.ffmpegPath = process.env.FFMPEG_PATH || ffmpegPath;
    this.ffprobePath = process.env.FFPROBE_PATH || ffprobePath;
  }

  async probeMedia(inputPath: string): Promise<MediaProbeResult> {
    const args = [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      inputPath
    ];

    try {
      const { stdout } = await execFileAsync(this.ffprobePath, args);
      const data = JSON.parse(stdout);
      const videoStream = data.streams?.find((s: any) => s.codec_type === 'video');
      const audioStream = data.streams?.find((s: any) => s.codec_type === 'audio');

      if (!videoStream) throw new Error('No valid video stream found in uploaded file');

      return {
        duration: parseFloat(data.format?.duration || '0'),
        width: parseInt(videoStream.width || '0', 10),
        height: parseInt(videoStream.height || '0', 10),
        codec: videoStream.codec_name || 'unknown',
        bitrate: parseInt(data.format?.bit_rate || '0', 10),
        hasAudio: !!audioStream
      };
    } catch (e: any) {
      throw new Error(`Media probe failed: ${e.message}`);
    }
  }

  async generateHLS(
    inputPath: string,
    outputDir: string,
    profile: VideoResolutionProfile,
    segmentDurationSec: number = 4
  ): Promise<string> {
    fs.mkdirSync(outputDir, { recursive: true });
    const playlistFile = `${profile.resolution}.m3u8`;
    const segmentPattern = `${profile.resolution}_%04d.ts`;

    const args = [
      '-y',
      '-i', inputPath,
      '-vf', `scale=w=${profile.width}:h=${profile.height}:force_original_aspect_ratio=decrease,pad=${profile.width}:${profile.height}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-b:v', `${profile.videoBitrateKbps}k`,
      '-maxrate', `${profile.maxRateKbps}k`,
      '-bufsize', `${profile.bufSizeKbps}k`,
      '-g', '60',
      '-keyint_min', '60',
      '-sc_threshold', '0',
      '-c:a', 'aac',
      '-b:a', `${profile.audioBitrateKbps}k`,
      '-ar', '48000',
      '-hls_time', segmentDurationSec.toString(),
      '-hls_playlist_type', 'vod',
      '-hls_segment_filename', path.join(outputDir, segmentPattern),
      path.join(outputDir, playlistFile)
    ];

    await execFileAsync(this.ffmpegPath, args);
    return path.join(outputDir, playlistFile);
  }

  generateMasterManifest(
    renditions: { profile: VideoResolutionProfile; relativePlaylistPath: string }[]
  ): string {
    const lines = [
      '#EXTM3U',
      '#EXT-X-VERSION:3'
    ];

    for (const r of renditions) {
      const totalBitrate = (r.profile.videoBitrateKbps + r.profile.audioBitrateKbps) * 1000;
      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${totalBitrate},RESOLUTION=${r.profile.width}x${r.profile.height},NAME="${r.profile.resolution}"`,
        r.relativePlaylistPath
      );
    }

    return lines.join('\n');
  }

  async extractThumbnail(inputPath: string, outputPath: string, timestampSec: number = 2.0): Promise<void> {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const args = [
      '-y',
      '-ss', timestampSec.toString(),
      '-i', inputPath,
      '-vframes', '1',
      '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease',
      outputPath
    ];
    await execFileAsync(this.ffmpegPath, args);
  }

  async generateSpriteSheet(inputPath: string, outputDir: string, durationSec: number): Promise<{ spriteUrl: string; vttUrl: string }> {
    fs.mkdirSync(outputDir, { recursive: true });
    const spritePath = path.join(outputDir, 'sprites.webp');
    const vttPath = path.join(outputDir, 'sprites.vtt');

    const interval = Math.max(1, Math.floor(durationSec / 100)); // 100 tiles max
    const args = [
      '-y',
      '-i', inputPath,
      '-vf', `fps=1/${interval},scale=160:90,tile=10x10`,
      spritePath
    ];

    await execFileAsync(this.ffmpegPath, args);

    // Generate sprites.vtt
    const vttLines = ['WEBVTT', ''];
    let tileIndex = 0;
    for (let t = 0; t < durationSec; t += interval) {
      const start = new Date(t * 1000).toISOString().substr(11, 8);
      const end = new Date(Math.min(durationSec, t + interval) * 1000).toISOString().substr(11, 8);
      const x = (tileIndex % 10) * 160;
      const y = Math.floor(tileIndex / 10) * 90;
      vttLines.push(`${start}.000 --> ${end}.000`);
      vttLines.push(`sprites.webp#xywh=${x},${y},160,90`, '');
      tileIndex++;
    }

    fs.writeFileSync(vttPath, vttLines.join('\n'), 'utf-8');
    return { spriteUrl: 'sprites.webp', vttUrl: 'sprites.vtt' };
  }
}

export class ResourceGovernor {
  static getEligibleProfiles(sourceWidth: number, sourceHeight: number, freeMemoryBytes: number): VideoResolutionProfile[] {
    const profiles = TRANSCODING_PROFILES.filter(p => p.width <= sourceWidth && p.height <= sourceHeight);
    if (profiles.length === 0) {
      return [TRANSCODING_PROFILES[0]]; // fallback to lowest 240p
    }

    // In constrained environments (< 1GB RAM free), limit highest profile to 720p
    if (freeMemoryBytes < 1024 * 1024 * 1024) {
      return profiles.filter(p => p.height <= 720);
    }

    return profiles;
  }
}
