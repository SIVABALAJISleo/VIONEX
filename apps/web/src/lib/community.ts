/**
 * VIONEX Social & Community Engine
 * Manages creator community updates, text/image posts, and interactive polls.
 */

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPost {
  id: string;
  authorHandle: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string;
  content: string;
  imageUrl?: string;
  poll?: {
    question: string;
    totalVotes: number;
    options: PollOption[];
    userVotedOptionId?: string;
  };
  likes: number;
  commentsCount: number;
}

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'comm_01',
    authorHandle: 'vionex-labs',
    authorName: 'VIONEX Engineering',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    publishedAt: '2 hours ago',
    content: 'We just rolled out the Two-Tower Deep Neural Network candidate generator for our homepage recommendations! Which feature should we benchmark next?',
    poll: {
      question: 'Which next-gen feature should we benchmark next?',
      totalVotes: 12480,
      options: [
        { id: 'opt_1', text: 'Ultra-Low-Latency WebRTC P2P mesh relay', votes: 5840 },
        { id: 'opt_2', text: 'AV1 Hardware codec transcoding benchmarks', votes: 3920 },
        { id: 'opt_3', text: 'Real-time multi-track live audio dubbing', votes: 2720 },
      ],
    },
    likes: 1840,
    commentsCount: 294,
  },
  {
    id: 'comm_02',
    authorHandle: 'vionex-labs',
    authorName: 'VIONEX Engineering',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    publishedAt: '1 day ago',
    content: 'Check out our newly deployed Edge PoP telemetry in Frankfurt and Singapore. Over 99.4% cache hit ratio achieved across global video segments!',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    likes: 3120,
    commentsCount: 412,
  },
];

/**
 * Cast a vote on a community poll and compute percentage distribution (SOC-039)
 */
export function voteOnCommunityPoll(
  posts: CommunityPost[],
  postId: string,
  optionId: string
): { updatedPosts: CommunityPost[]; optionPercentages: Record<string, number> } {
  const updatedPosts = posts.map(post => {
    if (post.id !== postId || !post.poll) return post;

    const hasVotedBefore = !!post.poll.userVotedOptionId;
    const oldOptionId = post.poll.userVotedOptionId;

    const newOptions = post.poll.options.map(opt => {
      let v = opt.votes;
      if (hasVotedBefore && opt.id === oldOptionId) v = Math.max(0, v - 1);
      if (opt.id === optionId) v += 1;
      return { ...opt, votes: v };
    });

    const newTotal = newOptions.reduce((acc, o) => acc + o.votes, 0);

    return {
      ...post,
      poll: {
        ...post.poll,
        options: newOptions,
        totalVotes: newTotal,
        userVotedOptionId: optionId,
      },
    };
  });

  const targetPost = updatedPosts.find(p => p.id === postId);
  const optionPercentages: Record<string, number> = {};
  if (targetPost && targetPost.poll && targetPost.poll.totalVotes > 0) {
    targetPost.poll.options.forEach(opt => {
      optionPercentages[opt.id] = Math.round((opt.votes / targetPost.poll!.totalVotes) * 100);
    });
  }

  return { updatedPosts, optionPercentages };
}
