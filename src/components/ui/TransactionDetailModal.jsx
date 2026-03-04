import { useState, useEffect } from 'react';

const GREEN  = '#22c55e';
const BLUE   = '#1d4ed8';
const SLATE  = '#64748b';
const ROSE   = '#dc2626';

// ─── Mock detail data generator ───────────────────────────────────────────────
function makeDetail(row) {
  return {
    url:           'http://aciq.playit.mobi/confirm-asiacell?uniquid=ask004b49312599e074c94c3951d698ad23',
    referrer:      'http://aciq.playit.mobi/signup?parameter=60432life-15od-4cb2-837f-2e8e7f380f6b&trafficsource=OffyClick',
    time:          row?.time || 'Feb 25, 04:23:08.438 AM',
    timezone:      'Asia/Baghdad',
    transactionId: row?.id || '20260225042308_fd1f907042ef4af9bfe261415926f45',
    client:        'IQ Grand Technology',
    clientColor:   '#22c55e',
    service:       'GC 2231 Playit',
    serviceColor:  '#0891b2',
    queried:       'Yes',
    queriedTime:   '2026-02-25 07:23:08.488 AM',
    queriedLabel:  'Asia/Baghdad',
    userIp:        row?.userIp || '89.46.206.31',
    userAgent:     'Mozilla/5.0 (Linux; Android 13; SM-M127F Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.135 Mobile Safari/537.36',
    country:       'Iraq',
    continent:     'Asia',
    timezone2:     'Asia/Baghdad',
    device:        'Samsung SM-M127F',
    os:            'Android',
    browser:       'Chrome Mobile',
    network:       row?.network || 'Asiacell Communications Pjsc',
    status:        row?.status || 'Clean',
    statusColor:   '#22c55e',
    score:         10,
    apk:           row?.apk || '',
    reasons:       row?.reasons || [],
  };
}

const EVENTS = [
  { name: 'Pointerdown', time: '2026-02-25 04:23:19.217 AM', tests: ['Screen Test', 'Event Layers Test', 'Client Test'] },
  { name: 'Touchstart',  time: '2026-02-25 04:23:19.221 AM', tests: ['Screen Test', 'Client Test', 'Touch Area Test'] },
  { name: 'Pointerup',   time: '2026-02-25 04:23:19.225 AM', tests: ['Screen Test', 'Event Layers Test', 'Client Test'] },
  { name: 'Touchend',    time: '2026-02-25 04:23:19.257 AM', tests: ['Screen Test', 'Client Test', 'Touch Area Test'] },
  { name: 'Mousedown',   time: '2026-02-25 04:23:19.428 AM', tests: ['Screen Test', 'Event Layers Test', 'Client Test'] },
  { name: 'Mouseup',     time: '2026-02-25 04:23:19.432 AM', tests: ['Screen Test', 'Event Layers Test', 'Client Test'] },
  { name: 'Click',       time: '2026-02-25 04:23:19.457 AM', tests: ['Screen Test', 'Event Layers Test', 'Client Test'] },
];

const DEVICE_CHECKS = {
  'UI Rendering': [
    'Point 0 Test', 'Background Rendering Test',
    '0x0 0x0 Pixel View W.R.T Device', '0x0 0x0 Pixel View W.R.T Browser',
  ],
  'Spoofing': [
    'Canvas Fingerprint Test', 'WebGL Renderer Test',
    'Audio Context Test', 'Font Metrics Test',
  ],
  'JavaScript Challenge': [
    'Timing Attack Test', 'Prototype Chain Test',
    'Eval Behavior Test', 'Async Context Test',
  ],
};

function PassedBadge() {
  return (
    <span className="tdd-clean-badge">Passed</span>
  );
}

function Field({ label, children, mono }) {
  return (
    <div className="tdd-display-row">
      <div className="tdd-field-key">{label}</div>
      <div className={mono ? "tdd-field-val-mono" : "tdd-field-val"}>{children}</div>
    </div>
  );
}

