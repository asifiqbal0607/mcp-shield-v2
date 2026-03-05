import { useState, useEffect } from "react";

const GREEN = "#22c55e";
const BLUE = "#1d4ed8";
const SLATE = "#64748b";
const ROSE = "#dc2626";

function makeDetail(row) {
  return {
    url: "http://aciq.playit.mobi/confirm-asiacell?uniquid=ask004b49312599e074c94c3951d698ad23",
    referrer:
      "http://aciq.playit.mobi/signup?parameter=60432life-15od-4cb2-837f-2e8e7f380f6b&trafficsource=OffyClick",
    time: row?.time || "Feb 25, 04:23:08.438 AM",
    timezone: "Asia/Baghdad",
    transactionId: row?.id || "20260225042308_fd1f907042ef4af9bfe261415926f45",
    client: "IQ Grand Technology",
    service: "GC 2231 Playit",
    queried: "Yes",
    queriedTime: "2026-02-25 07:23:08.488 AM",
    queriedLabel: "Asia/Baghdad",
    userIp: row?.userIp || "89.46.206.31",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; SM-M127F Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.135 Mobile Safari/537.36",
    country: "Iraq",
    continent: "Asia",
    timezone2: "Asia/Baghdad",
    device: "Samsung SM-M127F",
    os: "Android",
    browser: "Chrome Mobile",
    network: row?.network || "Asiacell Communications Pjsc",
    status: row?.status || "Clean",
    score: 10,
    apk: row?.apk || "",
    reasons: row?.reasons || [],
  };
}

