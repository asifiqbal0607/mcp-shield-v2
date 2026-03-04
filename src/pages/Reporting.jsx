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

export default function PageReporting() {
  return (
    <div>
      {/* Summary stats */}
      <div className="grid-2 mb-24">
        {SUMMARY_STATS.map(({ label, value, color }) => (
          <Card
            key={label}
            className="stat-top-4" style={{ '--c': color }}
          >
            <div
              className="kpi-stat"
              className="dyn-color" style={{ '--c': color }}
            >
              {value}
            </div>
            <div className="stat-sublabel">
              {label}
            </div>
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
          <div
            className="rep-summary-col"
          >
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
            <div
              className="rep-list-col"
            >
              {[
                [VIOLET, "Scheduled", "4 reports"],
                [CYAN, "On-demand", "2 reports"],
              ].map(([c, l, v]) => (
                <div
                  key={l}
                  className="rep-legend-row"
                >
                  <div
                    className="rep-color-sq" style={{ '--c': c }}
                  />
                  <div
                    className="rep-legend-lbl"
                  >
                    {l}
                  </div>
                  <span className="stat-sublabel">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Reports table */}
      <Card>
        <div
          className="toolbar"
        >
          <SectionTitle>All Reports</SectionTitle>
          <button
            className="btn-primary"
            className="tab-pill"
          >
            + New Report
          </button>
        </div>
        <div className="table-wrap"><table
          className="dt dt-lg"
        >
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
            {repReports.map((r, i) => (
              <tr key={i} className="dt-tr-plain">
                <td className="td-p-10">{r.name}</td>
                <td className="p-10">
                  <Badge color={r.type === "Scheduled" ? VIOLET : CYAN}>
                    {r.type}
                  </Badge>
                </td>
                <td className="p-10">{r.freq}</td>
                <td className="p-10">{r.lastRun}</td>
                <td className="td-p-10m">
                  {r.rows}
                </td>
                <td className="p-10">
                  <Badge color={r.status === "active" ? GREEN : AMBER}>
                    {r.status}
                  </Badge>
                </td>
                <td className="p-10">
                  <div className="f-gap-6">
                    <button className="btn-primary">Run Now</button>
                    <button className="btn-secondary">Download Now</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}
