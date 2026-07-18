"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { coachService } from "@/services/coachService";
import type { Habit } from "@/types/habit";

const HABIT_ID_KEY = "bba_habit_id";

export default function PlanPage() {
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("Initializing AI Coach…");

  // Step-based status message rotation for polished loading states
  useEffect(() => {
    if (!loading) return;
    const messages = [
      { text: "Initializing AI Coach…", delay: 0 },
      { text: "Analyzing habit triggers & motivations…", delay: 2000 },
      { text: "Creating daily micro-actions…", delay: 4500 },
      { text: "Polishing your custom behavioral roadmap…", delay: 7500 },
    ];

    const timeouts = messages.map((m) =>
      setTimeout(() => setStatusMsg(m.text), m.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [loading]);

  const loadPlan = async (habitId: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedHabit = await coachService.generatePlan(habitId);
      setHabit(updatedHabit);
    } catch (err) {
      console.error(err);
      setError("Failed to generate your plan. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const habitId = localStorage.getItem(HABIT_ID_KEY);
    if (!habitId) {
      router.replace("/");
      return;
    }
    loadPlan(habitId);
  }, [router]);

  const parseInlineBold = (line: string) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} style={{ color: "#ff6584", fontWeight: 600 }}>
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const renderPlanContent = (text: string) => {
    const sections = text.split("###");
    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return null;
      const lines = trimmed.split("\n");
      const title = lines[0].trim();
      const contentLines = lines.slice(1);

      return (
        <div
          key={idx}
          style={{
            marginBottom: "1.75rem",
            background: "rgba(255, 255, 255, 0.02)",
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <h3
            style={{
              color: "#8b85ff",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#6c63ff",
                display: "inline-block",
              }}
            />
            {title}
          </h3>
          <div
            style={{
              color: "#c5cae9",
              fontSize: "0.9375rem",
              lineHeight: "1.6",
            }}
          >
            {contentLines.map((line, lIdx) => {
              const lineTrimmed = line.trim();
              if (!lineTrimmed) return null;

              // Match lists (1., -, *)
              const matchNumber = lineTrimmed.match(/^(\d+)\.\s*(.*)/);
              const isBullet = lineTrimmed.startsWith("-") || lineTrimmed.startsWith("*");

              if (matchNumber) {
                const num = matchNumber[1];
                const rest = matchNumber[2];
                return (
                  <div
                    key={lIdx}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "0.625rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(108, 99, 255, 0.15)",
                        color: "#8b85ff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {num}
                    </span>
                    <span style={{ flex: 1 }}>{parseInlineBold(rest)}</span>
                  </div>
                );
              }

              if (isBullet) {
                const rest = lineTrimmed.replace(/^[-*]\s*/, "");
                return (
                  <div
                    key={lIdx}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "0.625rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "#ff6584",
                        fontSize: "1.25rem",
                        lineHeight: "1",
                        flexShrink: 0,
                      }}
                    >
                      •
                    </span>
                    <span style={{ flex: 1 }}>{parseInlineBold(rest)}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} style={{ margin: "0.5rem 0" }}>
                  {parseInlineBold(lineTrimmed)}
                </p>
              );
            })}
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          background:
            "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%), " +
            "radial-gradient(ellipse at bottom right, rgba(255,101,132,0.07) 0%, transparent 50%)",
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Outer pulsing ring */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px solid rgba(108, 99, 255, 0.2)",
              animation: "pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          {/* Main loader */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "4px solid rgba(108,99,255,0.1)",
              borderTopColor: "#6c63ff",
              borderRightColor: "#9f7aea",
              animation: "spinPlan 1s linear infinite",
            }}
          />
        </div>
        <div style={{ textAlign: "center", maxWidth: "320px", padding: "0 1rem" }}>
          <p
            style={{
              color: "#e8eaf6",
              fontSize: "1.1rem",
              fontWeight: 600,
              margin: "0 0 0.5rem",
            }}
          >
            Generating Plan
          </p>
          <p
            style={{
              color: "#8892b0",
              fontSize: "0.875rem",
              minHeight: "20px",
              margin: 0,
              transition: "opacity 0.3s",
            }}
          >
            {statusMsg}
          </p>
        </div>
        <style>{`
          @keyframes spinPlan { to { transform: rotate(360deg); } }
          @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.15); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background:
            "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%)",
        }}
      >
        <div
          className="glass glow-primary"
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,101,132,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff6584",
              fontSize: "1.5rem",
            }}
          >
            ⚠
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e8eaf6", margin: "0 0 0.5rem" }}>
              Plan Generation Failed
            </h2>
            <p style={{ color: "#8892b0", fontSize: "0.9rem", margin: 0 }}>{error}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const habitId = localStorage.getItem(HABIT_ID_KEY);
              if (habitId) loadPlan(habitId);
            }}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "10px",
              border: "none",
              background: "#6c63ff",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(108,99,255,0.3)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#5b52ee";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6c63ff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Retry Generation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        background:
          "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%), " +
          "radial-gradient(ellipse at bottom right, rgba(255,101,132,0.07) 0%, transparent 50%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              background: "rgba(108,99,255,0.15)",
              color: "#8b85ff",
              padding: "0.375rem 1rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Phase 4 Complete
          </span>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              margin: "0.75rem 0 0",
              background: "linear-gradient(135deg, #e8eaf6, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Your AI Personalized Plan
          </h1>
          <p style={{ color: "#8892b0", fontSize: "0.9375rem", marginTop: "0.5rem" }}>
            Here is your custom strategy to build better habits.
          </p>
        </div>

        <div className="glass glow-primary animate-fade-in-up" style={{ padding: "2rem" }}>
          {habit?.ai_plan ? (
            renderPlanContent(habit.ai_plan)
          ) : (
            <p style={{ color: "#8892b0", textAlign: "center" }}>No plan details available.</p>
          )}

          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              style={{
                width: "100%",
                padding: "0.875rem 2rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #6c63ff 0%, #9f7aea 100%)",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
                transform: "translateY(0)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Let&apos;s Get Started 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
