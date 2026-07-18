import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";
import type { UrgeEvent } from "@/types/urge";

function dateKey(iso: string): string {
  return iso.split("T")[0];
}

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/** Latest check-in per calendar day, keyed by YYYY-MM-DD. */
export function groupCheckInsByDay(checkins: CheckIn[]): Map<string, CheckIn> {
  const byDay = new Map<string, CheckIn>();
  for (const checkin of checkins) {
    const key = dateKey(checkin.created_at);
    const existing = byDay.get(key);
    if (!existing || new Date(checkin.created_at) > new Date(existing.created_at)) {
      byDay.set(key, checkin);
    }
  }
  return byDay;
}

export function getTodayCheckIn(checkins: CheckIn[]): CheckIn | null {
  const today = todayKey();
  return checkins.find((c) => dateKey(c.created_at) === today) ?? null;
}

/** Consecutive days (ending today or yesterday) where progress meets the target. */
export function calculateStreak(checkins: CheckIn[], targetLevel: number): number {
  if (checkins.length === 0) return 0;

  const byDay = groupCheckInsByDay(checkins);
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!byDay.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    const checkin = byDay.get(key);
    if (!checkin || checkin.progress > targetLevel) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** Percent reduction from first logged check-in to the latest. */
export function calculateImprovement(checkins: CheckIn[]): number | null {
  if (checkins.length < 2) return null;

  const sorted = [...checkins].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const first = sorted[0].progress;
  const latest = sorted[sorted.length - 1].progress;
  if (first <= 0) return null;

  return Math.round(((first - latest) / first) * 100);
}

/** How far the user has moved from baseline toward their target (0–100). */
export function getGoalProgress(
  todayProgress: number | null,
  currentLevel: number,
  targetLevel: number
): number {
  const value = todayProgress ?? currentLevel;
  const totalReduction = currentLevel - targetLevel;
  if (totalReduction <= 0) return 100;

  const achieved = currentLevel - value;
  return Math.min(100, Math.max(0, (achieved / totalReduction) * 100));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Chart points: baseline at habit creation, then each daily check-in. */
export function buildChartData(habit: Habit, checkins: CheckIn[]) {
  const sorted = [...checkins].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const points: { label: string; value: number; fullDate: string }[] = [
    {
      label: "Start",
      value: habit.current_level,
      fullDate: habit.created_at,
    },
  ];

  const byDay = groupCheckInsByDay(sorted);
  const dayKeys = [...byDay.keys()].sort();

  for (const key of dayKeys) {
    const checkin = byDay.get(key)!;
    points.push({
      label: new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value: checkin.progress,
      fullDate: checkin.created_at,
    });
  }

  return points;
}

/** Frontend-only nudge until Phase 6 AI endpoint is ready. */
export function buildDailyNudge(habit: Habit): string {
  if (habit.ai_plan) {
    const lines = habit.ai_plan
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const actionLine = lines.find((l) => /^\d+\./.test(l) || l.startsWith("-"));
    if (actionLine) return actionLine.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "");
  }

  return `You tend to struggle with ${habit.trigger.toLowerCase()}. Tonight, try planning one offline activity before your usual trigger time.`;
}

export interface DashboardInsights {
  biggestTrigger: string;
  pattern: string;
  progressText: string;
  recommendation: string;
}

/** Frontend-only insights derived from habit + check-in history. */
export function buildInsights(
  habit: Habit,
  checkins: CheckIn[],
  urges: UrgeEvent[]
): DashboardInsights {
  const improvement = calculateImprovement(checkins);
  const resisted = urges.filter((u) => u.outcome === "resisted").length;

  let pattern = "Log a few check-ins to reveal your patterns.";
  if (checkins.length >= 2) {
    const moodCounts = checkins.reduce<Record<string, number>>((acc, c) => {
      acc[c.mood] = (acc[c.mood] ?? 0) + 1;
      return acc;
    }, {});
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topMood === "struggled") {
      pattern = "Most check-ins show you had tough days — urges often cluster around difficult moods.";
    } else if (topMood === "good") {
      pattern = "Your recent check-ins look positive — keep reinforcing what's working.";
    } else {
      pattern = "Your progress has been steady with a mix of good and okay days.";
    }
  }

  if (urges.length >= 2) {
    pattern = `You've logged ${urges.length} urges and resisted ${resisted}. Most urges tie back to ${habit.trigger.toLowerCase()}.`;
  }

  let progressText = "Start logging daily check-ins to track your improvement.";
  if (improvement !== null && improvement > 0) {
    progressText = `Usage has decreased by ${improvement}% since you started tracking.`;
  } else if (checkins.length === 1) {
    progressText = "Great start — one check-in logged. Keep going to see your trend.";
  }

  return {
    biggestTrigger: habit.trigger,
    pattern,
    progressText,
    recommendation: `Create a routine around your trigger: "${habit.trigger}". Small replacements beat willpower alone.`,
  };
}

/** Static urge intervention until Phase 7 AI endpoint is ready. */
export function buildUrgeIntervention(habit: Habit, feeling: string): string {
  return `I hear you — "${feeling.trim()}" is tough. Remember why you're doing this: ${habit.motivation.toLowerCase()}.

Right now: take 3 slow breaths and put your phone out of reach for 5 minutes.

Try instead: a short walk, a glass of water, or messaging a friend about something unrelated to ${habit.habit_name.toLowerCase()}.`;
}
