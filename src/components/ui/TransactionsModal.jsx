import { useState, useEffect, useRef } from 'react';
import { transactionRows } from '../../data/tables';
import TransactionDetailModal from './TransactionDetailModal';
import TransactionDashboardModal from './TransactionDashboardModal';

// ── Reason colour palette ────────────────────────────────────────────────────
const REASON_COLORS = {
  'MCPS-2000':  { bg: '#7c3aed', text: '#fff' },
  'MCPS-1300':  { bg: '#2563eb', text: '#fff' },
  'AMCPS-1310': { bg: '#0891b2', text: '#fff' },
  'MCPS-1400':  { bg: '#d97706', text: '#fff' },
  'MCPS-1500':  { bg: '#dc2626', text: '#fff' },
  'AMCPS-2000': { bg: '#059669', text: '#fff' },
};
const reasonColor = (code) => REASON_COLORS[code] || { bg: '#64748b', text: '#fff' };

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const VISIBLE_REASONS   = 2; // shown inline; rest behind +N badge

// ── Compact reason cell ──────────────────────────────────────────────────────
function ReasonCell({ reasons }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const visible  = reasons.slice(0, VISIBLE_REASONS);
  const overflow = reasons.slice(VISIBLE_REASONS);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  if (!reasons.length) return <span className="txt-muted">—</span>;

  return (
    <div className="txn-reason-cell">
      {visible.map((rsn) => {
        const c = reasonColor(rsn);
        return (
          <span key={rsn} className="txn-reason-badge" style={{ '--bg': c.bg, '--tx': c.text }}>{rsn}</span>
        );
      })}

      {overflow.length > 0 && (
        <div ref={ref} className="txn-reason-more">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
            className="txn-reason-more-btn" style={{ '--bg': open ? '#1e40af' : '#e0e7ff', '--tx': open ? '#fff' : '#1e40af' }}
          >+{overflow.length}</button>

          {open && (
            <div className="txn-reason-popover">
              <div className="txn-popover-hd">
                +{overflow.length} More
              </div>
              <div className="txn-popover-list">
                {overflow.map((rsn) => {
                  const c = reasonColor(rsn);
                  return (
                    <span key={rsn} className="txn-reason-badge" style={{ '--bg': c.bg, '--tx': c.text }}>{rsn}</span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLS = [
  { key: 'sr',          label: 'Sr.',         w: 44,  noSort: true },
  { key: 'id',          label: 'ID',          w: 170, mono: true   },
  { key: 'time',        label: 'Time',        w: 115              },
  { key: 'network',     label: 'Network',     w: 155              },
  { key: 'apk',         label: 'APK',         w: 155, mono: true   },
  { key: 'userIp',      label: 'User IP',     w: 125, mono: true   },
  { key: 'msisdn',      label: 'MSISDN',      w: 80               },
  { key: 'status',      label: 'Status',      w: 80               },
  { key: 'reasons',     label: 'Reason',      w: 200, noSort: true },
  { key: 'interaction', label: 'Interaction', w: 90               },
  { key: 'view',        label: 'View',        w: 60,  noSort: true },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function TransactionsModal({
  onClose,
  title = 'Clicked Clean — Transactions',
  ipFilter: initialIp = '',
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [dashMode,    setDashMode]    = useState(null);
  const [ipFilter,    setIpFilter]    = useState(initialIp);
  const [search,      setSearch]      = useState(initialIp);
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [sortKey,     setSortKey]     = useState(null);
  const [sortDir,     setSortDir]     = useState('asc');

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  let filtered = transactionRows.filter((r) =>
    r.id.includes(search) ||
    r.network.toLowerCase().includes(search.toLowerCase()) ||
    r.apk.toLowerCase().includes(search.toLowerCase()) ||
    r.userIp.includes(search)
  );

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }

  const totalPages   = Math.ceil(filtered.length / pageSize);
  const paged        = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalEntries = 112003;

  const pageNums = [];
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pageNums.push(i); }
  else pageNums.push(1, 2, 3, '…', totalPages - 1, totalPages);

  // Shared TD helper — fixed height, vertically centred, no row blow-out
  const TD = ({ col, children, extra = {} }) => (
    <td className={col.mono ? 'txn-td-mono' : 'txn-td'}>{children}</td>
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="txn-backdrop" />

      {/* Modal shell */}
      <div className="txn-modal">

        {/* Header */}
        <div className="txn-header">
          <div className="txn-header-left">
            <div className="txn-icon">✓</div>
            <div>
              <div className="txn-title">
                {ipFilter ? `Transactions — IP: ${ipFilter}` : title}
              </div>
              <div className="txn-subtitle">
                Showing {filtered.length.toLocaleString()} of {totalEntries.toLocaleString()} entries
              </div>
            </div>
          </div>
          <div className="txn-toolbar">
            {[
              { label: 'Export Transactions', bg: '#1d4ed8', fn: null         },
              { label: 'Dashboard',           bg: '#0f766e', fn: () => setDashMode('dashboard') },
              { label: 'Excluded Dashboard',  bg: '#7c3aed', fn: () => setDashMode('excluded')  },
            ].map(({ label, bg, fn }) => (
              <button key={label} onClick={fn} className="btn" style={{ '--bg': bg, background: bg }}>{label}</button>
            ))}
            <button onClick={onClose} className="btn-icon">×</button>
          </div>
        </div>

        {/* IP filter pill */}
        {ipFilter && (
          <div className="txn-toolbar txn-app-toolbar">
            <span className="txn-toolbar-label">🔍 Filtering by User IP:</span>
            <span className="txn-app-id">{ipFilter}</span>
            <button onClick={() => { setIpFilter(''); setSearch(''); }} className="txn-clear-btn">✕ Clear</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="txn-filter-row">
          <div className="txn-count-label">
            Show
            <select value={pageSize} onChange={(e) => { setPageSize(+e.target.value); setPage(1); }} className="txn-col-select">
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </div>
          <div className="txn-count-label">
            Search:
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ID, network, APK, IP…"
              className="txn-search"
            />
          </div>
        </div>

        {/* Table */}
        <div className="txn-table-scroll">
          <table className="txn-table">
            <colgroup>
              {COLS.map(col => <col key={col.key} style={{ '--w': col.w }} />)}
            </colgroup>

            <thead className="txn-thead">
              <tr className="txn-thead-row">
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => !col.noSort && toggleSort(col.key)}
                    className="txn-th"
                  >
                    {col.label}
                    {!col.noSort && (
                      <span className="txn-sort-arrow" style={{ '--op': sortKey === col.key ? 1 : 0.3 }}>
                        {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paged.map((r, i) => (
                <tr
                  key={r.id}
                  className="txn-tr"
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <TD col={COLS[0]} extra={{ color: '#94a3b8', fontWeight: 700 }}>
                    {(page - 1) * pageSize + i + 1}
                  </TD>
                  <TD col={COLS[1]} extra={{ color: '#475569' }}>
                    <span title={r.id}>{r.id}</span>
                  </TD>
                  <TD col={COLS[2]} extra={{ color: '#475569' }}>{r.time}</TD>
                  <TD col={COLS[3]}>
                    <span title={r.network}>{r.network}</span>
                  </TD>
                  <TD col={COLS[4]} extra={{ color: '#64748b' }}>
                    <span title={r.apk}>{r.apk || '—'}</span>
                  </TD>
                  <TD col={COLS[5]}>{r.userIp}</TD>
                  <TD col={COLS[6]} extra={{ color: '#94a3b8' }}>{r.msisdn || '—'}</TD>
                  <TD col={COLS[7]}>
                    <span className="txn-status-block" style={{ '--bg': r.status === 'Block' ? '#fef2f2' : '#dcfce7', '--tx': r.status === 'Block' ? '#dc2626' : '#15803d' }}>{r.status}</span>
                  </TD>
                  {/* Reason — always 1 line height, overflow in popover */}
                  <TD col={COLS[8]} extra={{ overflow: 'visible', position: 'relative' }}>
                    <ReasonCell reasons={r.reasons || []} />
                  </TD>
                  <TD col={COLS[9]}>
                    <span className="txn-status-red">{r.interaction}</span>
                  </TD>
                  <TD col={COLS[10]}>
                    <button onClick={() => setSelectedRow(r)} className="txn-export-btn">View</button>
                  </TD>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={COLS.length} className="txn-empty">
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="txn-footer">
          <div className="txn-footer-count">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length).toLocaleString()} to{' '}
            {Math.min(page * pageSize, filtered.length).toLocaleString()} of {totalEntries.toLocaleString()} entries
          </div>
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="txn-page-prev" style={{ '--bg': page === 1 ? '#f8fafc' : '#fff' }}
            >Previous</button>

            {pageNums.map((n, idx) => (
              <button
                key={idx}
                onClick={() => typeof n === 'number' && setPage(n)}
                className="txn-page-btn" style={{ '--bdr': page === n ? 'none' : '1px solid #e2e8f0', '--bg': page === n ? 'var(--color-primary)' : '#fff', '--tx': page === n ? '#fff' : '#334155' }}
              >{n}</button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="txn-page-next"
            >Next</button>
          </div>
        </div>
      </div>

      {selectedRow && (
        <TransactionDetailModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onUserIp={(ip) => { setSelectedRow(null); setIpFilter(ip); setSearch(ip); setPage(1); }}
        />
      )}
      {dashMode && (
        <TransactionDashboardModal
          title={ipFilter ? `IP: ${ipFilter}` : title}
          mode={dashMode}
          onClose={() => setDashMode(null)}
        />
      )}
    </>
  );
}
