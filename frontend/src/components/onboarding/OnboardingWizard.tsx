"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HabitCard, HABIT_OPTIONS } from "./HabitCard";
import { habitService } from "@/services/habitService";

const HABIT_ID_KEY = "bba_habit_id";

interface OnboardingWizardProps {
  userId: string;
}

interface FormState {
  habitId: string;       // id from HABIT_OPTIONS
  habitName: string;     // could be custom if "other"
  unit: string;          // user types this
  currentLevel: string;
  targetLevel: string;
  trigger: string;
  motivation: string;
}

const TOTAL_STEPS = 5;

export function OnboardingWizard({ userId }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    habitId: "",
    habitName: "",
    unit: "",
    currentLevel: "",
    targetLevel: "",
    trigger: "",
    motivation: "",
  });

  function updateForm(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  // ── Step validation ──────────────────────────────────────────────────────
  function canProceed(): boolean {
    switch (step) {
      case 1: return form.habitId !== "";
      case 2: return form.habitName.trim() !== "" && form.unit.trim() !== "";
      case 3:
        return (
          form.currentLevel !== "" &&
          form.targetLevel !== "" &&
          Number(form.targetLevel) < Number(form.currentLevel)
        );
      case 4: return form.trigger.trim().length >= 5;
      case 5: return form.motivation.trim().length >= 5;
      default: return false;
    }
  }

  // ── Navigate steps ───────────────────────────────────────────────────────
  function handleNext() {
    if (!canProceed()) {
      setError(getValidationMessage());
      return;
    }
    setError(null);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function getValidationMessage(): string {
    switch (step) {
      case 1: return "Please select a habit to work on.";
      case 2: return "Please fill in the habit name and unit label.";
      case 3:
        if (!form.currentLevel || !form.targetLevel) return "Please fill in both values.";
        return "Your target must be less than your current level.";
      case 4: return "Please describe your trigger (at least 5 characters).";
      case 5: return "Please describe your motivation (at least 5 characters).";
      default: return "";
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!canProceed()) return;
    setLoading(true);
    setError(null);
    try {
      const habit = await habitService.createHabit({
        user_id: userId,
        habit_name: form.habitName,
        unit: form.unit,
        current_level: Number(form.currentLevel),
        target_level: Number(form.targetLevel),
        trigger: form.trigger,
        motivation: form.motivation,
      });
      localStorage.setItem(HABIT_ID_KEY, habit.id);
      router.push("/plan");
    } catch (err) {
      console.error(err);
      setError("Something went wrong saving your habit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 1 — Habit selection ─────────────────────────────────────────────
  function renderStep1() {
    const selectedOption = HABIT_OPTIONS.find((o) => o.id === form.habitId);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            What habit do you want to reduce?
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-muted-foreground)",
              fontSize: "0.9375rem",
            }}
          >
            Pick the one you struggle with most right now.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {HABIT_OPTIONS.map((opt) => (
            <HabitCard
              key={opt.id}
              option={opt}
              selected={form.habitId === opt.id}
              onClick={() => {
                updateForm("habitId", opt.id);
                // Pre-fill habitName for non-other options; unit gets default suggestion
                if (opt.id !== "other") {
                  updateForm("habitName", opt.label);
                } else {
                  updateForm("habitName", "");
                }
                updateForm("unit", opt.defaultUnit);
              }}
            />
          ))}
        </div>

        {selectedOption && (
          <p style={{ color: "#6c63ff", fontSize: "0.875rem", margin: 0 }}>
            ✓ Selected: <strong>{selectedOption.label}</strong>
          </p>
        )}
      </div>
    );
  }

  // ── Step 2 — Habit name & unit ───────────────────────────────────────────
  function renderStep2() {
    const isOther = form.habitId === "other";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            {isOther ? "Name your habit" : "Confirm the details"}
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-muted-foreground)",
              fontSize: "0.9375rem",
            }}
          >
            {isOther
              ? "Give it a name and define how you measure it."
              : "We've pre-filled these — adjust if needed."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Habit name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={labelStyle}>
              Habit name {isOther && <span style={{ color: "#ff6584" }}>*</span>}
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Instagram, Netflix, Vaping…"
              value={form.habitName}
              onChange={(e) => updateForm("habitName", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Unit label */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={labelStyle}>
              How do you measure it? <span style={{ color: "#ff6584" }}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. hours/day, cigarettes/day, times/week…"
              value={form.unit}
              onChange={(e) => updateForm("unit", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <p style={{ color: "#8892b0", fontSize: "0.8125rem", margin: 0 }}>
              This unit will be used throughout the app for your goals and check-ins.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3 — Current & target levels ────────────────────────────────────
  function renderStep3() {
    const unit = form.unit || "units";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            Set your baseline & goal
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-muted-foreground)",
              fontSize: "0.9375rem",
            }}
          >
            Be honest — this helps the AI create a realistic plan for you.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={labelStyle}>
              Current level <span style={{ color: "#8892b0", fontWeight: 400 }}>({unit})</span>
            </label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              step={0.5}
              placeholder="0"
              value={form.currentLevel}
              onChange={(e) => updateForm("currentLevel", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={labelStyle}>
              Target level <span style={{ color: "#8892b0", fontWeight: 400 }}>({unit})</span>
            </label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              step={0.5}
              placeholder="0"
              value={form.targetLevel}
              onChange={(e) => updateForm("targetLevel", e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            {form.currentLevel && form.targetLevel && (
              <p
                style={{
                  fontSize: "0.8125rem",
                  margin: 0,
                  color:
                    Number(form.targetLevel) < Number(form.currentLevel)
                      ? "#4ade80"
                      : "#ff6584",
                }}
              >
                {Number(form.targetLevel) < Number(form.currentLevel)
                  ? `✓ Reduction of ${(
                      Number(form.currentLevel) - Number(form.targetLevel)
                    ).toFixed(1)} ${unit}`
                  : "⚠ Target must be less than current level"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 4 — Trigger ────────────────────────────────────────────────────
  function renderStep4() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            What usually triggers this habit?
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-muted-foreground)",
              fontSize: "0.9375rem",
            }}
          >
            Think about the situations, emotions, or times of day when you reach for it most.
          </p>
        </div>

        <textarea
          style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
          placeholder="e.g. Boredom at night, stress after work, scrolling before bed…"
          value={form.trigger}
          onChange={(e) => updateForm("trigger", e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Boredom", "Stress", "After meals", "Before sleep", "Social pressure"].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() =>
                updateForm(
                  "trigger",
                  form.trigger ? `${form.trigger}, ${chip.toLowerCase()}` : chip.toLowerCase()
                )
              }
              style={chipStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(108,99,255,0.2)";
                e.currentTarget.style.borderColor = "#6c63ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 5 — Motivation ─────────────────────────────────────────────────
  function renderStep5() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            Why do you want to change?
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-muted-foreground)",
              fontSize: "0.9375rem",
            }}
          >
            Your AI coach will use this to keep you motivated during tough moments.
          </p>
        </div>

        <textarea
          style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
          placeholder="e.g. Better sleep, more time for family, improved health, mental clarity…"
          value={form.motivation}
          onChange={(e) => updateForm("motivation", e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Better sleep", "More energy", "Save money", "Mental clarity", "Family time"].map(
            (chip) => (
              <button
                key={chip}
                type="button"
                onClick={() =>
                  updateForm(
                    "motivation",
                    form.motivation ? `${form.motivation}, ${chip.toLowerCase()}` : chip.toLowerCase()
                  )
                }
                style={chipStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(108,99,255,0.2)";
                  e.currentTarget.style.borderColor = "#6c63ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                + {chip}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%), " +
          "radial-gradient(ellipse at bottom right, rgba(255,101,132,0.07) 0%, transparent 50%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#8892b0", fontSize: "0.875rem", marginBottom: "0.5rem", margin: 0 }}>
            Let&apos;s get you set up ✨
          </p>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              margin: "0.25rem 0 0",
              background: "linear-gradient(135deg, #6c63ff, #9f7aea)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.03em",
            }}
          >
            Build better habits
          </h1>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === step ? "2rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "0.25rem",
                background: i + 1 <= step ? "#6c63ff" : "rgba(255,255,255,0.12)",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#8892b0", fontSize: "0.8125rem", margin: "-1.25rem 0 0" }}>
          Step {step} of {TOTAL_STEPS}
        </p>

        {/* Card */}
        <div
          className="glass"
          style={{ padding: "2rem" }}
        >
          <div
            key={step}
            className="animate-fade-in-up"
          >
            {stepRenderers[step - 1]?.()}
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255,101,132,0.1)",
                border: "1px solid rgba(255,101,132,0.3)",
                color: "#ff8fab",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: step > 1 ? "space-between" : "flex-end",
            }}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
                style={backBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)";
                  e.currentTarget.style.color = "#e8eaf6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#8892b0";
                }}
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              style={{
                ...nextBtnStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading
                ? "Saving…"
                : step === TOTAL_STEPS
                ? "🚀 Create my plan"
                : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared inline styles ─────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--color-muted-foreground)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--color-card-foreground)",
  fontSize: "0.9375rem",
  outline: "none",
  transition: "border-color 0.2s",
};

const chipStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--color-muted-foreground)",
  fontSize: "0.8125rem",
  cursor: "pointer",
  fontWeight: 500,
  transition: "all 0.2s",
};

const backBtnStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "transparent",
  color: "var(--color-muted-foreground)",
  fontSize: "0.9375rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const nextBtnStyle: React.CSSProperties = {
  padding: "0.75rem 2rem",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #6c63ff 0%, #9f7aea 100%)",
  color: "#fff",
  fontSize: "0.9375rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
  transition: "all 0.2s",
};
