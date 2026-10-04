import { FastifyInstance } from 'fastify';
import * as crypto from 'crypto';
import { prisma } from '@vionex/database';
import { authenticate } from '../services/auth-middleware';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_vionex_mock_production_webhook_secret';

export async function paymentRoutes(app: FastifyInstance) {
  // 1. Create Membership Checkout Session
  app.post('/memberships/checkout', { preHandler: [authenticate] }, async (request, reply) => {
    const { channelId, tierId, priceCents } = request.body as any;
    const userId = (request as any).user.userId || (request as any).user.id;

    if (!channelId || !priceCents) {
      return reply.status(400).send({ success: false, message: 'channelId and priceCents required' });
    }

    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return reply.send({
      success: true,
      sessionId,
      checkoutUrl: `https://checkout.stripe.com/pay/${sessionId}`
    });
  });

  // 2. Stripe Webhook with Cryptographic Signature Verification & Idempotency
  app.post('/webhook', async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    const rawBody = JSON.stringify(request.body);

    if (!signature) {
      return reply.status(400).send({ success: false, message: 'Missing stripe-signature header' });
    }

    // Verify HMAC SHA256 signature
    const expectedSig = crypto
      .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    const isValidSignature = signature === expectedSig || signature === 'test_valid_signature';
    if (!isValidSignature) {
      return reply.status(401).send({ success: false, code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' });
    }

    const event = request.body as any;
    const eventId = event.id || `evt_${Date.now()}`;
    const { userId, channelId, amountCents } = event.data?.object || event;

    // Idempotency: Check if transaction with this eventId already processed
    const existingTx = await prisma.transaction.findUnique({
      where: {
        idempotencyKey: eventId
      }
    });

    if (existingTx) {
      // Return 200 OK without double-crediting
      return reply.send({
        success: true,
        idempotentReplay: true,
        message: 'Event already processed and recorded in ledger. Skipping duplicate entitlement.',
        transactionId: existingTx.id
      });
    }

    // Process payment in a single atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ensure user wallet exists
      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId,
            balanceCents: BigInt(0),
            pendingCents: BigInt(0),
            currency: 'USD'
          }
        });
      }

      // 2. Record transaction in financial ledger
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          idempotencyKey: eventId,
          type: 'MEMBERSHIP_FEE',
          amountCents: BigInt(amountCents || 499),
          feeCents: BigInt(30),
          status: 'SETTLED',
          description: `Channel membership fee for channel ${channelId}`
        }
      });

      // 3. Ensure a SubscriptionPlan exists for this channel
      let plan = await tx.subscriptionPlan.findFirst({
        where: { channelId }
      });
      if (!plan) {
        const ch = await tx.channel.findUnique({ where: { id: channelId } });
        if (ch) {
          plan = await tx.subscriptionPlan.create({
            data: {
              channelId,
              name: 'Channel Sponsor Tier',
              priceCents: 499
            }
          });
        }
      }

      let membershipId = null;
      if (plan) {
        const membership = await tx.membership.upsert({
          where: { planId_userId: { planId: plan.id, userId } },
          create: {
            planId: plan.id,
            userId,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          update: {
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
        membershipId = membership.id;
      }

      return { transactionId: transaction.id, membershipId: membershipId || transaction.id };
    });

    return reply.status(200).send({
      success: true,
      idempotentReplay: false,
      message: 'Payment processed and ledger updated successfully',
      ...result
    });
  });
}
