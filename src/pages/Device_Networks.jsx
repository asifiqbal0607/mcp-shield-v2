import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Top10ServicesChart from "./Top10ServicesChart";
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
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const short = name.length > 18 ? name.slice(0, 18) + "…" : name;
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
      {short} ({(percent * 100).toFixed(1)}%)
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

// ── Pie Card ──────────────────────────────────────────────────────────────────
const CHART_TOOLTIP = { fontSize: 11, borderRadius: 8 };

function StatPieCard({ title, data, onSliceClick, serviceFilter }) {
  const containerRef = useRef(null);
  const isFiltered = Boolean(serviceFilter);

  // When a service is selected, scale each slice value by a service-specific
  // seed so the distribution changes visually to reflect that service's data.
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
              label={renderLabel}
              labelLine={true}
              onClick={(entry) => onSliceClick && onSliceClick(entry.name)}
              className="p-rel clickable"
            >
              {filteredData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_TOOLTIP} />
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PageDevice() {
  const [modal, setModal] = useState(null);
  const [serviceFilter, setServiceFilter] = useState(null);
  const [days, setDays] = useState(1);
  const open = (title) => setModal(title);
  const close = () => setModal(null);
  const handleServiceFilter = useCallback((name) => setServiceFilter(name), []);

  const stats = [
    {
      label: "Unique Devices",
      value: "48,291",
      color: "#1d4ed8",
      clickable: true,
    },
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
            className={s.clickable ? "stat-card-click" : "stat-card-click-opt"}
            style={{ "--c": s.color }}
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
            <div className="dyn-color" style={{ "--c": s.color }}>
              {s.value}
            </div>
            <div className="stat-lbl-12">{s.label}</div>
            {s.clickable && (
              <div className="stat-hint">View Transactions ↗</div>
            )}
          </Card>
        ))}
      </div>

      {/* ── Top 20 Services Chart ── */}
      <Top10ServicesChart days={days} onServiceFilter={handleServiceFilter} />

      {/* ── Top 10 Devices + Top 10 OS ── */}
      <div className="g-halves mb-section">
        <StatPieCard
          title="Top 10 Devices"
          data={topDevicesData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
        <StatPieCard
          title="Top 10 Operating Systems"
          data={topOsData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
      </div>

      {/* ── Top 10 Browsers + Top 10 Networks ── */}
      <div className="g-halves">
        <StatPieCard
          title="Top 10 Browsers"
          data={topBrowsersData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
        <StatPieCard
          title="Top 10 Networks"
          data={topNetworksData}
          onSliceClick={(name) => open(`${name} — Transactions`)}
          serviceFilter={serviceFilter}
        />
      </div>

      {modal && <TransactionsModal title={modal} onClose={close} />}
    </div>
  );
}
