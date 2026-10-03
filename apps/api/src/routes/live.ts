import { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import { prisma } from '@vionex/database';

export async function liveRoutes(app: FastifyInstance) {
  // Real-time Live Chat WebSocket
  app.get('/chat/:streamId', { websocket: true }, (connection, req) => {
    const { streamId } = req.params as { streamId: string };
    console.log(`[LiveChat] Client connected to live stream chat: ${streamId}`);

    connection.socket.on('message', async (rawMessage: any) => {
      try {
        const data = JSON.parse(rawMessage.toString());
        // Broadcast to stream chat
        connection.socket.send(JSON.stringify({
          type: 'CHAT_MESSAGE',
          streamId,
          senderName: data.senderName || 'Viewer',
          content: data.content,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('[LiveChat] Invalid message format:', err);
      }
    });

    connection.socket.on('close', () => {
      console.log(`[LiveChat] Client disconnected from stream: ${streamId}`);
    });
  });
}
