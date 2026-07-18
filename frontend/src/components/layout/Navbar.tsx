"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,15,26,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #9f7aea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          BreakFree
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.875rem",
              color: "#8892b0",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8eaf6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b0")}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: "0.875rem",
              color: "#8892b0",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8eaf6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b0")}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
