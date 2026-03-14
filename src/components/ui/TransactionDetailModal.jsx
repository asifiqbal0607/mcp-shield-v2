import { useState, useEffect, useMemo } from "react";

// ── Event template — all test names used per event type ──────────────────────
const EVENT_TEMPLATES = [
  {
    name: "Pointerdown",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Touchstart",
    tests: ["Screen Test", "Client Test", "Touch Area Test"],
  },
  {
    name: "Pointerup",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Touchend",
    tests: ["Screen Test", "Client Test", "Touch Area Test"],
  },
  {
    name: "Mousedown",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  {
    name: "Mouseup",
    tests: ["Screen Test", "Event Layers Test", "Client Test"],
  },
  { name: "Click", tests: ["Screen Test", "Event Layers Test", "Client Test"] },
];

// For blocked transactions: which specific tests fail per event
const BLOCKED_FAILURES = {
  Touchstart: ["Touch Area Test"],
  Mousedown: ["Event Layers Test"],
  Pointerdown: ["Client Test"], // only in seq 2
};

// Build one click sequence worth of events
// seqIdx 0 = first click, seqIdx 1 = second click etc.
// isBlocked drives whether any tests fail
function buildSequence(seqIdx, isBlocked, baseMs) {
  const offsets = [0, 4, 8, 40, 211, 215, 240]; // ms offsets per event
  const base = new Date(`2026-02-25T04:23:${19 + seqIdx * 2}.000`);

  return EVENT_TEMPLATES.map((tmpl, i) => {
    const t = new Date(base.getTime() + offsets[i] + baseMs);
    const timeStr =
      t.toISOString().replace("T", " ").replace("Z", "").slice(0, 23) + " AM";

    // Clean = every test is always pass. Blocked = specific tests fail per sequence.
    const tests = tmpl.tests.map((testName) => {
      if (!isBlocked) return { name: testName, status: "pass" };
      const failSet =
        seqIdx === 0
          ? {
              Touchstart: ["Touch Area Test"],
              Mousedown: ["Event Layers Test"],
            }
          : { Pointerdown: ["Client Test"], Mouseup: ["Event Layers Test"] };
      return {
        name: testName,
        status: failSet[tmpl.name]?.includes(testName) ? "fail" : "pass",
      };
    });

    return { name: tmpl.name, time: timeStr, tests };
  });
}

// Build device-check results driven by status
function buildDeviceChecks(isBlocked) {
  const p = "pass";
  const f = isBlocked ? "fail" : "pass"; // only fails when truly blocked
  return {
    "UI Rendering": [
      { name: "Point 0 Test", status: f },
      { name: "Background Rendering Test", status: p },
      { name: "0x0 0x0 Pixel View W.R.T Device", status: f },
      { name: "0x0 0x0 Pixel View W.R.T Browser", status: p },
    ],
    Spoofing: [
      { name: "Canvas Fingerprint Test", status: p },
      { name: "WebGL Renderer Test", status: f },
      { name: "Audio Context Test", status: p },
      { name: "Font Metrics Test", status: p },
    ],
    "JavaScript Challenge": [
      { name: "Timing Attack Test", status: p },
      { name: "Prototype Chain Test", status: f },
      { name: "Eval Behavior Test", status: p },
      { name: "Async Context Test", status: p },
    ],
  };
}

function groupIntoClickSequences(events) {
  const groups = [];
  let current = [];
  events.forEach((evt) => {
    current.push(evt);
    if (evt.name === "Click") {
      groups.push(current);
      current = [];
    }
  });
  if (current.length) groups.push(current);
  return groups;
}

function makeDetail(row) {
  const isBlocked = (row?.status || "").toLowerCase().includes("block");
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
    score: isBlocked ? 87 : 10,
    isBlocked,
    reasons: isBlocked
      ? [
          "Touch Area Test failed in sequence 1",
          "Event Layers Test anomaly detected",
          "Prototype Chain injection attempt",
        ]
      : [],
  };
}

