import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  SectionTitle,
  ChartTooltip,
  TransactionsModal,
} from "../components/ui";
import { TaperedGauge, TinyDonut, BlockRadarChart } from "../components/charts";
import { BLUE, GREEN, AMBER, SLATE } from "../constants/colors";
import { histogramData } from "../data/charts";
import { channelCards } from "../data/tables";

const SERIES = [
  { key: "visits", color: GREEN },
  { key: "clicks", color: AMBER },
  { key: "subs", color: BLUE },
];

// ── Recharts shared config constants (no inline objects in JSX) ────────────
const CHART_TICK = { fontSize: 9, fill: "#cbd5e1" };
const CHART_MARGIN = { top: 5, right: 5, bottom: 0, left: -30 };

// Reusable click-to-open helper styles
export default function PageOverview() {
  const [active, setActive] = useState({
    visits: true,
    clicks: true,
    subs: true,
  });
  const toggle = (k) => setActive((prev) => ({ ...prev, [k]: !prev[k] }));
  const [modal, setModal] = useState(null); // stores the title string when open

  const open = (title) => setModal(title);
  const close = () => setModal(null);

  return (
    <div>
      {/* ── Row 1: KPI cards + gauge + line chart ── */}
      <div className="ov-row1">
        {/* KPI summary — each stat clickable */}
        <Card className="p-0-of">
          {/* Total Visits */}
          <div
            onClick={() => open("Total Visits — Transactions")}
            className="ov-kpi-header"
          >
            <div className="ov-kpi-main-num">1.5m</div>
            <div className="stat-lbl">Total Visits</div>
            <div className="stat-hint">View Transactions ↗</div>
          </div>
          {/* Sub-stats */}
          <div className="ov-kpi-sub-section">
            {[
              ["500k", "Total Clicks"],
              ["170", "Unique Apps"],
            ].map(([v, l]) => (
              <div
                key={l}
                onClick={() => open(`${l} — Transactions`)}
                className="ov-kpi-substat"
              >
                <div className="ov-kpi-sub-num">{v}</div>
                <div className="stat-sublabel">{l}</div>
                <div className="stat-hint">View Transactions ↗</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Clicked Clean */}
        <div
          onClick={() => open("Clicked Clean — Transactions")}
          className="ov-clean-card"
        >
          <div className="ov-clean-num">50k</div>
          <div className="ov-clean-lbl">Clicked Clean</div>
          <div className="ov-clean-link">View Transactions ↗</div>
        </div>

        {/* Gauge — each legend item clickable */}
        <Card className="p-md">
          <div className="ov-gauge-header">
            <span className="txt-label">Page Clicks</span>
            <span className="ov-gauge-value">5,00,437</span>
          </div>
          <TaperedGauge />
          <div className="ov-gauge-legend">
            {[
              ["#43a84a", "Clean"],
              ["#ffc107", "Low Risk"],
              ["#f44336", "High Risk"],
            ].map(([c, l]) => (
              <div
                key={l}
                onClick={() => open(`${l} — Transactions`)}
                className="ov-legend-item-btn"
              >
                <div className="ov-legend-sq" style={{ "--c": c }} />
                {l}
                <span className="txt-muted-hint">↗</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Line chart — each series toggle still works; chart area itself clickable */}
        <Card className="p-md">
          <div className="ov-chart-header">
            <span className="txt-label">
              Visits, Clicks &amp; Subscriptions
            </span>
            <div className="f-gap-6">
              {SERIES.map(({ key, color }) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="ov-series-btn"
                  style={{
                    "--bg": active[key] ? `${color}18` : "#f1f5f9",
                    "--tx": active[key] ? color : SLATE,
                    "--ol": active[key] ? `1.5px solid ${color}` : "none",
                  }}
                >
                  <span
                    className="ov-series-dot"
                    style={{ "--c": active[key] ? color : "#cbd5e1" }}
                  />
                  {key[0].toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div
            onClick={() =>
              open("Visits, Clicks & Subscriptions — Transactions")
            }
            className="ov-clickable"
          >
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={histogramData} margin={CHART_MARGIN}>
                <XAxis
                  dataKey="x"
                  tick={CHART_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                {active.visits && (
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke={GREEN}
                    strokeWidth={2.5}
                    dot={false}
                    name="Visits"
                  />
                )}
                {active.clicks && (
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke={AMBER}
                    strokeWidth={1.5}
                    dot={false}
                    name="Clicks"
                  />
                )}
                {active.subs && (
                  <Line
                    type="monotone"
                    dataKey="subs"
                    stroke={BLUE}
                    strokeWidth={1.5}
                    dot={false}
                    name="Subs"
                    strokeDasharray="4 2"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            <div className="ov-chart-link">
              Click chart to view transactions ↗
            </div>
          </div>
        </Card>
      </div>

      {/* ── Row 2: Block Reasons radar + channel donuts ── */}
      <div className="ov-row2">
        {/* Radar card */}
        <Card className="card-lg">
          <SectionTitle>Block Reasons — Past Week</SectionTitle>
          <div className="ov-radar-wrap">
            {/* Side stats */}
            <div className="ov-side-stats">
              <div
                className="stat-bg"
                style={{ "--c": "#1d4ed8" }}
                onClick={() => open("Overall Blocks — Transactions")}
              >
                <div className="ov-overall-label">Overall</div>
                <div className="ov-overall-num">1,511,786</div>
                <div className="ov-overall-link">View Transactions ↗</div>
              </div>

              {[
                ["Apps", "2,26,767", "#22c55e"],
                ["Browsing", "2,26,767", "#f59e0b"],
                ["In-App", "1,89,034", "#1d4ed8"],
              ].map(([l, v, col]) => (
                <div
                  key={l}
                  className="bl-stat"
                  style={{ "--c": col }}
                  onClick={() => open(`${l} — Transactions`)}
                >
                  <div className="ov-stat-label">{l}</div>
                  <div className="ov-stat-num">{v}</div>
                  <div className="ov-stat-link">View Transactions ↗</div>
                </div>
              ))}
            </div>

            {/* Radar chart */}
            <div className="ov-radar-expand">
              <BlockRadarChart
                height={420}
                showBadge={false}
                onDayClick={(day) =>
                  open(`${day} Block Pattern — Transactions`)
                }
              />
            </div>
          </div>
        </Card>

        {/* Channel cards — 2×2 grid */}
        <div className="ov-channel-grid">
          {channelCards.map((c, i) => (
            <Card key={i} className="ov-channel-card">
              <div
                className="ov-channel-title dyn-border-bottom"
                style={{ "--c": c.color }}
                onClick={() => open(`${c.name} — Transactions`)}
              >
                {c.name}
                <span className="ov-channel-title-arrow">↗</span>
              </div>

              <div className="ov-channel-body">
                <div>
                  <div
                    className="ov-metric-item"
                    onClick={() => open(`${c.name} Clicks — Transactions`)}
                  >
                    <div className="ov-metric-label">Clicks</div>
                    <div className="ov-metric-num-clicks">
                      {c.clicks.toLocaleString()}
                    </div>
                    <div className="ov-metric-link">View Transactions ↗</div>
                  </div>
                  <div
                    className="ov-metric-item"
                    onClick={() => open(`${c.name} Visits — Transactions`)}
                  >
                    <div className="ov-metric-label">Visits</div>
                    <div className="ov-metric-num-visits">
                      {c.visits.toLocaleString()}
                    </div>
                    <div className="ov-metric-link">View Transactions ↗</div>
                  </div>
                </div>
                <TinyDonut
                  pct={Math.round((c.clicks / c.visits) * 100)}
                  color={c.color}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions modal */}
      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
