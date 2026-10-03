import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';

export async function socialRoutes(app: FastifyInstance) {
  // Subscribe to channel
  app.post('/subscribe/:channelId', async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const userId = (request as any).user?.id || 'demo-user-id';

    await prisma.subscription.upsert({
      where: { userId_channelId: { userId, channelId } },
      create: { userId, channelId },
      update: {}
    });

    await prisma.channel.update({
      where: { id: channelId },
      data: { subscriberCount: { increment: 1 } }
    });

    return reply.send({ success: true, subscribed: true });
  });

  // Unsubscribe
  app.post('/unsubscribe/:channelId', async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const userId = (request as any).user?.id || 'demo-user-id';

    try {
      await prisma.subscription.delete({
        where: { userId_channelId: { userId, channelId } }
      });
      await prisma.channel.update({
        where: { id: channelId },
        data: { subscriberCount: { decrement: 1 } }
      });
    } catch {}

    return reply.send({ success: true, subscribed: false });
  });
}
