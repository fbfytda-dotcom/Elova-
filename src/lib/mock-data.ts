import type { UserProfile, VoiceRoom } from "./types";
const diceBearUrl = (seed: string) =>
`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
export const mockUsers: UserProfile[] = [
{
id: "1", username: "luna_speaks", full_name: "Luna Martinez",
avatar_url: diceBearUrl("luna"), english_level: "C2", streak_count: 47,
xp_points: 12400, native_language: "Spanish", bio: "Language enthusiast & polyglot", is_online: true,
},
{
id: "2", username: "kai_english", full_name: "Kai Tanaka",
avatar_url: diceBearUrl("kai"), english_level: "B2", streak_count: 12,
xp_points: 3200, native_language: "Japanese", bio: "Preparing for IELTS", is_online: true,
},
{
id: "3", username: "sofia_words", full_name: "Sofia Andersson",
avatar_url: diceBearUrl("sofia"), english_level: "C1", streak_count: 31,
xp_points: 8900, native_language: "Swedish", bio: "Business English focused", is_online: false,
},
{
id: "4", username: "alex_flow", full_name: "Alex Kim",
avatar_url: diceBearUrl("alex"), english_level: "B1", streak_count: 5,
xp_points: 1100, native_language: "Korean", bio: "Just getting started!", is_online: true,
},
{
id: "5", username: "priya_talks", full_name: "Priya Sharma",
avatar_url: diceBearUrl("priya"), english_level: "A2", streak_count: 3,
xp_points: 450, native_language: "Hindi", bio: "Learning every day", is_online: true,
},
{
id: "6", username: "marco_chat", full_name: "Marco Rossi",
avatar_url: diceBearUrl("marco"), english_level: "B2", streak_count: 22,
xp_points: 5600, native_language: "Italian", bio: "Love debating topics", is_online: false,
},
];
export const mockRooms: VoiceRoom[] = [
{
id: "r1", name: "Morning Coffee Chat", topic_tags: ["Casual", "Daily Life"],
host: mockUsers[0], participants: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
max_capacity: 8, current_count: 4, is_live: true, language_focus: "General",
created_at: new Date().toISOString(),
},
{
id: "r2", name: "IELTS Speaking Practice", topic_tags: ["Exam Prep", "IELTS"],
host: mockUsers[2], participants: [mockUsers[2], mockUsers[1]],
max_capacity: 6, current_count: 2, is_live: true, language_focus: "Exam",
created_at: new Date().toISOString(),
},
{
id: "r3", name: "Business Negotiations 101", topic_tags: ["Business", "Professional"],
host: mockUsers[5], participants: [mockUsers[5], mockUsers[2], mockUsers[0]],
max_capacity: 8, current_count: 3, is_live: false, language_focus: "Business",
created_at: new Date().toISOString(),
},
{
id: "r4", name: "Gaming in English", topic_tags: ["Gaming", "Fun"],
host: mockUsers[3], participants: [mockUsers[3], mockUsers[4]],
max_capacity: 8, current_count: 2, is_live: true, language_focus: "Gaming",
created_at: new Date().toISOString(),
},
];