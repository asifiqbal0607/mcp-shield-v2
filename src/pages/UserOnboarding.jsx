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
    <label className="onb-label-lg">
      {children}{required && <span className="txt-danger">*</span>}
    </label>
  );
}

function Input({ placeholder, type = "text", value, onChange, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="onb-input-pw-wrap">
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="onb-input" style={{ '--bdr': focused ? T : '#e2e8f0' }}
      />
      {right && <div className="onb-pw-toggle">{right}</div>}
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
      className="onb-input" style={{ '--bdr': focused ? T : '#e2e8f0' }}
    />
  );
}

function Select({ placeholder, options, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className="onb-input" style={{ '--bdr': focused ? T : '#e2e8f0' }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className="onb-select-opt">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="onb-radio-accent" />
      {label}
    </label>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="onb-card-lg">
      {title && <div className="onb-step-title">{title}</div>}
      {children}
    </div>
  );
}

// ─── Email row (supports multiple) ───────────────────────────────────────────
function EmailRow({ emails, setEmails }) {
  return (
    <div>
      {emails.map((email, i) => (
        <div key={i} className="onb-email-row">
          <div className="flex-1">
            <Input placeholder="Enter email" type="email" value={email} onChange={(e) => {
              const next = [...emails]; next[i] = e.target.value; setEmails(next);
            }} />
          </div>
          {emails.length > 1 && (
            <button onClick={() => setEmails(emails.filter((_, j) => j !== i))}
              className="onb-email-del-btn">×</button>
          )}
        </div>
      ))}
      <button onClick={() => setEmails([...emails, ""])}
        className="onb-add-tag-btn onb-tag active"
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
    <div className="onb-max-container">

      {/* Page header */}
      <div className="onb-dark-banner">
        <div className="onb-dark-eyebrow">MCP Shield · User Management</div>
        <div className="onb-dark-title">Add User</div>
        <div className="onb-dark-sub">Create a new user account and configure their access permissions.</div>
      </div>

      {/* ── Basic Info ── */}
      <SectionCard>
        <div className="g-halves" className="onb-gap-16">
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
                  className="onb-step-num">
                  {showPwd ? "🙈" : "👁"}
                </button>
              }
            />
          </div>
        </div>
        <div className="mt-16">
          <Label>Description</Label>
          <Textarea placeholder="Description" value={form.description} onChange={set("description")} />
        </div>
        <div className="mt-16">
          <Label>Time Zone</Label>
          <Select placeholder="Select from the list" options={TIMEZONES} value={form.timezone} onChange={set("timezone")} />
        </div>
      </SectionCard>

      {/* ── Permissions ── */}
      <SectionCard title="Permissions">
        <div className="g-perms5">
          {PERMISSIONS.map(p => (
            <div key={p.key} className="onb-services-grid">
              <div className="onb-services-hd">{p.label}</div>
              <div className="f-gap-12">
                <Radio name={p.key} value="yes" checked={permissions[p.key] === "yes"} onChange={() => setPermissions(prev => ({ ...prev, [p.key]: "yes" }))} label="Yes" />
                <Radio name={p.key} value="no"  checked={permissions[p.key] === "no"}  onChange={() => setPermissions(prev => ({ ...prev, [p.key]: "no"  }))} label="No"  />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Account Type ── */}
      <SectionCard title="Account Type">
        <div className="onb-select-row">
          {ACCOUNT_TYPES.map(t => (
            <label key={t} className={`onb-select-opt ${accountType === t ? 'active' : 'inactive'}`}>
              <input type="radio" name="accountType" value={t} checked={accountType === t} onChange={() => setAccountType(t)} className="onb-radio-accent" />
              {t}
            </label>
          ))}
        </div>

        <div className="onb-mb-16">
          <Label>C Admins</Label>
          <Select placeholder="Select from the list" options={["Admin One", "Admin Two", "Admin Three"]} value={form.cadmin} onChange={set("cadmin")} />
        </div>

        <div>
          <Label>Environment</Label>
          <div className="onb-gap-16">
            <Radio name="environment" value="trial" checked={environment === "trial"} onChange={() => setEnvironment("trial")} label="Trial" />
            <Radio name="environment" value="live"  checked={environment === "live"}  onChange={() => setEnvironment("live")}  label="Live"  />
          </div>
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div className="onb-action-row">
        <button
          className="onb-btn-submit"
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >Save</button>
        <button
          onClick={() => setPage && setPage("users")}
          className="onb-btn-back"
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
        >Cancel</button>
      </div>

    </div>
  );
}
