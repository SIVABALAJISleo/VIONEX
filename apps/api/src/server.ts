import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import websocket from '@fastify/websocket';
import { authRoutes } from './routes/auth';
import { channelRoutes } from './routes/channels';
import { videoRoutes } from './routes/videos';
import { commentRoutes } from './routes/comments';
import { socialRoutes } from './routes/social';
import { discoveryRoutes } from './routes/discovery';
import { analyticsRoutes } from './routes/analytics';
import { liveRoutes } from './routes/live';

const fastify = Fastify({
  logger: process.env.NODE_ENV !== 'production'
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
  });

  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'vionex-cookie-secret-min-32-chars-long!'
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false // Allows HLS.js streaming
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024 // 100MB chunk limit
    }
  });

  await fastify.register(websocket);

  // Health and Observability
  fastify.get('/health', async () => ({ status: 'UP', service: 'vionex-api', timestamp: new Date() }));
  fastify.get('/ready', async () => ({ ready: true }));
  fastify.get('/version', async () => ({ version: '0.1.0', gitCommit: 'HEAD', env: process.env.NODE_ENV }));

  // Register API domain routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(channelRoutes, { prefix: '/api/v1/channels' });
  fastify.register(videoRoutes, { prefix: '/api/v1/videos' });
  fastify.register(commentRoutes, { prefix: '/api/v1/comments' });
  fastify.register(socialRoutes, { prefix: '/api/v1/social' });
  fastify.register(discoveryRoutes, { prefix: '/api/v1/discovery' });
  fastify.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
  fastify.register(liveRoutes, { prefix: '/api/v1/live' });

  // Global Error Handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      success: false,
      code: error.code || 'INTERNAL_ERROR',
      message: statusCode === 500 ? 'An unexpected internal error occurred' : error.message
    });
  });

  const PORT = parseInt(process.env.PORT || '4000', 10);
  const HOST = process.env.HOST || '0.0.0.0';

  await fastify.listen({ port: PORT, host: HOST });
  console.log(`[VIONEX API] Server listening on http://${HOST}:${PORT}`);
}

bootstrap().catch(err => {
  console.error('[VIONEX API] Startup failed:', err);
  process.exit(1);
});
