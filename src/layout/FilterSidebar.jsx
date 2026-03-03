import { useState } from "react";
import { BLUE, SLATE } from "../components/constants/colors";

const FILTER_OPTIONS = [
  "Choose Service",
  "Choose Network",
  "Choose OS",
  "Choose Platform",
  "Choose Google/Non-Google",
  "Custom Variables",
];

const FILTER_DATA = {
  "Choose Service": ["Service A", "Service B", "Service C"],
  "Choose Network": ["MTN", "Vodacom", "Airtel", "Glo"],
  "Choose OS": ["Android", "iOS", "Windows", "Other"],
  "Choose Platform": ["Mobile", "Desktop", "Tablet"],
  "Choose Google/Non-Google": ["Google", "Non-Google"],
  "Custom Variables": ["Variable 1", "Variable 2", "Variable 3"],
};

function SelectFilter({ label }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#475569",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <select
        defaultValue=""
        style={{
          width: "100%",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          padding: "8px 10px",
          fontSize: 12,
          color: "#334155",
          background: "#fff",
          cursor: "pointer",
          outline: "none",
          appearance: "auto",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
      >
        <option value="" disabled>
          — Select —
        </option>
        {(FILTER_DATA[label] || []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterSidebar() {
  const [fromDate, setFromDate] = useState("2024-09-01");
  const [toDate, setToDate] = useState("2024-09-26");

  const dateInputStyle = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 7,
    padding: "8px 10px",
    fontSize: 11,
    color: "#334155",
    background: "#fff",
    outline: "none",
    cursor: "pointer",
    fontFamily: "var(--font)",
  };
  return (
    <aside
      style={{
        width: 220,
        height: "100%",
        background: "#fff",
        borderRight: "1px solid #e8ecf3",
        padding: "16px 14px 20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: SLATE,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Filters
        </div>
      </div>

      {/* GEO */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#475569",
            display: "block",
            marginBottom: 5,
          }}
        >
          GEO
        </label>
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            padding: "9px 12px",
            fontSize: 12,
            color: "#334155",
          }}
        >
          South Africa (ZA)
        </div>
      </div>

      {/* Date Range */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#475569",
            display: "block",
            marginBottom: 5,
          }}
        >
          Date From
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={dateInputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#475569",
            display: "block",
            marginBottom: 5,
          }}
        >
          Date To
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={dateInputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 7,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            fontSize: 12,
            color: "#64748b",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Reset
        </button>
        <button
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 7,
            border: "none",
            background: BLUE,
            fontSize: 12,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Apply
        </button>
      </div>

      {/* Options */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: SLATE,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Options
      </div>
      {FILTER_OPTIONS.map((label) => (
        <SelectFilter key={label} label={label} />
      ))}
    </aside>
  );
}
