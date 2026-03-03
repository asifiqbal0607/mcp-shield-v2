import { useState } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

const PERMISSIONS = [
  { key: "allowedTrafficCheck",    label: "Allowed Traffic Check"    },
  { key: "allowedSubAccount",      label: "Allowed Sub Account"      },
  { key: "enableVTXProcessing",    label: "Enable VTX Processing"    },
  { key: "allowVerifyTrx",         label: "Allow Verify Trx"         },
  { key: "allowRedirectFlow",      label: "Allow Redirect Flow"      },
  { key: "allowPaymentManager",    label: "Allow Payment Manager"    },
  { key: "allowMsisdnSearch",      label: "Allow Msisdn Search"      },
  { key: "allowPerformanceMatrix", label: "Allow Performance Matrix" },
  { key: "dualBlockAPI",           label: "Dual Block API"           },
  { key: "forceClear",             label: "Force Clear"              },
];

const ACCOUNT_TYPES = [
  "Supper Client", "Client", "Admin", "C - Admin",
  "Publisher", "Operation Admin", "Client Partner",
];

// ─── Reusable primitives ──────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
      {children}{required && <span style={{ color: ROSE, marginLeft: 2 }}>*</span>}
    </label>
  );
}

function Input({ placeholder, type = "text", value, onChange, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${focused ? T : "#e2e8f0"}`, borderRadius: 8, padding: right ? "10px 44px 10px 12px" : "10px 12px", fontSize: 13, color: "#334155", outline: "none", background: "#fff", transition: "border-color .15s" }}
      />
      {right && <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>{right}</div>}
    </div>
  );
}

function Textarea({ placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      rows={3}
      style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${focused ? T : "#e2e8f0"}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#334155", outline: "none", background: "#fff", resize: "vertical", transition: "border-color .15s" }}
    />
  );
}

function Select({ placeholder, options, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${focused ? T : "#e2e8f0"}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: value ? "#334155" : "#94a3b8", outline: "none", background: "#fff", cursor: "pointer", transition: "border-color .15s" }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#334155", fontWeight: checked ? 700 : 500 }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ accentColor: T, width: 14, height: 14 }} />
      {label}
    </label>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf3", padding: "22px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      {title && <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>{title}</div>}
      {children}
    </div>
  );
}

// ─── Email row (supports multiple) ───────────────────────────────────────────
function EmailRow({ emails, setEmails }) {
  return (
    <div>
      {emails.map((email, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < emails.length - 1 ? 8 : 0 }}>
          <div style={{ flex: 1 }}>
            <Input placeholder="Enter email" type="email" value={email} onChange={(e) => {
              const next = [...emails]; next[i] = e.target.value; setEmails(next);
            }} />
          </div>
          {emails.length > 1 && (
            <button onClick={() => setEmails(emails.filter((_, j) => j !== i))}
              style={{ width: 36, height: 40, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>×</button>
          )}
        </div>
      ))}
      <button onClick={() => setEmails([...emails, ""])}
        style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: `1.5px solid ${T}`, background: "#f0fdfa", color: T, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdfa")}
      >+ Add More</button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PageUserOnboarding({ setPage }) {
  const [showPwd, setShowPwd] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [permissions, setPermissions] = useState(
    Object.fromEntries(PERMISSIONS.map(p => [p.key, p.key === "allowedTrafficCheck" ? "yes" : "no"]))
  );
  const [accountType, setAccountType] = useState("Supper Client");
  const [environment, setEnvironment] = useState("trial");

  const [form, setForm] = useState({ name: "", username: "", password: "", description: "", timezone: "", cadmin: "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const TIMEZONES = ["UTC-12:00","UTC-11:00","UTC-10:00","UTC-09:00","UTC-08:00","UTC-07:00","UTC-06:00","UTC-05:00","UTC-04:00","UTC-03:00","UTC-02:00","UTC-01:00","UTC+00:00","UTC+01:00","UTC+02:00","UTC+03:00","UTC+04:00","UTC+05:00","UTC+05:30","UTC+06:00","UTC+07:00","UTC+08:00","UTC+09:00","UTC+10:00","UTC+11:00","UTC+12:00"];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a3050 100%)", borderRadius: 14, padding: "22px 28px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.15)" }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: T, marginBottom: 8 }}>MCP Shield · User Management</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Add User</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 5 }}>Create a new user account and configure their access permissions.</div>
      </div>

      {/* ── Basic Info ── */}
      <SectionCard>
        <div className="g-halves" style={{ gap: 16 }}>
          <div>
            <Label required>Name</Label>
            <Input placeholder="Name" value={form.name} onChange={set("name")} />
          </div>
          <div>
            <Label required>Email</Label>
            <EmailRow emails={emails} setEmails={setEmails} />
          </div>
          <div>
            <Label required>Username</Label>
            <Input placeholder="Username" value={form.username} onChange={set("username")} />
          </div>
          <div>
            <Label required>Password</Label>
            <Input
              placeholder="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              right={
                <button onClick={() => setShowPwd(s => !s)}
                  style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: T, color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              }
            />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Label>Description</Label>
          <Textarea placeholder="Description" value={form.description} onChange={set("description")} />
        </div>
        <div style={{ marginTop: 16 }}>
          <Label>Time Zone</Label>
          <Select placeholder="Select from the list" options={TIMEZONES} value={form.timezone} onChange={set("timezone")} />
        </div>
      </SectionCard>

      {/* ── Permissions ── */}
      <SectionCard title="Permissions">
        <div className="g-perms5">
          {PERMISSIONS.map(p => (
            <div key={p.key} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e8ecf3" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 10, lineHeight: 1.4 }}>{p.label}</div>
              <div style={{ display: "flex", gap: 12 }}>
                <Radio name={p.key} value="yes" checked={permissions[p.key] === "yes"} onChange={() => setPermissions(prev => ({ ...prev, [p.key]: "yes" }))} label="Yes" />
                <Radio name={p.key} value="no"  checked={permissions[p.key] === "no"}  onChange={() => setPermissions(prev => ({ ...prev, [p.key]: "no"  }))} label="No"  />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Account Type ── */}
      <SectionCard title="Account Type">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {ACCOUNT_TYPES.map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${accountType === t ? T : "#e2e8f0"}`, background: accountType === t ? "#f0fdfa" : "#f8fafc", cursor: "pointer", fontSize: 13, fontWeight: accountType === t ? 700 : 500, color: accountType === t ? T : "#64748b", transition: "all .12s" }}>
              <input type="radio" name="accountType" value={t} checked={accountType === t} onChange={() => setAccountType(t)} style={{ accentColor: T }} />
              {t}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Label>C Admins</Label>
          <Select placeholder="Select from the list" options={["Admin One", "Admin Two", "Admin Three"]} value={form.cadmin} onChange={set("cadmin")} />
        </div>

        <div>
          <Label>Environment</Label>
          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            <Radio name="environment" value="trial" checked={environment === "trial"} onChange={() => setEnvironment("trial")} label="Trial" />
            <Radio name="environment" value="live"  checked={environment === "live"}  onChange={() => setEnvironment("live")}  label="Live"  />
          </div>
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
        <button
          style={{ padding: "10px 32px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${T}, #0891b2)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${T}50` }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >Save</button>
        <button
          onClick={() => setPage && setPage("users")}
          style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
        >Cancel</button>
      </div>

    </div>
  );
}
