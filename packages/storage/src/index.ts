import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface StorageObjectMetadata {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  eTag?: string;
}

export interface StorageProvider {
  putObject(key: string, data: Buffer | Readable | string, options?: { contentType?: string }): Promise<void>;
  getObject(key: string): Promise<Readable>;
  getObjectBuffer(key: string): Promise<Buffer>;
  deleteObject(key: string): Promise<void>;
  headObject(key: string): Promise<StorageObjectMetadata | null>;
  generateSignedPlaybackUrl(key: string, expiresInSeconds?: number): Promise<string>;
  generatePresignedUploadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicBaseUrl: string;

  constructor(baseDir?: string, publicBaseUrl?: string) {
    this.baseDir = baseDir || process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), 'data/storage');
    this.publicBaseUrl = publicBaseUrl || process.env.STORAGE_PUBLIC_URL || '/storage';
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private resolve(key: string): string {
    const cleanKey = key.replace(/\.\./g, '').replace(/^[\\/]+/, '');
    return path.join(this.baseDir, cleanKey);
  }

  async putObject(key: string, data: Buffer | Readable | string, options?: { contentType?: string }): Promise<void> {
    const target = this.resolve(key);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (Buffer.isBuffer(data) || typeof data === 'string') {
      await fs.promises.writeFile(target, data);
    } else {
      const out = fs.createWriteStream(target);
      await new Promise<void>((resolve, reject) => {
        data.pipe(out);
        out.on('finish', () => resolve());
        out.on('error', reject);
      });
    }
  }

  async getObject(key: string): Promise<Readable> {
    const target = this.resolve(key);
    if (!fs.existsSync(target)) throw new Error(`Object not found: ${key}`);
    return fs.createReadStream(target);
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const target = this.resolve(key);
    if (!fs.existsSync(target)) throw new Error(`Object not found: ${key}`);
    return fs.promises.readFile(target);
  }

  async deleteObject(key: string): Promise<void> {
    const target = this.resolve(key);
    if (fs.existsSync(target)) {
      await fs.promises.unlink(target);
    }
  }

  async headObject(key: string): Promise<StorageObjectMetadata | null> {
    const target = this.resolve(key);
    if (!fs.existsSync(target)) return null;
    const stats = await fs.promises.stat(target);
    return {
      contentLength: stats.size,
      lastModified: stats.mtime
    };
  }

  async generateSignedPlaybackUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    return `${this.publicBaseUrl}/${key.replace(/\\/g, '/')}`;
  }

  async generatePresignedUploadUrl(key: string, expiresInSeconds: number = 900): Promise<string> {
    return `/api/v1/uploads/chunk?key=${encodeURIComponent(key)}`;
  }
}

export class S3StorageProvider implements StorageProvider {
  private s3: S3Client;
  private bucket: string;

  constructor(bucket: string, endpoint?: string, region?: string) {
    this.bucket = bucket;
    this.s3 = new S3Client({
      region: region || process.env.AWS_REGION || 'auto',
      endpoint: endpoint || process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async putObject(key: string, data: Buffer | Readable | string, options?: { contentType?: string }): Promise<void> {
    const body = Buffer.isBuffer(data) || typeof data === 'string' ? data : await this.streamToBuffer(data);
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: options?.contentType
    }));
  }

  async getObject(key: string): Promise<Readable> {
    const res = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    return res.Body as Readable;
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const stream = await this.getObject(key);
    return this.streamToBuffer(stream);
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async headObject(key: string): Promise<StorageObjectMetadata | null> {
    try {
      const res = await this.s3.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return {
        contentLength: res.ContentLength,
        lastModified: res.LastModified,
        eTag: res.ETag
      };
    } catch (e) {
      return null;
    }
  }

  async generateSignedPlaybackUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, cmd, { expiresIn: expiresInSeconds });
  }

  async generatePresignedUploadUrl(key: string, expiresInSeconds: number = 900): Promise<string> {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, cmd, { expiresIn: expiresInSeconds });
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}

export function createStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER || 'local';
  if (driver === 's3' && process.env.S3_BUCKET) {
    return new S3StorageProvider(process.env.S3_BUCKET, process.env.S3_ENDPOINT, process.env.AWS_REGION);
  }
  return new LocalStorageProvider();
}
