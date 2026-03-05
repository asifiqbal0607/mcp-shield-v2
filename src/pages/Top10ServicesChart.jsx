import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { Card, SectionTitle } from "../components/ui";
import { PALETTE } from "../constants/colors";

// ── Service registry ──────────────────────────────────────────────────────────
const ALL_SERVICES = [
  { id: 1, name: "GC 2231 Playit", baseTraffic: 1421866 },
  { id: 2, name: "True Digital Horo Sap4", baseTraffic: 326726 },
  { id: 3, name: "Teleinfotech Duang Den", baseTraffic: 120482 },
  { id: 4, name: "GVI Services Sub-Acc", baseTraffic: 46666 },
  { id: 5, name: "True Digital XR Academy", baseTraffic: 41037 },
  { id: 6, name: "Health Care 2", baseTraffic: 39854 },
  { id: 7, name: "Horo Lucky Dee9", baseTraffic: 33546 },
  { id: 8, name: "iPay Service", baseTraffic: 30668 },
  { id: 9, name: "Wan Duang Dee 3", baseTraffic: 28926 },
  { id: 10, name: "Hora Duange4", baseTraffic: 24355 },
  { id: 11, name: "Horo Sap2", baseTraffic: 23254 },
  { id: 12, name: "Shield Core API", baseTraffic: 21514 },
  { id: 13, name: "Click Guard Pro", baseTraffic: 19903 },
  { id: 14, name: "True Digital Wan Dee", baseTraffic: 16487 },
  { id: 15, name: "APK Scanner v2", baseTraffic: 15187 },
  { id: 16, name: "Fraud Net Detector", baseTraffic: 15171 },
  { id: 17, name: "GVI Export Service", baseTraffic: 8234 },
  { id: 18, name: "Notification Hub", baseTraffic: 7705 },
  { id: 19, name: "Map Service Gateway", baseTraffic: 5351 },
  { id: 20, name: "IP Shield Layer", baseTraffic: 5089 },
];

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Returns daily stats for a specific day offset (0 = today, 1 = yesterday)
function getDayStats(svc, dayOffset) {
  const dailyBase = svc.baseTraffic / 30;
  const variance = 0.6 + seededRand(svc.id * 31 + dayOffset) * 0.8;
  const total = Math.round(dailyBase * variance);
  // block rate seeded separately so it's stable
  const blockRate = 0.08 + seededRand(svc.id * 17 + dayOffset + 99) * 0.55;
  const blocked = Math.round(total * blockRate);
  const clean = total - blocked;
  return { total, blocked, clean, blockRate };
}

