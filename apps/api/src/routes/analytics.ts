import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { TelemetrySchema } from '@vionex/validation';

export async function analyticsRoutes(app: FastifyInstance) {
  // Deduplicated View & Watch Time Telemetry Beacon
  app.post('/telemetry', async (request, reply) => {
    const parse = TelemetrySchema.safeParse(request.body);
    if (!parse.success) return reply.status(400).send({ success: false, errors: parse.error.errors });

    const { videoId, viewerSessionHash, watchedSeconds, currentPosition } = parse.data;

    // View registered once viewer has watched at least 30 cumulative seconds
    if (watchedSeconds >= 30) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if view already recorded today for this session
      const existingView = await prisma.view.findFirst({
        where: {
          videoId,
          viewerHash: viewerSessionHash,
          createdAt: { gte: today }
        }
      });

      if (!existingView) {
        await prisma.view.create({
          data: {
            videoId,
            viewerHash: viewerSessionHash,
            watchedSeconds,
            completed: false
          }
        });

        await prisma.video.update({
          where: { id: videoId },
          data: { viewsCount: { increment: 1 } }
        });
      }
    }

    return reply.send({ success: true, recorded: true });
  });
}
