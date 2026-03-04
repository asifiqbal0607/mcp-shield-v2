import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Card, SectionTitle, Badge } from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE, SLATE, VIOLET } from "../constants/colors";

// ── Mock Data ────────────────────────────────────────────────────────────────
const PARTNER_ROWS = [
  { id: "PTR-001", name: "True Digital Group",     contact: "John Smith",      email: "john@truedigital.com",   country: "TH", services: 24, users: 8,  revenue: "฿1,240,000", status: "active",  joined: "2023-01-15", lastActive: "Today" },
  { id: "PTR-002", name: "MTN South Africa",        contact: "Sipho Dlamini",   email: "sipho@mtn.co.za",        country: "ZA", services: 18, users: 12, revenue: "R 980,000",  status: "active",  joined: "2023-03-08", lastActive: "Today" },
  { id: "PTR-003", name: "Vodacom Tanzania",        contact: "Amina Hassan",    email: "amina@vodacom.tz",       country: "TZ", services: 9,  users: 5,  revenue: "TZS 4.2M",   status: "active",  joined: "2023-06-22", lastActive: "2d ago" },
  { id: "PTR-004", name: "Airtel Nigeria",          contact: "Chukwuemeka O.",  email: "chukwu@airtel.ng",       country: "NG", services: 14, users: 7,  revenue: "₦ 2,100,000",status: "active",  joined: "2023-07-01", lastActive: "Today" },
  { id: "PTR-005", name: "Orange Senegal",          contact: "Moussa Diop",     email: "moussa@orange.sn",       country: "SN", services: 6,  users: 3,  revenue: "CFA 890,000", status: "warning", joined: "2023-09-14", lastActive: "8d ago" },
  { id: "PTR-006", name: "Safaricom Kenya",         contact: "Grace Wanjiru",   email: "grace@safaricom.co.ke",  country: "KE", services: 21, users: 15, revenue: "KES 3,400,000",status: "active", joined: "2022-11-30", lastActive: "Today" },
  { id: "PTR-007", name: "Glo Mobile Ghana",        contact: "Kwame Asante",    email: "kwame@glo.com.gh",       country: "GH", services: 4,  users: 2,  revenue: "GHS 210,000", status: "blocked", joined: "2024-01-05", lastActive: "22d ago" },
  { id: "PTR-008", name: "Telecel Zimbabwe",        contact: "Tatenda Moyo",    email: "tatenda@telecel.co.zw",  country: "ZW", services: 7,  users: 4,  revenue: "USD 45,000",  status: "active",  joined: "2024-02-18", lastActive: "1d ago" },
  { id: "PTR-009", name: "Ethio Telecom",           contact: "Bereket Alemu",   email: "bereket@ethiotelecom.et",country: "ET", services: 11, users: 6,  revenue: "ETB 820,000", status: "active",  joined: "2023-08-09", lastActive: "Today" },
  { id: "PTR-010", name: "Sudan Telecom (Sudatel)", contact: "Omar Al-Rashid",  email: "omar@sudatel.sd",        country: "SD", services: 5,  users: 3,  revenue: "SDG 340,000", status: "warning", joined: "2024-03-01", lastActive: "5d ago" },
  { id: "PTR-011", name: "Zamtel Zambia",           contact: "Mwila Mwansa",    email: "mwila@zamtel.zm",        country: "ZM", services: 3,  users: 2,  revenue: "ZMW 98,000",  status: "active",  joined: "2024-04-12", lastActive: "3d ago" },
  { id: "PTR-012", name: "Africell Uganda",         contact: "Ronald Kato",     email: "ronald@africell.ug",     country: "UG", services: 8,  users: 5,  revenue: "UGX 1.8M",    status: "active",  joined: "2023-10-20", lastActive: "Today" },
];

const TREND_DATA = [
  { d: "Sep 1",  partners: 8  },
  { d: "Sep 7",  partners: 9  },
  { d: "Sep 14", partners: 9  },
  { d: "Sep 21", partners: 10 },
  { d: "Sep 26", partners: 12 },
];

const STATUS_COLOR = (s) => s === "active" ? GREEN : s === "warning" ? AMBER : ROSE;
const STATUS_BG    = (s) => s === "active" ? "#dcfce7" : s === "warning" ? "#fef3c7" : "#fee2e2";
const STATUS_TEXT  = (s) => s === "active" ? "#15803d" : s === "warning" ? "#92400e" : "#991b1b";

const FLAG = { ZA:"🇿🇦", TH:"🇹🇭", TZ:"🇹🇿", NG:"🇳🇬", SN:"🇸🇳", KE:"🇰🇪",
               GH:"🇬🇭", ZW:"🇿🇼", ET:"🇪🇹", SD:"🇸🇩", ZM:"🇿🇲", UG:"🇺🇬" };

