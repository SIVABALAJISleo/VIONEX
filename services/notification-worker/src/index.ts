import { Worker, Job } from 'bullmq';
import { prisma } from '@vionex/database';

export const notificationWorker = new Worker(
  'notifications',
  async (job: Job) => {
    const { userId, type, title, message, linkUrl } = job.data;
    console.log(`[NotificationWorker] Sending ${type} notification to user: ${userId}`);

    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        linkUrl
      }
    });

    return { sent: true };
  },
  {
    connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: parseInt(process.env.REDIS_PORT || '6379', 10) }
  }
);
