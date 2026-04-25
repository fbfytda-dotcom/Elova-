import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark,
  TrendingUp, Clock, Flame, Pin, Send, ChevronDown, ChevronUp, Sparkles, Hash
} from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { mockUsers } from "@/lib/mock-data";
import type { UserProfile } from "@/lib/types";
import { LevelBadge } from "@/components/LevelBadge";

/* ═══════════════════════════════════════════════════════════════════
   BACKGROUND KEYFRAMES & COMPONENT (Consistent with Explore page)
   ═══════════════════════════════════════════════════════════════════ */

const KEYFRAMES = `
@keyframes nd1{0%,100%{transform:translate(0,0) scale(1);opacity:.5}33%{transform:translate(60px,-40px) scale(1.12);opacity:.7}66%{transform:translate(-35px,30px) scale(.93);opacity:.4}}
@keyframes nd2{0%,100%{transform:translate(0,0) scale(1);opacity:.35}40%{transform:translate(-50px,55px) scale(1.15);opacity:.55}70%{transform:translate(35px,-25px) scale(.9);opacity:.3}}
@keyframes nd3{0%,100%{transform:translate(0,0) scale(1);opacity:.28}50%{transform:translate(70px,-45px) scale(1.12);opacity:.42}}
@keyframes nd4{0%,100%{transform:translate(0,0) scale(1);opacity:.4}50%{transform:translate(-55px,35px) scale(1.2);opacity:.55}}
@keyframes nd5{0%,100%{transform:translate(0,0) scale(1);opacity:.25}35%{transform:translate(30px,40px) scale(1.08);opacity:.38}70%{transform:translate(-40px,-20px) scale(.95);opacity:.18}}
@keyframes af{0%{background-position:0% 50%;opacity:.7}25%{opacity:.9}50%{background-position:100% 50%;opacity:.7}75%{opacity:.85}100%{background-position:0% 50%;opacity:.7}}
@keyframes ap{0%,100%{opacity:.45;transform:scaleY(1)}50%{opacity:.7;transform:scaleY(1.12)}}
@keyframes gs{0%,100%{opacity:.04}50%{opacity:.07}}
`;

function CosmicBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(175deg, #07001a 0%, #0c0624 35%, #0a0820 65%, #06001a 100%)" }} />
        <div style={{ position:"absolute", top:"-12%", left:"-10%", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(124,58,237,0.1) 45%, transparent 70%)", filter:"blur(100px)", animation:"nd1 26s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"2%", right:"-8%", width:650, height:650, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 45%, transparent 70%)", filter:"blur(110px)", animation:"nd2 30s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"-18%", left:"10%", width:900, height:900, borderRadius:"50%", background:"radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.06) 45%, transparent 70%)", filter:"blur(140px)", animation:"nd3 34s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"30%", left:"-6%", width:550, height:550, borderRadius:"50%", background:"radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0.06) 45%, transparent 70%)", filter:"blur(90px)", animation:"nd4 22s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"50%", background:"linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.08) 30%, transparent 60%)", backgroundSize:"300% 300%", animation:"af 16s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"130%", height:"55%", background:"radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 55%)", animation:"ap 7s ease-in-out infinite" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"72px 72px", animation:"gs 5s ease-in-out infinite" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(4,0,14,0.6) 100%)" }} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════ */

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
      { id: "r5", author: mockUsers[5], content: "What was your writing strategy? That is my weakest section.", upvotes: 9, created_at: "3h ago" },
    ],
  },
  {
    id: "p3",
    author: mockUsers[3],
    title: "Daily vocabulary challenge - Week 12",
    content: "This week's theme: Business idioms! Try using these in your next conversation:\n\n1. 'Cut corners' - to do something in the cheapest way\n2. 'The bottom line' - the most important fact\n3. 'Get the ball rolling' - to start something\n4. 'Think outside the box' - to think creatively\n5. 'Bring to the table' - to contribute something\n\nDrop a sentence using any of these below!",
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

/* ═══════════════════════════════════════════════════════════════════
   STYLING CONFIGS
   ═══════════════════════════════════════════════════════════════════ */

const topicStyles: Record<string, { bg: string; text: string; border: string }> = {
  "Learning Tips": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  "Exam Prep":     { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  "Vocabulary":    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  "Discussion":    { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "Grammar":       { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

const sortOptions = [
  { icon: TrendingUp, label: "Trending" },
  { icon: Clock, label: "New" },
  { icon: Flame, label: "Top" },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function CommunityPage() {
  const [activeSort, setActiveSort] = useState("Trending");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [votes, setVotes] = useState<Record<string, number>>({});

  const handleVote = (id: string, delta: number) => {
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }));
  };

  return (
    <div className="flex min-h-screen relative" style={{ background: "transparent" }}>
      <CosmicBackground />
      
      <DesktopSidebar />
      
      <main className="flex-1 min-w-0 relative" style={{ zIndex: 10 }}>
        {/* ═══════════ STICKY HEADER ═══════════ */}
        <header 
          className="sticky top-0 border-b border-white/[0.08]" 
          style={{ zIndex: 40, background: "rgba(7,0,26,0.78)", backdropFilter: "blur(24px) saturate(1.4)", WebkitBackdropFilter: "blur(24px) saturate(1.4)" }}
        >
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground">Community</h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-7">Discuss, share tips, and learn together</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-[0_0_24px_rgba(124,58,237,0.3)] hover:shadow-[0_0_32px_rgba(124,58,237,0.45)] transition-shadow"
              >
                <Send className="h-4 w-4" />
                New Post
              </motion.button>
            </div>

            {/* Sort tabs */}
            <div className="flex items-center gap-2 mt-4">
              {sortOptions.map((opt) => (
                <motion.button 
                  key={opt.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSort(opt.label)}
                  className={
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 " +
                    (activeSort === opt.label
                      ? "bg-primary/15 text-primary border-primary/30 shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                      : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:bg-white/[0.07] hover:text-foreground")
                  }
                >
                  <opt.icon className="h-3.5 w-3.5" />
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>
        </header>

        {/* ═══════════ FEED ═══════════ */}
        <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-3xl mx-auto space-y-4">
          {mockPosts.map((post, i) => {
            const isExpanded = expandedPost === post.id;
            const voteOffset = votes[post.id] ?? 0;
            const tStyle = topicStyles[post.topic] ?? { bg: "bg-white/10", text: "text-muted-foreground", border: "border-white/10" };

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-300 group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-x-0 -bottom-8 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(124,58,237,0.06), transparent)" }} />

                <div className="relative p-5">
                  {/* Post header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                          <Pin className="h-3 w-3" /> Pinned
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tStyle.bg} ${tStyle.text} ${tStyle.border}`}>
                        <Hash className="h-3 w-3 inline-block mr-0.5 -mt-0.5" />{post.topic}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/60">{post.created_at}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <img src={post.author.avatar_url} alt="" className="w-8 h-8 rounded-lg border border-white/10 object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-foreground">@{post.author.username}</span>
                        <LevelBadge level={post.author.english_level} />
                      </div>
                    </div>
                  </div>

                  {/* Title & content */}
                  <h3 className="text-[16px] font-extrabold text-foreground mb-2 leading-snug">{post.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">{post.content}</p>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                    {/* Integrated Vote Pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleVote(post.id, 1)} className={`p-0.5 rounded transition-colors ${voteOffset > 0 ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                        <ArrowBigUp className="h-5 w-5" />
                      </motion.button>
                      <span className="text-[12px] font-bold text-foreground min-w-[20px] text-center">{post.upvotes + voteOffset}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleVote(post.id, -1)} className={`p-0.5 rounded transition-colors ${voteOffset < 0 ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                        <ArrowBigDown className="h-5 w-5" />
                      </motion.button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all">
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all">
                        <Bookmark className="h-3.5 w-3.5" /> Save
                      </motion.button>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 space-y-3 pl-4 border-l-2 border-primary/30">
                          {post.replies.map((reply, ri) => (
                            <motion.div
                              key={reply.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ri * 0.07 }}
                              className="rounded-xl p-3.5"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <img src={reply.author.avatar_url} alt="" className="w-6 h-6 rounded-md border border-white/10" />
                                  <span className="text-[11px] font-bold text-foreground">@{reply.author.username}</span>
                                  <LevelBadge level={reply.author.english_level} />
                                </div>
                                <span className="text-[10px] text-muted-foreground/60">{reply.created_at}</span>
                              </div>
                              <p className="text-[12px] text-foreground/90 leading-relaxed mb-2">{reply.content}</p>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <motion.button whileTap={{ scale: 0.8 }} className="hover:text-primary transition-colors"><ArrowBigUp className="h-4 w-4" /></motion.button>
                                <span className="text-[10px] font-bold">{reply.upvotes}</span>
                                <motion.button whileTap={{ scale: 0.8 }} className="hover:text-destructive transition-colors ml-1"><ArrowBigDown className="h-4 w-4" /></motion.button>
                              </div>
                            </motion.div>
                          ))}
                          
                          {/* Reply input */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 rounded-xl px-4 py-2.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.3)]"
                            >
                              <Send className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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