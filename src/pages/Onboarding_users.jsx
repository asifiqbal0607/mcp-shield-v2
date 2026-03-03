import { useState } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 6,
      }}
    >
      {children} {required && <span style={{ color: ROSE }}>*</span>}
    </label>
  );
}

function Input({ placeholder, type = "text", value, onChange, style }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        padding: "9px 12px",
        fontSize: 13,
        color: "#334155",
        outline: "none",
        background: "#fff",
        ...style,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = T)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    />
  );
}

function Select({ placeholder, options = [] }) {
  return (
    <select
      defaultValue=""
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        padding: "9px 12px",
        fontSize: 13,
        color: "#94a3b8",
        outline: "none",
        background: "#fff",
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
  return <div style={{ height: 1, background: "#f1f5f9", margin: "22px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#0f172a",
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

// Yes/No radio toggle
function YesNo({ name, defaultValue = "No" }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
      {["Yes", "No"].map((o) => (
        <label
          key={o}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: val === o ? T : "#64748b",
          }}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={val === o}
            onChange={() => setVal(o)}
            style={{ accentColor: T }}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

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

export default function PageOnboardingUsers({ setPage }) {
  const [emails, setEmails] = useState([""]);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("Supper Client");
  const [mode, setMode] = useState("Trial");

  const addEmail = () => setEmails((prev) => [...prev, ""]);
  const updateEmail = (i, val) =>
    setEmails((prev) => prev.map((e, idx) => (idx === i ? val : e)));

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a3050 100%)",
          borderRadius: 14,
          padding: "22px 32px",
          marginBottom: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,.15)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: T,
            marginBottom: 8,
          }}
        >
          MCP Shield · User Management
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>
          Add New User
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
          Fill in the details below to create a new user account.
        </div>
      </div>

      {/* Form card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e8ecf3",
          padding: "28px 32px",
          boxShadow: "0 1px 6px rgba(0,0,0,.04)",
        }}
      >
        {/* ── Basic Info ── */}
        <SectionTitle>Basic Information</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <Label required>Name</Label>
            <Input placeholder="Name" />
          </div>
          <div>
            <Label required>Username</Label>
            <Input placeholder="Username" />
          </div>
        </div>

        {/* Email + Add More */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Label required>Email</Label>
            <button
              onClick={addEmail}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                background: T,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
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

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <Label required>Password</Label>
          <div style={{ position: "relative" }}>
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              style={{ paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: T,
                color: "#fff",
                borderRadius: 5,
                width: 28,
                height: 28,
                cursor: "pointer",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <Label>Description</Label>
          <textarea
            placeholder="Description"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #e2e8f0",
              borderRadius: 7,
              padding: "9px 12px",
              fontSize: 13,
              color: "#334155",
              outline: "none",
              background: "#fff",
              resize: "vertical",
              minHeight: 70,
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = T)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Time Zone */}
        <div style={{ marginBottom: 0 }}>
          <Label>Time Zone</Label>
          <Select
            placeholder="Select from the list"
            options={[
              "UTC-12:00",
              "UTC-08:00",
              "UTC-05:00",
              "UTC+00:00",
              "UTC+03:00",
              "UTC+05:30",
              "UTC+08:00",
              "UTC+09:00",
              "UTC+12:00",
            ]}
          />
        </div>

        <Divider />

        {/* ── Permissions ── */}
        <SectionTitle>Permissions</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "14px 20px",
          }}
        >
          {PERMISSIONS.map((p) => (
            <div
              key={p.key}
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: "12px 14px",
                border: "1px solid #e8ecf3",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: 4,
                  lineHeight: 1.4,
                }}
              >
                {p.label}
              </div>
              <YesNo name={p.key} defaultValue={p.default} />
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Account Type ── */}
        <SectionTitle>Account Type</SectionTitle>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {ACCOUNT_TYPES.map((t) => (
            <label
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 8,
                border: `1.5px solid ${accountType === t ? T : "#e2e8f0"}`,
                background: accountType === t ? "#f0fdfa" : "#f8fafc",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: accountType === t ? T : "#64748b",
                transition: "all .12s",
              }}
            >
              <input
                type="radio"
                name="accountType"
                value={t}
                checked={accountType === t}
                onChange={() => setAccountType(t)}
                style={{ accentColor: T }}
              />
              {t}
            </label>
          ))}
        </div>

        {/* ── C Admins ── */}
        <div style={{ marginBottom: 20 }}>
          <Label>C Admins</Label>
          <Select placeholder="Select from the list" />
        </div>

        {/* ── Trial / Live ── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["Trial", "Live"].map((m) => (
              <label
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: mode === m ? T : "#64748b",
                }}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  style={{ accentColor: T }}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── Footer ── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg, ${T}, #0891b2)`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 14px ${T}50`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Save
          </button>
          <button
            onClick={() => setPage && setPage("users")}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
