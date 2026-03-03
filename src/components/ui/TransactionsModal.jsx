import { useState, useEffect, useRef } from "react";
import { transactionRows } from "../../data/tables";
import TransactionDetailModal from "./TransactionDetailModal";
import TransactionDashboardModal from "./TransactionDashboardModal";

// ── Reason colour palette ────────────────────────────────────────────────────
const REASON_COLORS = {
  "MCPS-2000": { bg: "#7c3aed", text: "#fff" },
  "MCPS-1300": { bg: "#2563eb", text: "#fff" },
  "AMCPS-1310": { bg: "#0891b2", text: "#fff" },
  "MCPS-1400": { bg: "#d97706", text: "#fff" },
  "MCPS-1500": { bg: "#dc2626", text: "#fff" },
  "AMCPS-2000": { bg: "#059669", text: "#fff" },
};
const reasonColor = (code) =>
  REASON_COLORS[code] || { bg: "#64748b", text: "#fff" };

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const VISIBLE_REASONS = 2; // shown inline; rest behind +N badge

// ── Compact reason cell ──────────────────────────────────────────────────────
function ReasonCell({ reasons }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const visible = reasons.slice(0, VISIBLE_REASONS);
  const overflow = reasons.slice(VISIBLE_REASONS);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  if (!reasons.length) return <span style={{ color: "#cbd5e1" }}>—</span>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "nowrap",
      }}
    >
      {visible.map((rsn) => {
        const c = reasonColor(rsn);
        return (
          <span
            key={rsn}
            style={{
              padding: "3px 8px",
              borderRadius: 5,
              fontSize: 10,
              fontWeight: 700,
              background: c.bg,
              color: c.text,
              whiteSpace: "nowrap",
              letterSpacing: ".3px",
            }}
          >
            {rsn}
          </span>
        );
      })}

      {overflow.length > 0 && (
        <div ref={ref} style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            style={{
              padding: "3px 8px",
              borderRadius: 5,
              fontSize: 10,
              fontWeight: 700,
              background: open ? "#1e40af" : "#e0e7ff",
              color: open ? "#fff" : "#1e40af",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all .15s",
            }}
          >
            +{overflow.length}
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "10px 12px",
                boxShadow: "0 8px 24px rgba(0,0,0,.14)",
                zIndex: 999,
                minWidth: 160,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                }}
              >
                All Reasons ({reasons.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {reasons.map((rsn) => {
                  const c = reasonColor(rsn);
                  return (
                    <span
                      key={rsn}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background: c.bg,
                        color: c.text,
                        display: "block",
                      }}
                    >
                      {rsn}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLS = [
  { key: "sr", label: "Sr.", w: 44, noSort: true },
  { key: "id", label: "ID", w: 170, mono: true },
  { key: "time", label: "Time", w: 115 },
  { key: "network", label: "Network", w: 155 },
  { key: "apk", label: "APK", w: 155, mono: true },
  { key: "userIp", label: "User IP", w: 125, mono: true },
  { key: "msisdn", label: "MSISDN", w: 80 },
  { key: "status", label: "Status", w: 80 },
  { key: "reasons", label: "Reason", w: 200, noSort: true },
  { key: "interaction", label: "Interaction", w: 90 },
  { key: "view", label: "View", w: 60, noSort: true },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function TransactionsModal({
  onClose,
  title = "Clicked Clean — Transactions",
  ipFilter: initialIp = "",
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [dashMode, setDashMode] = useState(null);
  const [ipFilter, setIpFilter] = useState(initialIp);
  const [search, setSearch] = useState(initialIp);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  let filtered = transactionRows.filter(
    (r) =>
      r.id.includes(search) ||
      r.network.toLowerCase().includes(search.toLowerCase()) ||
      r.apk.toLowerCase().includes(search.toLowerCase()) ||
      r.userIp.includes(search),
  );

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalEntries = 112003;

  const pageNums = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else pageNums.push(1, 2, 3, "…", totalPages - 1, totalPages);

  // Shared TD helper — fixed height, vertically centred, no row blow-out
  const TD = ({ col, children, extra = {} }) => (
    <td
      style={{
        padding: "0 12px",
        height: 46,
        verticalAlign: "middle",
        fontFamily: col.mono
          ? "'IBM Plex Mono','Courier New',monospace"
          : "inherit",
        fontSize: col.mono ? 11 : 12,
        color: "#334155",
        overflow: col.key === "reasons" ? "visible" : "hidden",
        textOverflow: "ellipsis",
        whiteSpace: col.key === "reasons" ? "normal" : "nowrap",
        ...extra,
      }}
    >
      {children}
    </td>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,.55)",
          backdropFilter: "blur(3px)",
          zIndex: 900,
        }}
      />

      {/* Modal shell */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(98vw, 1340px)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,.25)",
          zIndex: 901,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid #f1f5f9",
            background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flexShrink: 0,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#fff",
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#14532d" }}>
                {ipFilter ? `Transactions — IP: ${ipFilter}` : title}
              </div>
              <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
                Showing {filtered.length.toLocaleString()} of{" "}
                {totalEntries.toLocaleString()} entries
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Export Transactions", bg: "#1d4ed8", fn: null },
              {
                label: "Dashboard",
                bg: "#0f766e",
                fn: () => setDashMode("dashboard"),
              },
              {
                label: "Excluded Dashboard",
                bg: "#7c3aed",
                fn: () => setDashMode("excluded"),
              },
            ].map(({ label, bg, fn }) => (
              <button
                key={label}
                onClick={fn}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: bg,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
                fontSize: 20,
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* IP filter pill */}
        {ipFilter && (
          <div
            style={{
              padding: "8px 20px",
              background: "#eff6ff",
              borderBottom: "1px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
              🔍 Filtering by User IP:
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 700,
                color: "#1e40af",
                background: "#dbeafe",
                padding: "2px 10px",
                borderRadius: 20,
              }}
            >
              {ipFilter}
            </span>
            <button
              onClick={() => {
                setIpFilter("");
                setSearch("");
              }}
              style={{
                padding: "2px 10px",
                borderRadius: 20,
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#475569",
            }}
          >
            Show
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(+e.target.value);
                setPage(1);
              }}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            entries
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#475569",
            }}
          >
            Search:
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ID, network, APK, IP…"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                outline: "none",
                width: 220,
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", overflowX: "auto", flex: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              tableLayout: "fixed",
              minWidth: 900,
            }}
          >
            <colgroup>
              {COLS.map((col) => (
                <col key={col.key} style={{ width: col.w }} />
              ))}
            </colgroup>

            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#f8fafc",
                zIndex: 10,
              }}
            >
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => !col.noSort && toggleSort(col.key)}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: ".6px",
                      whiteSpace: "nowrap",
                      cursor: col.noSort ? "default" : "pointer",
                      userSelect: "none",
                    }}
                  >
                    {col.label}
                    {!col.noSort && (
                      <span
                        style={{
                          marginLeft: 3,
                          opacity: sortKey === col.key ? 1 : 0.3,
                          fontSize: 9,
                        }}
                      >
                        {sortKey === col.key
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paged.map((r, i) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <TD
                    col={COLS[0]}
                    extra={{ color: "#94a3b8", fontWeight: 700 }}
                  >
                    {(page - 1) * pageSize + i + 1}
                  </TD>
                  <TD col={COLS[1]} extra={{ color: "#475569" }}>
                    <span title={r.id}>{r.id}</span>
                  </TD>
                  <TD col={COLS[2]} extra={{ color: "#475569" }}>
                    {r.time}
                  </TD>
                  <TD col={COLS[3]}>
                    <span title={r.network}>{r.network}</span>
                  </TD>
                  <TD col={COLS[4]} extra={{ color: "#64748b" }}>
                    <span title={r.apk}>{r.apk || "—"}</span>
                  </TD>
                  <TD col={COLS[5]}>{r.userIp}</TD>
                  <TD col={COLS[6]} extra={{ color: "#94a3b8" }}>
                    {r.msisdn || "—"}
                  </TD>
                  <TD col={COLS[7]}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          r.status === "Block" ? "#fef2f2" : "#f0fdf4",
                        color: r.status === "Block" ? "#dc2626" : "#16a34a",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.status}
                    </span>
                  </TD>
                  {/* Reason — always 1 line height, overflow in popover */}
                  <TD
                    col={COLS[8]}
                    extra={{ overflow: "visible", position: "relative" }}
                  >
                    <ReasonCell reasons={r.reasons || []} />
                  </TD>
                  <TD col={COLS[9]}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "#fef2f2",
                        color: "#dc2626",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.interaction}
                    </span>
                  </TD>
                  <TD col={COLS[10]}>
                    <button
                      onClick={() => setSelectedRow(r)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: "#22c55e",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      View
                    </button>
                  </TD>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{
                      padding: 48,
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            borderTop: "1px solid #f1f5f9",
            background: "#fafafa",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Showing{" "}
            {Math.min(
              (page - 1) * pageSize + 1,
              filtered.length,
            ).toLocaleString()}{" "}
            to {Math.min(page * pageSize, filtered.length).toLocaleString()} of{" "}
            {totalEntries.toLocaleString()} entries
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: page === 1 ? "#f8fafc" : "#fff",
                cursor: page === 1 ? "default" : "pointer",
                fontSize: 12,
                color: page === 1 ? "#cbd5e1" : "#334155",
                fontWeight: 600,
              }}
            >
              Previous
            </button>

            {pageNums.map((n, idx) => (
              <button
                key={idx}
                onClick={() => typeof n === "number" && setPage(n)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  border: page === n ? "none" : "1px solid #e2e8f0",
                  background: page === n ? "#1d4ed8" : "#fff",
                  color: page === n ? "#fff" : "#475569",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: typeof n === "number" ? "pointer" : "default",
                }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
                fontSize: 12,
                color: "#334155",
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedRow && (
        <TransactionDetailModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onUserIp={(ip) => {
            setSelectedRow(null);
            setIpFilter(ip);
            setSearch(ip);
            setPage(1);
          }}
        />
      )}
      {dashMode && (
        <TransactionDashboardModal
          title={ipFilter ? `IP: ${ipFilter}` : title}
          mode={dashMode}
          onClose={() => setDashMode(null)}
        />
      )}
    </>
  );
}
