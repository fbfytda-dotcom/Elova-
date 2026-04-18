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

// ─── Chat System Types ─────────────────────────────────────────────────

export interface ChatReaction {
  emoji: string;
  count: number;
  reacted: boolean; // did current user react
}

export interface ChatMessage {
  id: string;
  channelId: string;
  author: LoungeUser;
  content: string;
  timestamp: string; // ISO-like display string
  reactions: ChatReaction[];
  replyTo?: { id: string; author: LoungeUser; content: string };
  attachmentUrl?: string;
  isSystem?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unreadCount: number;
  category: string;
}

// ─── Mock Channels (shared template, per-lounge) ────────────────────────

export const mockChannels: ChatChannel[] = [
  { id: "ch-general",       name: "general",          description: "Talk about anything and everything",                    emoji: "💬", unreadCount: 3,  category: "TEXT CHANNELS" },
  { id: "ch-introductions", name: "introductions",    description: "Say hi and tell us about yourself",                     emoji: "👋", unreadCount: 0,  category: "TEXT CHANNELS" },
  { id: "ch-resources",     name: "study-resources",  description: "Share helpful links, books, and tools",                 emoji: "📚", unreadCount: 1,  category: "TEXT CHANNELS" },
  { id: "ch-off-topic",     name: "off-topic",        description: "Memes, random thoughts, and fun stuff",                emoji: "🎲", unreadCount: 5,  category: "TEXT CHANNELS" },
  { id: "ch-voice-text",    name: "voice-chat",       description: "Text companion for voice rooms",                       emoji: "🎙️", unreadCount: 0,  category: "VOICE TEXT" },
  { id: "ch-announcements", name: "announcements",    description: "Important updates and community news",                 emoji: "📢", unreadCount: 0,  category: "INFORMATION" },
];

// ─── Mock Chat Messages ─────────────────────────────────────────────────

