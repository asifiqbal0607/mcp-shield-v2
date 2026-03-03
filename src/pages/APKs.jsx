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
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <SectionTitle>{title}</SectionTitle>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: SLATE,
            fontSize: 16,
          }}
        >
          ≡
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
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
            style={{ cursor: "pointer" }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => `${v}%`}
            contentStyle={{ fontSize: 11, borderRadius: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "#94a3b8",
          marginTop: 4,
        }}
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {[
          { label: "Total APKs", value: "170", color: BLUE },
          { label: "Clean APKs", value: "142", color: GREEN },
          { label: "Flagged APKs", value: "28", color: ROSE },
        ].map((s) => (
          <Card
            key={s.label}
            onClick={() => open(`${s.label} — Transactions`)}
            style={{
              textAlign: "center",
              borderTop: `3px solid ${s.color}`,
              cursor: "pointer",
              transition: "box-shadow .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "Poppins,serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: SLATE,
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>
              View Transactions ↗
            </div>
          </Card>
        ))}
      </div>

      {/* Top APK pie charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 18,
        }}
      >
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
      <div style={{ marginBottom: 18 }}>
        <ApkPieCard
          title="Specified APKs"
          data={specifiedApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* Hidden APKs */}
      <div style={{ marginBottom: 18 }}>
        <ApkPieCard
          title="Hidden APKs"
          data={hiddenApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* Top 20 Apps table */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SectionTitle style={{ margin: 0 }}>Top 20 Apps</SectionTitle>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: SLATE,
              }}
            >
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 12,
                  color: "#334155",
                  cursor: "pointer",
                  outline: "none",
                }}
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
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "7px 12px",
                fontSize: 12,
                outline: "none",
                width: 180,
              }}
            />
          </div>
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["#", "Package Name", "Type", "Share %", "Risk", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: SLATE,
                      textTransform: "uppercase",
                      letterSpacing: ".8px",
                    }}
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
                style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                onClick={() => open(`${r.name} — Transactions`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ padding: "10px", fontWeight: 700, color: SLATE }}>
                  {r.rank}
                </td>
                <td
                  style={{
                    padding: "10px",
                    color: "#334155",
                    fontFamily: "monospace",
                    fontSize: 10,
                  }}
                >
                  {r.name}
                </td>
                <td style={{ padding: "10px" }}>
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
                <td style={{ padding: "10px", fontWeight: 700, color: BLUE }}>
                  {r.share}%
                </td>
                <td style={{ padding: "10px" }}>
                  <Badge color={RISK_COLORS[r.risk]}>{r.risk}</Badge>
                </td>
                <td style={{ padding: "10px" }}>
                  <StatusDot status={r.status} />
                  <span
                    style={{
                      color:
                        r.status === "active"
                          ? GREEN
                          : r.status === "warning"
                            ? AMBER
                            : ROSE,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      marginLeft: 4,
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
