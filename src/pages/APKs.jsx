import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  SectionTitle,
  Badge,
  StatusDot,
  TransactionsModal,
} from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE, SLATE, PALETTE } from "../constants/colors";
import {
  trustedApkData,
  cleanApkData,
  specifiedApkData,
  hiddenApkData,
} from "../data/tables";

const RISK_COLORS = { Low: GREEN, Medium: AMBER, High: ROSE };

const RADIAN = Math.PI / 180;
function renderLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}) {
  if (percent < 0.04) return null;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={9}
      fontWeight={600}
    >
      {name.length > 22 ? name.slice(0, 22) + "…" : name} (
      {(percent * 100).toFixed(1)}%)
    </text>
  );
}

function ApkPieCard({ title, data, onSliceClick }) {
  return (
    <Card>
      <div
        className="ov-chart-header"
      >
        <SectionTitle>{title}</SectionTitle>
        <button
          className="geo-collapse-btn"
        >
          ≡
        </button>
      </div>
      <ResponsiveContainer width="100%" height={185}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            labelLine={true}
            label={renderLabel}
            onClick={(entry) => onSliceClick && onSliceClick(entry.name)}
            className="p-rel clickable"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => `${v}%`}
            contentStyle={CHART_TOOLTIP}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="stat-hint-center"
      >
        Click a slice to view transactions ↗
      </div>
    </Card>
  );
}

// Build top 20 from all pie chart data sorted by value desc
const TYPE_META = {
  "Blocked Apps": { risk: "Low", status: "active" },
  Clean: { risk: "Low", status: "active" },
  Specified: { risk: "Medium", status: "warning" },
  Hidden: { risk: "High", status: "blocked" },
};

function buildTop20() {
  const all = [
    ...trustedApkData.map((d) => ({ ...d, type: "Blocked Apps" })),
    ...cleanApkData.map((d) => ({ ...d, type: "Clean" })),
    ...specifiedApkData.map((d) => ({ ...d, type: "Specified" })),
    ...hiddenApkData.map((d) => ({ ...d, type: "Hidden" })),
  ];
  return all
    .sort((a, b) => b.value - a.value)
    .slice(0, 20)
    .map((d, i) => ({
      rank: i + 1,
      name: d.name,
      type: d.type,
      share: d.value,
      risk: TYPE_META[d.type].risk,
      status: TYPE_META[d.type].status,
    }));
}

const CHART_TOOLTIP = { fontSize: 11, borderRadius: 8 };
export default function PageAPKs() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const open = (title) => setModal(title);
  const close = () => setModal(null);

  const top20 = buildTop20();
  const [perPage, setPerPage] = useState(10);
  const filtered = top20.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase()),
  );
  const rows = filtered.slice(0, perPage);

  return (
    <div>
      {/* Summary stats */}
      <div className="g-stats3 mb-section">
        {[
          { label: "Total APKs", value: "170", color: BLUE },
          { label: "Clean APKs", value: "142", color: GREEN },
          { label: "Flagged APKs", value: "28", color: ROSE },
        ].map((s) => (
          <Card
            key={s.label}
            onClick={() => open(`${s.label} — Transactions`)}
            className="stat-card-click" style={{ '--c': s.color }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
          >
            <div className="kpi-stat"
              className="dyn-color" style={{ '--c': s.color }}
            >
              {s.value}
            </div>
            <div
              className="stat-lbl-12"
            >
              {s.label}
            </div>
            <div className="stat-hint">
              View Transactions ↗
            </div>
          </Card>
        ))}
      </div>

      {/* Top APK pie charts */}
      <div className="g-halves mb-section">
        <ApkPieCard
          title="Block APKs"
          data={trustedApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
        <ApkPieCard
          title="Clean APKs"
          data={cleanApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* Specified APKs */}
      <div className="mb-18">
        <ApkPieCard
          title="Specified APKs"
          data={specifiedApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* Hidden APKs */}
      <div className="mb-18">
        <ApkPieCard
          title="Hidden APKs"
          data={hiddenApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* Top 20 Apps table */}
      <Card>
        <div
          className="toolbar"
        >
          <div className="f-gap-8">
            <SectionTitle className="m-0">Top 20 Apps</SectionTitle>
          </div>
          <div className="f-gap-12">
            <div
              className="apk-filter-row"
            >
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="apk-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
            <input
              placeholder="Search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setApkPage(0);
              }}
              className="apk-search"
            />
          </div>
        </div>
        <div className="table-wrap"><table
          className="dt"
        >
          <thead>
            <tr className="dt-head-row">
              {["#", "Package Name", "Type", "Share %", "Risk", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="dt-th"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="dt-tr"
                onClick={() => open(`${r.name} — Transactions`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td className="td-p-10s">
                  {r.rank}
                </td>
                <td
                  className="apk-td-mono"
                >
                  {r.name}
                </td>
                <td className="apk-td-p10">
                  <Badge
                    color={
                      r.type === "Blocked Apps"
                        ? GREEN
                        : r.type === "Clean"
                          ? BLUE
                          : r.type === "Specified"
                            ? AMBER
                            : ROSE
                    }
                  >
                    {r.type}
                  </Badge>
                </td>
                <td className="td-p-blue">
                  {r.share}%
                </td>
                <td className="apk-td-p10">
                  <Badge color={RISK_COLORS[r.risk]}>{r.risk}</Badge>
                </td>
                <td className="apk-td-p10">
                  <StatusDot status={r.status} />
                  <span
                    className="apk-status" style={{ '--c': r.status === "active" ? GREEN : r.status === "warning" ? AMBER : ROSE }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>

      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