// ── Small components ──────────────────────────────────────────────────────────
function TestBadge({ status }) {
  return status === "fail" ? (
    <span className="tdd-test-badge fail">Failed</span>
  ) : (
    <span className="tdd-test-badge pass">Passed</span>
  );
}

function eventHasFail(evt) {
  return evt.tests.some((t) => t.status === "fail");
}
function seqHasFail(seq) {
  return seq.some(eventHasFail);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TransactionDetailModal({ row, onClose, onUserIp }) {
  const [devTab, setDevTab] = useState("UI Rendering");
  const [expandedEvt, setExpandedEvt] = useState(null);

  const d = useMemo(() => makeDetail(row), [row]);

  // All events + device checks derived from transaction status
  const rawEvents = useMemo(
    () => [
      ...buildSequence(0, d.isBlocked, 0),
      ...buildSequence(1, d.isBlocked, 2000),
    ],
    [d.isBlocked],
  );

  const clickSequences = useMemo(
    () => groupIntoClickSequences(rawEvents),
    [rawEvents],
  );
  const deviceChecks = useMemo(
    () => buildDeviceChecks(d.isBlocked),
    [d.isBlocked],
  );

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Reset expanded event when transaction changes
  useEffect(() => {
    setExpandedEvt(null);
  }, [row]);

  const totalFails = rawEvents.reduce(
    (a, e) => a + e.tests.filter((t) => t.status === "fail").length,
    0,
  );

  return (
    <>
      <div onClick={onClose} className="tdd-backdrop" />
      <div className="tdd-modal">
        {/* ── Header ── */}
        <div
          className={`tdd-header${d.isBlocked ? " tdd-header-blocked" : ""}`}
        >
          <div className="tdd-header-left">
            <div className="tdd-header-icon">{d.isBlocked ? "🚫" : "✅"}</div>
            <div>
              <div className="tdd-header-title">Transaction Detail</div>
              <div className="tdd-header-txid">{d.transactionId}</div>
            </div>
          </div>
          <div className="tdd-header-actions">
            {/* Status pill prominent in header */}
            <span
              className={`tdd-header-status-pill ${d.isBlocked ? "blocked" : "clean"}`}
            >
              {d.isBlocked ? "🚫 BLOCKED" : "✅ CLEAN"}
              <span className="tdd-header-score">Score: {d.score}</span>
            </span>
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

        {/* ── Blocked reasons banner ── */}
        {d.isBlocked && d.reasons.length > 0 && (
          <div className="tdd-block-banner">
            <span className="tdd-block-banner-icon">⚠</span>
            <div>
              <div className="tdd-block-banner-title">Block Reasons</div>
              <div className="tdd-block-banner-reasons">
                {d.reasons.map((r, i) => (
                  <span key={i} className="tdd-block-reason-chip">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

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
                        className={`tdd-status-pill ${d.isBlocked ? "tdd-status-block" : "tdd-status-clean"}`}
                      >
                        {d.isBlocked ? "Block" : "Clear"}
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
              {d.isBlocked && (
                <span className="tdd-section-fail-count">
                  {
                    Object.values(deviceChecks)
                      .flat()
                      .filter((c) => c.status === "fail").length
                  }{" "}
                  checks failed
                </span>
              )}
            </div>
            <div className="tdd-tabs-wrap">
              {Object.keys(deviceChecks).map((tab) => {
                const tabFails = deviceChecks[tab].some(
                  (c) => c.status === "fail",
                );
                return (
                  <button
                    key={tab}
                    onClick={() => setDevTab(tab)}
                    className={`tdd-tab-btn${devTab === tab ? " active" : ""}${tabFails ? " has-fail" : ""}`}
                  >
                    {tab}
                    {tabFails && <span className="tdd-tab-fail-dot" />}
                  </button>
                );
              })}
            </div>
            <div className="tdd-checks-grid">
              {deviceChecks[devTab].map((check) => (
                <div
                  key={check.name}
                  className={`tdd-check-item${check.status === "fail" ? " fail" : ""}`}
                >
                  <span className="tdd-check-label">{check.name}</span>
                  <TestBadge status={check.status} />
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Events Timeline ── */}
          <section>
            <div className="tdd-section-hd">
              <span
                className={`tdd-section-bar ${d.isBlocked ? "tdd-bar-red" : "tdd-bar-green"}`}
              />
              Events Timeline
              <span className="tdd-section-hint">
                — click an event to expand tests
              </span>
              {d.isBlocked ? (
                <span className="tdd-section-fail-count">
                  {totalFails} test{totalFails !== 1 ? "s" : ""} failed across
                  all events
                </span>
              ) : (
                <span className="tdd-section-pass-count">
                  All tests passed ✓
                </span>
              )}
            </div>

            <div className="tdd-events-list">
              {clickSequences.map((seq, seqIdx) => {
                const seqFailed = seqHasFail(seq);
                const globalBase = clickSequences
                  .slice(0, seqIdx)
                  .reduce((a, s) => a + s.length, 0);
                const failCount = seq.reduce(
                  (a, e) =>
                    a + e.tests.filter((t) => t.status === "fail").length,
                  0,
                );

                return (
                  <div
                    key={seqIdx}
                    className={`tdd-click-group${seqFailed ? " has-fail" : ""}`}
                  >
                    {/* ── Sequence header ── */}
                    <div
                      className={`tdd-click-group-hd${seqFailed ? " fail" : ""}`}
                    >
                      <div className="tdd-click-group-left">
                        <span
                          className={`tdd-click-group-pill${seqFailed ? " fail" : ""}`}
                        >
                          {seqFailed ? "🚫" : "✅"} Click {seqIdx + 1}
                        </span>
                        {seqFailed ? (
                          <span className="tdd-click-fail-badge">
                            ⚠ {failCount} test{failCount !== 1 ? "s" : ""}{" "}
                            failed
                          </span>
                        ) : (
                          <span className="tdd-click-pass-badge">
                            All clear
                          </span>
                        )}
                      </div>
                      <span className="tdd-click-group-time">
                        {seq[0]?.time} → {seq[seq.length - 1]?.time}
                      </span>
                    </div>

                    {/* ── Events ── */}
                    {seq.map((evt, evtIdx) => {
                      const globalIdx = globalBase + evtIdx;
                      const isOpen = expandedEvt === globalIdx;
                      const hasFail = eventHasFail(evt);
                      const evtFailCount = evt.tests.filter(
                        (t) => t.status === "fail",
                      ).length;

                      return (
                        <div
                          key={evtIdx}
                          className={`tdd-event-card${isOpen ? " open" : ""}${hasFail ? " evt-has-fail" : ""}`}
                        >
                          <div
                            onClick={() =>
                              setExpandedEvt(isOpen ? null : globalIdx)
                            }
                            className={`tdd-event-header${isOpen ? " open" : ""}${hasFail ? " evt-fail-hd" : ""}`}
                          >
                            <div className="tdd-event-left">
                              <div
                                className={`tdd-event-icon${hasFail ? " fail" : ""}${isOpen ? " open" : ""}`}
                              >
                                {evtIdx + 1}
                              </div>
                              <div>
                                <div className="tdd-event-name-wrap">
                                  <span
                                    className={`tdd-event-name${hasFail ? " fail" : ""}`}
                                  >
                                    {evt.name}
                                  </span>
                                  {hasFail ? (
                                    <span className="tdd-evt-fail-pill">
                                      {evtFailCount} failed
                                    </span>
                                  ) : (
                                    <span className="tdd-evt-pass-pill">
                                      ✓ passed
                                    </span>
                                  )}
                                </div>
                                <div className="tdd-event-meta">
                                  Event Information
                                </div>
                              </div>
                            </div>
                            <div className="tdd-event-right">
                              {hasFail && <span className="tdd-evt-fail-dot" />}
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
                                <div
                                  key={test.name}
                                  className={`tdd-test-item${test.status === "fail" ? " fail" : ""}`}
                                >
                                  <div className="tdd-test-left">
                                    <span className="tdd-test-label">
                                      {test.name}
                                    </span>
                                  </div>
                                  <TestBadge status={test.status} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
