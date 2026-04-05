import type { EnglishLevel } from "./types";

export type RoomMode = "Open Floor" | "Debate" | "Teach Me" | "Hot Seat";

export interface LoungeUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  english_level: EnglishLevel;
  xp_points: number;
  streak_count: number;
  is_online: boolean;
  bio?: string;
}

export interface Lounge {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  memberCount: number;
  activeRooms: number;
  gradient: string;
}

export interface LoungeRoom {
  id: string;
  name: string;
  loungeId: string;
  loungeName: string;
  host: LoungeUser;
  participants: LoungeUser[];
  maxParticipants: number;
  mode: RoomMode;
  topic: string;
  isLive: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: LoungeUser;
  upvotes: number;
  createdAt: string;
}

export interface Post {
  id: string;
  loungeId: string;
  loungeName: string;
  title: string;
  content: string;
  author: LoungeUser;
  upvotes: number;
  comments: Comment[];
  createdAt: string;
  isPinned?: boolean;
  mediaType?: "text" | "image" | "video";
  mediaUrl?: string;
  communityId?: string;
  communityName?: string;
}

export interface SuggestedCommunity {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  memberCount: number;
  activeRooms: number;
  shortDescription: string;
  matchReason: string;
}

const u1: LoungeUser = { id: "u1", username: "alex_speaks", full_name: "Alex Chen", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4", english_level: "C1", xp_points: 4820, streak_count: 14, is_online: true, bio: "Debate enthusiast and coffee addict" };
const u2: LoungeUser = { id: "u2", username: "maria_talks", full_name: "Maria Santos", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=ffdfbf", english_level: "B2", xp_points: 3150, streak_count: 7, is_online: true, bio: "Learning English through football debates" };
const u3: LoungeUser = { id: "u3", username: "james_w", full_name: "James Wilson", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=d1d4f9", english_level: "A2", xp_points: 890, streak_count: 3, is_online: false, bio: "Just getting started!" };
const u4: LoungeUser = { id: "u4", username: "priya_v", full_name: "Priya Venkat", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede", english_level: "B1", xp_points: 2340, streak_count: 21, is_online: true, bio: "Tech writer working on fluency" };
const u5: LoungeUser = { id: "u5", username: "chen_l", full_name: "Chen Li", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen&backgroundColor=ffd5dc", english_level: "C2", xp_points: 9210, streak_count: 45, is_online: true, bio: "Native-level speaker, here to help" };

export const loungeUsers = [u1, u2, u3, u4, u5];

export const lounges: Lounge[] = [
  { id: "l1", name: "Daily Debate", slug: "daily-debate", description: "Hot takes, controversial opinions, and spirited discussions", emoji: "🔥", memberCount: 2847, activeRooms: 2, gradient: "from-orange-500 to-red-600" },
  { id: "l2", name: "Business English", slug: "business-english", description: "Nail your presentations, emails, and boardroom talk", emoji: "����", memberCount: 1923, activeRooms: 1, gradient: "from-blue-500 to-indigo-600" },
  { id: "l3", name: "Beginner Corner", slug: "beginner-corner", description: "Zero judgment zone. Every question is a good one", emoji: "🌱", memberCount: 4102, activeRooms: 1, gradient: "from-green-500 to-emerald-600" },
  { id: "l4", name: "Football Talk", slug: "football-talk", description: "Match analysis, transfers, and endless hot takes", emoji: "⚽", memberCount: 3341, activeRooms: 1, gradient: "from-lime-400 to-green-600" },
  { id: "l5", name: "Tech and AI", slug: "tech-ai", description: "The future is happening. Let us talk about it", emoji: "🤖", memberCount: 2156, activeRooms: 1, gradient: "from-violet-500 to-purple-700" },
  { id: "l6", name: "Creative Writing", slug: "creative-writing", description: "Stories, poetry, and the art of expression", emoji: "✍️", memberCount: 1287, activeRooms: 0, gradient: "from-pink-500 to-rose-600" },
];

export const sampleRooms: LoungeRoom[] = [
  { id: "r1", name: "Is remote work killing company culture?", loungeId: "l1", loungeName: "Daily Debate", host: u1, participants: [u1, u2, u5], maxParticipants: 8, mode: "Debate", topic: "Remote work vs office", isLive: true },
  { id: "r2", name: "AI will take every job — agree or disagree?", loungeId: "l1", loungeName: "Daily Debate", host: u5, participants: [u5, u4, u2, u3], maxParticipants: 10, mode: "Open Floor", topic: "AI and the future of work", isLive: true },
  { id: "r3", name: "Pitch Practice: Sell me this pen", loungeId: "l2", loungeName: "Business English", host: u4, participants: [u4, u1], maxParticipants: 6, mode: "Hot Seat", topic: "Business pitching", isLive: true },
  { id: "r4", name: "Simple English: Tell me about your week", loungeId: "l3", loungeName: "Beginner Corner", host: u5, participants: [u5, u3, u2], maxParticipants: 6, mode: "Open Floor", topic: "Casual conversation practice", isLive: true },
  { id: "r5", name: "Champions League semi-final breakdown", loungeId: "l4", loungeName: "Football Talk", host: u2, participants: [u2, u1, u4, u3], maxParticipants: 12, mode: "Open Floor", topic: "UCL analysis", isLive: true },
  { id: "r6", name: "Claude vs GPT — which actually wins?", loungeId: "l5", loungeName: "Tech and AI", host: u1, participants: [u1, u5], maxParticipants: 8, mode: "Debate", topic: "AI model comparison", isLive: true },
];

export const samplePosts: Post[] = [
  { id: "p1", loungeId: "l1", loungeName: "Daily Debate", title: "Grammar mistakes do not matter when speaking — unpopular opinion", content: "Hear me out. Communication is about getting your point across. I have seen C2 speakers lose arguments to B1 speakers because confidence matters more than perfect grammar. The obsession with grammar in speaking is actively holding people back from ever opening their mouths.", author: u1, upvotes: 342, comments: [], createdAt: "2h ago", isPinned: true, mediaType: "text", communityId: "l1", communityName: "Daily Debate" },
  { id: "p2", loungeId: "l1", loungeName: "Daily Debate", title: "Social media has made people worse at real conversation", content: "We spend hours scrolling but our conversational skills are deteriorating. Short-form content has destroyed our ability to hold a sustained argument. The average attention span in a room is now under 90 seconds. Change my mind.", author: u5, upvotes: 218, comments: [], createdAt: "4h ago", isPinned: true, mediaType: "text" },
  { id: "p3", loungeId: "l2", loungeName: "Business English", title: "Phrases that instantly make you sound more professional", content: "After years of business meetings, here are phrases that elevate speakers: Build on that point. Let me reframe that. What I am hearing is. These signal active listening and intelligence. Stop using basically and like in professional settings — they undermine everything else you say.", author: u4, upvotes: 567, comments: [], createdAt: "1d ago", isPinned: true, mediaType: "image", mediaUrl: "https://picsum.photos/seed/post1/600/400", communityId: "l2", communityName: "Business English" },
  { id: "p4", loungeId: "l3", loungeName: "Beginner Corner", title: "I spoke English with a stranger for the first time today!", content: "I have been learning for 8 months and today I asked for directions and the person understood me perfectly!! It is a small win but it feels enormous. This community helped me get here. Thank you all so much.", author: u3, upvotes: 891, comments: [], createdAt: "3h ago", mediaType: "image", mediaUrl: "https://picsum.photos/seed/post3/600/400", communityId: "l3", communityName: "Beginner Corner" },
  { id: "p5", loungeId: "l4", loungeName: "Football Talk", title: "Best vocabulary for describing a goal in English — let us build a list", content: "I struggle to describe football moments in English. I know scored but what about the rest? Top corner, tap-in, worldie, screamer, curler, header, volley. Share your football vocabulary in the comments and let us build the ultimate list together.", author: u2, upvotes: 445, comments: [], createdAt: "5h ago", mediaType: "video", mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", communityId: "l4", communityName: "Football Talk" },
  { id: "p6", loungeId: "l5", loungeName: "Tech and AI", title: "Using AI to practice English: 6 months in, honest review", content: "The good: always available, no judgment, infinite patience. The bad: it never challenges you, it is too agreeable, and it validates everything you say. Nothing replaces speaking with real humans who will actually push back and disagree with you.", author: u1, upvotes: 623, comments: [], createdAt: "6h ago", mediaType: "text" },
];

export const suggestedCommunities: SuggestedCommunity[] = [
  {
    id: "sc1",
    name: "Language Hacks",
    emoji: "🧠",
    gradient: "from-cyan-400 to-blue-500",
    memberCount: 5432,
    activeRooms: 3,
    shortDescription: "Quick tips and tricks to accelerate your English learning",
    matchReason: "Because you engage with Daily Debate posts",
  },
];