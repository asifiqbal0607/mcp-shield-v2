import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, SectionTitle, TransactionsModal } from "../components/ui";
import { SLATE, PALETTE } from "../constants/colors";
import {
  topDevicesData,
  topOsData,
  topBrowsersData,
  topNetworksData,
} from "../data/tables";

const RADIAN = Math.PI / 180;

function renderLabel({ cx, cy, midAngle, outerRadius, name, percent }) {
  if (percent < 0.03) return null;
  const radius = outerRadius + 30;
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
      {name.length > 24 ? name.slice(0, 24) + "…" : name} (
      {(percent * 100).toFixed(1)}%)
    </text>
  );
}

function StatPieCard({ title, data, onSliceClick }) {
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
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderLabel}
            labelLine={true}
            onClick={(entry) => onSliceClick && onSliceClick(entry.name)}
            className="p-rel clickable"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
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

export default function PageDevice() {
  const [modal, setModal] = useState(null);
  const open = (title) => setModal(title);
  const close = () => setModal(null);

  const stats = [
    {
      label: "Unique Devices",
      value: "48,291",
      color: "#1d4ed8",
      clickable: true,
    },
    // {
    //   label: "Mobile Share",
    //   value: "91.4%",
    //   color: "#22c55e",
    //   clickable: false,
    // },
    { label: "Top OS", value: "Android", color: "#f59e0b", clickable: true },
    {
      label: "Top Browser",
      value: "Chrome",
      color: "#8b5cf6",
      clickable: true,
    },
  ];

  return (
    <div>
      {/* ── Summary ── */}
      <div className="g-stats3 mb-section">
        {stats.map((s) => (
          <Card
            key={s.label}
            onClick={
              s.clickable ? () => open(`${s.label} — Transactions`) : undefined
            }
            className={s.clickable ? "stat-card-click" : "stat-card-click-opt"} style={{ '--c': s.color }}
            onMouseEnter={
              s.clickable
                ? (e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,.1)")
                : undefined
            }
            onMouseLeave={
              s.clickable
                ? (e) => (e.currentTarget.style.boxShadow = "")
                : undefined
            }
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
            {s.clickable && (
              <div className="stat-hint">
                View Transactions ↗
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ── Top 10 Devices + Top 10 OS ── */}
      <div className="g-halves mb-section">
        <StatPieCard
          title="Top 10 Devices"
          data={topDevicesData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
        <StatPieCard
          title="Top 10 Operating Systems"
          data={topOsData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>

      {/* ── Top 10 Browsers + Top 10 Networks ── */}
      <div className="g-halves">
        <StatPieCard
          title="Top 10 Browsers"
          data={topBrowsersData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
        <StatPieCard
          title="Top 10 Networks"
          data={topNetworksData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
        />
      </div>
      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
