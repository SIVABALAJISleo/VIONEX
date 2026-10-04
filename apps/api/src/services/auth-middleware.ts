import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService, TokenPayload } from '@vionex/auth';
import { prisma } from '@vionex/database';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (request.cookies && (request.cookies as any).vionex_session) {
    token = (request.cookies as any).vionex_session;
  }

  if (!token) {
    return reply.status(401).send({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication token required'
    });
  }

  const payload = AuthService.verifyAccessToken(token);
  if (!payload) {
    return reply.status(401).send({
      success: false,
      code: 'TOKEN_EXPIRED',
      message: 'Access token is invalid or expired'
    });
  }

  // Check if session is revoked in database
  const isValidSession = await AuthService.validateSession(payload.sessionId);
  if (!isValidSession) {
    return reply.status(401).send({
      success: false,
      code: 'SESSION_REVOKED',
      message: 'Session has been invalidated or revoked'
    });
  }

  request.user = payload;
}

export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        code: 'FORBIDDEN',
        message: 'Insufficient permissions for this operation'
      });
    }
  };
}

export async function verifyVideoOwnership(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  if (!request.user) {
    return reply.status(401).send({ success: false, code: 'UNAUTHORIZED' });
  }

  const video = await prisma.video.findUnique({
    where: { id },
    include: { channel: true }
  });

  if (!video) {
    return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Video not found' });
  }

  if (video.channel.ownerId !== request.user.userId && !['ADMIN', 'SUPER_ADMIN'].includes(request.user.role)) {
    return reply.status(403).send({
      success: false,
      code: 'FORBIDDEN',
      message: 'You do not own this video resource'
    });
  }
}
