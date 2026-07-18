"use client";

import React from "react";

export interface HabitOption {
  id: string;
  label: string;
  emoji: string;
  defaultUnit: string;
}

export const HABIT_OPTIONS: HabitOption[] = [
  { id: "screen_time",   label: "Screen Time",   emoji: "📱", defaultUnit: "hours/day" },
  { id: "social_media",  label: "Social Media",  emoji: "💬", defaultUnit: "hours/day" },
  { id: "gaming",        label: "Gaming",         emoji: "🎮", defaultUnit: "hours/day" },
  { id: "smoking",       label: "Smoking",        emoji: "🚬", defaultUnit: "cigarettes/day" },
  { id: "junk_food",     label: "Junk Food",      emoji: "🍔", defaultUnit: "times/day" },
  { id: "alcohol",       label: "Alcohol",        emoji: "🍺", defaultUnit: "drinks/day" },
  { id: "other",         label: "Other",          emoji: "✏️", defaultUnit: "times/day" },
];

interface HabitCardProps {
  option: HabitOption;
  selected: boolean;
  onClick: () => void;
}

export function HabitCard({ option, selected, onClick }: HabitCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1.25rem 1rem",
        borderRadius: "12px",
        border: selected
          ? "2px solid #6c63ff"
          : "2px solid rgba(255,255,255,0.07)",
        background: selected
          ? "linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(159,122,234,0.1) 100%)"
          : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        boxShadow: selected ? "0 0 24px rgba(108,99,255,0.3)" : "none",
        transform: selected ? "scale(1.04)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        width: "100%",
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }
      }}
    >
      <span style={{ fontSize: "2rem", lineHeight: 1 }}>{option.emoji}</span>
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: selected ? "#8b85ff" : "#8892b0",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {option.label}
      </span>
    </button>
  );
}
