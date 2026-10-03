import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { CreateCommentSchema } from '@vionex/validation';

export async function commentRoutes(app: FastifyInstance) {
  // 1. List comments for video
  app.get('/video/:videoId', async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    const comments = await prisma.comment.findMany({
      where: { videoId, parentId: null, isDeleted: false },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        replies: {
          where: { isDeleted: false },
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [{ isPinned: 'desc' }, { likesCount: 'desc' }, { createdAt: 'desc' }]
    });

    return reply.send({ success: true, comments });
  });

  // 2. Post comment
  app.post('/', async (request, reply) => {
    const parse = CreateCommentSchema.safeParse(request.body);
    if (!parse.success) return reply.status(400).send({ success: false, errors: parse.error.errors });

    const { videoId, parentId, content } = parse.data;
    // In production extracted from JWT
    const userId = (request as any).user?.id || 'demo-user-id';

    const comment = await prisma.comment.create({
      data: {
        videoId,
        parentId,
        userId,
        content
      }
    });

    await prisma.video.update({
      where: { id: videoId },
      data: { commentsCount: { increment: 1 } }
    });

    return reply.status(201).send({ success: true, comment });
  });
}
