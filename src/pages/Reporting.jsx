import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, SectionTitle, Badge } from "../components/ui";
import { BLUE, GREEN, AMBER, VIOLET, CYAN, SLATE } from "../constants/colors";
import { repTrend } from "../data/charts";
import { repReports } from "../data/tables";

const SUMMARY_STATS = [
  { label: "Total Reports", value: "6", color: BLUE },
  { label: "Scheduled", value: "4", color: VIOLET },
  { label: "On-demand", value: "2", color: CYAN },
  { label: "Avg Delivery", value: "4.2s", color: GREEN },
];

// ── Recharts / chart config constants ──────────────────────────────────────
const PIE_CX = 70,
  PIE_CY = 70,
  PIE_IR = 42,
  PIE_OR = 68,
  PIE_PA = 4;

export default function PageReporting() {
  const [query, setQuery] = useState("");
  const [perPageRep, setPerPageRep] = useState(10);
  const filteredRep = repReports.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleRep = filteredRep.slice(0, perPageRep);

  return (
    <div className="reporting-page-wrap">
      {/* Summary stats */}
      <div className="grid-2 mb-24">
        {SUMMARY_STATS.map(({ label, value, color }) => (
          <Card key={label} className="stat-top-4" style={{ "--c": color }}>
            <div
              className="kpi-stat"
              className="dyn-color"
              style={{ "--c": color }}
            >
              {value}
            </div>
            <div className="stat-sublabel">{label}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2 mb-24">
        <Card>
          <SectionTitle>30-Day Reporting Trends</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repTrend}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
              <Line dataKey="clicks" stroke="#22c55e" strokeWidth={2} />
              <Line dataKey="blocked" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Report Type Split</SectionTitle>
          <div className="rep-summary-col">
            <PieChart width={150} height={150}>
              <Pie
                data={[{ v: 4 }, { v: 2 }]}
                dataKey="v"
                cx={70}
                cy={70}
                innerRadius={42}
                outerRadius={68}
                paddingAngle={4}
              >
                <Cell fill={VIOLET} />
                <Cell fill={CYAN} />
              </Pie>
            </PieChart>
            <div className="rep-list-col">
              {[
                [VIOLET, "Scheduled", "4 reports"],
                [CYAN, "On-demand", "2 reports"],
              ].map(([c, l, v]) => (
                <div key={l} className="rep-legend-row">
                  <div className="rep-color-sq" style={{ "--c": c }} />
                  <div className="rep-legend-lbl">{l}</div>
                  <span className="stat-sublabel">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Reports table */}
      <Card>
        <div className="toolbar">
          <SectionTitle>All Reports</SectionTitle>
          <div className="f-gap-10">
            <div className="dt-entries-bar">
              <span className="dt-entries-lbl">Show</span>
              <select
                className="dt-entries-sel"
                value={perPageRep}
                onChange={(e) => setPerPageRep(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="dt-entries-lbl">entries</span>
            </div>
            <div className="p-rel">
              <span className="partner-search-icon">🔍</span>
              <input
                placeholder="Search reports…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="partner-search"
              />
            </div>
            <button className="tab-pill">+ New Report</button>
          </div>
        </div>
        <div className="page-table-scroll">
          <table className="dt dt-lg">
            <thead>
              <tr className="dt-head-row">
                {[
                  "Report Name",
                  "Type",
                  "Frequency",
                  "Last Run",
                  "Rows",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="dt-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRep.map((r, i) => (
                <tr key={i} className="dt-tr-plain">
                  <td className="td-p-10">{r.name}</td>
                  <td className="p-10">
                    <Badge color={r.type === "Scheduled" ? VIOLET : CYAN}>
                      {r.type}
                    </Badge>
                  </td>
                  <td className="p-10">{r.freq}</td>
                  <td className="p-10">{r.lastRun}</td>
                  <td className="td-p-10m">{r.rows}</td>
                  <td className="p-10">
                    <Badge color={r.status === "active" ? GREEN : AMBER}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="td-actions-wide">
                    <div className="f-gap-6">
                      <button className="btn-icon" title="View">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="btn-icon" title="Download">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