export const mockChatMessages: ChatMessage[] = [
  // ── #general channel ──
  { id: "cm1",  channelId: "ch-general", author: u5, content: "Good morning everyone! Who is ready for today's debate topic? 🔥", timestamp: "Today at 9:02 AM", reactions: [{ emoji: "🔥", count: 4, reacted: false }, { emoji: "👋", count: 2, reacted: true }], },
  { id: "cm2",  channelId: "ch-general", author: u1, content: "I have been thinking about this all night. The topic about AI replacing jobs is way more nuanced than people make it out to be.", timestamp: "Today at 9:05 AM", reactions: [{ emoji: "💯", count: 3, reacted: false }], },
  { id: "cm3",  channelId: "ch-general", author: u2, content: "Agree! I think the real question is not whether AI takes jobs but whether we adapt fast enough.", timestamp: "Today at 9:06 AM", reactions: [], replyTo: { id: "cm2", author: u1, content: "I have been thinking about this all night..." }, },
  { id: "cm4",  channelId: "ch-general", author: u1, content: "Exactly. And the language learning space is a perfect example — AI tools help but they cannot replace real conversation practice.", timestamp: "Today at 9:07 AM", reactions: [{ emoji: "👏", count: 5, reacted: true }, { emoji: "🎯", count: 2, reacted: false }], },
  { id: "cm5",  channelId: "ch-general", author: u4, content: "Just joined the room! What did I miss?", timestamp: "Today at 9:15 AM", reactions: [{ emoji: "👋", count: 3, reacted: false }], },
  { id: "cm6",  channelId: "ch-general", author: u5, content: "We were just warming up! The debate room opens in 15 minutes. Anyone want to volunteer as first speaker?", timestamp: "Today at 9:16 AM", reactions: [], },
  { id: "cm7",  channelId: "ch-general", author: u3, content: "I am too nervous to go first but I will definitely participate 😅", timestamp: "Today at 9:18 AM", reactions: [{ emoji: "❤️", count: 4, reacted: true }, { emoji: "💪", count: 2, reacted: false }], },
  { id: "cm8",  channelId: "ch-general", author: u1, content: "No pressure! That is what this community is about. Everyone speaks at their own pace.", timestamp: "Today at 9:19 AM", reactions: [{ emoji: "🙌", count: 6, reacted: false }], replyTo: { id: "cm7", author: u3, content: "I am too nervous to go first..." }, },
  { id: "cm9",  channelId: "ch-general", author: u2, content: "I remember my first time speaking here — my voice was shaking the entire time. Now I host rooms! You will get there.", timestamp: "Today at 9:21 AM", reactions: [{ emoji: "🥹", count: 3, reacted: false }, { emoji: "💯", count: 4, reacted: true }], },
  { id: "cm10", channelId: "ch-general", author: u4, content: "Has anyone tried the new shadowing technique Chen shared last week? I have been practicing with BBC podcasts and it is actually working.", timestamp: "Today at 9:30 AM", reactions: [{ emoji: "👀", count: 2, reacted: false }], },
  { id: "cm11", channelId: "ch-general", author: u5, content: "Yes! The key is to not pause — just keep repeating even if you miss words. Your brain fills in the gaps over time.", timestamp: "Today at 9:32 AM", reactions: [{ emoji: "🧠", count: 5, reacted: false }, { emoji: "📝", count: 1, reacted: false }], replyTo: { id: "cm10", author: u4, content: "Has anyone tried the new shadowing technique..." }, },
  { id: "cm12", channelId: "ch-general", author: u1, content: "Debate room is live now! Topic: \"Social media has made us worse communicators\" — join if you are ready 🎙️", timestamp: "Today at 9:45 AM", reactions: [{ emoji: "🔥", count: 7, reacted: true }, { emoji: "🎙️", count: 3, reacted: false }], },
  { id: "cm-sys1", channelId: "ch-general", author: u3, content: "James Wilson joined the community. Welcome! 🎉", timestamp: "Today at 8:30 AM", reactions: [], isSystem: true },

  // ── #introductions channel ──
  { id: "cm20", channelId: "ch-introductions", author: u3, content: "Hi everyone! I am James from London. I have been learning English for about 6 months now. My native language is Mandarin and I am aiming for B1 by the end of this year. I love football and technology! Happy to be here 🙌", timestamp: "Yesterday at 3:15 PM", reactions: [{ emoji: "👋", count: 5, reacted: true }, { emoji: "❤️", count: 3, reacted: false }, { emoji: "⚽", count: 2, reacted: false }], },
  { id: "cm21", channelId: "ch-introductions", author: u5, content: "Welcome James! Great to have you here. If you need any help, don't hesitate to ask in #general. We are all here to support each other.", timestamp: "Yesterday at 3:22 PM", reactions: [{ emoji: "🙏", count: 2, reacted: false }], replyTo: { id: "cm20", author: u3, content: "Hi everyone! I am James from London..." }, },
  { id: "cm22", channelId: "ch-introductions", author: u2, content: "Another football fan! You should definitely check out the Football Talk lounge. We do live match commentary rooms in English — it is the best way to learn sports vocabulary.", timestamp: "Yesterday at 3:30 PM", reactions: [{ emoji: "⚽", count: 3, reacted: false }, { emoji: "💯", count: 1, reacted: false }], },

  // ── #study-resources channel ──
  { id: "cm30", channelId: "ch-resources", author: u4, content: "Here is a list of podcasts I use for shadowing practice:\n\n1. BBC Learning English (beginner-friendly)\n2. All Ears English (intermediate)\n3. The English We Speak (short episodes)\n4. 6 Minute English (perfect length)\n\nAll free and amazing quality!", timestamp: "Today at 7:30 AM", reactions: [{ emoji: "🔖", count: 8, reacted: true }, { emoji: "🙏", count: 5, reacted: false }, { emoji: "📚", count: 3, reacted: false }], },
  { id: "cm31", channelId: "ch-resources", author: u1, content: "Adding to this — for advanced learners, try \"Philosophize This!\" podcast. Complex vocabulary, abstract concepts, and it forces you to think in English.", timestamp: "Today at 7:45 AM", reactions: [{ emoji: "🧠", count: 4, reacted: false }], replyTo: { id: "cm30", author: u4, content: "Here is a list of podcasts I use..." }, },
  { id: "cm32", channelId: "ch-resources", author: u3, content: "Thank you so much for these! I have been looking for good listening resources.", timestamp: "Today at 8:10 AM", reactions: [{ emoji: "❤️", count: 2, reacted: false }], },

  // ── #off-topic channel ──
  { id: "cm40", channelId: "ch-off-topic", author: u2, content: "What is everyone having for lunch today? I need inspiration 🍕", timestamp: "Today at 12:01 PM", reactions: [{ emoji: "🍕", count: 3, reacted: false }, { emoji: "🍣", count: 2, reacted: true }], },
  { id: "cm41", channelId: "ch-off-topic", author: u1, content: "I just had the most amazing ramen. Learning food vocabulary in English is underrated — it is actual useful daily conversation.", timestamp: "Today at 12:05 PM", reactions: [{ emoji: "🍜", count: 4, reacted: false }, { emoji: "😂", count: 1, reacted: false }], },
  { id: "cm42", channelId: "ch-off-topic", author: u4, content: "Fun fact: the word \"ketchup\" originally comes from a Chinese word. English steals vocabulary from everywhere 😄", timestamp: "Today at 12:10 PM", reactions: [{ emoji: "🤯", count: 6, reacted: true }, { emoji: "📖", count: 2, reacted: false }], },
  { id: "cm43", channelId: "ch-off-topic", author: u5, content: "Speaking of food words — who can explain the difference between \"cuisine\" and \"food\"? Both mean the same thing but feel totally different.", timestamp: "Today at 12:15 PM", reactions: [{ emoji: "🤔", count: 3, reacted: false }], },
  { id: "cm44", channelId: "ch-off-topic", author: u3, content: "Cuisine sounds fancy, food sounds normal? Like \"I love Italian cuisine\" vs \"I love Italian food\"?", timestamp: "Today at 12:18 PM", reactions: [{ emoji: "💯", count: 5, reacted: false }, { emoji: "🎯", count: 3, reacted: true }], replyTo: { id: "cm43", author: u5, content: "Speaking of food words..." }, },

  // ── #voice-chat channel ──
  { id: "cm50", channelId: "ch-voice-text", author: u1, content: "Anyone in the debate room right now? Cannot unmute because I am on the train 🚂", timestamp: "Today at 10:00 AM", reactions: [], },
  { id: "cm51", channelId: "ch-voice-text", author: u5, content: "Yes! We are discussing whether accent matters more than grammar. Come listen!", timestamp: "Today at 10:02 AM", reactions: [{ emoji: "🎧", count: 2, reacted: false }], },

  // ── #announcements channel ──
  { id: "cm60", channelId: "ch-announcements", author: u5, content: "📢 **Weekly Speaking Challenge**\n\nThis week's topic: Describe your ideal weekend using at least 5 new vocabulary words.\n\nRecord yourself in any voice room and tag it with #WeeklyChallenge. Winner gets a special badge! 🏆\n\nDeadline: Sunday 11:59 PM", timestamp: "Monday at 9:00 AM", reactions: [{ emoji: "🏆", count: 12, reacted: true }, { emoji: "🔥", count: 8, reacted: false }, { emoji: "💪", count: 5, reacted: false }], },
  { id: "cm61", channelId: "ch-announcements", author: u5, content: "🎉 **New Feature: Forums!**\n\nYou can now create long-form discussion threads in the Forums tab. Perfect for questions that deserve detailed answers.\n\nCheck it out and start a thread!", timestamp: "Last Wednesday at 2:00 PM", reactions: [{ emoji: "🎉", count: 15, reacted: false }, { emoji: "👏", count: 9, reacted: true }], },
];