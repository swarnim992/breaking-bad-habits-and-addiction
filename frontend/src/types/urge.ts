export type UrgeOutcome = "pending" | "resisted" | "gave_in";

export interface UrgeEvent {
  id: string;
  habit_id: string;
  feeling: string;
  ai_response: string | null;
  outcome: UrgeOutcome;
  created_at: string;
}

export interface UrgeEventCreate {
  habit_id: string;
  feeling: string;
  ai_response?: string;
  outcome?: UrgeOutcome;
}
