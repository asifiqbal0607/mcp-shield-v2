import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import {
  Card,
  SectionTitle,
  Badge,
  ChartTooltip,
  TransactionsModal,
} from "../components/ui";
import { BlockRadarChart } from "../components/charts";
import { ROSE, AMBER, GREEN, SLATE, BLUE } from "../constants/colors";
import { blkRows } from "../data/tables";

const SEVERITY_COLORS = {
  Critical: ROSE,
  High: AMBER,
  Medium: GREEN,
  // Low: GREEN,
};

const SUMMARY_STATS = [
  { label: "Total Blocked", value: "15,39,810", color: ROSE },
  { label: "Critical Events", value: "2,53,660", color: ROSE },
  { label: "Clean", value: "6,15,350", color: GREEN },
  // { label: "Auto-Resolved", value: "8,24,110", color: GREEN },
];

export default function PageBlocking() {
  const [modal, setModal] = useState(null);
  const open = (title) => setModal(title);
  const close = () => setModal(null);

  return (
    <div>
      {/* Summary stats */}
      <div className="g-stats3 mb-section">
        {SUMMARY_STATS.map((s) => (
          <Card
            key={s.label}
            onClick={() => open(`${s.label} — Transactions`)}
            className="stat-card-click" style={{ '--c': s.color }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
          >
            <div className="kpi-stat-sm dyn-color" style={{ '--c': s.color }}>
              {s.value}
            </div>
            <div
              className="stat-lbl"
            >
              {s.label}
            </div>
            <div className="stat-hint">
              View Transactions ↗
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="g-split mb-section">
        <Card>
          <BlockRadarChart
            height={200}
            showBadge={true}
            onDayClick={(day) => open(`${day} Block Pattern — Transactions`)}
          />
        </Card>

        <Card>
          <SectionTitle>Volume by Reason</SectionTitle>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={blkRows}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: "#cbd5e1" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="reason"
                tick={{ fontSize: 9, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={130}
                tickFormatter={(v) =>
                  v.length > 16 ? v.slice(0, 16) + "…" : v
                }
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="pct"
                name="Share %"
                radius={[0, 4, 4, 0]}
                onClick={(data) => open(`${data.reason} — Transactions`)}
                className="p-rel clickable"
              >
                {blkRows.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Full Breakdown Block Reason */}
      <Card>
        <SectionTitle>Full Breakdown Block Reasons</SectionTitle>
        <div className="table-wrap"><table
          className="dt"
        >
          <thead>
            <tr className="dt-head-row">
              {[
                "Block Reason",
                "Count",
                "Share",
                "7d Trend",
                "Severity",
                "Progress",
              ].map((h) => (
                <th
                  key={h}
                  className="dt-th"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blkRows.map((r, i) => (
              <tr
                key={i}
                className="dt-tr"
                onClick={() => open(`${r.reason} — Transactions`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td className="p-sm">
                  <div
                    className="f-gap-9"
                  >
                    <div
                      className="bl-color-square" style={{ '--c': r.color }}
                    />
                    <span className="txt-strong">
                      {r.reason}
                    </span>
                  </div>
                </td>
                <td
                  className="bl-td-mono"
                >
                  {r.count}
                </td>
                <td
                  className="bl-td-color" style={{ '--c': r.color }}
                >
                  {r.pct}%
                </td>
                <td
                  className={`bl-td-trend ${r.trend.startsWith("+") ? "txt-danger" : "txt-success"}`}
                >
                  {r.trend}
                </td>
                <td className="p-sm">
                  <Badge color={SEVERITY_COLORS[r.sev]}>{r.sev}</Badge>
                </td>
                <td className="bl-td-wide">
                  <div
                    className="progress-track"
                  >
                    <div
                      className="progress-bar" style={{ '--w': `${r.pct * 3.5}%`, '--c': r.color }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      {/* Transactions modal */}
      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
