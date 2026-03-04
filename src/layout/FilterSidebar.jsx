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
    <div className="mb-9">
      <label
        className="fsb-label"
      >
        {label}
      </label>
      <select
        defaultValue=""
        className="fsb-input"
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
      className="fsb-root"
    >
      {/* Header */}
      <div className="fsb-section">
        <div
          className="fsb-section-hd"
        >
          Filters
        </div>
      </div>

      {/* GEO */}
      <div className="mb-12">
        <label
          className="fsb-label-lg"
        >
          GEO
        </label>
        <div
          className="fsb-select"
        >
          South Africa (ZA)
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-12">
        <label
          className="fsb-label-lg"
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
      <div className="mb-12">
        <label
          className="fsb-label-lg"
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
      <div className="fsb-btn-row">
        <button
          className="fsb-btn-clear"
        >
          Reset
        </button>
        <button
          className="fsb-btn-apply"
        >
          Apply
        </button>
      </div>

      {/* Options */}
      <div
        className="fsb-section-hd"
      >
        Options
      </div>
      {FILTER_OPTIONS.map((label) => (
        <SelectFilter key={label} label={label} />
      ))}
    </aside>
  );
}
