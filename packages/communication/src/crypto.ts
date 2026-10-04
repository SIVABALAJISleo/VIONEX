import crypto from 'crypto';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class VionexCryptoEngine {
  /**
   * Generates a Curve25519 identity key pair
   */
  static generateDeviceKeyPair(): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      privateKey: Buffer.from(privateKey).toString('base64')
    };
  }

  /**
   * Encrypts plaintext message payload using AES-256-GCM symmetric session key
   */
  static encryptPayload(plaintext: string, sessionKeyHex: string): { ciphertext: string; iv: string; tag: string } {
    const key = Buffer.from(sessionKeyHex, 'hex');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag().toString('base64');

    return {
      ciphertext: encrypted,
      iv: iv.toString('base64'),
      tag
    };
  }

  /**
   * Decrypts ciphertext using AES-256-GCM session key and verifies authentication tag
   */
  static decryptPayload(ciphertext: string, ivBase64: string, tagBase64: string, sessionKeyHex: string): string {
    const key = Buffer.from(sessionKeyHex, 'hex');
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Computes Short Authentication String (SAS) for device verification
   */
  static generateVerificationSas(aliceKey: string, bobKey: string): { numbers: string; emojis: string[] } {
    const combined = [aliceKey, bobKey].sort().join(':');
    const hash = crypto.createHash('sha256').update(combined).digest();
    
    // First 3 13-bit numbers
    const num1 = (hash.readUInt16BE(0) % 8192).toString().padStart(4, '0');
    const num2 = (hash.readUInt16BE(2) % 8192).toString().padStart(4, '0');
    const num3 = (hash.readUInt16BE(4) % 8192).toString().padStart(4, '0');

    // Emoji symbols from hash
    const emojiMap = ['🐶', '🐱', '🦁', '🦊', '🐼', '🐨', '🐯', '🦄', '🚀', '🌟', '⚡', '🔥'];
    const e1 = emojiMap[hash[6] % emojiMap.length];
    const e2 = emojiMap[hash[7] % emojiMap.length];
    const e3 = emojiMap[hash[8] % emojiMap.length];

    return {
      numbers: `${num1} ${num2} ${num3}`,
      emojis: [e1, e2, e3]
    };
  }
}
