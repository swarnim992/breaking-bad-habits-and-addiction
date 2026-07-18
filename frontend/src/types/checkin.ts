export type Mood = "good" | "okay" | "struggled";

export interface CheckIn {
  id: string;
  habit_id: string;
  progress: number;
  mood: Mood;
  note: string | null;
  ai_feedback: string | null;
  created_at: string;
}

export interface CheckInCreate {
  habit_id: string;
  progress: number;
  mood: Mood;
  note?: string;
}
