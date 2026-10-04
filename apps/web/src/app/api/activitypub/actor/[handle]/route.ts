import { NextRequest, NextResponse } from 'next/server';

/**
 * W3C ActivityPub Actor Endpoint (SOC-040)
 * Returns compliant ActivityStreams 2.0 Actor JSON object for federated channel discovery.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vionex.video';
  const cleanHandle = (handle || 'vionex-labs').replace('@', '');

  const actor = {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    id: `${baseUrl}/api/activitypub/actor/${cleanHandle}`,
    type: 'Person',
    preferredUsername: cleanHandle,
    name: cleanHandle === 'vionex-labs' ? 'VIONEX Engineering' : `${cleanHandle} on VIONEX`,
    summary: 'Official VIONEX decentralized video creator channel.',
    url: `${baseUrl}/channel/${cleanHandle}`,
    inbox: `${baseUrl}/api/activitypub/actor/${cleanHandle}/inbox`,
    outbox: `${baseUrl}/api/activitypub/actor/${cleanHandle}/outbox`,
    followers: `${baseUrl}/api/activitypub/actor/${cleanHandle}/followers`,
    following: `${baseUrl}/api/activitypub/actor/${cleanHandle}/following`,
    publicKey: {
      id: `${baseUrl}/api/activitypub/actor/${cleanHandle}#main-key`,
      owner: `${baseUrl}/api/activitypub/actor/${cleanHandle}`,
      publicKeyPem: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0T7y8VionexFederalActorKey\n-----END PUBLIC KEY-----`,
    },
    endpoints: {
      sharedInbox: `${baseUrl}/api/activitypub/sharedInbox`,
    },
  };

  return NextResponse.json(actor, {
    status: 200,
    headers: {
      'Content-Type': 'application/activity+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
