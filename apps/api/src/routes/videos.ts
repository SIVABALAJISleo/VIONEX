import { FastifyInstance } from 'fastify';
import * as path from 'path';
import * as fs from 'fs';
import { Queue } from 'bullmq';
import { prisma } from '@vionex/database';
import { InitiateUploadSchema, UpdateVideoMetadataSchema } from '@vionex/validation';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const videoQueue = new Queue('video-processing', {
  connection: { host: REDIS_HOST, port: REDIS_PORT }
});

export async function videoRoutes(app: FastifyInstance) {
  // 1. Initiate upload session
  app.post('/upload/session', async (request, reply) => {
    const parse = InitiateUploadSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ success: false, errors: parse.error.errors });
    }

    const { channelId, title, description, filesize, isShort, category, visibility } = parse.data;

    const video = await prisma.video.create({
      data: {
        channelId,
        title,
        description,
        isShort,
        category,
        visibility,
        originalFilesize: BigInt(filesize),
        state: 'CREATED'
      }
    });

    return reply.status(201).send({
      success: true,
      videoId: video.id,
      chunkSize: 10 * 1024 * 1024 // 10MB chunk
    });
  });

  // 2. Upload file chunk (Multipart / Local storage)
  app.post('/upload/:id/chunk', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await request.file();
    if (!data) return reply.status(400).send({ success: false, message: 'No file received' });

    const uploadDir = path.join(process.cwd(), `data/quarantine/${id}`);
    fs.mkdirSync(uploadDir, { recursive: true });

    const chunkIndex = request.query && (request.query as any).index ? (request.query as any).index : '0';
    const chunkPath = path.join(uploadDir, `chunk_${chunkIndex}.part`);

    const out = fs.createWriteStream(chunkPath);
    await data.file.pipe(out);

    return reply.send({ success: true, chunkIndex });
  });

  // 3. Complete upload & enqueue transcoding job
  app.post('/upload/:id/complete', async (request, reply) => {
    const { id } = request.params as { id: string };
    const uploadDir = path.join(process.cwd(), `data/quarantine/${id}`);
    const finalMasterPath = path.join(uploadDir, 'master_raw.mp4');

    if (!fs.existsSync(uploadDir)) {
      return reply.status(404).send({ success: false, message: 'Upload session not found' });
    }

    // Assemble parts
    const parts = fs.readdirSync(uploadDir).filter(f => f.endsWith('.part')).sort();
    const dest = fs.createWriteStream(finalMasterPath);
    for (const part of parts) {
      const partData = fs.readFileSync(path.join(uploadDir, part));
      dest.write(partData);
    }
    dest.end();

    await prisma.video.update({
      where: { id },
      data: { state: 'UPLOADED', masterUrl: finalMasterPath }
    });

    // Enqueue transcoding job
    await videoQueue.add('transcode', { videoId: id, rawFilePath: finalMasterPath });

    return reply.send({ success: true, message: 'Upload completed and queued for processing', videoId: id });
  });

  // 4. Get video details by ID
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        channel: {
          select: { id: true, handle: true, name: true, avatarUrl: true, isVerified: true, subscriberCount: true }
        },
        renditions: true,
        chapters: { orderBy: { startTime: 'asc' } },
        subtitles: true
      }
    });

    if (!video) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Video not found' });
    }

    return reply.send({
      success: true,
      video: {
        ...video,
        originalFilesize: video.originalFilesize ? video.originalFilesize.toString() : null,
        viewsCount: video.viewsCount.toString()
      }
    });
  });
}
