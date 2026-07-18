"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
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
    reset();
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
        className="animate-pulse-glow w-full rounded-2xl px-6 py-4 text-base font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #ff6584 0%, #6c63ff 100%)",
          boxShadow: "0 8px 32px rgba(255,101,132,0.35)",
        }}
      >
        I&apos;m Having an Urge
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={
          step === "feeling"
            ? "What's happening right now?"
            : step === "response"
            ? "Your coach says"
            : "You showed up — that matters"
        }
        description={
          step === "feeling"
            ? "Describe what you're feeling. We'll help you through this moment."
            : undefined
        }
      >
        {step === "feeling" && (
          <div className="flex flex-col gap-4">
            <textarea
              value={feeling}
              onChange={(e) => {
                setFeeling(e.target.value);
                setError(null);
              }}
              placeholder="e.g. I'm bored and want to scroll Instagram…"
              className="min-h-[120px] w-full resize-y rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[#e8eaf6] outline-none focus:border-[#6c63ff]"
            />
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
                onClick={handleSubmitFeeling}
                className="rounded-xl px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
              >
                {loading ? "Sending…" : "Get support"}
              </button>
            </div>
          </div>
        )}

        {step === "response" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.08)] p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#c5cae9]">
                {response}
              </p>
            </div>
            <p className="text-sm text-[#8892b0]">How did it go?</p>
            {error && <p className="text-sm text-[#ff8fab]">{error}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleOutcome("resisted")}
                className="rounded-xl border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.1)] px-4 py-3 text-sm font-semibold text-[#4ade80] disabled:opacity-60"
              >
                I Resisted 🎉
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleOutcome("gave_in")}
                className="rounded-xl border border-[rgba(255,101,132,0.3)] bg-[rgba(255,101,132,0.1)] px-4 py-3 text-sm font-semibold text-[#ff8fab] disabled:opacity-60"
              >
                I Gave In
              </button>
            </div>
          </div>
        )}

        {step === "outcome" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-[#c5cae9]">
              Every urge you notice is progress. Your coach will adapt based on what you shared.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="self-end rounded-xl px-5 py-2 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
            >
              Back to dashboard
            </button>
          </div>
        )}
      </Dialog>
    </>
  );
}
