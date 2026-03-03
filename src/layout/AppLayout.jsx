import { useState } from "react";
import TopNav from "./TopNav";
import FilterSidebar from "./FilterSidebar";
import { ALL_PAGES } from "../components/constants/nav";
import { SLATE } from "../components/constants/colors";

export default function AppLayout({ role, page, setPage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const curPage = ALL_PAGES.find((p) => p.key === page);
  const curLabel = curPage?.label ?? "Dashboard";
  const isAdminOnly =
    curPage?.roles?.includes("admin") && !curPage?.roles?.includes("partner");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f0f4f8",
        fontFamily: "var(--font)",
        color: "#1a1a2e",
        overflow: "hidden",
      }}
    >
      {/* TopNav — always visible */}
      <TopNav role={role} page={page} setPage={setPage} />

      {/* Body */}
      <div
        style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}
      >
        {/* ── Backdrop — click to close ── */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(15,23,42,0.35)",
              backdropFilter: "blur(2px)",
              top: 54, // below topnav
            }}
          />
        )}

        {/* ── Slide-in drawer ── */}
        <div
          style={{
            position: "fixed",
            top: 54,
            left: 0,
            height: "calc(100vh - 54px)",
            width: 220,
            zIndex: 400,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-260px)",
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
            overflow: "hidden",
          }}
        >
          <FilterSidebar />
        </div>

        {/* ── Close button — fully outside drawer, only rendered when open ── */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 54 + 12,
              left: 220,
              zIndex: 401,
              width: 28,
              height: 28,
              borderRadius: "0 8px 8px 0",
              border: "1px solid #e2e8f0",
              borderLeft: "none",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#64748b",
              boxShadow: "3px 0 8px rgba(0,0,0,0.08)",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            ×
          </button>
        )}

        {/* ── Main content ── */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            padding: "18px 22px 50px",
          }}
        >
          {/* Breadcrumb + filter button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: SLATE }}>Shield</span>
              <span style={{ fontSize: 12, color: "#d1d5db" }}>›</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>
                {curLabel}
              </span>
              {isAdminOnly && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: "#fef3c7",
                    color: "#92400e",
                    border: "1px solid #fde68a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Admin only
                </span>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                cursor: "pointer",
                border: sidebarOpen ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                background: sidebarOpen ? "#eff6ff" : "#fff",
                color: sidebarOpen ? "#1d4ed8" : "#64748b",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font)",
                transition: "all 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="4" y1="8" x2="12" y2="8" />
                <line x1="6" y1="12" x2="10" y2="12" />
              </svg>
              Filters
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
