import { useState } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

function Label({ children, required }) {
  return (
    <label
      className="onb-label-lg"
    >
      {children} {required && <span className="txt-danger">*</span>}
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
      className="onb-input"
      onFocus={(e) => (e.currentTarget.style.borderColor = T)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    />
  );
}

function Select({ placeholder, options = [] }) {
  return (
    <select
      defaultValue=""
      className="onb-input"
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
  return <div className="onb-divider-lg" />;
}

function SectionTitle({ children }) {
  return (
    <div
      className="onb-step-title onb-mb-16"
    >
      {children}
    </div>
  );
}

// Yes/No radio toggle
function YesNo({ name, defaultValue = "No" }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="f-gap-12">
      {["Yes", "No"].map((o) => (
        <label
          key={o}
          className={`onb-mode-opt ${val === v ? 'active' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={val === o}
            onChange={() => setVal(o)}
            className="onb-radio-accent"
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
        className="onb-dark-banner"
      >
        <div
          className="onb-dark-eyebrow"
        >
          MCP Shield · User Management
        </div>
        <div className="onb-dark-title">
          Add New User
        </div>
        <div className="onb-dark-sub">
          Fill in the details below to create a new user account.
        </div>
      </div>

      {/* Form card */}
      <div
        className="onb-card-lg"
      >
        {/* ── Basic Info ── */}
        <SectionTitle>Basic Information</SectionTitle>
        <div className="g-halves mb-section">
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
        <div className="onb-mb-16">
          <div
            className="flex-between"
          >
            <Label required>Email</Label>
            <button
              onClick={addEmail}
              className="onb-btn-next"
            >
              + Add More
            </button>
          </div>
          {emails.map((email, i) => (
            <div
              key={i}
              style={{ '--mb': i < emails.length - 1 ? '8px' : '0' }}
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
        <div className="onb-mb-16">
          <Label required>Password</Label>
          <div className="onb-input-pw-wrap">
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="onb-input onb-input-pw"
            />
            <button
              onClick={() => setShowPassword((s) => !s)}
              className="onb-pw-toggle"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="onb-mb-16">
          <Label>Description</Label>
          <textarea
            placeholder="Description"
            className="onb-input"
            onFocus={(e) => (e.currentTarget.style.borderColor = T)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Time Zone */}
        <div className="mb-0">
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
        <div className="g-perms5">
          {PERMISSIONS.map((p) => (
            <div
              key={p.key}
              className="onb-services-grid"
            >
              <div
                className="onb-services-hd"
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
          className="onb-select-row"
        >
          {ACCOUNT_TYPES.map((t) => (
            <label
              key={t}
              className={`onb-select-opt ${accountType === t ? 'active' : 'inactive'}`}
            >
              <input
                type="radio"
                name="accountType"
                value={t}
                checked={accountType === t}
                onChange={() => setAccountType(t)}
                className="onb-radio-accent"
              />
              {t}
            </label>
          ))}
        </div>

        {/* ── C Admins ── */}
        <div className="mb-20">
          <Label>C Admins</Label>
          <Select placeholder="Select from the list" />
        </div>

        {/* ── Trial / Live ── */}
        <div className="mb-8">
          <div className="onb-mode-row">
            {["Trial", "Live"].map((m) => (
              <label
                key={m}
                className={`onb-mode-opt ${mode === m ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="onb-radio-accent"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── Footer ── */}
        <div className="onb-footer-btn-group">
          <button
            className="onb-btn-submit"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Save
          </button>
          <button
            onClick={() => setPage && setPage("users")}
            className="onb-btn-back"
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
