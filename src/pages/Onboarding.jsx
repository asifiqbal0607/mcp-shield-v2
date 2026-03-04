import { useState } from "react";

const T = "#0d9488";
const ROSE = "#ef4444";

// ─── Reusable form primitives ─────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label
      className="onb-label"
    >
      {children} {required && <span className="txt-danger">*</span>}
    </label>
  );
}

function HelpText({ children }) {
  return (
    <p
      className="onb-hint"
    >
      {children}
    </p>
  );
}

function Input({ placeholder, style }) {
  return (
    <input
      placeholder={placeholder}
      className="onb-input"
      onFocus={(e) => (e.currentTarget.style.borderColor = T)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    />
  );
}

function Select({ placeholder }) {
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
    </select>
  );
}

function RadioGroup({ options, name }) {
  const [val, setVal] = useState(options[0]);
  return (
    <div className="onb-tag-row">
      {options.map((o) => (
        <label
          key={o}
          className={`onb-tag ${val === o ? 'active' : 'inactive'}`}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={val === o}
            onChange={() => setVal(o)}
            className="hidden"
          />
          {o}
        </label>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="onb-divider" />;
}

function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="onb-btn-next"
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
      className="onb-card"
    >
      <div
        className="onb-step-row"
      >
        <div
          className="onb-step-num"
        >
          {step}
        </div>
        <div className="flex-1">
          <div className="flex-center gap-8">
            <span className="onb-step-title">
              {title}
            </span>
            {optional && (
              <span
                className="onb-step-badge"
              >
                Optional
              </span>
            )}
          </div>
          {subtitle && (
            <div className="onb-step-sub">
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
        className="onb-dark-banner"
      >
        <div
          className="onb-dark-eyebrow"
        >
          MCP Shield · Partner Portal
        </div>
        <div
          className="onb-dark-title"
        >
          New Service Onboarding
        </div>
        <div className="onb-dark-sub">
          Configure your service details using the form below ·{" "}
          <span
            className="onb-link"
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
        <div className="onb-mb-16">
          <Label required>Service Name</Label>
          <Input placeholder="e.g. GameZone UK MTN · Newsscape NG Airtel" />
          <HelpText>
            Choose a descriptive name that identifies this specific service. If
            you have multiple services, use clear naming conventions (e.g.,
            'GameZone UK MTN', 'Newsscape NG Airtel').
          </HelpText>
        </div>
        <Divider />
        <div className="g-halves mb-section">
          <div>
            <Label>Short Code</Label>
            <Input placeholder="Enter short code" />
            <HelpText>
              Enter a unique short code identifier for this service.
            </HelpText>
          </div>
          <div>
            <Label required>CSP/Merchant Name</Label>
            <div className="f-gap-8">
              <div className="flex-1">
                <Select placeholder="Select…" />
              </div>
              <button
                className="onb-btn-submit"
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
        <div className="g-halves mb-section">
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
            <div className="f-gap-8">
              <div className="flex-1">
                <Select placeholder="Select…" />
              </div>
              <button
                className="onb-btn-submit"
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
        <div className="g-halves">
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
        <div className="g-stats3" className="onb-gap-16 onb-mb-16">
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
        <div className="onb-mb-16">
          <Label required>Number of HTML Pages in Flow</Label>
          <Input placeholder="1" className="w-80" />
          <HelpText>
            Count the number of web pages (HTML documents) in your subscription
            flow. This includes the landing page and any subsequent pages before
            payment completion.
          </HelpText>
        </div>

        {/* Page 1 URLs */}
        <div
          className="onb-card-sm"
        >
          <Label>Page 1 URL(s)</Label>
          {urls1.map((_, i) => (
            <div key={i} className="mb-8">
              <Input placeholder="Enter a landing page URL for this page" />
            </div>
          ))}
          <AddButton onClick={() => setUrls1([...urls1, ""])}>
            + Add Another URL for Page 1
          </AddButton>
        </div>

        {/* Page 2 URLs */}
        <div
          className="onb-card-sm"
        >
          <Label>Page 2 URL(s)</Label>
          {urls2.map((_, i) => (
            <div key={i} className="mb-8">
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
        <div className="g-halves mb-section">
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
          className="onb-card-sm"
        >
          <div
            className="onb-note-bold"
          >
            Payment Flow Options
          </div>
          <div className="onb-note-body">
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
        <div className="mt-12">
          {ips.map((_, i) => (
            <div key={i} className="mb-8">
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
        <div className="mb-18">
          <Label>Custom URL Parameters to Track</Label>
          <Input placeholder="eg. revenue_id" />
          {params.map((_, i) => (
            <div key={i} className="mt-8">
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
        <div className="mb-18">
          <Label>Custom Referrers (Referrer URL Parameters)</Label>
          <Input placeholder="eg. ref_source" />
          {referrers.map((_, i) => (
            <div key={i} className="mt-8">
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
            <div key={i} className="mt-8">
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
          className="onb-card-sm-dashed"
        >
          <div
            className="onb-note"
          >
            This area will auto-generate a description of the service
            configuration once fields are completed. You can edit the text if
            needed, but ensure it remains accurate as this will be used by our
            operations team.
          </div>
        </div>
        <label
          className="onb-check-row"
        >
          <input type="checkbox" className="onb-check-accent" />
          <span className="onb-check-text">
            I confirm that the service summary above accurately describes my
            service configuration and I understand that Shield will enforce
            these parameters for fraud detection.
          </span>
        </label>
      </FormSection>

      {/* ── Footer actions ── */}
      <div
        className="onb-footer"
      >
        <button
          onClick={() => setPage && setPage("services")}
          className="onb-btn-back"
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
        >
          ← Cancel
        </button>
        <div className="onb-footer-btn-group">
          <button
            className="onb-btn-next"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdfa")}
          >
            Save as Profile
          </button>
          <button
            className="onb-btn-submit"
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