function buildServiceData(days) {
  return ALL_SERVICES.map((svc, idx) => {
    // Aggregate current period
    let total = 0,
      blocked = 0;
    for (let d = 0; d < days; d++) {
      const s = getDayStats(svc, d);
      total += s.total;
      blocked += s.blocked;
    }
    const clean = total - blocked;
    const blockRate = total > 0 ? blocked / total : 0;

    // Previous period (same length, offset by days)
    let prevTotal = 0,
      prevBlocked = 0;
    for (let d = 0; d < days; d++) {
      const s = getDayStats(svc, d + days);
      prevTotal += s.total;
      prevBlocked += s.blocked;
    }
    const prevClean = prevTotal - prevBlocked;
    const prevBlockRate = prevTotal > 0 ? prevBlocked / prevTotal : 0;

    // % change vs previous period
    const trafficDelta =
      prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
    const blockDelta =
      prevBlocked > 0 ? ((blocked - prevBlocked) / prevBlocked) * 100 : 0;

    return {
      id: svc.id,
      name: svc.name,
      colorIdx: idx,
      // current
      traffic: total,
      blocked,
      clean,
      blockRate,
      // previous
      prevTotal,
      prevBlocked,
      prevClean,
      prevBlockRate,
      // deltas
      trafficDelta,
      blockDelta,
    };
  }).sort((a, b) => b.traffic - a.traffic);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function DeltaBadge({ value }) {
  if (value === 0) return <span className="svc-tt-delta neutral">→ 0%</span>;
  const up = value > 0;
  return (
    <span className={`svc-tt-delta ${up ? "up" : "down"}`}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

// ── Rich comparison tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, days }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (d._hidden || !d.traffic) return null;

  const color = PALETTE[d.colorIdx % PALETTE.length];
  const periodLabel = days === 1 ? "Yesterday" : `Prev ${days} days`;

  return (
    <div className="svc-tt">
      {/* ── Service name strip ── */}
      <div className="svc-tt-header" style={{ borderLeftColor: color }}>
        <span className="svc-tt-name">{d.name}</span>
        <DeltaBadge value={d.trafficDelta} />
      </div>

      {/* ── TODAY section ── */}
      <div className="svc-tt-period-label">
        {days === 1 ? "Today" : `Last ${days} days`}
      </div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">Total Traffic</span>
        <span className="svc-tt-val svc-tt-val-total">{fmt(d.traffic)}</span>
      </div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">
          <span className="svc-tt-dot svc-tt-dot-block" /> Blocked
        </span>
        <span className="svc-tt-val svc-tt-val-block">
          {fmt(d.blocked)}
          <span className="svc-tt-pct">
            ({(d.blockRate * 100).toFixed(1)}%)
          </span>
        </span>
      </div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">
          <span className="svc-tt-dot svc-tt-dot-clean" /> Clean
        </span>
        <span className="svc-tt-val svc-tt-val-clean">
          {fmt(d.clean)}
          <span className="svc-tt-pct">
            ({((1 - d.blockRate) * 100).toFixed(1)}%)
          </span>
        </span>
      </div>

      {/* ── Mini bar: block vs clean ── */}
      <div className="svc-tt-bar-wrap">
        <div
          className="svc-tt-bar-fill svc-tt-bar-block"
          style={{ width: `${(d.blockRate * 100).toFixed(1)}%` }}
        />
        <div
          className="svc-tt-bar-fill svc-tt-bar-clean"
          style={{ width: `${((1 - d.blockRate) * 100).toFixed(1)}%` }}
        />
      </div>

      {/* ── Divider ── */}
      <div className="svc-tt-divider" />

      {/* ── PREVIOUS section ── */}
      <div className="svc-tt-period-label prev">{periodLabel}</div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">Total Traffic</span>
        <span className="svc-tt-val">{fmt(d.prevTotal)}</span>
      </div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">
          <span className="svc-tt-dot svc-tt-dot-block" /> Blocked
        </span>
        <span className="svc-tt-val">
          {fmt(d.prevBlocked)}
          <span className="svc-tt-pct">
            ({(d.prevBlockRate * 100).toFixed(1)}%)
          </span>
          <DeltaBadge value={d.blockDelta} />
        </span>
      </div>
      <div className="svc-tt-row">
        <span className="svc-tt-key">
          <span className="svc-tt-dot svc-tt-dot-clean" /> Clean
        </span>
        <span className="svc-tt-val">
          {fmt(d.prevClean)}
          <span className="svc-tt-pct">
            ({((1 - d.prevBlockRate) * 100).toFixed(1)}%)
          </span>
        </span>
      </div>

      {/* ── Mini bar: previous ── */}
      <div className="svc-tt-bar-wrap">
        <div
          className="svc-tt-bar-fill svc-tt-bar-block"
          style={{
            width: `${(d.prevBlockRate * 100).toFixed(1)}%`,
            opacity: 0.5,
          }}
        />
        <div
          className="svc-tt-bar-fill svc-tt-bar-clean"
          style={{
            width: `${((1 - d.prevBlockRate) * 100).toFixed(1)}%`,
            opacity: 0.5,
          }}
        />
      </div>

      <div className="svc-tt-footer">Click to filter all charts below</div>
    </div>
  );
}

// ── Bar top label ─────────────────────────────────────────────────────────────
function BarValueLabel({ x, y, width, value }) {
  if (!value) return null;
  const label =
    value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000
        ? `${(value / 1000).toFixed(0)}k`
        : String(value);
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={9}
      fontWeight={700}
      fill="#64748b"
    >
      {label}
    </text>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Top10ServicesChart({ days = 1, onServiceFilter }) {
  const [selected, setSelected] = useState(null);

  const allData = useMemo(() => buildServiceData(days), [days]);

  const chartData = useMemo(
    () =>
      allData.map((d) => ({
        ...d,
        traffic: selected === null || selected === d.id ? d.traffic : 0,
        _hidden: selected !== null && selected !== d.id,
      })),
    [allData, selected],
  );

  useEffect(() => {
    if (onServiceFilter) {
      const svc = selected ? ALL_SERVICES.find((s) => s.id === selected) : null;
      onServiceFilter(svc ? svc.name : null);
    }
  }, [selected, onServiceFilter]);

  function handleBarClick(entry) {
    if (!entry?.activePayload?.[0]) return;
    const clicked = entry.activePayload[0].payload;
    setSelected((prev) => (prev === clicked.id ? null : clicked.id));
  }

  const selectedName = selected
    ? ALL_SERVICES.find((s) => s.id === selected)?.name
    : null;

  const chartMinWidth = Math.max(allData.length * 54 + 80, 600);

  return (
    <Card className="svc-chart-card mb-section">
      {/* ── Header ── */}
      <div className="svc-chart-header">
        <div className="svc-chart-header-left">
          <SectionTitle>Top 20 Services by Traffic</SectionTitle>
          <span className="svc-chart-period-badge">
            {days === 1 ? "Today" : `Last ${days} days`}
          </span>
          {selectedName && (
            <div className="svc-chart-active-filter">
              <span className="svc-chart-filter-label">Filtering:</span>
              <span className="svc-chart-filter-name">{selectedName}</span>
              <button
                className="svc-chart-filter-clear"
                onClick={() => setSelected(null)}
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>
        <div className="svc-chart-header-right">
          <span className="svc-chart-hint">
            {selected
              ? "Click same bar to clear"
              : "Click any bar to filter charts below ↓"}
          </span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="svc-chart-scroll-wrap">
        <div style={{ minWidth: chartMinWidth }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 20, bottom: 76, left: 10 }}
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                angle={-42}
                textAnchor="end"
                interval={0}
                height={82}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#cbd5e1" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : v >= 1000
                      ? `${(v / 1000).toFixed(0)}k`
                      : v
                }
              />
              <Tooltip
                content={<CustomTooltip days={days} />}
                cursor={{ fill: "rgba(99,102,241,.05)" }}
              />
              <Bar dataKey="traffic" radius={[5, 5, 0, 0]} maxBarSize={42}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={PALETTE[entry.colorIdx % PALETTE.length]}
                    opacity={selected === null || selected === entry.id ? 1 : 0}
                  />
                ))}
                <LabelList dataKey="traffic" content={<BarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="svc-chart-legend-scroll">
        <div className="svc-chart-legend">
          {allData.map((entry) => (
            <button
              key={entry.id}
              title={entry.name}
              className={[
                "svc-chart-legend-item",
                selected === entry.id ? "active" : "",
                selected !== null && selected !== entry.id ? "dimmed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                setSelected((p) => (p === entry.id ? null : entry.id))
              }
            >
              <span
                className="svc-chart-legend-dot"
                style={{ background: PALETTE[entry.colorIdx % PALETTE.length] }}
              />
              <span className="svc-chart-legend-name">{entry.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
