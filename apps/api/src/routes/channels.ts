import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { CreateChannelSchema } from '@vionex/validation';

export async function channelRoutes(app: FastifyInstance) {
  app.get('/:handle', async (request, reply) => {
    const { handle } = request.params as { handle: string };
    const channel = await prisma.channel.findUnique({
      where: { handle },
      include: {
        videos: {
          where: { state: 'PUBLISHED', visibility: 'PUBLIC' },
          orderBy: { publishedAt: 'desc' },
          take: 30
        },
        playlists: {
          where: { visibility: 'PUBLIC' }
        }
      }
    });

    if (!channel) return reply.status(404).send({ success: false, message: 'Channel not found' });
    return reply.send({
      success: true,
      channel: {
        ...channel,
        totalViews: channel.totalViews.toString(),
        videos: channel.videos.map(v => ({
          ...v,
          viewsCount: v.viewsCount.toString(),
          originalFilesize: v.originalFilesize ? v.originalFilesize.toString() : null
        }))
      }
    });
  });
}
