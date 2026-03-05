import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Top10ServicesChart from "./Top10ServicesChart";
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
  spoofedApkData,
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
      {name.length > 18 ? name.slice(0, 18) + "…" : name} (
      {(percent * 100).toFixed(1)}%)
    </text>
  );
}

// ── Chart Context Menu ────────────────────────────────────────────────────────
function ChartContextMenu({ containerRef, data, title }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getSvgEl = () => containerRef.current?.querySelector("svg");

  const getSvgAsCanvas = () =>
    new Promise((resolve) => {
      const svg = getSvgEl();
      if (!svg) return resolve(null);
      const svgStr = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = svg.clientWidth || 500;
        canvas.height = svg.clientHeight || 300;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.src = url;
    });

  const viewFullScreen = () => {
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
    setOpen(false);
  };

  const printChart = async () => {
    const canvas = await getSvgAsCanvas();
    if (!canvas) return;
    const win = window.open("", "_blank");
    win.document.write(
      `<html><head><title>${title || "chart"}</title></head><body style="margin:0">` +
        `<img src="${canvas.toDataURL("image/png")}" style="width:100%" onload="window.print();window.close()" /></body></html>`,
    );
    win.document.close();
    setOpen(false);
  };

  const downloadPNG = async () => {
    const canvas = await getSvgAsCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${title || "chart"}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setOpen(false);
  };

  const downloadJPEG = async () => {
    const canvas = await getSvgAsCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${title || "chart"}.jpg`;
    a.href = canvas.toDataURL("image/jpeg", 0.92);
    a.click();
    setOpen(false);
  };

  const downloadPDF = async () => {
    const canvas = await getSvgAsCanvas();
    if (!canvas) return;
    const win = window.open("", "_blank");
    win.document.write(
      `<html><head><title>${title || "chart"}</title></head><body style="margin:0">` +
        `<img src="${canvas.toDataURL("image/png")}" style="width:100%" onload="window.print();window.close()" /></body></html>`,
    );
    win.document.close();
    setOpen(false);
  };

  const downloadSVG = () => {
    const svg = getSvgEl();
    if (!svg) return;
    const svgStr = new XMLSerializer().serializeToString(svg);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml" }));
    a.download = `${title || "chart"}.svg`;
    a.click();
    setOpen(false);
  };

  const downloadCSV = () => {
    if (!data?.length) return;
    const csv = [
      "name,value",
      ...data.map((d) => `"${d.name}",${d.value}`),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${title || "chart"}.csv`;
    a.click();
    setOpen(false);
  };

  const downloadXLS = () => {
    if (!data?.length) return;
    const tsv = [
      "name\tvalue",
      ...data.map((d) => `${d.name}\t${d.value}`),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([tsv], { type: "application/vnd.ms-excel" }),
    );
    a.download = `${title || "chart"}.xls`;
    a.click();
    setOpen(false);
  };

  const MENU_ITEMS = [
    { label: "View in full screen", action: viewFullScreen },
    { label: "Print chart", action: printChart },
    null,
    { label: "Download PNG image", action: downloadPNG },
    { label: "Download JPEG image", action: downloadJPEG },
    { label: "Download PDF document", action: downloadPDF },
    { label: "Download SVG vector image", action: downloadSVG },
    null,
    { label: "Download CSV", action: downloadCSV },
    { label: "Download XLS", action: downloadXLS },
  ];

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button className="geo-collapse-btn" onClick={() => setOpen((p) => !p)}>
        ≡
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            zIndex: 200,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            minWidth: 210,
            padding: "4px 0",
          }}
        >
          {MENU_ITEMS.map((item, i) =>
            item === null ? (
              <div
                key={i}
                style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }}
              />
            ) : (
              <button
                key={i}
                onClick={item.action}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 16px",
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#334155",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f1f5f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ── APK Pie Card ──────────────────────────────────────────────────────────────
const CHART_TOOLTIP = { fontSize: 11, borderRadius: 8 };

function ApkPieCard({ title, data, onSliceClick, serviceFilter }) {
  const containerRef = useRef(null);
  const isFiltered = Boolean(serviceFilter);

  const filteredData = useMemo(() => {
    if (!isFiltered) return data;
    const seed = serviceFilter
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return data.map((d, i) => ({
      ...d,
      value: Math.max(
        1,
        Math.round(d.value * (0.4 + ((seed * (i + 7)) % 100) / 150)),
      ),
    }));
  }, [data, serviceFilter, isFiltered]);

  return (
    <Card className={isFiltered ? "pie-card-filtered" : ""}>
      <div className="ov-chart-header">
        <SectionTitle>{title}</SectionTitle>
        <div className="pie-card-header-right">
          {isFiltered && (
            <span
              className="pie-filter-badge"
              title={`Filtered by: ${serviceFilter}`}
            >
              🔍{" "}
              {serviceFilter.length > 20
                ? serviceFilter.slice(0, 20) + "…"
                : serviceFilter}
            </span>
          )}
          <ChartContextMenu
            containerRef={containerRef}
            data={filteredData}
            title={title}
          />
        </div>
      </div>
      <div ref={containerRef}>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={true}
              label={renderLabel}
              onClick={(entry) => onSliceClick && onSliceClick(entry.name)}
              className="p-rel clickable"
            >
              {filteredData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} contentStyle={CHART_TOOLTIP} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="stat-hint-center">
        {isFiltered
          ? `Showing data for: ${serviceFilter}`
          : "Click a slice to view transactions ↗"}
      </div>
    </Card>
  );
}

// ── Build Top 20 ──────────────────────────────────────────────────────────────
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
    ...spoofedApkData.map((d) => ({ ...d, type: "Specified" })),
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PageAPKs() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [serviceFilter, setServiceFilter] = useState(null);
  const [days, setDays] = useState(1);
  const open = (title) => setModal(title);
  const close = () => setModal(null);
  const handleServiceFilter = useCallback((name) => setServiceFilter(name), []);

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
            className="stat-card-click"
            style={{ "--c": s.color }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
          >
            <div className="dyn-color" style={{ "--c": s.color }}>
              {s.value}
            </div>
            <div className="stat-lbl-12">{s.label}</div>
            <div className="stat-hint">View Transactions ↗</div>
          </Card>
        ))}
      </div>

      {/* ── Top 20 Services Chart ── */}
      <Top10ServicesChart days={days} onServiceFilter={handleServiceFilter} />

      {/* Top APK pie charts */}
      <div className="g-halves mb-section">
        <ApkPieCard
          title="Block APKs"
          data={trustedApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
        <ApkPieCard
          title="Clean APKs"
          data={cleanApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
      </div>

      {/* Specified APKs */}
      <div className="mb-18">
        <ApkPieCard
          title="Specified APKs"
          data={spoofedApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
      </div>

      {/* Hidden APKs */}
      <div className="mb-18">
        <ApkPieCard
          title="Hidden APKs"
          data={hiddenApkData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
      </div>

      {/* Top 20 Apps table */}
      <Card>
        <div className="toolbar">
          <div className="f-gap-8">
            <SectionTitle className="m-0">Top 20 Apps</SectionTitle>
          </div>
          <div className="f-gap-12">
            <div className="dt-entries-bar">
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="dt-entries-sel"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
            <input
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="apk-search"
            />
          </div>
        </div>
        <div className="table-wrap">
          <table className="dt" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "48px" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "110px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead>
              <tr className="dt-head-row">
                <th className="dt-th" style={{ textAlign: "center" }}>
                  #
                </th>
                <th className="dt-th" style={{ textAlign: "left" }}>
                  Package Name
                </th>
                <th className="dt-th" style={{ textAlign: "center" }}>
                  Type
                </th>
                <th
                  className="dt-th"
                  style={{ textAlign: "right", paddingRight: 24 }}
                >
                  Share %
                </th>
                <th className="dt-th" style={{ textAlign: "center" }}>
                  Risk
                </th>
                <th className="dt-th" style={{ textAlign: "center" }}>
                  Status
                </th>
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
                  {/* # */}
                  <td
                    style={{
                      textAlign: "center",
                      padding: "10px 8px",
                      color: "#94a3b8",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {r.rank}
                  </td>
                  {/* Package Name */}
                  <td
                    style={{
                      padding: "10px 12px",
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: "#334155",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.name}
                  </td>
                  {/* Type */}
                  <td style={{ textAlign: "center", padding: "10px 8px" }}>
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
                  {/* Share % */}
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: 24,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1d4ed8",
                    }}
                  >
                    {r.share}%
                  </td>
                  {/* Risk */}
                  <td style={{ textAlign: "center", padding: "10px 8px" }}>
                    <Badge color={RISK_COLORS[r.risk]}>{r.risk}</Badge>
                  </td>
                  {/* Status */}
                  <td style={{ textAlign: "center", padding: "10px 8px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <StatusDot status={r.status} />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color:
                            r.status === "active"
                              ? GREEN
                              : r.status === "warning"
                                ? AMBER
                                : ROSE,
                          textTransform: "capitalize",
                        }}
                      >
                        {r.status}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