export default function TransactionDetailModal({ row, onClose, onUserIp }) {
  const [devTab,      setDevTab]      = useState('UI Rendering');
  const [expandedEvt, setExpandedEvt] = useState(null);
  const d = makeDetail(row);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="tdd-backdrop" />

      {/* Modal shell */}
      <div className="tdd-modal">

        {/* ── Header ── */}
        <div className="tdd-header">
          <div className="tdd-header-left">
            <div className="tdd-icon-btn">🔍</div>
            <div>
              <div className="tdd-title">Transaction Detail</div>
              <div className="tdd-subtitle">
                {d.transactionId}
              </div>
            </div>
          </div>
          <div className="tdd-action-row">
            <button onClick={() => onUserIp && onUserIp(d.userIp)} className="tdd-action-btn-violet">👤 User IP</button>
            <button className="tdd-action-btn-amber">📊 Anomaly Analysis</button>
            <button className="tdd-action-btn-green">📄 Show Raw Data</button>
            <button onClick={onClose} className="tdd-close-btn">×</button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="tdd-body">

          {/* ── 1. Transaction Info ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar" style={{ '--c': BLUE }} />
              Transaction Information
            </div>

            <div className="tdd-table-wrap">
              {/* Two-column rows */}
              {[
                [['URL',            <a href="#" className="tdd-url-link">{d.url}</a>],
                 ['Country',        d.country]],
                [['Referrer',       <a href="#" className="tdd-url-link">{d.referrer}</a>],
                 ['Continent',      d.continent]],
                [['Time',           <>{d.time} <span className="tdd-url-tiny">({d.timezone})</span></>],
                 ['Time Zone',      d.timezone2]],
                [['Transaction ID', <span className="tdd-subtitle">{d.transactionId}</span>],
                 ['Device',         d.device]],
                [['Client',         <span className="tdd-tag-client" style={{ '--c': d.clientColor }}>{d.client}</span>],
                 ['OS',             d.os]],
                [['Service',        <span className="tdd-tag-client" style={{ '--c': d.serviceColor }}>{d.service}</span>],
                 ['Browser',        d.browser]],
                [['Queried',        <><span className="tdd-action-btn-green">{d.queried}</span><span className="tdd-url-tiny">{d.queriedTime}</span></>],
                 ['Network',        d.network]],
                [['User IP',        <span className="tdd-mono-val">{d.userIp}</span>],
                 ['Status',         <><span className="tdd-tag-client" style={{ '--c': d.statusColor }}>{d.status}</span><span className="tdd-section-hd">Score: {d.score}</span></>]],
              ].map(([left, right], i) => (
                <div key={i} className={i % 2 === 0 ? 'tdd-grid-4col tdd-row-even' : 'tdd-grid-4col tdd-row-odd'}>
                  <div className="tdd-cell-key">{left[0]}</div>
                  <div className="tdd-cell-val">{left[1]}</div>
                  <div className="tdd-cell-key">{right[0]}</div>
                  <div className="tdd-cell-val-last">{right[1]}</div>
                </div>
              ))}

              {/* User Agent — full width */}
              <div className="tdd-grid-2col">
                <div className="tdd-cell-key">User Agent</div>
                <div className="tdd-cell-mono">{d.userAgent}</div>
              </div>
            </div>
          </section>

          {/* ── 2. Device Verification ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar" style={{ '--c': '#7c3aed' }} />
              Device Verification
            </div>

            {/* Tabs */}
            <div className="tdd-tab-bar">
              {Object.keys(DEVICE_CHECKS).map((tab) => (
                <button key={tab} onClick={() => setDevTab(tab)} className="tdd-tab-btn" style={{ '--bg': active === t ? '#fff' : 'transparent', '--tx': active === t ? '#1a1a2e' : '#64748b' }}>{tab}</button>
              ))}
            </div>

            {/* Checks grid */}
            <div className="tdd-detail-grid">
              {DEVICE_CHECKS[devTab].map((check) => (
                <div key={check} className="tdd-detail-item">
                  <span className="tdd-detail-item-key">{check}</span>
                  <PassedBadge />
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Events Timeline ── */}
          <section>
            <div className="tdd-section-hd">
              <span className="tdd-section-bar" style={{ '--c': GREEN }} />
              Events Timeline
              <span className="tdd-url-tiny">— click an event to expand tests</span>
            </div>

            <div className="f-col-6">
              {EVENTS.map((evt, i) => {
                const isOpen = expandedEvt === i;
                return (
                  <div key={i} className="tdd-event-card" style={{ '--bdr': isOpen ? '#bbf7d0' : '#f1f5f9' }}>
                    {/* Event row */}
                    <div onClick={() => setExpandedEvt(isOpen ? null : i)}
                      className="tdd-event-header">
                      <div className="tdd-header-left">
                        <div className="tdd-event-icon" style={{ '--bg': isOpen ? GREEN : '#e2e8f0' }}>{i + 1}</div>
                        <div>
                          <div className="tdd-event-title">{evt.name}</div>
                          <div className="tdd-event-meta">Event Information</div>
                        </div>
                      </div>
                      <div className="tdd-header-left">
                        <span className="tdd-event-time">{evt.time}</span>
                        <span className={`tdd-event-arrow ${isOpen ? 'open' : ''}`}>▾</span>
                      </div>
                    </div>

                    {/* Expanded tests — compact inline grid */}
                    {isOpen && (
                      <div className="tdd-event-body">
                        {evt.tests.map((test) => (
                          <div key={test} className="tdd-event-kv">
                            <span className="tdd-event-kv-label">{test}</span>
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
          <button onClick={onClose} className="tdd-footer-cancel">Close</button>
          <button className="tdd-footer-primary">Export This Transaction</button>
        </div>
      </div>
    </>
  );
}
