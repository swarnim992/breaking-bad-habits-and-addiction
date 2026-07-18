"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { checkinService } from "@/services/checkinService";
import type { Mood } from "@/types/checkin";
import type { Habit } from "@/types/habit";

interface CheckInCardProps {
  habit: Habit;
  onComplete: () => void;
}

const MOODS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: "good", label: "Good", emoji: "😊", color: "border-green-500/40 bg-green-500/10 text-green-400" },
  { value: "okay", label: "Okay", emoji: "😐", color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" },
  { value: "struggled", label: "Struggled", emoji: "😞", color: "border-destructive/40 bg-destructive/10 text-destructive" },
];

export function CheckInCard({ habit, onComplete }: CheckInCardProps) {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);
  const [progress, setProgress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const unit = habit.unit ?? "units";

  function reset() {
    setMood(null);
    setProgress("");
    setNote("");
    setError(null);
    setSuccess(false);
    setAiFeedback(null);
    setLoading(false);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handleSubmit() {
    if (!mood) { setError("Please select how today went."); return; }
    if (!progress || Number(progress) < 0) {
      setError("Please enter how much you spent on the habit today.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const checkin = await checkinService.create({
        habit_id: habit.id,
        mood,
        progress: Number(progress),
        note: note.trim() || undefined,
      });
      setAiFeedback(checkin.ai_feedback);
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
      <Card className="flex h-full flex-col animate-fade-in-up border-border bg-card shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              📝
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-card-foreground">
                Daily Check-in
              </CardTitle>
              <CardDescription className="mt-0.5">
                Reflect on today and track your progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            A quick daily log helps your coach spot patterns and celebrate wins.
          </p>
          <Button
            onClick={() => setOpen(true)}
            className="w-full font-semibold"
            size="lg"
          >
            Log today&apos;s check-in
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              {success ? "✅ Check-in saved!" : "How did today go?"}
            </DialogTitle>
            <DialogDescription>
              {success
                ? "Your coach reviewed today's log."
                : "Be honest. This helps you and your coach improve over time."}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="space-y-4">
              {aiFeedback ? (
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    ✨ Coach feedback
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">{aiFeedback}</p>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Great job showing up today! Your dashboard will update with your latest progress. 🎉
                </p>
              )}
              <DialogFooter>
                <Button onClick={handleClose} className="w-full sm:w-auto">
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Mood */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">How was today?</p>
                <div className="grid grid-cols-3 gap-2">
                  {MOODS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => { setMood(item.value); setError(null); }}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-center text-sm transition-all duration-150",
                        "hover:scale-105 active:scale-100",
                        mood === item.value
                          ? item.color
                          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="block text-xl mb-1">{item.emoji}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {habit.habit_name} today ({unit})
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={progress}
                  onChange={(e) => { setProgress(e.target.value); setError(null); }}
                  placeholder={`e.g. ${habit.target_level}`}
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  What happened today?{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any triggers, wins, or challenges…"
                  className="min-h-[90px] bg-background border-border text-foreground resize-y"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleClose} className="border-border">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Saving & getting feedback…" : "Save check-in"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
