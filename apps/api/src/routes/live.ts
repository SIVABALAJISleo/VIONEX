import { FastifyInstance } from 'fastify';
import * as crypto from 'crypto';
import { prisma } from '@vionex/database';
import { authenticate } from '../services/auth-middleware';

// Active chat rooms: Map<streamId, Set<WebSocket>>
const chatRooms = new Map<string, Set<any>>();

export async function liveRoutes(app: FastifyInstance) {
  // 1. Create Live Stream
  app.post('/create', { preHandler: [authenticate] }, async (request, reply) => {
    const { title, description, channelId } = request.body as any;
    const userId = (request as any).user.userId || (request as any).user.id;

    const rawStreamKey = `live_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    const streamKeyHash = crypto.createHash('sha256').update(rawStreamKey).digest('hex');

    const stream = await prisma.liveStream.create({
      data: {
        channelId,
        title: title || 'Live Stream',
        description: description || '',
        streamKeyHash,
        streamKeyPrefix: rawStreamKey.substring(0, 10),
        state: 'IDLE',
        hlsPlaybackUrl: `http://localhost:4000/storage/live/${streamKeyHash}/master.m3u8`
      }
    });

    return reply.status(201).send({
      success: true,
      streamId: stream.id,
      streamKey: rawStreamKey,
      rtmpIngestUrl: 'rtmp://localhost:1935/live',
      hlsPlaybackUrl: stream.hlsPlaybackUrl
    });
  });

  // 2. Update Stream Status & Telemetry
  app.post('/:streamId/status', { preHandler: [authenticate] }, async (request, reply) => {
    const { streamId } = request.params as { streamId: string };
    const { state, bitrate, fps, droppedFrames } = request.body as any;

    const stream = await prisma.liveStream.findUnique({ where: { id: streamId } });
    if (!stream) {
      return reply.status(404).send({ success: false, message: 'Live stream not found' });
    }

    const updateData: any = { state };
    if (state === 'LIVE' && !stream.startedAt) {
      updateData.startedAt = new Date();
      // Record session start
      await prisma.liveSession.create({
        data: {
          liveStreamId: streamId,
          inboundBitrate: bitrate || 4500,
          fps: fps || 60,
          droppedFrames: droppedFrames || 0
        }
      });
    } else if (state === 'ENDED') {
      updateData.endedAt = new Date();
      // Auto-generate VOD Video asset on channel
      await prisma.video.create({
        data: {
          channelId: stream.channelId,
          title: `[VOD] ${stream.title}`,
          description: `Archived live stream recording from ${new Date().toLocaleDateString()}`,
          duration: 3600.0,
          hlsMasterUrl: stream.hlsPlaybackUrl,
          state: 'PUBLISHED',
          visibility: 'PUBLIC'
        }
      });
    }

    const updated = await prisma.liveStream.update({
      where: { id: streamId },
      data: updateData
    });

    return reply.send({ success: true, stream: updated });
  });

  // 3. Real-time Live Chat WebSocket with Room Broadcast
  app.get('/chat/:streamId', { websocket: true }, (connection, req) => {
    const { streamId } = req.params as { streamId: string };

    if (!chatRooms.has(streamId)) {
      chatRooms.set(streamId, new Set());
    }
    const room = chatRooms.get(streamId)!;
    room.add(connection.socket);

    console.log(`[LiveChat] Client connected to room ${streamId}. Active viewers in room: ${room.size}`);

    connection.socket.on('message', async (rawMessage: any) => {
      try {
        const data = JSON.parse(rawMessage.toString());
        const messagePayload = {
          type: 'CHAT_MESSAGE',
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          streamId,
          senderId: data.senderId || 'viewer-anon',
          senderName: data.senderName || 'Live Viewer',
          senderAvatar: data.senderAvatar || null,
          senderRole: data.senderRole || 'VIEWER',
          content: data.content,
          timestamp: new Date().toISOString()
        };

        // Persist message in database if stream exists
        await prisma.liveChatMessage.create({
          data: {
            liveStreamId: streamId,
            senderId: messagePayload.senderId,
            senderName: messagePayload.senderName,
            senderAvatar: messagePayload.senderAvatar,
            senderRole: messagePayload.senderRole,
            content: messagePayload.content
          }
        }).catch(() => {});

        // Broadcast to ALL sockets in the room
        const jsonString = JSON.stringify(messagePayload);
        for (const client of room) {
          if (client.readyState === 1) { // OPEN
            client.send(jsonString);
          }
        }
      } catch (err) {
        console.error('[LiveChat] Invalid message format:', err);
      }
    });

    connection.socket.on('close', () => {
      room.delete(connection.socket);
      if (room.size === 0) chatRooms.delete(streamId);
      console.log(`[LiveChat] Client left room ${streamId}. Remaining viewers: ${room.size}`);
    });
  });

  // 4. Fetch Live Chat Message History
  app.get('/:streamId/messages', async (request, reply) => {
    const { streamId } = request.params as { streamId: string };
    const messages = await prisma.liveChatMessage.findMany({
      where: { liveStreamId: streamId },
      orderBy: { createdAt: 'asc' },
      take: 100
    });
    return reply.send({ success: true, messages });
  });
}
