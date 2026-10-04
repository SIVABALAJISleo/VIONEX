import jwt from 'jsonwebtoken';
import { CallRoomCredentials } from './types';

export class LiveKitCallingAdapter {
  private static apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  private static apiSecret = process.env.LIVEKIT_API_SECRET || 'secret_livekit_key_vionex_32chars_long!';
  private static wsUrl = process.env.LIVEKIT_WS_URL || 'wss://livekit.vionex.internal';

  /**
   * Generates a secure, scoped, short-lived room access token for WebRTC calling
   */
  static generateCallToken(params: {
    roomId: string;
    identity: string;
    name: string;
    canPublish?: boolean;
    canSubscribe?: boolean;
    ttlMinutes?: number;
  }): CallRoomCredentials {
    const ttl = params.ttlMinutes || 60;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    const payload = {
      sub: params.identity,
      name: params.name,
      iss: this.apiKey,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000),
      video: {
        room: params.roomId,
        roomJoin: true,
        canPublish: params.canPublish !== false,
        canSubscribe: params.canSubscribe !== false,
        canPublishData: true
      }
    };

    const token = jwt.sign(payload, this.apiSecret, { algorithm: 'HS256' });

    return {
      roomId: params.roomId,
      token,
      wsUrl: this.wsUrl,
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
        { 
          urls: [process.env.TURN_URL || 'turn:turn.vionex.internal:3478'],
          username: 'vionex-turn-user',
          credential: process.env.TURN_PASSWORD || 'turn-secure-credential-vionex'
        }
      ],
      expiresAt: expiresAt.toISOString()
    };
  }
}
