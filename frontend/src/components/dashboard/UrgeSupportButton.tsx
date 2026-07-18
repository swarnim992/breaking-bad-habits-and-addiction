"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildUrgeIntervention } from "@/lib/dashboardUtils";
import { urgeService } from "@/services/urgeService";
import type { Habit } from "@/types/habit";

interface UrgeSupportButtonProps {
  habit: Habit;
  onComplete: () => void;
}

type Step = "feeling" | "response" | "outcome";

export function UrgeSupportButton({ habit, onComplete }: UrgeSupportButtonProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("feeling");
  const [feeling, setFeeling] = useState("");
  const [response, setResponse] = useState("");
  const [urgeId, setUrgeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep("feeling");
    setFeeling("");
    setResponse("");
    setUrgeId(null);
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handleSubmitFeeling() {
    if (feeling.trim().length < 5) {
      setError("Please describe what you're feeling (at least 5 characters).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const aiResponse = buildUrgeIntervention(habit, feeling);
      const urge = await urgeService.create({
        habit_id: habit.id,
        feeling: feeling.trim(),
        ai_response: aiResponse,
        outcome: "pending",
      });
      setUrgeId(urge.id);
      setResponse(aiResponse);
      setStep("response");
    } catch (err) {
      console.error(err);
      setError("Could not log your urge. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOutcome(outcome: "resisted" | "gave_in") {
    if (!urgeId) return;
    setLoading(true);
    setError(null);
    try {
      await urgeService.updateOutcome(urgeId, outcome);
      setStep("outcome");
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Could not save your outcome. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="animate-pulse-glow w-full rounded-xl px-6 py-4 text-base font-bold text-white
          transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, oklch(0.5413 0.2466 293.009) 0%, oklch(0.7874 0.1179 295.7538) 100%)",
          boxShadow: "0 8px 32px oklch(0.7874 0.1179 295.7538 / 0.35)",
        }}
      >
        🚨 I&apos;m Having an Urge
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              {step === "feeling"
                ? "What's happening right now?"
                : step === "response"
                ? "Your coach says"
                : "You showed up — that matters 💪"}
            </DialogTitle>
            {step === "feeling" && (
              <DialogDescription>
                Describe what you&apos;re feeling. We&apos;ll help you through this moment.
              </DialogDescription>
            )}
          </DialogHeader>

          {step === "feeling" && (
            <div className="space-y-4">
              <Textarea
                value={feeling}
                onChange={(e) => { setFeeling(e.target.value); setError(null); }}
                placeholder="e.g. I'm bored and want to scroll Instagram…"
                className="min-h-[120px] bg-background border-border text-foreground resize-y"
              />
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleClose} className="border-border">
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeeling} disabled={loading}>
                  {loading ? "Sending…" : "Get support"}
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === "response" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {response}
                </p>
              </div>
              <p className="text-sm font-medium text-foreground">How did it go?</p>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  disabled={loading}
                  onClick={() => handleOutcome("resisted")}
                  variant="outline"
                  className="border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                >
                  I Resisted 🎉
                </Button>
                <Button
                  disabled={loading}
                  onClick={() => handleOutcome("gave_in")}
                  variant="outline"
                  className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  I Gave In
                </Button>
              </div>
            </div>
          )}

          {step === "outcome" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground/80">
                Every urge you notice is progress. Your coach will adapt based on what you shared.
              </p>
              <DialogFooter>
                <Button onClick={handleClose} className="w-full sm:w-auto">
                  Back to dashboard
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
