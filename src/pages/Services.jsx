import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { Card, SectionTitle, Badge } from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE, VIOLET, SLATE } from "../constants/colors";
import { repTrend } from "../data/charts";

const T = "#0d9488"; // teal accent

const API_CALL_DATA = [
  { name: "Shield", calls: 10 },
  { name: "Click", calls: 8 },
  { name: "APK", calls: 6 },
  { name: "Fraud", calls: 5 },
  { name: "Export", calls: 70 },
  { name: "Geo", calls: 4 },
  { name: "Notification", calls: 320 },
];

const BAR_COLORS = [BLUE, GREEN, VIOLET, ROSE, AMBER, "#06b6d4", "#f97316"];

const svcRows = [
  {
    id: 1,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap4 - 4237424 - True",
    serviceId: "-36KlpABQGMxF54qLUGn",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-10",
    lastUpdate: "2024-06-01",
  },
  {
    id: 2,
    name: "True Digital Group Co.,Ltd (4239) | Wan Duang dee 3 - 4239469 - True",
    serviceId: "-37bZ5MBQGMxF54qXIB_",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-12",
    lastUpdate: "2024-06-03",
  },
  {
    id: 3,
    name: "True Digital Group Co.,Ltd (4238) | Hora Duange4 - 4238572 - True",
    serviceId: "-6gEeJcBP_A8TV-HbUzE",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-15",
    lastUpdate: "2024-06-05",
  },
  {
    id: 4,
    name: "gvi services | anus-sub-acc",
    serviceId: "-8u4q5cB1fchDeWJNjg3",
    status: "active",
    client: "GVI",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-01",
    lastUpdate: "2024-06-10",
  },
  {
    id: 5,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap - 4237421 - True",
    serviceId: "-H6llpABQGMxF54qjEGX",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-10",
    lastUpdate: "2024-06-12",
  },
  {
    id: 6,
    name: "Teleinfotech | Duang Den - 4218043 - True",
    serviceId: "-H6kiZEBQGMxF54qRUQX",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-01",
    lastUpdate: "2024-06-15",
  },
  {
    id: 7,
    name: "True Digital Group Co.,Ltd (4239) | Health care 2 - 4239462 - True",
    serviceId: "-H7RZ5MBQGMxF54q0IAp",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-05",
    lastUpdate: "2024-06-18",
  },
  {
    id: 8,
    name: "True Digital Group Co.,Ltd (4238) | XR Academy - 4238069 - True",
    serviceId: "-Mp2d5AB-W5fcuufUc83",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-10",
    lastUpdate: "2024-06-20",
  },
  {
    id: 9,
    name: "True Digital Group Co.,Ltd (4239) | Horo Lucky Dee9 - 4239355 - True",
    serviceId: "-Muv_ZQB-W5fcuufnkmx",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-15",
    lastUpdate: "2024-06-22",
  },
  {
    id: 10,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap2 - 4237422 - True",
    serviceId: "-X6JlpABQGMxF54qHkFO",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-01",
    lastUpdate: "2024-06-25",
  },
  {
    id: 11,
    name: "iPay Service",
    serviceId: "qcmk0vBzyQ83DjMqcw",
    status: "inactive",
    client: "TPay",
    vsBrand: "--",
    type: "API",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-01",
    lastUpdate: "2024-07-01",
  },
];

const PARTNER_ACTIONS = [
  { label: "👁", color: "#17a2b8", title: "View" },
  { label: "✎", color: "#17a2b8", title: "Edit" },
  { label: "Custom Variables", color: "#0d9488", title: "Custom Variables" },
];

const ADMIN_ACTIONS = [
  { label: "Solution", color: "#6c757d" },
  { label: "Map Service", color: "#17a2b8" },
  { label: "Dashboard", color: "#6c757d" },
  { label: "Edit", color: "#0d6efd" },
  { label: "IP", color: "#6c757d" },
  { label: "Clone Service", color: "#0d9488" },
  { label: "Custom Variables", color: "#0d9488" },
  { label: "Update Summary", color: "#6c757d" },
];

function ActionsDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-rel-ib">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`svc-ver-btn ${open ? "open" : "closed"}`}
      >
        ···
      </button>
      {open && (
        <>
          <div
            className="p-fixed-0"
            onClick={() => setOpen(false)}
          />
          <div
            className="svc-dropdown"
          >
            {ADMIN_ACTIONS.map((a, i) => (
              <button
                key={a.label}
                onClick={() => setOpen(false)}
                className="svc-dropdown-item" style={{ '--c': a.color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PartnerActions() {
  return (
    <div className="f-gap-4">
      {PARTNER_ACTIONS.map((a) => (
        <button
          key={a.label}
          title={a.title}
          className="svc-action-badge" style={{ '--c': a.color, '--bg': a.label.length <= 2 ? a.color : "#fff" }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PageServices({ role = "admin", setPage }) {
  const [tab, setTab] = useState("active");

  const isPartner = role === "partner";
  const isAdmin = role === "admin";

  const activeServices = svcRows.filter((r) => r.status === "active");
  const inactiveServices = svcRows.filter((r) => r.status !== "active");
  const displayed = tab === "active" ? activeServices : inactiveServices;

  const SUMMARY_STATS = [
    { label: "Total Services", value: svcRows.length, color: "#2563eb" },
    { label: "Active", value: activeServices.length, color: "#22c55e" },
    { label: "Inactive", value: inactiveServices.length, color: "#f50b1f" },
  ];

  const ALL_COLUMNS = [
    { key: "sr", label: "Sr.", admin: true, partner: true },
    { key: "name", label: "Name", admin: true, partner: true },
    { key: "serviceId", label: "Service ID", admin: true, partner: true },
    { key: "status", label: "Status", admin: true, partner: true },
    { key: "client", label: "Client", admin: true, partner: false },
    { key: "vsBrand", label: "VS Brand", admin: true, partner: false },
    { key: "serviceType", label: "Service Type", admin: true, partner: true },
    { key: "mno", label: "MNO", admin: true, partner: false },
    {
      key: "carrierGradeNat",
      label: "Carrier Grade NAT",
      admin: true,
      partner: false,
    },
    { key: "shieldMode", label: "ShieldMode", admin: true, partner: true },
    {
      key: "headerEnrichedFlow",
      label: "Header Enriched Flow",
      admin: true,
      partner: true,
    },
    {
      key: "hePaymentFlow",
      label: "HE Payment Flow",
      admin: true,
      partner: false,
    },
    {
      key: "wifiPaymentFlow",
      label: "WiFi Payment Flow",
      admin: true,
      partner: false,
    },
    {
      key: "serviceCreated",
      label: "Service Created",
      admin: true,
      partner: false,
    },
    { key: "lastUpdate", label: "Last Update", admin: true, partner: true },
    { key: "actions", label: "Actions", admin: true, partner: true },
  ];

  const visibleCols = ALL_COLUMNS.filter((c) =>
    isAdmin ? c.admin : c.partner,
  );

  function renderCell(col, row, idx) {
    switch (col.key) {
      case "sr":
        return <span className="txt-muted">{idx + 1}</span>;
      case "name":
        return (
          <span className="txt-label-md">
            {row.name}
          </span>
        );
      case "serviceId":
        return (
          <span
            className="txt-mono"
          >
            {row.serviceId}
          </span>
        );
      case "status":
        return (
          <span
            className="svc-status-badge" style={{ '--c': row.status === "active" ? "#16a34a" : "#f59e0b" }}
          >
            {row.status.toUpperCase()}
          </span>
        );
      case "client":
        return <span className="txt-body">{row.client || "--"}</span>;
      case "vsBrand":
        return <span className="txt-muted">{row.vsBrand || "--"}</span>;
      case "serviceType":
        return <span className="txt-muted">{row.type || "--"}</span>;
      case "mno":
        return <span className="txt-muted">{row.mno || "--"}</span>;
      case "carrierGradeNat":
        return (
          <span className="txt-muted">
            {row.carrierGradeNat || "--"}
          </span>
        );
      case "shieldMode":
        return row.shieldMode && row.shieldMode !== "--" ? (
          <span
            className="svc-pill"
          >
            {row.shieldMode}
          </span>
        ) : (
          <span className="txt-muted">--</span>
        );
      case "headerEnrichedFlow":
        return (
          <span className="txt-muted">
            {row.headerEnrichedFlow || "--"}
          </span>
        );
      case "hePaymentFlow":
        return (
          <span className="txt-muted">{row.hePaymentFlow || "--"}</span>
        );
      case "wifiPaymentFlow":
        return (
          <span className="txt-muted">
            {row.wifiPaymentFlow || "--"}
          </span>
        );
      case "serviceCreated":
        return (
          <span
            className="svc-code"
          >
            {row.serviceCreated}
          </span>
        );
      case "lastUpdate":
        return (
          <span
            className="svc-code"
          >
            {row.lastUpdate}
          </span>
        );
      case "actions":
        return isAdmin ? <ActionsDropdown /> : <PartnerActions />;
      default:
        return "--";
    }
  }

  return (
    <div>
      {/* Summary stats */}
      <div className="g-stats3 mb-section">
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
      <div className="g-split2 mb-section">
        <Card>
          <SectionTitle>Uptime Trend (14 days)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repTrend}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line dataKey="visits" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>API Calls by Service</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={API_CALL_DATA}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                {API_CALL_DATA.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Service Registry */}
      <Card>
        <div
          className="toolbar"
        >
          <div className="f-gap-14">
            <SectionTitle>Service Registration</SectionTitle>
            {isPartner && (
              <button
                onClick={() => setPage && setPage("onboarding")}
                className="svc-add-btn" style={{ '--c': T }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                ⊕ Add New Service
              </button>
            )}
          </div>

          <div className="f-gap-0">
            {[
              ["active", GREEN, "22c55e", "dcfce7", "16a34a"],
              ["inactive", AMBER, "f59e0b", "fef3c7", "d97706"],
            ].map(([key, borderColor, dotHex, bgHex, textHex]) => {
              const isOn = tab === key;
              const count =
                key === "active"
                  ? activeServices.length
                  : inactiveServices.length;
              const label = key === "active" ? "✓ Active" : "⊘ Inactive";
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`svc-tab-btn ${isOn ? "on" : "off"}`} style={{ '--c': `#${textHex}` }}
                >
                  <span
                    className={`svc-tab-dot ${isOn ? "on" : "off"}`} style={{ '--c': `#${dotHex}` }}
                  />
                  {label}
                  <span
                    className={`svc-tab-pill ${isOn ? "on" : "off"}`} style={{ '--bg': `#${bgHex}`, '--c': `#${textHex}` }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="table-wrap"><table
          className="dt dt-lg"
          >
            <thead>
              <tr className="dt-head-row">
                {visibleCols.map((col) => (
                  <th
                    key={col.key}
                    className="dt-th"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="dt-empty"
                  >
                    No {tab} services found.
                  </td>
                </tr>
              ) : (
                displayed.map((row, idx) => (
                  <tr
                    key={idx}
                    className="dt-tr-plain"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {visibleCols.map((col) => (
                      <td
                        key={col.key}
                        className="td-svc"
                      >
                        {renderCell(col, row, idx)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table></div>
      </Card>
    </div>
  );
}
