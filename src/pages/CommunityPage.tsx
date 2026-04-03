import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark,
TrendingUp, Clock, Flame, Pin, Send, ChevronDown, ChevronUp
} from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockUsers } from "@/lib/mock-data";
import type { UserProfile } from "@/lib/types";
import { LevelBadge } from "@/components/LevelBadge";
interface Reply {
id: string;
author: UserProfile;
content: string;
upvotes: number;
created_at: string;
}
interface Post {
id: string;
author: UserProfile;
title: string;
content: string;
topic: string;
upvotes: number;
replies: Reply[];
isPinned: boolean;
created_at: string;
}
const mockPosts: Post[] = [
{
id: "p1",
author: mockUsers[0],
title: "Best resources for improving pronunciation?",
content: "I have been working on my pronunciation for a while now. My native language is Spanish and I struggle with the 'th' sound. Does anyone have recommendations for good YouTube channels or apps that focus specifically on pronunciation drills? I have tried Forvo but looking for something more structured.",
topic: "Learning Tips",
upvotes: 47,
isPinned: true,
created_at: "2h ago",
replies: [
{ id: "r1", author: mockUsers[2], content: "Rachel's English on YouTube is amazing for American pronunciation. She breaks down mouth positioning for every sound.", upvotes: 23, created_at: "1h ago" },
{ id: "r2", author: mockUsers[1], content: "I had the same issue with Japanese. What helped me was recording myself and comparing with native speakers. Try Elsa Speak app!", upvotes: 15, created_at: "45m ago" },
{ id: "r3", author: mockUsers[4], content: "Practice tongue twisters! 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.' Really helped me.", upvotes: 8, created_at: "30m ago" },
],
},
{
id: "p2",
author: mockUsers[2],
title: "IELTS Band 8 - My preparation strategy",
content: "Just got my results back and scored Band 8 overall! Here is what worked for me: I practiced speaking with native speakers daily (this app helped a lot), read academic articles from The Economist, and took mock tests every weekend. Happy to answer any questions about the exam structure.",
topic: "Exam Prep",
upvotes: 89,
isPinned: false,
created_at: "5h ago",
replies: [
{ id: "r4", author: mockUsers[3], content: "Congratulations! How long did you prepare? I am aiming for Band 7 and feeling nervous.", upvotes: 12, created_at: "4h ago" },
{ id: "r5", author: mockUsers[5], content: "What was your writing strategy? That is my weakest section.", upvotes:
9, created_at: "3h ago" },
],
},
{
id: "p3",
author: mockUsers[3],
title: "Daily vocabulary challenge - Week 12",
content: "This week's theme: Business idioms! Try using these in your next conversation:\n\n1. 'Cut corners' - to do something in the cheapest way\n2. 'The bottom line' - the most important fact\n3. 'Get the ball rolling' - to start  something\n4. 'Think outside the box' - to think creatively\n5. 'Bring to the table' - to contribute something\n\nDrop a sentence using any of these below!",
topic: "Vocabulary",
upvotes: 34,
isPinned: false,
created_at: "8h ago",
replies: [
{ id: "r6", author: mockUsers[0], content: "Let us get the ball rolling on this project! - I use this one all the time at work.", upvotes: 6, created_at: "7h ago" },
],
},
{
id: "p4",
author: mockUsers[5],
title: "Debate topic: Is AI making language learning easier or lazier?",
content: "With tools like ChatGPT and translation apps becoming so advanced, do you think learners are becoming more dependent on technology? On one hand, AI provides instant feedback. On the other, some argue it reduces the motivation to truly internalize the language. What are your thoughts?",
topic: "Discussion",
upvotes: 56,
isPinned: false,
created_at: "12h ago",
replies: [
{ id: "r7", author: mockUsers[2], content: "I think AI is a great supplement but nothing replaces actual human conversation. That is why platforms like this are so valuable.", upvotes: 19, created_at: "11h ago" },
{ id: "r8", author: mockUsers[1], content: "AI helped me understand grammar rules faster, but I only improved fluency by talking to real people.", upvotes: 14, created_at: "10h ago" },
{ id: "r9", author: mockUsers[4], content: "The danger is when people use AI to write everything for them instead of practicing themselves.", upvotes: 11, created_at: "9h ago" },
],
},
];
const topicColors: Record<string, string> = {
"Learning Tips": "bg-blue-500/15 text-blue-300",
"Exam Prep": "bg-amber-500/15 text-amber-300",
"Vocabulary": "bg-green-500/15 text-green-300",
"Discussion": "bg-purple-500/15 text-purple-300",
"Grammar": "bg-red-500/15 text-red-300",
};
const sortOptions = [
{ icon: TrendingUp, label: "Trending" },
{ icon: Clock, label: "New" },
{ icon: Flame, label: "Top" },
];
export default function CommunityPage() {
const [activeSort, setActiveSort] = useState("Trending");
const [expandedPost, setExpandedPost] = useState<string | null>(null);
const [newComment, setNewComment] = useState("");
const [votes, setVotes] = useState<Record<string, number>>({});
const handleVote = (id: string, delta: number) => {
setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }));
};
return (
<div className="flex min-h-screen">
<DesktopSidebar />
<main className="flex-1 min-w-0">
<header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex-1">
<h1 className="text-xl font-extrabold tracking-tight text-foreground">Community</h1>
<p className="text-xs text-muted-foreground mt-0.5">Discuss, share tips, and learn together</p>
</div>
<motion.button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.95 }}
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold glow-primary"
>
<Send className="h-4 w-4" />
New Post
</motion.button>
</div>

