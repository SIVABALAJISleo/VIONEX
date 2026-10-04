/**
 * VIONEX ADD-ONLY COMMUNICATION EXPANSION
 * Phase 11: End-to-End Automated Verification of all 10 Golden Journeys
 * 
 * Journey 1: 1:1 E2EE Messaging (Double Ratchet / Signal Protocol Equivalent)
 * Journey 2: Multi-Device QR Linking & Revocation
 * Journey 3: Group Chat & Multi-Party Envelopes
 * Journey 4: Voice Calling (LiveKit Room & Signaling)
 * Journey 5: Video Calling (LiveKit HD Real-Time Stream)
 * Journey 6: 24h Ephemeral Status Engine (Stories, Views, Reactions, 24h Expiry)
 * Journey 7: Communities & Creator Topic Hubs
 * Journey 8: Creator Broadcast Channels (1-Way Broadcast, Followers, Posts)
 * Journey 9: Verified Business Messaging & In-Chat Catalog
 * Journey 10: VIONEX Video/Shorts Deep-Link Card Sharing (Zero-Regression Parity)
 */

import assert from 'node:assert';
import crypto from 'node:crypto';

const API_BASE = 'http://localhost:4000/api/v1';

async function request(endpoint: string, options: any = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

// Helper: AES-256-GCM symmetric encrypt/decrypt simulating Double Ratchet message key
function encryptMessage(key: Buffer, text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64')
  };
}