// ── Partner Detail Modal ──────────────────────────────────────────────────────
function PartnerModal({ partner, onClose }) {
  if (!partner) return null;
  return (
    <div className="partner-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="partner-box">
        {/* Header */}
        <div className="partner-modal-header">
          <div className="f-gap-14">
            <div className="partner-avatar">{partner.name[0]}</div>
            <div>
              <div className="txt-white-hd">{partner.name}</div>
              <div className="txt-white-sub">
                {FLAG[partner.country]} {partner.id}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="partner-modal-close">×</button>
        </div>

        {/* Body */}
        <div className="p-section">
          {/* Stats row */}
          <div className="g-stats3 mb-section">
            {[
              { label: "Services", value: partner.services, color: BLUE },
              { label: "Users",    value: partner.users,    color: VIOLET },
              { label: "Revenue",  value: partner.revenue,  color: GREEN },
            ].map(s => (
              <div key={s.label} className="partner-stat-cell">
                <div className="stat-num" style={{ '--c': s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Details grid */}
          {[
            ["Contact",     partner.contact],
            ["Email",       partner.email],
            ["Country",     `${FLAG[partner.country]} ${partner.country}`],
            ["Status",      partner.status],
            ["Joined",      partner.joined],
            ["Last Active", partner.lastActive],
          ].map(([label, value]) => (
            <div key={label} className="partner-detail-row">
              <span className="stat-sublabel">{label}</span>
              {label === "Status" ? (
                <span className="partner-status-badge" style={{ '--bg': STATUS_BG(value), '--c': STATUS_TEXT(value) }}>{value}</span>
              ) : (
                <span className="detail-val">{value}</span>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="mt-20-acts">
            <button className="partner-btn-primary">Edit Partner</button>
            <button className="partner-btn-ghost">View Services</button>
            {partner.status !== "blocked" ? (
              <button className="partner-btn-danger">Block</button>
            ) : (
              <button className="partner-btn-success">Unblock</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PagePartners() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = PARTNER_ROWS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.contact.toLowerCase().includes(search.toLowerCase()) ||
                        p.country.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const stats = {
    total:   PARTNER_ROWS.length,
    active:  PARTNER_ROWS.filter(p => p.status === "active").length,
    warning: PARTNER_ROWS.filter(p => p.status === "warning").length,
    blocked: PARTNER_ROWS.filter(p => p.status === "blocked").length,
  };

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className="g-stats4 mb-section">
        {[
          { label: "Total Partners",   value: stats.total,   color: BLUE  },
          { label: "Active",           value: stats.active,  color: GREEN },
          { label: "Needs Attention",  value: stats.warning, color: AMBER },
          { label: "Blocked",          value: stats.blocked, color: ROSE  },
        ].map(s => (
          <Card key={s.label} className="stat-top" style={{ '--c': s.color }}>
            <div className="kpi-stat" className="stat-accent" style={{ '--c': s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* ── Trend Chart ── */}
      <div className="g-split2 mb-section">
        <Card>
          <SectionTitle>Partner Growth</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={TREND_DATA}>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[6, 14]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line dataKey="partners" name="Partners" stroke={BLUE} strokeWidth={2.5} dot={{ r: 4, fill: BLUE }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>By Status</SectionTitle>
          <div className="f-col-10">
            {[
              { label: "Active",          count: stats.active,  color: GREEN,  bg: "#dcfce7", pct: Math.round(stats.active  / stats.total * 100) },
              { label: "Needs Attention", count: stats.warning, color: AMBER,  bg: "#fef3c7", pct: Math.round(stats.warning / stats.total * 100) },
              { label: "Blocked",         count: stats.blocked, color: ROSE,   bg: "#fee2e2", pct: Math.round(stats.blocked / stats.total * 100) },
            ].map(s => (
              <div key={s.label} className="partner-status-row" style={{ '--bg': s.bg }}>
                <div className="color-dot" className="stat-bg" style={{ '--c': s.color }} />
                <div className="rep-legend-lbl">{s.label}</div>
                <span className="stat-num-val" style={{ '--c': s.color }}>{s.count}</span>
                <span className="stat-sublabel">{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Partner Table ── */}
      <Card>
        {/* Toolbar */}
        <div className="partner-toolbar">
          <SectionTitle className="m-0">All Partners</SectionTitle>
          <div className="f-wrap-10">
            {/* Status filter pills */}
            <div className="f-gap-6">
              {["All", "Active", "Warning", "Blocked"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`partner-filter-pill ${filter === f ? "active" : "inactive"}`}>{f}</button>
              ))}
            </div>
            {/* Search */}
            <div className="p-rel">
              <span className="partner-search-icon">🔍</span>
              <input
                placeholder="Search partners…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="partner-search"
              />
            </div>
            {/* Add button */}
            <button className="partner-add-btn">+ Add Partner</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="dt">
            <thead>
              <tr className="dt-head-row">
                {["Partner", "Contact", "Country", "Services", "Users", "Revenue", "Status", "Last Active", ""].map(h => (
                  <th key={h} className="dt-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                  className="dt-tr"
                  onClick={() => setSelected(p)}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Partner name + id */}
                  <td className="p-sm">
                    <div className="f-gap-10">
                      <div className="partner-row-avatar">{p.name[0]}</div>
                      <div>
                        <div className="txt-strong-sm">{p.name}</div>
                        <div className="txt-mono">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-p-body">{p.contact}</td>
                  <td className="td-p-flag">{FLAG[p.country]} {p.country}</td>
                  <td className="td-p-blue">{p.services}</td>
                  <td className="td-p-violet">{p.users}</td>
                  <td className="td-p-mono">{p.revenue}</td>
                  <td className="p-sm">
                    <span className="partner-status-badge" style={{ '--bg': STATUS_BG(p.status), '--c': STATUS_TEXT(p.status) }}>{p.status}</span>
                  </td>
                  <td className="td-p-slate">{p.lastActive}</td>
                  <td className="p-sm">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(p); }}
                      className="partner-view-btn">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="td-empty">
                    No partners match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="partner-footer-txt">
          Showing {filtered.length} of {PARTNER_ROWS.length} partners
        </div>
      </Card>

      {/* Detail modal */}
      {selected && <PartnerModal partner={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
