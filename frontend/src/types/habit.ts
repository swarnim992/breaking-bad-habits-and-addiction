export interface Habit {
  id: string;
  user_id: string;
  habit_name: string;
  unit: string | null;          // user-defined unit label e.g. "hours/day"
  current_level: number;
  target_level: number;
  trigger: string;
  motivation: string;
  ai_plan: string | null;
  created_at: string;
}

export interface HabitCreate {
  user_id: string;
  habit_name: string;
  unit: string;
  current_level: number;
  target_level: number;
  trigger: string;
  motivation: string;
}
