export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type RoomCategory = "General" | "Business" | "Exam" | "Gaming";
export interface UserProfile {
id: string;
username: string;
full_name: string;
avatar_url: string;
english_level: EnglishLevel;
streak_count: number;
xp_points: number;
native_language: string;
bio: string;
is_online: boolean;
}
export interface VoiceRoom {
id: string;
name: string;
topic_tags: string[];
host: UserProfile;
participants: UserProfile[];
max_capacity: number;
current_count: number;
is_live: boolean;
language_focus: RoomCategory;
created_at: string;
}