import { useState, useEffect } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

// ── Primitives ────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#1e293b",
        marginBottom: 5,
      }}
    >
      {children}
      {required && <span style={{ color: ROSE }}> *</span>}
    </label>
  );
}

function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  extraStyle = {},
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "9px 12px",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        fontSize: 13,
        color: "#334155",
        outline: "none",
        background: "#fff",
        transition: "border-color 0.15s",
        ...extraStyle,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = T)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    />
  );
}

function SelectField({ placeholder, options = [], value, onChange }) {
  return (
    <select
      value={value ?? ""}
      onChange={onChange}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "9px 36px 9px 12px",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        fontSize: 13,
        color: value ? "#334155" : "#94a3b8",
        outline: "none",
        background: "#fff",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        cursor: "pointer",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = T)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #f0f4f8", margin: "18px 0" }} />;
}

function YesNo({ name, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
      {["Yes", "No"].map((o) => (
        <label
          key={o}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            fontSize: 12,
            color: "#475569",
          }}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            style={{ accentColor: T, cursor: "pointer", width: 13, height: 13 }}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PERMISSIONS = [
  {
    key: "allowedTrafficCheck",
    label: "Allowed Traffic Check",
    default: "Yes",
  },
  { key: "allowedSubAccount", label: "Allowed Sub Account", default: "No" },
  { key: "enableVTXProcessing", label: "Enable VTX Processing", default: "No" },
  { key: "allowVerifyTrx", label: "Allow Verify Trx", default: "No" },
  { key: "allowRedirectFlow", label: "Allow Redirect Flow", default: "Yes" },
  { key: "allowPaymentManager", label: "Allow Payment Manager", default: "No" },
  { key: "allowMsisdnSearch", label: "Allow Msisdn Search", default: "No" },
  {
    key: "allowPerformanceMatrix",
    label: "Allow Performance Materix",
    default: "Yes",
  },
  { key: "dualBlockAPI", label: "Dual Block API", default: "No" },
  { key: "forceClear", label: "Force CLear", default: "No" },
];

const ACCOUNT_TYPES = [
  "Supper Client",
  "Client",
  "Admin",
  "C - Admin",
  "Publisher",
  "Operation Admin",
  "Client Partner",
];
const TIMEZONES = [
  "UTC-12:00",
  "UTC-08:00",
  "UTC-05:00",
  "UTC+00:00",
  "UTC+03:00",
  "UTC+05:30",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+12:00",
];

// ── Form body (shared by both modal and standalone) ───────────────────────────
function OnboardingForm({ onClose, setPage }) {
  const [name, setName] = useState("");
  const [emails, setEmails] = useState([""]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("");
  const [accountType, setAccountType] = useState("Supper Client");
  const [mode, setMode] = useState("Trial");
  const [perms, setPerms] = useState(
    Object.fromEntries(PERMISSIONS.map((p) => [p.key, p.default])),
  );

  const addEmail = () => setEmails((p) => [...p, ""]);
  const updateEmail = (i, v) =>
    setEmails((p) => p.map((e, idx) => (idx === i ? v : e)));
  const handleClose = () => {
    if (onClose) onClose();
    else if (setPage) setPage("users");
  };

  // ── Responsive column helper ──
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    setNarrow(mq.matches);
    const l = (e) => setNarrow(e.matches);
    mq.addEventListener("change", l);
    return () => mq.removeEventListener("change", l);
  }, []);

  const field = { marginBottom: 14 };

  return (
    <>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px 14px",
          borderBottom: "1px solid #f0f4f8",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 2,
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Add User
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            Fill in the details to create a new user account
          </div>
        </div>
        <button
          onClick={handleClose}
          title="Close"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#64748b",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.color = ROSE;
            e.currentTarget.style.borderColor = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
        {/* Name */}
        <div style={field}>
          <Label required>Name</Label>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div style={field}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Label required>Email</Label>
            <button
              onClick={addEmail}
              style={{
                padding: "5px 12px",
                background: T,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              + Add More
            </button>
          </div>
          {emails.map((email, i) => (
            <div
              key={i}
              style={{ marginBottom: i < emails.length - 1 ? 8 : 0 }}
            >
              <Input
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => updateEmail(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Username */}
        <div style={field}>
          <Label required>Username</Label>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div style={field}>
          <Label required>Password</Label>
          <div style={{ position: "relative" }}>
            <Input
              placeholder="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              extraStyle={{ paddingRight: 46 }}
            />
            <button
              onClick={() => setShowPw((s) => !s)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 42,
                background: T,
                border: "none",
                borderRadius: "0 7px 7px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#fff",
              }}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={field}>
          <Label>Description</Label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: 7,
              fontSize: 13,
              color: "#334155",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = T)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Time Zone */}
        <div style={field}>
          <Label>Time Zone</Label>
          <SelectField
            placeholder="Select from the list"
            options={TIMEZONES}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>

        <Divider />

        {/* Permissions */}
        <div style={{ marginBottom: 4 }}>
          <Label>Permissions</Label>
          <div
            style={{
              overflowX: "auto",
              marginTop: 8,
              border: "1px solid #f0f4f8",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", minWidth: "max-content" }}>
              {PERMISSIONS.map((p, idx) => (
                <div
                  key={p.key}
                  style={{
                    minWidth: 118,
                    padding: "10px 14px",
                    borderRight:
                      idx < PERMISSIONS.length - 1
                        ? "1px solid #f0f4f8"
                        : "none",
                    background: idx % 2 === 0 ? "#fafcff" : "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#475569",
                      whiteSpace: "nowrap",
                      lineHeight: 1.3,
                    }}
                  >
                    {p.label}
                  </div>
                  <YesNo
                    name={p.key}
                    value={perms[p.key]}
                    onChange={(v) =>
                      setPerms((prev) => ({ ...prev, [p.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* Account Type */}
        <div style={{ marginBottom: 16 }}>
          <Label>Account Type</Label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: narrow ? 10 : 16,
              marginTop: 8,
            }}
          >
            {ACCOUNT_TYPES.map((t) => (
              <label
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#334155",
                }}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={t}
                  checked={accountType === t}
                  onChange={() => setAccountType(t)}
                  style={{
                    accentColor: T,
                    cursor: "pointer",
                    width: 14,
                    height: 14,
                  }}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* C Admins */}
        <div style={{ marginBottom: 16 }}>
          <Label>C Admins</Label>
          <SelectField placeholder="Select from the list" options={[]} />
        </div>

        {/* Trial / Live */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 20 }}>
            {["Trial", "Live"].map((m) => (
              <label
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#334155",
                }}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  style={{
                    accentColor: T,
                    cursor: "pointer",
                    width: 14,
                    height: 14,
                  }}
                />
                {m}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "14px 24px",
          borderTop: "1px solid #f0f4f8",
          background: "#fafcff",
          borderRadius: "0 0 12px 12px",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            padding: "9px 26px",
            background: T,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Save
        </button>
        <button
          onClick={handleClose}
          style={{
            padding: "9px 26px",
            background: "#fff",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
export function AddUserModal({ onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.45)",
          backdropFilter: "blur(3px)",
          zIndex: 999,
        }}
      />
      {/* Modal box */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(780px, 95vw)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <OnboardingForm onClose={onClose} />
      </div>
    </>
  );
}

// ── Standalone page (kept for backward compat) ────────────────────────────────
export default function PageOnboardingUsers({ setPage }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        maxWidth: 860,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <OnboardingForm setPage={setPage} />
    </div>
  );
}
