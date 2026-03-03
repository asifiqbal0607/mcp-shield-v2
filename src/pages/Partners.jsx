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
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(10,22,40,.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        boxShadow: "0 24px 64px rgba(0,0,0,.2)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#0a1628,#0f2040)",
          padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10,
              background: "linear-gradient(135deg,#e8a020,#f5c842)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "#0a1628",
            }}>{partner.name[0]}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{partner.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>
                {FLAG[partner.country]} {partner.id}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 18,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px" }}>
          {/* Stats row */}
          <div className="g-stats3 mb-section">
            {[
              { label: "Services", value: partner.services, color: BLUE },
              { label: "Users",    value: partner.users,    color: VIOLET },
              { label: "Revenue",  value: partner.revenue,  color: GREEN },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center", padding: "14px 10px",
                borderRadius: 10, background: "#f8fafc", border: "1px solid #e8ecf3",
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: SLATE, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
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
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: "1px solid #f1f5f9",
            }}>
              <span style={{ fontSize: 12, color: SLATE, fontWeight: 600 }}>{label}</span>
              {label === "Status" ? (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: STATUS_BG(value), color: STATUS_TEXT(value),
                  textTransform: "capitalize",
                }}>{value}</span>
              ) : (
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{value}</span>
              )}
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button style={{
              flex: 1, padding: "10px", borderRadius: 8,
              background: BLUE, color: "#fff", border: "none",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>Edit Partner</button>
            <button style={{
              flex: 1, padding: "10px", borderRadius: 8,
              background: "#f8fafc", color: "#64748b",
              border: "1px solid #e2e8f0",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>View Services</button>
            {partner.status !== "blocked" ? (
              <button style={{
                padding: "10px 16px", borderRadius: 8,
                background: "#fee2e2", color: "#dc2626",
                border: "1px solid #fecaca",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Block</button>
            ) : (
              <button style={{
                padding: "10px 16px", borderRadius: 8,
                background: "#dcfce7", color: "#15803d",
                border: "1px solid #bbf7d0",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Unblock</button>
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
          <Card key={s.label} style={{ textAlign: "center", borderTop: `3px solid ${s.color}` }}>
            <div className="kpi-stat" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {[
              { label: "Active",          count: stats.active,  color: GREEN,  bg: "#dcfce7", pct: Math.round(stats.active  / stats.total * 100) },
              { label: "Needs Attention", count: stats.warning, color: AMBER,  bg: "#fef3c7", pct: Math.round(stats.warning / stats.total * 100) },
              { label: "Blocked",         count: stats.blocked, color: ROSE,   bg: "#fee2e2", pct: Math.round(stats.blocked / stats.total * 100) },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 10, background: s.bg,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{s.label}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
                <span style={{ fontSize: 11, color: SLATE }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Partner Table ── */}
      <Card>
        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, marginBottom: 16,
        }}>
          <SectionTitle style={{ margin: 0 }}>All Partners</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Status filter pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Active", "Warning", "Blocked"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                  fontSize: 11, fontWeight: 700,
                  border: filter === f ? "none" : "1px solid #e2e8f0",
                  background: filter === f ? BLUE : "#f8fafc",
                  color: filter === f ? "#fff" : "#64748b",
                  transition: "all .15s",
                }}>{f}</button>
              ))}
            </div>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#94a3b8" }}>🔍</span>
              <input
                placeholder="Search partners…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: "1px solid #e2e8f0", borderRadius: 8,
                  padding: "7px 12px 7px 30px", fontSize: 12, outline: "none", width: 200,
                }}
              />
            </div>
            {/* Add button */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8,
              background: BLUE, color: "#fff", border: "none",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>+ Add Partner</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                {["Partner", "Contact", "Country", "Services", "Users", "Revenue", "Status", "Last Active", ""].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "8px 12px",
                    fontSize: 10, fontWeight: 700, color: SLATE,
                    textTransform: "uppercase", letterSpacing: ".8px",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                  onClick={() => setSelected(p)}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Partner name + id */}
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                        background: `linear-gradient(135deg, ${BLUE}22, ${BLUE}44)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: BLUE,
                      }}>{p.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 12 }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: SLATE, fontFamily: "monospace" }}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "11px 12px", color: "#334155" }}>{p.contact}</td>
                  <td style={{ padding: "11px 12px", fontSize: 14 }}>{FLAG[p.country]} {p.country}</td>
                  <td style={{ padding: "11px 12px", fontWeight: 700, color: BLUE, textAlign: "center" }}>{p.services}</td>
                  <td style={{ padding: "11px 12px", fontWeight: 700, color: VIOLET, textAlign: "center" }}>{p.users}</td>
                  <td style={{ padding: "11px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155" }}>{p.revenue}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px",
                      borderRadius: 20, textTransform: "capitalize",
                      background: STATUS_BG(p.status),
                      color: STATUS_TEXT(p.status),
                    }}>{p.status}</span>
                  </td>
                  <td style={{ padding: "11px 12px", color: SLATE, fontSize: 11 }}>{p.lastActive}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(p); }}
                      style={{
                        padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                        border: "1px solid #e2e8f0", background: "#f8fafc",
                        fontSize: 11, fontWeight: 600, color: "#64748b",
                      }}>View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: SLATE, fontSize: 13 }}>
                    No partners match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div style={{ marginTop: 12, fontSize: 11, color: SLATE }}>
          Showing {filtered.length} of {PARTNER_ROWS.length} partners
        </div>
      </Card>

      {/* Detail modal */}
      {selected && <PartnerModal partner={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
