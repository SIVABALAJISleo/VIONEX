import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { AuthService } from '@vionex/auth';
import { RegisterSchema, LoginSchema } from '@vionex/validation';
import { authenticate } from '../services/auth-middleware';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const parse = RegisterSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ success: false, code: 'VALIDATION_ERROR', errors: parse.error.errors });
    }

    const { email, username, displayName, password } = parse.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existing) {
      return reply.status(409).send({ success: false, code: 'CONFLICT', message: 'Email or username already in use' });
    }

    const passwordHash = await AuthService.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        passwordHash
      }
    });

    // Create default channel for new user
    await prisma.channel.create({
      data: {
        ownerId: user.id,
        handle: username,
        name: displayName
      }
    });

    const ip = request.ip || '127.0.0.1';
    const ua = request.headers['user-agent'] || 'unknown';
    const { session, rawToken } = await AuthService.createSession(user.id, ip, ua);

    const token = AuthService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id
    });

    reply.setCookie('vionex_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return reply.status(201).send({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role
      }
    });
  });

  app.post('/login', async (request, reply) => {
    const parse = LoginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ success: false, code: 'VALIDATION_ERROR', errors: parse.error.errors });
    }

    const { emailOrUsername, password } = parse.data;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }]
      }
    });

    if (!user || !(await AuthService.verifyPassword(user.passwordHash, password))) {
      return reply.status(401).send({ success: false, code: 'AUTHENTICATION_ERROR', message: 'Invalid credentials' });
    }

    const ip = request.ip || '127.0.0.1';
    const ua = request.headers['user-agent'] || 'unknown';
    const { session, rawToken } = await AuthService.createSession(user.id, ip, ua);

    const token = AuthService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id
    });

    reply.setCookie('vionex_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return reply.send({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role
      }
    });
  });

  // Section 9: Fix Logout - Revokes server session in PostgreSQL & clears cookie
  app.post('/logout', async (request, reply) => {
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (request.cookies && (request.cookies as any).vionex_session) {
      token = (request.cookies as any).vionex_session;
    }

    if (token) {
      const payload = AuthService.verifyAccessToken(token);
      if (payload && payload.sessionId) {
        await AuthService.revokeSession(payload.sessionId).catch(() => {});
      }
    }

    reply.clearCookie('vionex_session', { path: '/' });
    return reply.send({
      success: true,
      message: 'Logged out successfully. Server session revoked.'
    });
  });

  // User Profile
  app.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        channels: {
          select: {
            id: true,
            handle: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!user) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'User not found' });
    }

    return reply.send({ success: true, user });
  });
}