const EVENTS = [
  {
    name: "Pointerdown",
    time: "2026-02-25 04:23:19.217 AM",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Touchstart",
    time: "2026-02-25 04:23:19.221 AM",
    tests: ["Screen Test", "Client Test", "Touch Area Test"],
  },
  {
    name: "Pointerup",
    time: "2026-02-25 04:23:19.225 AM",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Touchend",
    time: "2026-02-25 04:23:19.257 AM",
    tests: ["Screen Test", "Client Test", "Touch Area Test"],
  },
  {
    name: "Mousedown",
    time: "2026-02-25 04:23:19.428 AM",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Mouseup",
    time: "2026-02-25 04:23:19.432 AM",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Click",
    time: "2026-02-25 04:23:19.457 AM",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
];

const DEVICE_CHECKS = {
  "UI Rendering": [
    "Point 0 Test",
    "Background Rendering Test",
    "0x0 0x0 Pixel View W.R.T Device",
    "0x0 0x0 Pixel View W.R.T Browser",
  ],
  Spoofing: [
    "Canvas Fingerprint Test",
    "WebGL Renderer Test",
    "Audio Context Test",
    "Font Metrics Test",
  ],
  "JavaScript Challenge": [
    "Timing Attack Test",
    "Prototype Chain Test",
    "Eval Behavior Test",
    "Async Context Test",
  ],
};

function PassedBadge() {
  return <span className="passed-badge">Passed</span>;
}

export default function TransactionDetailModal({ row, onClose, onUserIp }) {
  const [devTab, setDevTab] = useState("UI Rendering");
  const [expandedEvt, setExpandedEvt] = useState(null);
  const d = makeDetail(row);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} className="tdd-backdrop" />

      <div className="tdd-modal">
        {/* ── Header ── */}
        <div className="tdd-header">
          <div className="tdd-header-left">
            <div className="tdd-header-icon">🔍</div>
            <div>
              <div className="tdd-header-title">Transaction Detail</div>
              <div className="tdd-header-txid">{d.transactionId}</div>
            </div>
          </div>
          <div className="tdd-header-actions">
            <button
              onClick={() => onUserIp && onUserIp(d.userIp)}
              className="tdd-btn-useip"
            >
              👤 User IP
            </button>
            <button className="tdd-btn-anomaly">📊 Anomaly Analysis</button>
            <button className="tdd-btn-rawdata">📄 Show Raw Data</button>
            <button onClick={onClose} className="tdd-close-btn">
              ×
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="tdd-body">
          {/* ── 1. Transaction Info ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar tdd-bar-blue" />
              Transaction Information
            </div>

            <div className="tdd-info-table">
              {[
                [
                  [
                    "URL",
                    <a href="#" className="tdd-url-link">
                      {d.url}
                    </a>,
                  ],
                  ["Country", d.country],
                ],
                [
                  [
                    "Referrer",
                    <a href="#" className="tdd-url-link">
                      {d.referrer}
                    </a>,
                  ],
                  ["Continent", d.continent],
                ],
                [
                  [
                    "Time",
                    <>
                      {d.time}{" "}
                      <span className="tdd-tz-note">({d.timezone})</span>
                    </>,
                  ],
                  ["Time Zone", d.timezone2],
                ],
                [
                  [
                    "Transaction ID",
                    <span className="tdd-mono-sm">{d.transactionId}</span>,
                  ],
                  ["Device", d.device],
                ],
                [
                  [
                    "Client",
                    <span className="tdd-color-tag tdd-tag-client-green">
                      {d.client}
                    </span>,
                  ],
                  ["OS", d.os],
                ],
                [
                  [
                    "Service",
                    <span className="tdd-color-tag tdd-tag-service-cyan">
                      {d.service}
                    </span>,
                  ],
                  ["Browser", d.browser],
                ],
                [
                  [
                    "Queried",
                    <>
                      <span className="tdd-queried-yes">{d.queried}</span>
                      <span className="tdd-queried-time">{d.queriedTime}</span>
                    </>,
                  ],
                  ["Network", d.network],
                ],
                [
                  ["User IP", <span className="tdd-mono-md">{d.userIp}</span>],
                  [
                    "Status",
                    <>
                      <span
                        className={`tdd-status-pill ${d.status === "Block" ? "tdd-status-block" : "tdd-status-clean"}`}
                      >
                        {d.status}
                      </span>
                      <span className="tdd-score-label">
                        Score: <strong>{d.score}</strong>
                      </span>
                    </>,
                  ],
                ],
              ].map(([left, right], i) => (
                <div key={i} className="tdd-info-row">
                  <div className="tdd-info-label">{left[0]}</div>
                  <div className="tdd-info-value">{left[1]}</div>
                  <div className="tdd-info-label">{right[0]}</div>
                  <div className="tdd-info-value-last">{right[1]}</div>
                </div>
              ))}

              {/* User Agent — full width */}
              <div className="tdd-info-row-full">
                <div className="tdd-info-label">User Agent</div>
                <div className="tdd-info-value-ua">{d.userAgent}</div>
              </div>
            </div>
          </section>

          {/* ── 2. Device Verification ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar tdd-bar-violet" />
              Device Verification
            </div>

            <div className="tdd-tabs-wrap">
              {Object.keys(DEVICE_CHECKS).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDevTab(tab)}
                  className={`tdd-tab-btn${devTab === tab ? " active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tdd-checks-grid">
              {DEVICE_CHECKS[devTab].map((check) => (
                <div key={check} className="tdd-check-item">
                  <span className="tdd-check-label">{check}</span>
                  <PassedBadge />
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Events Timeline ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar tdd-bar-green" />
              Events Timeline
              <span className="tdd-section-hint">
                — click an event to expand tests
              </span>
            </div>

            <div className="tdd-events-list">
              {EVENTS.map((evt, i) => {
                const isOpen = expandedEvt === i;
                return (
                  <div
                    key={i}
                    className={`tdd-event-card${isOpen ? " open" : ""}`}
                  >
                    <div
                      onClick={() => setExpandedEvt(isOpen ? null : i)}
                      className={`tdd-event-header${isOpen ? " open" : ""}`}
                    >
                      <div className="tdd-event-left">
                        <div
                          className={`tdd-event-icon${isOpen ? " open" : ""}`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <div className="tdd-event-name">{evt.name}</div>
                          <div className="tdd-event-meta">
                            Event Information
                          </div>
                        </div>
                      </div>
                      <div className="tdd-event-right">
                        <span className="tdd-event-time">{evt.time}</span>
                        <span
                          className={`tdd-event-arrow${isOpen ? " open" : ""}`}
                        >
                          ▾
                        </span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="tdd-tests-grid">
                        {evt.tests.map((test) => (
                          <div key={test} className="tdd-test-item">
                            <span className="tdd-test-label">{test}</span>
                            <PassedBadge />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="tdd-footer">
          <button onClick={onClose} className="tdd-btn-cancel">
            Close
          </button>
          <button className="tdd-btn-export">Export This Transaction</button>
        </div>
      </div>
    </>
  );
}