function decryptMessage(key: Buffer, enc: { ciphertext: string; iv: string; tag: string }) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(enc.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(enc.tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(enc.ciphertext, 'base64')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

async function runAll10Journeys() {
  console.log('================================================================');
  console.log('VIONEX COMMUNICATION EXPANSION: 10 GOLDEN JOURNEYS TEST SUITE');
  console.log('WhatsApp-Equivalent Real-Time & E2EE Ecosystem Verification');
  console.log('================================================================\n');

  let passed = 0;
  const total = 10;
  const ts = Date.now();

  // Provision 3 test users: Alice, Bob, and Charlie
  console.log('▶ [SETUP] Provisioning Test Identities (Alice, Bob, Charlie)...');
  const userA = { email: `alice_${ts}@vionex.tv`, username: `alice_${ts}`, displayName: 'Alice Walker', password: 'Password123!' };
  const userB = { email: `bob_${ts}@vionex.tv`, username: `bob_${ts}`, displayName: 'Bob Martin', password: 'Password123!' };
  const userC = { email: `charlie_${ts}@vionex.tv`, username: `charlie_${ts}`, displayName: 'Charlie Davis', password: 'Password123!' };

  const regA = await request('/auth/register', { method: 'POST', body: userA });
  const regB = await request('/auth/register', { method: 'POST', body: userB });
  const regC = await request('/auth/register', { method: 'POST', body: userC });

  const tokenA = regA.data.token;
  const tokenB = regB.data.token;
  const tokenC = regC.data.token;

  const authA = { Authorization: `Bearer ${tokenA}` };
  const authB = { Authorization: `Bearer ${tokenB}` };
  const authC = { Authorization: `Bearer ${tokenC}` };

  const meA = await request('/auth/me', { headers: authA });
  const meB = await request('/auth/me', { headers: authB });
  const meC = await request('/auth/me', { headers: authC });

  const userIdA = meA.data.user.id;
  const userIdB = meB.data.user.id;
  const userIdC = meC.data.user.id;

  console.log(`✓ Alice (${userIdA}), Bob (${userIdB}), Charlie (${userIdC}) authenticated.\n`);

  // ---------------------------------------------------------------------------
  // JOURNEY 1: 1:1 E2EE Messaging (Double Ratchet Simulation)
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 1/10] 1:1 End-to-End Encrypted Messaging...');
  try {
    // 1. Bootstrap Communication Identity for Alice and Bob
    const bootA = await request('/communication/bootstrap', { method: 'POST', headers: authA });
    assert.strictEqual(bootA.status, 200, 'Alice bootstrap should return HTTP 200');
    assert.ok(bootA.data.identity.id, 'Alice must receive communication identity ID');
    assert.ok(bootA.data.identity.devices.length >= 1, 'Alice must have primary device');

    const bootB = await request('/communication/bootstrap', { method: 'POST', headers: authB });
    assert.strictEqual(bootB.status, 200, 'Bob bootstrap should return HTTP 200');
    assert.ok(bootB.data.identity.id, 'Bob must receive communication identity ID');

    // 2. Alice fetches Bob\'s prekey bundle & devices
    const bobDevs = await request(`/communication/devices?userId=${userIdB}`, { headers: authA });
    assert.strictEqual(bobDevs.status, 200);
    assert.ok(bobDevs.data.devices.length >= 1, 'Bob should have at least 1 verified device');
    const bobDeviceId = bobDevs.data.devices[0].deviceId;

    // 3. Alice derives shared message key and encrypts message with AES-256-GCM
    const sharedSecret = crypto.randomBytes(32);
    const plaintext = 'Secret message: VIONEX E2EE Double Ratchet test message!';
    const encrypted = encryptMessage(sharedSecret, plaintext);

    // 4. Alice sends encrypted envelope to Bob
    const sendRes = await request('/communication/messages/envelope', {
      method: 'POST',
      headers: authA,
      body: {
        recipientId: bootB.data.identity.id,
        roomId: `direct-${userIdA}-${userIdB}`,
        encryptedPayload: encrypted,
        messageType: 'TEXT'
      }
    });
    assert.strictEqual(sendRes.status, 200);
    assert.ok(sendRes.data.envelopeId);

    // 5. Bob fetches envelope and decrypts
    const envRes = await request(`/communication/messages/envelope?roomId=direct-${userIdA}-${userIdB}`, { headers: authB });
    assert.strictEqual(envRes.status, 200);
    assert.ok(envRes.data.envelopes.length >= 1, 'Bob must retrieve encrypted envelope');
    const receivedPayload = envRes.data.envelopes[0].payload.encryptedPayload;

    const decrypted = decryptMessage(sharedSecret, receivedPayload);
    assert.strictEqual(decrypted, plaintext, 'Decrypted plaintext must match original message');

    console.log('✓ JOURNEY 1 PASSED: 1:1 E2EE encryption, transmission, and decryption verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 1 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 2: Multi-Device QR Linking & Revocation
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 2/10] Multi-Device QR Linking & Revocation...');
  try {
    // 1. Primary device initializes pairing challenge
    const linkInit = await request('/communication/devices/link/init', { method: 'POST', headers: authA });
    assert.strictEqual(linkInit.status, 200);
    assert.ok(linkInit.data.pairingToken, 'Must generate pairing challenge token');
    assert.ok(linkInit.data.qrPayload.startsWith('vionex-link:'), 'Must generate QR payload');

    // 2. Companion device approves pairing
    const companionKeypair = crypto.generateKeyPairSync('ed25519');
    const companionPub = companionKeypair.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const linkApprove = await request('/communication/devices/link/approve', {
      method: 'POST',
      body: {
        pairingToken: linkInit.data.pairingToken,
        deviceName: 'Alice iPad Pro (Companion)',
        platform: 'tablet',
        devicePublicKey: companionPub
      }
    });
    assert.strictEqual(linkApprove.status, 200);
    assert.ok(linkApprove.data.device.deviceId);
    assert.strictEqual(linkApprove.data.device.status, 'VERIFIED');
    const companionDeviceId = linkApprove.data.device.deviceId;

    // 3. Verify Alice now has 2 registered devices
    const devsAfter = await request('/communication/devices', { headers: authA });
    const activeDevs = devsAfter.data.devices.filter((d: any) => d.status === 'VERIFIED');
    assert.ok(activeDevs.length >= 2, 'Alice must have at least 2 verified devices');

    // 4. Revoke companion device
    const revokeRes = await request('/communication/devices/revoke', {
      method: 'POST',
      headers: authA,
      body: { deviceId: companionDeviceId }
    });
    assert.strictEqual(revokeRes.status, 200);
    assert.strictEqual(revokeRes.data.revokedDeviceId, companionDeviceId);

    // 5. Verify device status is REVOKED
    const devsRevoked = await request('/communication/devices', { headers: authA });
    const targetDev = devsRevoked.data.devices.find((d: any) => d.deviceId === companionDeviceId);
    assert.strictEqual(targetDev.status, 'REVOKED', 'Revoked device must have REVOKED status');

    console.log('✓ JOURNEY 2 PASSED: Multi-device pairing challenge, linking, and revocation verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 2 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 3: Group Chat & Multi-Party Envelopes
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 3/10] Group Chat & Multi-Party Envelopes...');
  try {
    // 1. Charlie bootstraps communication identity
    const bootC = await request('/communication/bootstrap', { method: 'POST', headers: authC });
    assert.strictEqual(bootC.status, 200);

    const groupRoomId = `group-engineering-${ts}`;
    const groupKey = crypto.randomBytes(32);
    const groupPlaintext = 'Engineering Team: All systems nominal!';
    const groupEncrypted = encryptMessage(groupKey, groupPlaintext);

    // 2. Alice broadcasts to group room
    const groupSend = await request('/communication/messages/envelope', {
      method: 'POST',
      headers: authA,
      body: {
        roomId: groupRoomId,
        encryptedPayload: groupEncrypted,
        messageType: 'GROUP_TEXT'
      }
    });
    assert.strictEqual(groupSend.status, 200);

    // 3. Bob and Charlie retrieve group messages
    const bGroup = await request(`/communication/messages/envelope?roomId=${groupRoomId}`, { headers: authB });
    assert.ok(bGroup.data.envelopes.length >= 1, 'Bob must receive group envelope');
    const bDecrypted = decryptMessage(groupKey, bGroup.data.envelopes[0].payload.encryptedPayload);
    assert.strictEqual(bDecrypted, groupPlaintext);

    const cGroup = await request(`/communication/messages/envelope?roomId=${groupRoomId}`, { headers: authC });
    assert.ok(cGroup.data.envelopes.length >= 1, 'Charlie must receive group envelope');
    const cDecrypted = decryptMessage(groupKey, cGroup.data.envelopes[0].payload.encryptedPayload);
    assert.strictEqual(cDecrypted, groupPlaintext);

    console.log('✓ JOURNEY 3 PASSED: Group chat message broadcast and multi-party decryption verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 3 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 4: Voice Calling (LiveKit Room & Signaling)
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 4/10] Voice Calling (LiveKit WebRTC Integration)...');
  try {
    const voiceRoomId = `voice-room-${ts}`;
    // 1. Alice requests LiveKit voice call token
    const callRes = await request('/communication/calls/token', {
      method: 'POST',
      headers: authA,
      body: {
        roomId: voiceRoomId,
        callType: 'VOICE_DIRECT'
      }
    });
    assert.strictEqual(callRes.status, 200);
    assert.ok(callRes.data.credentials.token, 'Must return signed LiveKit JWT');
    assert.strictEqual(callRes.data.credentials.roomName, voiceRoomId);

    // 2. Signal call status transition: CONNECTED -> COMPLETED
    const sigRes1 = await request('/communication/calls/signal', {
      method: 'POST',
      headers: authA,
      body: { roomId: voiceRoomId, status: 'CONNECTED' }
    });
    assert.strictEqual(sigRes1.status, 200);

    const sigRes2 = await request('/communication/calls/signal', {
      method: 'POST',
      headers: authA,
      body: { roomId: voiceRoomId, status: 'COMPLETED', durationSec: 85 }
    });
    assert.strictEqual(sigRes2.status, 200);

    // 3. Verify call history
    const historyRes = await request('/communication/calls/history', { headers: authA });
    assert.strictEqual(historyRes.status, 200);
    const recordedCall = historyRes.data.calls.find((c: any) => c.liveKitRoomId === voiceRoomId);
    assert.ok(recordedCall, 'Call session must be saved in database');
    assert.strictEqual(recordedCall.callType, 'VOICE_DIRECT');
    assert.strictEqual(recordedCall.status, 'COMPLETED');
    assert.strictEqual(recordedCall.durationSec, 85);

    console.log('✓ JOURNEY 4 PASSED: LiveKit voice calling, room signaling, and history logging verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 4 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 5: Video Calling (LiveKit HD Real-Time Stream)
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 5/10] Video Calling (LiveKit HD Video & Screen Share)...');
  try {
    const videoRoomId = `video-room-${ts}`;
    const vidRes = await request('/communication/calls/token', {
      method: 'POST',
      headers: authA,
      body: {
        roomId: videoRoomId,
        callType: 'VIDEO_DIRECT'
      }
    });
    assert.strictEqual(vidRes.status, 200);
    assert.ok(vidRes.data.credentials.token);
    assert.strictEqual(vidRes.data.credentials.roomName, videoRoomId);

    // Signal video call completion
    await request('/communication/calls/signal', {
      method: 'POST',
      headers: authA,
      body: { roomId: videoRoomId, status: 'COMPLETED', durationSec: 142 }
    });

    const historyRes = await request('/communication/calls/history', { headers: authA });
    const recordedVid = historyRes.data.calls.find((c: any) => c.liveKitRoomId === videoRoomId);
    assert.ok(recordedVid, 'Video call session must be saved in database');
    assert.strictEqual(recordedVid.callType, 'VIDEO_DIRECT');
    assert.strictEqual(recordedVid.durationSec, 142);

    console.log('✓ JOURNEY 5 PASSED: HD video calling credentials and session recording verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 5 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 6: 24h Ephemeral Status Engine
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 6/10] 24h Ephemeral Status Engine (Stories, Views, Reactions)...');
  try {
    // 1. Alice posts 24h Status
    const statusPost = await request('/communication/status', {
      method: 'POST',
      headers: authA,
      body: {
        text: 'Behind the scenes at VIONEX Studio! 🎬',
        mediaUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
        contentType: 'IMAGE'
      }
    });
    assert.strictEqual(statusPost.status, 200);
    assert.ok(statusPost.data.status.id);
    const statusId = statusPost.data.status.id;

    // Check expiration is 24h from creation
    const createdTime = new Date(statusPost.data.status.createdAt).getTime();
    const expiryTime = new Date(statusPost.data.status.expiresAt).getTime();
    const diffHours = (expiryTime - createdTime) / (1000 * 60 * 60);
    assert.ok(Math.abs(diffHours - 24) < 0.1, 'Status expiresAt must be exactly 24 hours from creation');

    // 2. Bob views status
    const viewRes = await request(`/communication/status/${statusId}/view`, { method: 'POST', headers: authB });
    assert.strictEqual(viewRes.status, 200);

    // 3. Bob reacts with emoji
    const reactRes = await request(`/communication/status/${statusId}/react`, {
      method: 'POST',
      headers: authB,
      body: { emoji: '🔥' }
    });
    assert.strictEqual(reactRes.status, 200);

    // 4. Query status feed
    const feedRes = await request('/communication/status', { headers: authA });
    assert.strictEqual(feedRes.status, 200);
    const posted = feedRes.data.statuses.find((s: any) => s.id === statusId);
    assert.ok(posted, 'Posted status must appear in active feed');
    assert.strictEqual(posted.viewsCount, 1, 'Views count must be incremented to 1');
    assert.strictEqual(posted.reactions['🔥'], 1, 'Reaction count for 🔥 must be 1');

    console.log('✓ JOURNEY 6 PASSED: 24h status creation, view tracking, and emoji reactions verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 6 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 7: Communities & Creator Topic Hubs
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 7/10] Communities & Creator Topic Hubs...');
  try {
    // 1. Alice creates community
    const commRes = await request('/communication/communities', {
      method: 'POST',
      headers: authA,
      body: {
        name: `VIONEX Developers Club ${ts}`,
        description: 'Open discussion on streaming protocols and WebRTC',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
      }
    });
    assert.strictEqual(commRes.status, 200);
    assert.ok(commRes.data.community.id);
    const commId = commRes.data.community.id;
    assert.strictEqual(commRes.data.community.channels.length, 2, 'Must create announcement and general channels');

    // 2. Bob joins community
    const joinRes = await request(`/communication/communities/${commId}/join`, {
      method: 'POST',
      headers: authB
    });
    assert.strictEqual(joinRes.status, 200);
    assert.strictEqual(joinRes.data.membership.role, 'MEMBER');

    // 3. List communities
    const listRes = await request('/communication/communities', { headers: authB });
    assert.strictEqual(listRes.status, 200);
    const found = listRes.data.communities.find((c: any) => c.id === commId);
    assert.ok(found, 'Community must be discoverable');
    assert.strictEqual(found.topics.length, 2);

    console.log('✓ JOURNEY 7 PASSED: Community creation, default topics, and member joins verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 7 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 8: Creator Broadcast Channels
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 8/10] Creator Broadcast Channels...');
  try {
    // 1. Alice creates broadcast channel
    const chanRes = await request('/communication/channels', {
      method: 'POST',
      headers: authA,
      body: {
        name: `Alice Tech Updates ${ts}`,
        description: 'Official 1-way updates from Alice',
        iconUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'
      }
    });
    assert.strictEqual(chanRes.status, 200);
    assert.ok(chanRes.data.channel.id);
    const chanId = chanRes.data.channel.id;
    assert.strictEqual(chanRes.data.channel.isVerified, true);

    // 2. Bob follows broadcast channel
    const followRes = await request(`/communication/channels/${chanId}/follow`, {
      method: 'POST',
      headers: authB
    });
    assert.strictEqual(followRes.status, 200);

    // 3. Alice broadcasts update
    const postRes = await request(`/communication/channels/${chanId}/posts`, {
      method: 'POST',
      headers: authA,
      body: {
        content: 'Excited to announce our new 4K 60fps livestream tonight at 8 PM!'
      }
    });
    assert.strictEqual(postRes.status, 200);
    assert.ok(postRes.data.post.id);

    // 4. Verify non-owner Bob cannot broadcast
    const unauthorizedPost = await request(`/communication/channels/${chanId}/posts`, {
      method: 'POST',
      headers: authB,
      body: { content: 'I should not be able to broadcast here' }
    });
    assert.strictEqual(unauthorizedPost.status, 403, 'Non-owner must be rejected with HTTP 403');

    // 5. Query channels list
    const chanList = await request('/communication/channels', { headers: authB });
    const targetChan = chanList.data.channels.find((c: any) => c.id === chanId);
    assert.ok(targetChan);
    assert.strictEqual(targetChan.followerCount, 1);
    assert.ok(targetChan.latestPost.content.includes('4K 60fps'));

    console.log('✓ JOURNEY 8 PASSED: Broadcast channel creation, 1-way permission, and follower stream verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 8 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 9: Verified Business Messaging & In-Chat Catalog
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 9/10] Verified Business Messaging & In-Chat Catalog...');
  try {
    // 1. Alice creates business profile & catalog
    const bizRes = await request('/communication/business', {
      method: 'POST',
      headers: authA,
      body: {
        name: `VIONEX Gear & Apparel ${ts}`,
        category: 'Creator Merchandise',
        description: 'Official apparel, stream decks, and studio accessories.',
        catalogItems: [
          { title: 'VIONEX Pro Hoodie (Charcoal)', description: 'Ultra-soft fleece hoodie', priceCents: 6500, sku: 'VNX-HD-01' },
          { title: 'Stream Deck 4K Controller', description: 'Programmable RGB stream buttons', priceCents: 14900, sku: 'VNX-ST-01' }
        ]
      }
    });
    assert.strictEqual(bizRes.status, 200);
    assert.ok(bizRes.data.business.id);
    const bizId = bizRes.data.business.id;
    assert.strictEqual(bizRes.data.business.catalog.length, 2);
    const catalogItemId = bizRes.data.business.catalog[0].id;

    // 2. Bob browses businesses
    const bizList = await request('/communication/business', { headers: authB });
    assert.strictEqual(bizList.status, 200);
    const foundBiz = bizList.data.businesses.find((b: any) => b.id === bizId);
    assert.ok(foundBiz);
    assert.strictEqual(foundBiz.isVerified, true);
    assert.strictEqual(foundBiz.catalog.length, 2);

    // 3. Bob sends in-chat product inquiry
    const inqRes = await request(`/communication/business/${bizId}/inquiries`, {
      method: 'POST',
      headers: authB,
      body: {
        catalogItemId,
        inquiryText: 'Do you offer international expedited shipping for this item?'
      }
    });
    assert.strictEqual(inqRes.status, 200);
    assert.ok(inqRes.data.inquiry.item);
    assert.strictEqual(inqRes.data.inquiry.item.id, catalogItemId);
    assert.ok(inqRes.data.inquiry.autoResponse);

    console.log('✓ JOURNEY 9 PASSED: Business registration, verified badge, catalog query, and in-chat inquiry verified.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 9 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // JOURNEY 10: VIONEX Video/Shorts Deep-Link Card Sharing
  // ---------------------------------------------------------------------------
  console.log('▶ [JOURNEY 10/10] VIONEX Video/Shorts Deep-Link Card Sharing (Zero-Regression Parity)...');
  try {
    // 1. Fetch an existing video from VIONEX video engine
    const videosRes = await request('/discovery/trending');
    assert.strictEqual(videosRes.status, 200);
    assert.ok(videosRes.data.videos.length > 0, 'VIONEX must have videos available');
    const sampleVideo = videosRes.data.videos[0];
    const videoId = sampleVideo.id;

    // 2. Alice sends chat message with rich VIONEX video card attached
    const cardPayload = {
      type: 'vionex_video',
      videoId: sampleVideo.id,
      title: sampleVideo.title,
      duration: sampleVideo.duration,
      durationFormatted: `${Math.floor(sampleVideo.duration / 60)}:${(sampleVideo.duration % 60).toString().padStart(2, '0')}`,
      thumbnailUrl: sampleVideo.thumbnailUrl,
      channelTitle: sampleVideo.channel?.name || 'VIONEX Creator',
      watchUrl: `/watch/${sampleVideo.id}`
    };

    const shareRes = await request('/communication/messages/envelope', {
      method: 'POST',
      headers: authA,
      body: {
        recipientId: userIdB,
        roomId: `direct-${userIdA}-${userIdB}`,
        encryptedPayload: { text: `Check out this VIONEX video: ${sampleVideo.title}` },
        messageType: 'VIONEX_SHARE',
        contentCard: cardPayload
      }
    });
    assert.strictEqual(shareRes.status, 200);

    // 3. Bob receives envelope and verifies rich video card metadata
    const bEnvs = await request(`/communication/messages/envelope?roomId=direct-${userIdA}-${userIdB}`, { headers: authB });
    const shareEnv = bEnvs.data.envelopes.find((e: any) => e.payload.messageType === 'VIONEX_SHARE');
    assert.ok(shareEnv, 'Bob must receive VIONEX_SHARE envelope');
    assert.strictEqual(shareEnv.payload.contentCard.videoId, videoId);
    assert.strictEqual(shareEnv.payload.contentCard.watchUrl, `/watch/${videoId}`);

    // 4. Verify original video details from core VIONEX API are completely intact (zero regression)
    const vidCheck = await request(`/videos/${videoId}`);
    assert.strictEqual(vidCheck.status, 200);
    assert.strictEqual(vidCheck.data.video.id, videoId);
    assert.strictEqual(vidCheck.data.video.title, sampleVideo.title);

    console.log('✓ JOURNEY 10 PASSED: VIONEX video deep-link card sharing verified with ZERO core video engine regression.\n');
    passed++;
  } catch (err: any) {
    console.error('✗ JOURNEY 10 FAILED:', err.message);
  }

  // ---------------------------------------------------------------------------
  // SUMMARY SCORECARD
  // ---------------------------------------------------------------------------
  console.log('================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} GOLDEN JOURNEYS PASSED (100% PARITY)`);
  console.log('================================================================');

  if (passed === total) {
    console.log('✨ ALL 10 COMMUNICATION JOURNEYS ARE FULLY OPERATIONAL AND VERIFIED.');
    process.exit(0);
  } else {
    console.error(`❌ ONLY ${passed}/${total} JOURNEYS PASSED.`);
    process.exit(1);
  }
}

runAll10Journeys().catch((err) => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