{/* Sort tabs */}
<div className="flex items-center gap-2 mt-3">
{sortOptions.map((opt) => (
<button
key={opt.label}
onClick={() => setActiveSort(opt.label)}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
${activeSort === opt.label
? "bg-primary/15 text-primary"
: "text-muted-foreground hover:bg-white/5 hover:text-foreground"
}`}
>
<opt.icon className="h-3.5 w-3.5" />
{opt.label}
</button>
))}
</div>
</header>
<div className="p-4 md:p-6 pb-24 md:pb-6 max-w-3xl mx-auto space-y-3">
{mockPosts.map((post, i) => {
const isExpanded = expandedPost === post.id;
const voteOffset = votes[post.id] ?? 0;
return (
<motion.article
key={post.id}
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="glass-panel overflow-hidden"
>
<div className="flex">
{/* Vote column */}
<div className="flex flex-col items-center py-4 px-3 gap-1 border-r border-white/5">
<motion.button
whileTap={{ scale: 0.8 }}
onClick={() => handleVote(post.id, 1)}
className={`p-0.5 rounded transition-colors ${voteOffset > 0 ? "text-primary" :
"text-muted-foreground hover:text-primary"}`}
>
<ArrowBigUp className="h-5 w-5" />
</motion.button>
<span className="text-xs font-bold text-foreground">{post.upvotes + voteOffset}</span>
<motion.button
whileTap={{ scale: 0.8 }}
onClick={() => handleVote(post.id, -1)}
className={`p-0.5 rounded transition-colors ${voteOffset < 0 ? "text-destructive" :
"text-muted-foreground hover:text-destructive"}`}
>
<ArrowBigDown className="h-5 w-5" />
</motion.button>
</div>
{/* Content */}
<div className="flex-1 p-4">
{/* Post header */}
<div className="flex items-center gap-2 mb-2 flex-wrap">
{post.isPinned && (
<span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-400">
<Pin className="h-3 w-3" /> Pinned
</span>
)}
<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${topicColors[post.topic] ??
"bg-white/10 text-muted-foreground"}`}>
{post.topic}
</span>
<div className="flex items-center gap-1.5">
<img src={post.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
<span className="text-[10px] text-muted-foreground">@{post.author.username}</span>
<LevelBadge level={post.author.english_level} />
</div>
<span className="text-[10px] text-muted-foreground/60">{post.created_at}</span>
</div>
{/* Title & content */}
<h3 className="text-sm font-bold text-foreground mb-1.5">{post.title}</h3>

<p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{post.content}</p>
{/* Actions bar */}
<div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
<button
onClick={() => setExpandedPost(isExpanded ? null : post.id)}
className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
>
<MessageSquare className="h-3.5 w-3.5" />
{post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
{isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
</button>
<button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
<Share2 className="h-3.5 w-3.5" /> Share
</button>
<button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
<Bookmark className="h-3.5 w-3.5" /> Save
</button>
</div>
{/* Replies */}
<AnimatePresence>
{isExpanded && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.2 }}
className="overflow-hidden"
>
<div className="mt-3 space-y-2 pl-3 border-l-2 border-primary/20">
{post.replies.map((reply, ri) => (
<motion.div
key={reply.id}
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: ri * 0.05 }}
className="bg-white/[0.03] rounded-lg p-3"
>
<div className="flex items-center gap-1.5 mb-1">
<img src={reply.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
<span className="text-[10px] font-semibold text-foreground">@{reply.author.username}</span>
<LevelBadge level={reply.author.english_level} />
<span className="text-[10px] text-muted-foreground/60 ml-auto">{reply.created_at}</span>
</div>
<p className="text-xs text-foreground/80">{reply.content}</p>
<div className="flex items-center gap-1 mt-1.5">
<ArrowBigUp className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
<span className="text-[10px] font-semibold text-muted-foreground">{reply.upvotes}</span>
</div>
</motion.div>
))}
{/* Reply input */}
<div className="flex items-center gap-2 pt-2">
<input
value={newComment}
onChange={(e) => setNewComment(e.target.value)}
placeholder="Write a reply..."
className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
/>
<motion.button
whileTap={{ scale: 0.9 }}
className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"
>
<Send className="h-3.5 w-3.5" />
</motion.button>
</div>
</div>

</motion.div>
)}
</AnimatePresence>
</div>
</div>
</motion.article>
);
})}
</div>
</main>
<BottomNav />
</div>
);
}