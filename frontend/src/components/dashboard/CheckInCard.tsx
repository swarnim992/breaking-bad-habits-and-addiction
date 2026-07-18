"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { checkinService } from "@/services/checkinService";
import type { Mood } from "@/types/checkin";
import type { Habit } from "@/types/habit";

interface CheckInCardProps {
  habit: Habit;
  onComplete: () => void;
}

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "good", label: "Good", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "struggled", label: "Struggled", emoji: "😞" },
];

export function CheckInCard({ habit, onComplete }: CheckInCardProps) {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);
  const [progress, setProgress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const unit = habit.unit ?? "units";

  function reset() {
    setMood(null);
    setProgress("");
    setNote("");
    setError(null);
    setSuccess(false);
    setLoading(false);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function handleSubmit() {
    if (!mood) {
      setError("Please select how today went.");
      return;
    }
    if (!progress || Number(progress) < 0) {
      setError("Please enter how much you spent on the habit today.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await checkinService.create({
        habit_id: habit.id,
        mood,
        progress: Number(progress),
        note: note.trim() || undefined,
      });
      setSuccess(true);
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Could not save your check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="flex h-full flex-col animate-fade-in-up">
        <CardHeader>
          <div>
            <CardTitle>Daily Check-in</CardTitle>
            <CardDescription className="mt-1">
              Reflect on today and track your progress
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-4">
          <p className="text-sm leading-relaxed text-[#8892b0]">
            A quick daily log helps your coach spot patterns and celebrate wins.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-xl px-4 py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
          >
            Log today&apos;s check-in
          </button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        title={success ? "Check-in saved" : "How did today go?"}
        description={
          success
            ? "AI feedback will arrive in Phase 8 — your progress is already tracked."
            : "Be honest. This helps you and your coach improve over time."
        }
      >
        {success ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#c5cae9]">
              Great job showing up today. Your dashboard will update with your latest progress.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="self-end rounded-xl px-5 py-2 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-sm font-medium text-[#c5cae9]">Mood</p>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setMood(item.value);
                      setError(null);
                    }}
                    className="rounded-xl border px-3 py-3 text-center text-sm transition-colors"
                    style={{
                      borderColor:
                        mood === item.value ? "#6c63ff" : "rgba(255,255,255,0.1)",
                      background:
                        mood === item.value
                          ? "rgba(108,99,255,0.15)"
                          : "rgba(255,255,255,0.04)",
                      color: mood === item.value ? "#e8eaf6" : "#8892b0",
                    }}
                  >
                    <span className="block text-xl">{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#c5cae9]">
                How much {habit.habit_name.toLowerCase()} today? ({unit})
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={progress}
                onChange={(e) => {
                  setProgress(e.target.value);
                  setError(null);
                }}
                placeholder={`e.g. ${habit.target_level}`}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#e8eaf6] outline-none focus:border-[#6c63ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#c5cae9]">
                What happened today? (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any triggers, wins, or challenges…"
                className="min-h-[90px] w-full resize-y rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[#e8eaf6] outline-none focus:border-[#6c63ff]"
              />
            </div>

            {error && <p className="text-sm text-[#ff8fab]">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-[#8892b0]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="rounded-xl px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
              >
                {loading ? "Saving…" : "Save check-in"}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
