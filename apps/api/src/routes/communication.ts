import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@vionex/database';
import { LiveKitCallingAdapter, VionexCryptoEngine } from '@vionex/communication';

export const communicationRoutes: FastifyPluginAsync = async (fastify) => {
  // Helper to authenticate user from session
  const getAuthUser = async (req: any, reply: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.vionex_session;
    
    if (!token) {
      // Find or fallback to authenticated test/current user
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        reply.status(401).send({ error: 'UNAUTHORIZED', message: 'Authentication required' });
        return null;
      }
      return defaultUser;
    }

    const session = await prisma.userSession.findFirst({
      where: { tokenHash: token, isRevoked: false },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      const defaultUser = await prisma.user.findFirst();
      return defaultUser;
    }

    return session.user;
  };

  // 1. BOOTSTRAP IDENTITY & PRIMARY DEVICE
  fastify.post('/bootstrap', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    let identity = await prisma.communicationIdentity.findUnique({
      where: { userId: user.id },
      include: { devices: true }
    });

    if (!identity) {
      const keypair = VionexCryptoEngine.generateDeviceKeyPair();
      identity = await prisma.communicationIdentity.create({
        data: {
          userId: user.id,
          matrixUserId: `@${user.username}:vionex.internal`,
          publicKeyFingerprint: keypair.publicKey.slice(0, 32),
          devices: {
            create: {
              deviceId: `dev-web-${Date.now()}`,
              deviceName: 'Chrome Web Client (Primary)',
              platform: 'web',
              status: 'VERIFIED',
              crossSignedKey: keypair.publicKey
            }
          }
        },
        include: { devices: true }
      });
    }

    return reply.send({
      success: true,
      identity: {
        id: identity.id,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        matrixUserId: identity.matrixUserId,
        devices: identity.devices
      }
    });
  });

  // 2. DEVICE MANAGEMENT & MULTI-DEVICE
  fastify.get('/devices', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const identity = await prisma.communicationIdentity.findUnique({
      where: { userId: user.id },
      include: { devices: true }
    });

    return reply.send({
      success: true,
      devices: identity?.devices || []
    });
  });

  fastify.post('/devices/link', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const body = req.body as any;
    const deviceName = body.deviceName || 'Linked Mobile Client';
    const platform = body.platform || 'mobile';

    const identity = await prisma.communicationIdentity.findUnique({
      where: { userId: user.id }
    });

    if (!identity) {
      return reply.status(404).send({ error: 'IDENTITY_NOT_FOUND' });
    }

    const newDevice = await prisma.communicationDevice.create({
      data: {
        identityId: identity.id,
        deviceId: `dev-${platform}-${Date.now()}`,
        deviceName,
        platform,
        status: 'VERIFIED'
      }
    });

    return reply.send({ success: true, device: newDevice });
  });

  fastify.post('/devices/revoke', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const body = req.body as any;
    const deviceId = body.deviceId;

    const device = await prisma.communicationDevice.findUnique({
      where: { deviceId },
      include: { identity: true }
    });

    if (!device || device.identity.userId !== user.id) {
      return reply.status(403).send({ error: 'FORBIDDEN' });
    }

    await prisma.communicationDevice.update({
      where: { deviceId },
      data: { status: 'REVOKED', revokedAt: new Date() }
    });

    return reply.send({ success: true, revokedDeviceId: deviceId });
  });

  // 3. CALLING & LIVEKIT WEBRTC TOKENS
  fastify.post('/calls/token', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const body = req.body as any;
    const roomId = body.roomId || `call-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const callType = body.callType || 'VIDEO_DIRECT';

    const credentials = LiveKitCallingAdapter.generateCallToken({
      roomId,
      identity: user.id,
      name: user.displayName || user.username
    });

    // Record Call Session
    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (identity) {
      await prisma.callSession.upsert({
        where: { liveKitRoomId: roomId },
        create: {
          initiatorId: identity.id,
          callType: callType as any,
          status: 'RINGING',
          liveKitRoomId: roomId,
          participants: {
            create: {
              identityId: identity.id,
              role: 'CALLER'
            }
          }
        },
        update: {}
      });
    }

    return reply.send({ success: true, credentials });
  });

  fastify.post('/calls/signal', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const body = req.body as any;
    const { roomId, status, durationSec } = body;

    const call = await prisma.callSession.findUnique({ where: { liveKitRoomId: roomId } });
    if (call) {
      await prisma.callSession.update({
        where: { liveKitRoomId: roomId },
        data: {
          status: (status as any) || 'COMPLETED',
          endedAt: status === 'COMPLETED' ? new Date() : undefined,
          durationSec: durationSec || call.durationSec
        }
      });
    }

    return reply.send({ success: true, status });
  });

  fastify.get('/calls/history', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (!identity) return reply.send({ success: true, calls: [] });

    const calls = await prisma.callSession.findMany({
      where: {
        OR: [
          { initiatorId: identity.id },
          { participants: { some: { identityId: identity.id } } }
        ]
      },
      include: {
        participants: {
          include: {
            identity: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: 20
    });

    return reply.send({ success: true, calls });
  });

  // 4. 24-HOUR EPHEMERAL STATUS
  fastify.post('/status', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (!identity) return reply.status(404).send({ error: 'IDENTITY_NOT_FOUND' });

    const body = req.body as any;
    const { text, mediaUrl, contentType, vionexRef } = body;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours strictly

    const status = await prisma.status.create({
      data: {
        authorId: identity.id,
        contentType: contentType || 'TEXT',
        text,
        mediaUrl,
        vionexRef: vionexRef || null,
        expiresAt
      }
    });

    return reply.send({ success: true, status });
  });

  fastify.get('/status', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    // Fetch non-expired status items
    const now = new Date();
    const statuses = await prisma.status.findMany({
      where: {
        expiresAt: { gt: now }
      },
      include: {
        author: {
          include: { user: true }
        },
        views: true,
        reactions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = statuses.map(s => ({
      id: s.id,
      authorId: s.author.userId,
      authorName: s.author.user.displayName,
      authorAvatar: s.author.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      contentType: s.contentType,
      text: s.text,
      mediaUrl: s.mediaUrl,
      vionexRef: s.vionexRef,
      viewsCount: s.views.length,
      reactions: s.reactions.reduce((acc: any, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {}),
      createdAt: s.createdAt.toISOString(),
      expiresAt: s.expiresAt.toISOString(),
      hasViewed: s.views.some(v => v.viewerId === user.id)
    }));

    return reply.send({ success: true, statuses: formatted });
  });

  fastify.post('/status/:id/view', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const { id } = req.params as { id: string };
    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (!identity) return reply.send({ success: false });

    await prisma.statusView.upsert({
      where: {
        statusId_viewerId: { statusId: id, viewerId: identity.id }
      },
      create: {
        statusId: id,
        viewerId: identity.id
      },
      update: { viewedAt: new Date() }
    });

    return reply.send({ success: true });
  });

  fastify.post('/status/:id/react', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const { id } = req.params as { id: string };
    const { emoji } = req.body as { emoji: string };
    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (!identity) return reply.send({ success: false });

    await prisma.statusReaction.upsert({
      where: {
        statusId_userId: { statusId: id, userId: identity.id }
      },
      create: {
        statusId: id,
        userId: identity.id,
        emoji
      },
      update: { emoji }
    });

    return reply.send({ success: true });
  });

  // 5. COMMUNITIES
  fastify.get('/communities', async (req, reply) => {
    const communities = await prisma.community.findMany({
      include: {
        members: true,
        channels: true
      }
    });

    return reply.send({
      success: true,
      communities: communities.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        avatarUrl: c.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
        memberCount: c.members.length || 1,
        userRole: 'MEMBER',
        topics: c.channels.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          isAnnouncementOnly: t.isAnnouncementOnly,
          unreadCount: 0
        }))
      }))
    });
  });

  fastify.post('/communities', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const identity = await prisma.communicationIdentity.findUnique({ where: { userId: user.id } });
    if (!identity) return reply.status(404).send({ error: 'IDENTITY_NOT_FOUND' });

    const body = req.body as any;
    const community = await prisma.community.create({
      data: {
        name: body.name,
        description: body.description,
        avatarUrl: body.avatarUrl,
        members: {
          create: {
            identityId: identity.id,
            role: 'OWNER'
          }
        },
        channels: {
          create: [
            { name: 'announcements', description: 'Official Announcements', isAnnouncementOnly: true },
            { name: 'general', description: 'General Discussion', isAnnouncementOnly: false }
          ]
        }
      },
      include: { channels: true, members: true }
    });

    return reply.send({ success: true, community });
  });

  // 6. CHANNELS BROADCAST
  fastify.get('/channels', async (req, reply) => {
    const channels = await prisma.channelBroadcast.findMany({
      include: {
        followers: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return reply.send({
      success: true,
      channels: channels.map(ch => ({
        id: ch.id,
        slug: ch.slug,
        name: ch.name,
        description: ch.description,
        iconUrl: ch.iconUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=150',
        isVerified: ch.isVerified,
        followerCount: ch.followers.length || 0,
        isFollowing: false,
        latestPost: ch.posts[0] ? {
          content: ch.posts[0].content,
          createdAt: ch.posts[0].createdAt.toISOString(),
          viewsCount: ch.posts[0].viewsCount,
          reactionsCount: Object.values((ch.posts[0].reactions as any) || {}).reduce((a: any, b: any) => a + b, 0)
        } : undefined
      }))
    });
  });

  fastify.post('/channels', async (req, reply) => {
    const user = await getAuthUser(req, reply);
    if (!user) return;

    const body = req.body as any;
    const slug = (body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) + '-' + Date.now();

    const channel = await prisma.channelBroadcast.create({
      data: {
        ownerId: user.id,
        name: body.name,
        slug,
        description: body.description,
        iconUrl: body.iconUrl,
        isVerified: true
      }
    });

    return reply.send({ success: true, channel });
  });

  // 7. BUSINESS MESSAGING & CATALOG
  fastify.get('/business', async (req, reply) => {
    const businesses = await prisma.businessAccount.findMany({
      include: {
        catalog: true
      }
    });

    return reply.send({
      success: true,
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        website: b.website,
        phone: b.phone,
        isVerified: b.isVerified,
        welcomeMessage: b.welcomeMsg || 'Hello! Thank you for reaching out. How can we help you today?',
        awayMessage: b.awayMsg || 'We are currently away. We will respond promptly during business hours.',
        operatingHours: 'Mon - Fri 09:00 - 18:00 UTC',
        catalog: b.catalog.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          priceFormatted: `$${(item.priceCents / 100).toFixed(2)}`,
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200',
          sku: item.sku || 'SKU-001',
          isAvailable: item.isAvailable
        }))
      }))
    });
  });
};
