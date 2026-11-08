/**
 * VIONEX External Media Synchronization & Taxonomy Ingestion Utility
 * 
 * Synthesizes HackerTube's zero-quota thumbnail extraction and batch YouTube API ingestion.
 * Automatically classifies incoming videos into the 16-area / 150-category taxonomy.
 * 
 * Usage:
 *   npx ts-node -T scripts/external-media-sync.ts --url "https://www.youtube.com/watch?v=fNk_zzaMoSs" --why "Intro to Linear Algebra"
 */

import { prisma } from '@vionex/database';
import { TaxonomyService } from '@vionex/search';

const taxonomyService = TaxonomyService.getInstance();

export interface IngestOptions {
  url?: string;
  vid?: string;
  title?: string;
  channelName?: string;
  summary?: string;
  whyCommunity?: string;
  quoteText?: string;
  quoteAuthor?: string;
  quoteYear?: string;
  contentType?: string;
  level?: string;
  shelfLife?: string;
  tags?: string[];
  categoryHint?: string;
  communityScore?: number;
}

export function extractYouTubeId(urlOrId: string): string | null {
  if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId;
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export async function ingestExternalVideo(options: IngestOptions) {
  const vid = options.vid || (options.url ? extractYouTubeId(options.url) : null);
  if (!vid) {
    throw new Error('Valid 11-character YouTube video ID or URL is required');
  }

  // 1. Derive zero-quota asset URLs (from HackerTube architecture)
  const masterThumbnailUrl = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
  const frameThumbnailUrl = `https://i.ytimg.com/vi/${vid}/hq2.jpg`; // middle frame grab
  const embedUrl = `https://www.youtube-nocookie.com/embed/${vid}`;

  // 2. Classify into Taxonomy
  const textForTaxonomy = `${options.title || ''} ${options.categoryHint || ''} ${(options.tags || []).join(' ')} ${options.summary || ''}`;
  const matchedCategories = taxonomyService.searchCategories(textForTaxonomy, 1);
  const matchedCategory = matchedCategories.length > 0 ? matchedCategories[0] : null;

  // 3. Find or create default channel
  const channelHandle = (options.channelName || 'creator')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 20);

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'creator@vionex.tv',
        username: 'master_creator',
        displayName: 'Master Creator',
        passwordHash: 'dummy_hash'
      }
    });
  }

  let channel = await prisma.channel.findFirst({
    where: { handle: channelHandle }
  });

  if (!channel) {
    channel = await prisma.channel.create({
      data: {
        ownerId: user.id,
        handle: channelHandle,
        name: options.channelName || 'Curated Channel',
        isVerified: true
      }
    });
  }

  // 4. Upsert Video record
  const video = await prisma.video.upsert({
    where: { id: `ext_${vid}` },
    create: {
      id: `ext_${vid}`,
      channelId: channel.id,
      title: options.title || `Video ${vid}`,
      description: options.summary || 'Curated educational video.',
      state: 'PUBLISHED',
      visibility: 'PUBLIC',
      duration: 600, // Default duration placeholder
      thumbnailUrl: masterThumbnailUrl,
      hlsMasterUrl: embedUrl,
      category: matchedCategory?.name || options.categoryHint || 'Education',
      tags: options.tags || [],
      externalVideoId: vid,
      contentType: options.contentType || 'course',
      level: options.level || 'general',
      shelfLife: options.shelfLife || 'evergreen',
      primaryTopic: matchedCategory?.name || 'General',
      whyCommunity: options.whyCommunity || null,
      communityScore: options.communityScore || 1.0,
      pullQuoteText: options.quoteText || null,
      pullQuoteAuthor: options.quoteAuthor || null,
      pullQuoteYear: options.quoteYear || null,
      taxonomyAreaId: matchedCategory?.areaId || null,
      taxonomyCategoryId: matchedCategory?.id || null
    },
    update: {
      title: options.title,
      whyCommunity: options.whyCommunity,
      communityScore: options.communityScore,
      pullQuoteText: options.quoteText,
      taxonomyAreaId: matchedCategory?.areaId,
      taxonomyCategoryId: matchedCategory?.id
    }
  });

  console.log(`[VIONEX Ingest] Successfully indexed video: ${video.title} (${video.id})`);
  console.log(`  Area: ${video.taxonomyAreaId || 'None'} | Category: ${video.taxonomyCategoryId || 'None'}`);
  return video;
}

// CLI Execution if invoked directly
if (require.main === module) {
  const args = process.argv.slice(2);
  let url = 'https://www.youtube.com/watch?v=fNk_zzaMoSs';
  let why = "HN's go-to recommendation for learning linear algebra intuition.";
  let title = 'Essence of Linear Algebra';
  let channel = '3Blue1Brown';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) url = args[++i];
    if (args[i] === '--why' && args[i + 1]) why = args[++i];
    if (args[i] === '--title' && args[i + 1]) title = args[++i];
    if (args[i] === '--channel' && args[i + 1]) channel = args[++i];
  }

  ingestExternalVideo({
    url,
    title,
    channelName: channel,
    whyCommunity: why,
    quoteText: "the most welcoming and informative introduction to the topic I've ever seen",
    quoteAuthor: 'nicebill8',
    quoteYear: '2018',
    contentType: 'course',
    level: 'intro',
    shelfLife: 'evergreen',
    tags: ['linear algebra', 'math', 'vectors', 'visual intuition'],
    communityScore: 25.0
  })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

