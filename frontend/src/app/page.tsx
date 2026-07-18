"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

const HABIT_ID_KEY = "bba_habit_id";

export default function HomePage() {
  const router = useRouter();
  const { userId, loading, error } = useUser();

  // If the user already has a habit saved → skip onboarding
  useEffect(() => {
    if (!loading && userId) {
      const habitId = localStorage.getItem(HABIT_ID_KEY);
      if (habitId) {
        router.replace("/dashboard");
      }
    }
  }, [loading, userId, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background:
            "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%)",
        }}
      >
        {/* Animated spinner */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid rgba(108,99,255,0.2)",
            borderTopColor: "#6c63ff",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#8892b0", fontSize: "0.9375rem" }}>Getting things ready…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          gap: "1rem",
        }}
      >
        <div
          style={{
            padding: "1.5rem 2rem",
            borderRadius: "12px",
            background: "rgba(255,101,132,0.08)",
            border: "1px solid rgba(255,101,132,0.25)",
            maxWidth: "480px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#ff8fab", fontWeight: 600, marginBottom: "0.5rem" }}>
            ⚠️ Connection error
          </p>
          <p style={{ color: "#8892b0", fontSize: "0.875rem", margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!userId) return null; // still resolving

  return <OnboardingWizard userId={userId} />;
}
