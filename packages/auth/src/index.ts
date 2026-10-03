import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { prisma } from '@vionex/database';

const JWT_SECRET = process.env.JWT_SECRET || 'vionex-super-secret-production-key-change-me';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_DAYS = 7;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });
  }

  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static async createSession(userId: string, ipAddress: string, userAgent: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);
    const rawToken = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const tokenHash = await argon2.hash(rawToken);

    const session = await prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        ipAddress,
        userAgent,
        expiresAt
      }
    });

    return { session, rawToken };
  }

  static async validateSession(sessionId: string): Promise<boolean> {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });
    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  static async revokeSession(sessionId: string): Promise<void> {
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isRevoked: true }
    });
  }
}
