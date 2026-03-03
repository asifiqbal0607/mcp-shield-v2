import { useState } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

// ─── Reusable form primitives ─────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 5,
      }}
    >
      {children} {required && <span style={{ color: ROSE }}>*</span>}
    </label>
  );
}

function HelpText({ children }) {
  return (
    <p
      style={{
        margin: "4px 0 0",
        fontSize: 11,
        color: "#94a3b8",
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  );
}

function Input({ placeholder, style }) {
  return (
    <input
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        padding: "9px 12px",
        fontSize: 12,
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

function Select({ placeholder }) {
  return (
    <select
      defaultValue=""
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        padding: "9px 12px",
        fontSize: 12,
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
    </select>
  );
}

function RadioGroup({ options, name }) {
  const [val, setVal] = useState(options[0]);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
      {options.map((o) => (
        <label
          key={o}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 6,
            border: `1.5px solid ${val === o ? T : "#e2e8f0"}`,
            background: val === o ? "#f0fdfa" : "#f8fafc",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: val === o ? T : "#64748b",
            transition: "all .12s",
          }}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={val === o}
            onChange={() => setVal(o)}
            style={{ display: "none" }}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#f1f5f9", margin: "18px 0" }} />;
}

function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 6,
        border: `1.5px solid ${T}`,
        background: "#f0fdfa",
        color: T,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        marginTop: 10,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdfa")}
    >
      {children}
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function FormSection({ id, step, title, subtitle, optional, children }) {
  return (
    <div
      id={id}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e8ecf3",
        padding: "26px 30px",
        marginBottom: 16,
        boxShadow: "0 1px 6px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${T}, #0891b2)`,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 4px 12px ${T}40`,
          }}
        >
          {step}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
              {title}
            </span>
            {optional && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 9px",
                  borderRadius: 10,
                  background: "#f1f5f9",
                  color: "#94a3b8",
                  fontWeight: 600,
                }}
              >
                Optional
              </span>
            )}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PageOnboarding({ setPage }) {
  const [urls1, setUrls1] = useState([""]);
  const [urls2, setUrls2] = useState([""]);
  const [ips, setIps] = useState([""]);
  const [params, setParams] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [variables, setVariables] = useState([]);
  return (
    <div>
      {/* Page header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a3050 100%)",
          borderRadius: 14,
          padding: "26px 32px",
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
          MCP Shield · Partner Portal
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          New Service Onboarding
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
          Configure your service details using the form below ·{" "}
          <span
            style={{ color: T, cursor: "pointer", textDecoration: "underline" }}
          >
            User guide
          </span>
        </div>
      </div>

      {/* ── Load Service Flow Profile ── */}
      <FormSection id="s0" step="↗" title="Load Service Flow Profile" optional>
        <Label>Select a Profile</Label>
        <Select placeholder="Select a profile…" />
        <HelpText>
          Select a saved profile to pre-fill form fields with common
          configuration patterns.
        </HelpText>
      </FormSection>

      {/* ── 1 Basic Information ── */}
      <FormSection
        id="s1"
        step="1"
        title="Basic Information"
        subtitle="Core identifiers for your service"
      >
        <div style={{ marginBottom: 16 }}>
          <Label required>Service Name</Label>
          <Input placeholder="e.g. GameZone UK MTN · Newsscape NG Airtel" />
          <HelpText>
            Choose a descriptive name that identifies this specific service. If
            you have multiple services, use clear naming conventions (e.g.,
            'GameZone UK MTN', 'Newsscape NG Airtel').
          </HelpText>
        </div>
        <Divider />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <Label>Short Code</Label>
            <Input placeholder="Enter short code" />
            <HelpText>
              Enter a unique short code identifier for this service.
            </HelpText>
          </div>
          <div>
            <Label required>CSP/Merchant Name</Label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Select placeholder="Select…" />
              </div>
              <button
                style={{
                  padding: "9px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: T,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
            <HelpText>
              Select the Content Service Provider or Merchant who owns this
              service. If not listed, click 'Add New CSP' to add one.
            </HelpText>
          </div>
        </div>
        <div>
          <Label>Type of Service</Label>
          <Select placeholder="Select…" />
          <HelpText>
            Categorize your service type. This helps with analytics and
            benchmarking. Select 'Other' if none fit.
          </HelpText>
        </div>
      </FormSection>

      {/* ── 2 Geographic & Network Configuration ── */}
      <FormSection
        id="s2"
        step="2"
        title="Geographic & Network Configuration"
        subtitle="Location and carrier settings"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <Label required>Country</Label>
            <Select placeholder="Select country…" />
            <HelpText>
              Select the country where this service operates. This determines
              available mobile network operators.
            </HelpText>
          </div>
          <div>
            <Label required>Mobile Network Operator (MNO)</Label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Select placeholder="Select…" />
              </div>
              <button
                style={{
                  padding: "9px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: T,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
            <HelpText>
              Select the mobile network operator for this service. If your MNO
              is not listed, click '+' to add a custom one.
            </HelpText>
          </div>
        </div>
        <Divider />
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <Label>Time Zone</Label>
            <Select placeholder="UTC+03:00 – Asia/Baghdad" />
            <HelpText>
              Select the timezone for your service. This is used for reporting
              and analytics.
            </HelpText>
          </div>
          <div>
            <Label required>Carrier Grade NAT</Label>
            <RadioGroup options={["Yes", "No", "I Don't Know"]} name="cgn" />
            <HelpText>
              Carrier Grade NAT (CGN) means multiple subscribers share the same
              public IP address. Select 'Yes' if you know the MNO uses CGN, or
              if you've noticed many subscribers appearing to use identical IP
              addresses.
            </HelpText>
          </div>
        </div>
      </FormSection>

      {/* ── 3 Service Flow Configuration ── */}
      <FormSection
        id="s3"
        step="3"
        title="Service Flow Configuration"
        subtitle="Shield mode, enrichment and page flow settings"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <Label required>Shield Mode</Label>
            <Select placeholder="Standard" />
            <HelpText>
              Select the Shield mode. Standard will protect your service from
              fraud. Monitor will only track but not block suspicious activity.
            </HelpText>
          </div>
          <div>
            <Label required>Header Enriched Flow</Label>
            <RadioGroup options={["Yes", "No"]} name="hef" />
            <HelpText>
              Header Enrichment means the mobile operator injects the
              subscriber's phone number (MSISDN) into HTTP headers. This enables
              one-click or two-click subscription flows without manual PIN
              entry.
            </HelpText>
          </div>
          <div>
            <Label required>LP Redirection</Label>
            <RadioGroup options={["Yes", "No"]} name="lpr" />
            <HelpText>
              Specify whether your landing page implements redirection rules for
              traffic routing.
            </HelpText>
          </div>
        </div>
        <Divider />
        <div style={{ marginBottom: 16 }}>
          <Label required>Number of HTML Pages in Flow</Label>
          <Input placeholder="1" style={{ width: 80 }} />
          <HelpText>
            Count the number of web pages (HTML documents) in your subscription
            flow. This includes the landing page and any subsequent pages before
            payment completion.
          </HelpText>
        </div>

        {/* Page 1 URLs */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "16px 18px",
            marginBottom: 12,
            border: "1px solid #e8ecf3",
          }}
        >
          <Label>Page 1 URL(s)</Label>
          {urls1.map((_, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <Input placeholder="Enter a landing page URL for this page" />
            </div>
          ))}
          <AddButton onClick={() => setUrls1([...urls1, ""])}>
            + Add Another URL for Page 1
          </AddButton>
        </div>

        {/* Page 2 URLs */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "16px 18px",
            border: "1px solid #e8ecf3",
          }}
        >
          <Label>Page 2 URL(s)</Label>
          {urls2.map((_, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <Input placeholder="Enter a landing page URL for this page" />
            </div>
          ))}
          <AddButton onClick={() => setUrls2([...urls2, ""])}>
            + Add Another URL for Page 2
          </AddButton>
        </div>
      </FormSection>

      {/* ── 4 Multi-Page Configuration ── */}
      <FormSection
        id="s4"
        step="4"
        title="Multi-Page Configuration"
        subtitle="Hosting and Shield placement across pages"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <Label required>Page 1 Hosted By</Label>
            <Select placeholder="Select…" />
            <HelpText>
              Specify who hosts/controls each page in your flow.
            </HelpText>
          </div>
          <div>
            <Label required>Page 2 Hosted By</Label>
            <Select placeholder="Select…" />
            <HelpText>
              Specify who hosts/controls each page in your flow.
            </HelpText>
          </div>
        </div>
        <div>
          <Label required>Page(s) Where Shield is Implemented</Label>
          <Select placeholder="Select an option" />
          <HelpText>
            Select all pages where the Shield JavaScript snippet is integrated.
            For maximum protection, we recommend integrating Shield on all
            pages.
          </HelpText>
        </div>
      </FormSection>

      {/* ── 5 Payment Flows ── */}
      <FormSection
        id="s5"
        step="5"
        title="Payment Flows"
        subtitle="Configure payment flow settings"
      >
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "18px 20px",
            border: "1px solid #e8ecf3",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#475569",
              marginBottom: 6,
            }}
          >
            Payment Flow Options
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
            Payment flow configuration will be available after selecting your
            MNO and service type above.
          </div>
        </div>
      </FormSection>

      {/* ── 6 IP Details ── */}
      <FormSection
        id="s6"
        step="6"
        title="IP Details"
        subtitle="Your IPs to use with the API"
      >
        <HelpText>
          Your Server IP. You will use it to get response from Shield API.
        </HelpText>
        <div style={{ marginTop: 12 }}>
          {ips.map((_, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <Input placeholder="0.0.0.0" />
            </div>
          ))}
          <AddButton onClick={() => setIps([...ips, ""])}>+ Add IP</AddButton>
        </div>
      </FormSection>

      {/* ── 7 Advanced Tracking ── */}
      <FormSection
        id="s7"
        step="7"
        title="Advanced Tracking"
        subtitle="Custom URL parameters, referrers and API variables"
        optional
      >
        <div style={{ marginBottom: 18 }}>
          <Label>Custom URL Parameters to Track</Label>
          <Input placeholder="eg. revenue_id" />
          {params.map((_, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <Input placeholder="eg. revenue_id" />
            </div>
          ))}
          <HelpText>
            Specify URL parameter names you want Shield to extract and display
            in your dashboard. Common examples: campaign ID, traffic source,
            affiliate ID.
          </HelpText>
          <AddButton onClick={() => setParams([...params, ""])}>
            + Add Parameter
          </AddButton>
        </div>
        <Divider />
        <div style={{ marginBottom: 18 }}>
          <Label>Custom Referrers (Referrer URL Parameters)</Label>
          <Input placeholder="eg. ref_source" />
          {referrers.map((_, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <Input placeholder="eg. ref_source" />
            </div>
          ))}
          <HelpText>
            Specify URL parameter names from the referrer URL. Note: Due to
            browser privacy protections, these are typically only available for
            same-origin navigation.
          </HelpText>
          <AddButton onClick={() => setReferrers([...referrers, ""])}>
            + Add Referrer
          </AddButton>
        </div>
        <Divider />
        <div>
          <Label>Shield API Variables</Label>
          <Input placeholder="eg. user_attribute_age" />
          {variables.map((_, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <Input placeholder="eg. user_attribute_age" />
            </div>
          ))}
          <HelpText>
            If you pass additional variables via the Shield API (server-side
            integration), list them here. Shield will automatically extract
            these variables and create separate analytics graphs for each.
          </HelpText>
          <AddButton onClick={() => setVariables([...variables, ""])}>
            + Add Variable
          </AddButton>
        </div>
      </FormSection>

      {/* ── 8 Service Summary ── */}
      <FormSection
        id="s8"
        step="8"
        title="Service Summary"
        subtitle="Auto-generated — review before saving"
      >
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "18px 20px",
            border: "1px dashed #cbd5e1",
            minHeight: 80,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            This area will auto-generate a description of the service
            configuration once fields are completed. You can edit the text if
            needed, but ensure it remains accurate as this will be used by our
            operations team.
          </div>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginTop: 18,
            cursor: "pointer",
          }}
        >
          <input type="checkbox" style={{ marginTop: 3, accentColor: T }} />
          <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
            I confirm that the service summary above accurately describes my
            service configuration and I understand that Shield will enforce
            these parameters for fraud detection.
          </span>
        </label>
      </FormSection>

      {/* ── Footer actions ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e8ecf3",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.06)",
          marginBottom: 30,
        }}
      >
        <button
          onClick={() => setPage && setPage("services")}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
        >
          ← Cancel
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              border: `1.5px solid ${T}`,
              background: "#f0fdfa",
              color: T,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdfa")}
          >
            Save as Profile
          </button>
          <button
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg, ${T}, #0891b2)`,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${T}55`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Save Service →
          </button>
        </div>
      </div>
    </div>
  );
}
