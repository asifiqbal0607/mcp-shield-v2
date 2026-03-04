import { useState, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, SectionTitle, Badge } from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE, SLATE } from "../constants/colors";
import { repTrend } from "../data/charts";
import { userRows as initialUserRows } from "../data/tables";

const USER_TYPES = [
  "All",
  "Admins",
  "C-Admins",
  "Supper Clients",
  "Clients",
  "Client Partner",
  "Sub Account",
  "Publisher",
  "Mirrored",
  "Operations",
];
const TYPE_COLORS = {
  Admins: "#1d4ed8",
  "C-Admins": "#7c3aed",
  "Supper Clients": "#0891b2",
  Clients: "#16a34a",
  "Client Partner": "#d97706",
  "Sub Account": "#dc2626",
  Publisher: "#db2777",
  Mirrored: "#6366f1",
  Operations: "#0f766e",
};
const TYPE_COUNTS = [
  { label: "Admins", count: 12, color: "#1d4ed8" },
  { label: "C-Admins", count: 8, color: "#7c3aed" },
  { label: "Supper Clients", count: 15, color: "#0891b2" },
  { label: "Clients", count: 34, color: "#16a34a" },
  { label: "Client Partner", count: 9, color: "#d97706" },
  { label: "Sub Account", count: 21, color: "#dc2626" },
  { label: "Publisher", count: 7, color: "#db2777" },
  { label: "Mirrored", count: 5, color: "#6366f1" },
  { label: "Operations", count: 11, color: "#0f766e" },
];
const TOTAL_USERS = TYPE_COUNTS.reduce((s, t) => s + t.count, 0);
const STATUS_COLOR = (s) =>
  s === "active" ? GREEN : s === "warning" ? AMBER : ROSE;
const T = "#0d9488";

const PARTNER_SUB_ACCOUNTS_INIT = [
  {
    id: "TDG4240",
    name: "TDG4240",
    type: "SP Account For Details",
    lastLogin: "- -",
    lastAccessed: "- -",
    status: true,
    services: [
      "Noble Horo - 4240002 - True",
      "Horo Mine - 4240003 - True",
      "Horo Majestic - 4240004 - True",
      "Majestic 2 Horo - 4240005 - True",
      "Horo Symbolic - 4240006 - True",
      "Horo Habits - 4240007 - True",
      "Horo Veiled - 4240008 - True",
      "Horosard DD - 4240009 - True",
      "Taro Horo - 4240010 - True",
      "Super Wow Horo - 4240011 - True",
      "Good Health D - 4240012 - True",
      "Health Happy - 4240013 - True",
      "Morning Health - 4240014 - True",
      "Hi Healthy - 4240015 - True",
      "Healthy Fine - 4240016 - True",
      "Healthy Mine - 4240017 - True",
      "Healthy Eat - 4240018 - True",
      "Healthy Habits - 4240019 - True",
      "Healthy Meals - 4240020 - True",
      "Healthy Style - 4240021 - True",
    ],
  },
  {
    id: "CLT8821",
    name: "CLT8821",
    type: "Client Account",
    lastLogin: "Feb 24, 11:30",
    lastAccessed: "192.168.1.44",
    status: true,
    services: [
      "Shield Core - 8821001 - True",
      "Click Pro - 8821002 - True",
      "APK Scan Lite - 8821003 - True",
      "Fraud Guard - 8821004 - True",
    ],
  },
  {
    id: "PRT3310",
    name: "PRT3310",
    type: "Sub Account",
    lastLogin: "Feb 23, 09:12",
    lastAccessed: "10.0.0.15",
    status: false,
    services: [
      "Basic Tracker - 3310001 - False",
      "Geo Resolver - 3310002 - True",
    ],
  },
  {
    id: "AGT9902",
    name: "AGT9902",
    type: "Agent Account",
    lastLogin: "Today 08:55",
    lastAccessed: "89.46.20.11",
    status: true,
    services: [
      "Premium Shield - 9902001 - True",
      "APK Vault - 9902002 - True",
      "Network Guard - 9902003 - True",
      "DataSync - 9902004 - True",
      "Event Logger - 9902005 - True",
    ],
  },
];

const PRIMARY_ACTIONS = [
  { key: "view", icon: "👁", title: "View", color: "#0891b2" },
  { key: "edit", icon: "✏️", title: "Edit", color: "#1d4ed8" },
  { key: "loginAs", icon: "🔑", title: "Login As", color: "#7c3aed" },
];
const MORE_ACTIONS = [
  { key: "ninjaUser", label: "Ninja User", icon: "🥷", color: "#0f172a" },
  { key: "loginAs", label: "Login As", icon: "🔑", color: "#7c3aed" },
  { key: "updatePlans", label: "Update Plans", icon: "📋", color: "#0891b2" },
  { key: "makeStatus", label: "Make Status", icon: "🔄", color: "#d97706" },
  { key: "clearHistory", label: "Clear History", icon: "🗑", color: "#dc2626" },
  {
    key: "updateHistory",
    label: "User Update History",
    icon: "📜",
    color: "#16a34a",
  },
];

// ─── Shared Modal shell ───────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children, width = 520 }) {
  return (
    <>
      <div
        onClick={onClose}
        className="usr-backdrop"
      />
      <div
        className="usr-modal-box" style={{ '--modal-w': `min(${width}px,95vw)` }}
      >
        <div
          className="usr-modal-hdr"
        >
          <div>
            <div className="modal-title">
              {title}
            </div>
            {subtitle && (
              <div className="modal-subtitle">
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="usr-modal-close"
          >
            ✕
          </button>
        </div>
        <div className="modal-scroll">
          {children}
        </div>
      </div>
    </>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="mb-14">
      <div
        className="txt-section-hd"
      >
        {label}
      </div>
      <div
        className={mono ? "usr-field-val-mono" : "usr-field-val"}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function FormInput({ label, defaultValue, type = "text" }) {
  return (
    <div className="mb-14">
      <label
        className="usr-field-label"
      >
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="usr-input"
        onFocus={(e) => (e.currentTarget.style.borderColor = T)}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
      />
    </div>
  );
}

function FormSelect({ label, defaultValue, options }) {
  return (
    <div className="mb-14">
      <label
        className="usr-field-label"
      >
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        className="usr-input-white"
        onFocus={(e) => (e.currentTarget.style.borderColor = T)}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActionBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="usr-btn-save" style={{ '--c': T }}
    >
      {label}
    </button>
  );
}

function CancelBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="usr-btn-cancel"
    >
      Cancel
    </button>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ user, onClose }) {
  return (
    <Modal
      title="User Details"
      subtitle={`Viewing profile for ${user.name}`}
      onClose={onClose}
    >
      <div
        className="usr-preview-row"
      >
        <div
          className="usr-avatar-lg" style={{ '--bg': TYPE_COLORS[user.role] ? `${TYPE_COLORS[user.role]}22` : "#e2e8f0", '--bdr': TYPE_COLORS[user.role] || "#cbd5e1", '--c': TYPE_COLORS[user.role] || "#334155" }}
        >
          {user.name[0]}
        </div>
        <div>
          <div className="modal-title">
            {user.name}
          </div>
          <div className="txt-body">{user.email}</div>
          <span
            className="usr-role-badge" style={{ '--bg': TYPE_COLORS[user.role] ? `${TYPE_COLORS[user.role]}20` : "#f1f5f9", '--c': TYPE_COLORS[user.role] || "#64748b" }}
          >
            {user.role}
          </span>
        </div>
      </div>
      <div className="g-halves">
        <Field label="Region" value={user.region} />
        <Field label="Sessions" value={user.sessions} />
        <Field label="Last Login" value={user.lastLogin} />
        <Field label="Status" value={user.status} />
      </div>
      <div
        className="mt-8-end"
      >
        <CancelBtn onClick={onClose} />
      </div>
    </Modal>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ user, onSave, onClose }) {
  return (
    <Modal
      title="Edit User"
      subtitle={`Editing ${user.name}`}
      onClose={onClose}
    >
      <div
        className="usr-grid-2"
      >
        <FormInput label="Full Name" defaultValue={user.name} />
        <FormInput label="Email" defaultValue={user.email} type="email" />
        <FormSelect
          label="Role"
          defaultValue={user.role}
          options={USER_TYPES.filter((t) => t !== "All")}
        />
        <FormInput label="Region" defaultValue={user.region} />
        <FormSelect
          label="Status"
          defaultValue={user.status}
          options={["active", "warning", "blocked"]}
        />
      </div>
      <div
        className="usr-action-row-end"
      >
        <CancelBtn onClick={onClose} />
        <ActionBtn
          label="Save Changes"
          onClick={() => {
            onSave();
            onClose();
          }}
        />
      </div>
    </Modal>
  );
}

// ─── Login As Modal ───────────────────────────────────────────────────────────
function LoginAsModal({ user, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <Modal
      title="Login As User"
      subtitle="Impersonate this user account"
      onClose={onClose}
      width={440}
    >
      {!confirmed ? (
        <>
          <div
            className="alert-warning"
          >
            <div
              className="alert-title dyn-color" style={{ '--c': "#92400e" }}
            >
              ⚠️ Admin Impersonation
            </div>
            <div className="alert-body">
              You are about to log in as <strong>{user.name}</strong>. All
              actions performed will be under their account. This session will
              be logged for auditing purposes.
            </div>
          </div>
          <Field label="User" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          <div
            className="usr-action-row-end"
          >
            <CancelBtn onClick={onClose} />
            <ActionBtn
              label="Confirm & Login As"
              onClick={() => setConfirmed(true)}
            />
          </div>
        </>
      ) : (
        <div className="txt-center-20">
          <div className="txt-img-icon">🔑</div>
          <div
            className="usr-modal-title"
          >
            Session Started
          </div>
          <div className="txt-body-mb">
            You are now logged in as <strong>{user.name}</strong>. Session has
            been logged.
          </div>
          <ActionBtn label="Close" onClick={onClose} />
        </div>
      )}
    </Modal>
  );
}

// ─── Update Plans Modal ───────────────────────────────────────────────────────
function UpdatePlansModal({ user, onClose }) {
  const plans = ["Basic", "Standard", "Professional", "Enterprise", "Custom"];
  const [selected, setSelected] = useState("Standard");
  return (
    <Modal
      title="Update Plans"
      subtitle={`Change plan for ${user.name}`}
      onClose={onClose}
      width={440}
    >
      <div
        className="usr-col-gap8"
      >
        {plans.map((p) => (
          <label
            key={p}
            className="usr-plan-opt" style={{ '--bdr': selected === p ? T : "#e2e8f0", '--bg': selected === p ? "#f0fdfa" : "#f8fafc" }}
          >
            <input
              type="radio"
              name="plan"
              checked={selected === p}
              onChange={() => setSelected(p)}
              className="perm-check usr-radio-accent" style={{ '--ac': T }}
            />
            <span
              className="usr-plan-lbl" style={{ '--c': selected === p ? T : "#334155" }}
            >
              {p}
            </span>
          </label>
        ))}
      </div>
      <div className="toolbar-end">
        <CancelBtn onClick={onClose} />
        <ActionBtn label="Update Plan" onClick={onClose} />
      </div>
    </Modal>
  );
}

// ─── Make Status Modal ────────────────────────────────────────────────────────
function MakeStatusModal({ user, onSave, onClose }) {
  const statuses = [
    {
      value: "active",
      label: "Active",
      color: "#16a34a",
      bg: "#dcfce7",
      desc: "User can log in and access all features.",
    },
    {
      value: "warning",
      label: "Warning",
      color: "#d97706",
      bg: "#fef3c7",
      desc: "User is flagged. Limited access may apply.",
    },
    {
      value: "blocked",
      label: "InActive",
      color: "#dc2626",
      bg: "#fee2e2",
      desc: "User is inactive and cannot log in.",
    },
  ];
  const [selected, setSelected] = useState(user.status);
  return (
    <Modal
      title="Change User Status"
      subtitle={`Update status for ${user.name}`}
      onClose={onClose}
      width={440}
    >
      <div
        className="usr-col-gap8"
      >
        {statuses.map((s) => (
          <label
            key={s.value}
            className="usr-perm-opt" style={{ '--bdr': selected === s.value ? s.color : "#e2e8f0", '--bg': selected === s.value ? s.bg : "#f8fafc" }}
          >
            <input
              type="radio"
              name="status"
              checked={selected === s.value}
              onChange={() => setSelected(s.value)}
              className="perm-check usr-radio-accent" style={{ '--ac': s.color }}
            />
            <div>
              <div className="stat-num-val" style={{ '--c': s.color }}>
                {s.label}
              </div>
              <div className="txt-body-mt">
                {s.desc}
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="toolbar-end">
        <CancelBtn onClick={onClose} />
        <ActionBtn
          label="Apply Status"
          onClick={() => {
            onSave(selected);
            onClose();
          }}
        />
      </div>
    </Modal>
  );
}

// ─── Clear History Modal ──────────────────────────────────────────────────────
function ClearHistoryModal({ user, onClose }) {
  const [done, setDone] = useState(false);
  return (
    <Modal
      title="Clear History"
      subtitle={`Clear activity history for ${user.name}`}
      onClose={onClose}
      width={420}
    >
      {!done ? (
        <>
          <div
            className="alert-danger"
          >
            <div
              className="alert-title dyn-color" style={{ '--c': "#dc2626" }}
            >
              ⚠️ This action cannot be undone
            </div>
            <div className="alert-body">
              You are about to permanently delete all login history, session
              logs and activity records for <strong>{user.name}</strong>.
            </div>
          </div>
          <div className="toolbar-end">
            <CancelBtn onClick={onClose} />
            <button
              onClick={() => setDone(true)}
              className="usr-btn-danger"
            >
              Yes, Clear History
            </button>
          </div>
        </>
      ) : (
        <div className="txt-center-20">
          <div className="txt-img-icon">✅</div>
          <div
            className="usr-modal-title"
          >
            History Cleared
          </div>
          <div className="txt-body-mb">
            All history for <strong>{user.name}</strong> has been removed.
          </div>
          <ActionBtn label="Close" onClick={onClose} />
        </div>
      )}
    </Modal>
  );
}

// ─── User Update History Modal ────────────────────────────────────────────────
function UpdateHistoryModal({ user, onClose }) {
  const history = [
    {
      date: "2024-06-25 14:32",
      action: "Status changed",
      detail: "active → warning",
      by: "admin@mcp.com",
    },
    {
      date: "2024-06-20 09:11",
      action: "Plan updated",
      detail: "Basic → Standard",
      by: "admin@mcp.com",
    },
    {
      date: "2024-06-14 16:45",
      action: "Password reset",
      detail: "Via admin panel",
      by: "superadmin",
    },
    {
      date: "2024-06-01 10:00",
      action: "Role changed",
      detail: "Clients → C-Admins",
      by: "admin@mcp.com",
    },
    {
      date: "2024-05-18 08:22",
      action: "Account created",
      detail: "New user added",
      by: "superadmin",
    },
  ];
  return (
    <Modal
      title="User Update History"
      subtitle={`Audit trail for ${user.name}`}
      onClose={onClose}
      width={580}
    >
      <div className="f-col-8">
        {history.map((h, i) => (
          <div
            key={i}
            className="usr-history-row"
          >
            <div
              className="txt-mono"
            >
              {h.date}
            </div>
            <div className="txt-label-md">
              {h.action}
            </div>
            <div className="txt-body-3">{h.detail}</div>
            <div className="txt-muted-r">
              {h.by}
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-16-end"
      >
        <CancelBtn onClick={onClose} />
      </div>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ user, onDelete, onClose }) {
  return (
    <Modal
      title="Delete User"
      subtitle="This action is permanent"
      onClose={onClose}
      width={400}
    >
      <div
        className="alert-danger"
      >
        <div
          className="alert-title dyn-color" style={{ '--c': "#dc2626" }}
        >
          ⚠️ Cannot be undone
        </div>
        <div className="alert-body">
          Are you sure you want to permanently delete{" "}
          <strong>{user.name}</strong>? All associated data will be removed.
        </div>
      </div>
      <div className="toolbar-end">
        <CancelBtn onClick={onClose} />
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="usr-btn-danger"
        >
          Delete User
        </button>
      </div>
    </Modal>
  );
}

// ─── Ninja User Modal ─────────────────────────────────────────────────────────
function NinjaUserModal({ user, onClose }) {
  const [active, setActive] = useState(false);
  return (
    <Modal
      title="Ninja User Mode"
      subtitle="Silent admin access without audit trail"
      onClose={onClose}
      width={420}
    >
      <div
        className="onb-dark-card"
      >
        <div className="txt-hero-icon">🥷</div>
        <div
          className="txt-hero-title"
        >
          Ninja Mode for {user.name}
        </div>
        <div className="txt-body-2">
          Access this account invisibly. User will not be notified.
        </div>
      </div>
      <div
        className="action-row mb-10"
      >
        <span className="txt-name">
          Enable Ninja Mode
        </span>
        <div
          onClick={() => setActive((a) => !a)}
          className="usr-toggle" style={{ '--c': active ? "#0d9488" : "#cbd5e1" }}
        >
          <div
            className="usr-toggle-thumb" style={{ '--left': active ? '23px' : '3px' }}
          />
        </div>
      </div>
      <div className="toolbar-end">
        <CancelBtn onClick={onClose} />
        <ActionBtn
          label={active ? "Activate Ninja Mode" : "Close"}
          onClick={onClose}
        />
      </div>
    </Modal>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({ onAdd, onClose }) {
  return (
    <Modal
      title="Add New User"
      subtitle="Create a new user account"
      onClose={onClose}
      width={560}
    >
      <div
        className="usr-grid-2"
      >
        <FormInput label="Full Name" placeholder="e.g. John Doe" />
        <FormInput label="Email" placeholder="email@example.com" type="email" />
        <FormSelect
          label="Role"
          defaultValue="Clients"
          options={USER_TYPES.filter((t) => t !== "All")}
        />
        <FormInput label="Region" placeholder="e.g. US, EU, APAC" />
        <FormSelect
          label="Status"
          defaultValue="active"
          options={["active", "warning", "blocked"]}
        />
      </div>
      <div
        className="usr-action-row-end"
      >
        <CancelBtn onClick={onClose} />
        <ActionBtn
          label="Create User"
          onClick={() => {
            onAdd();
            onClose();
          }}
        />
      </div>
    </Modal>
  );
}

// ─── UserActions component ────────────────────────────────────────────────────
function UserActions({ user, onBlock, onDelete, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isBlocked = user.status === "blocked";
  const openModal = (key) => {
    setOpen(false);
    setModal(key);
  };

  return (
    <>
      {modal === "view" && (
        <ViewModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "edit" && (
        <EditModal
          user={user}
          onSave={() => {}}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "loginAs" && (
        <LoginAsModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "ninjaUser" && (
        <NinjaUserModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "updatePlans" && (
        <UpdatePlansModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "makeStatus" && (
        <MakeStatusModal
          user={user}
          onSave={(s) => onStatusChange(user, s)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "clearHistory" && (
        <ClearHistoryModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "updateHistory" && (
        <UpdateHistoryModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "delete" && (
        <DeleteModal
          user={user}
          onDelete={() => onDelete(user)}
          onClose={() => setModal(null)}
        />
      )}

      <div ref={ref} className="f-gap-4">
        {PRIMARY_ACTIONS.map((a) => (
          <button
            key={a.key}
            title={a.title}
            onClick={() => openModal(a.key)}
            className="usr-action-icon" style={{ '--bg': `${a.color}15`, '--c': a.color }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `${a.color}30`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `${a.color}15`)
            }
          >
            {a.icon}
          </button>
        ))}

        <button
          title={isBlocked ? "Active" : "InActive"}
          onClick={() => onBlock(user)}
          className={`usr-toggle-block-btn ${isBlocked ? "blocked" : "unblocked"}`}
        >
          {isBlocked ? "Active" : "InActive"}
        </button>

        <div className="p-rel">
          <button
            onClick={() => setOpen((o) => !o)}
            title="More actions"
            className={`usr-action-dots ${open ? "open" : "closed"}`}
          >
            ⋯
          </button>

          {open && (
            <div
              className="usr-action-menu"
            >
              <div
                className="usr-action-hdr"
              >
                <div
                  className="txt-label"
                >
                  {user.name}
                </div>
                <div className="txt-slate">
                  {user.email}
                </div>
              </div>
              {MORE_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => openModal(a.key)}
                  className="usr-action-item"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    className="usr-action-icon" style={{ '--bg': `${a.color}15`, '--c': a.color }}
                  >
                    {a.icon}
                  </span>
                  <span
                    className="txt-name"
                  >
                    {a.label}
                  </span>
                </button>
              ))}
              <div
                className="detail-sep"
              />
              <button
                onClick={() => openModal("delete")}
                className="usr-action-item"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fef2f2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className="usr-action-icon-del"
                >
                  🗑
                </span>
                <span
                  className="txt-danger"
                >
                  Delete User
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Active/Inactive Tabs ─────────────────────────────────────────────────────
function ActiveInactiveTabs({ value, onChange, activeCount, inactiveCount }) {
  const tabs = [
    {
      key: "active",
      label: "Active",
      count: activeCount,
      color: "#16a34a",
      bg: "#dcfce7",
      dot: "#22c55e",
    },
    {
      key: "inactive",
      label: "Inactive",
      count: inactiveCount,
      color: "#d9060d",
      bg: "#fef3c7",
      dot: "#f59e0b",
    },
  ];
  return (
    <div className="tab-bar">
      {tabs.map(({ key, label, count, color, bg, dot }) => {
        const on = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`svc-tab-btn ${on ? "on" : "off"}`} style={{ '--c': color }}
          >
            <span
              className={`svc-tab-dot ${on ? "on" : "off"}`} style={{ '--c': dot }}
            />
            {label}
            <span
              className={`svc-tab-pill ${on ? "on" : "off"}`} style={{ '--bg': bg, '--c': color }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PageUsers({ role = "admin", setPage }) {
  const [users, setUsers] = useState(initialUserRows);
  const [partnerAccounts, setPartnerAccounts] = useState(
    PARTNER_SUB_ACCOUNTS_INIT,
  );
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState("active");
  const isPartner = role === "partner";

  // ── User actions ──
  const handleBlock = (user) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === user.email
          ? { ...u, status: u.status === "blocked" ? "active" : "blocked" }
          : u,
      ),
    );
  };
  const handleDelete = (user) => {
    setUsers((prev) => prev.filter((u) => u.email !== user.email));
  };
  const handleStatusChange = (user, newStatus) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === user.email ? { ...u, status: newStatus } : u,
      ),
    );
  };
  const handleAddUser = () => {
    // placeholder — in real app would collect form data
  };

  const isActiveStatus = (u) => u.status === "active";
  const isInactiveStatus = (u) => u.status !== "active";

  const filtered = users.filter((u) => {
    const matchStatus =
      statusTab === "active" ? isActiveStatus(u) : isInactiveStatus(u);
    const matchType = activeType === "All" || u.role === activeType;
    const matchQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchType && matchQuery;
  });

  const activeUsersCount = users.filter(isActiveStatus).length;
  const inactiveUsersCount = users.filter(isInactiveStatus).length;

  // ── Partner view ──
  const [expandedAccounts, setExpandedAccounts] = useState({});
  const [partnerTab, setPartnerTab] = useState("active");
  const toggleAccount = (id) =>
    setExpandedAccounts((p) => ({ ...p, [id]: !p[id] }));
  const SERVICES_PREVIEW = 4;

  const handlePartnerToggle = (id) => {
    setPartnerAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: !a.status } : a)),
    );
  };

  const filteredPartnerAccounts = partnerAccounts.filter((u) =>
    partnerTab === "active" ? u.status === true : u.status === false,
  );
  const activePartnerCount = partnerAccounts.filter(
    (u) => u.status === true,
  ).length;
  const inactivePartnerCount = partnerAccounts.filter(
    (u) => u.status === false,
  ).length;

  if (isPartner) {
    return (
      <div>
        <div
          className="usr-table-card"
        >
          <div
            className="flex-between p-10-14"
          >
            <div>
              <div className="txt-label-lg">
                My Sub-Accounts
              </div>
              <div className="txt-slate-11">
                {partnerAccounts.length} accounts ·{" "}
                {partnerAccounts.reduce((s, u) => s + u.services.length, 0)}{" "}
                total services
              </div>
            </div>
            <button
              className="usr-btn-save" style={{ '--c': T }}
            >
              ⊕ New Account
            </button>
          </div>
          <ActiveInactiveTabs
            value={partnerTab}
            onChange={setPartnerTab}
            activeCount={activePartnerCount}
            inactiveCount={inactivePartnerCount}
          />
        </div>

        <div className="f-col-12">
          {filteredPartnerAccounts.length === 0 && (
            <div
              className="usr-empty"
            >
              No {partnerTab} accounts found.
            </div>
          )}
          {filteredPartnerAccounts.map((u) => {
            const isExpanded = !!expandedAccounts[u.id];
            const preview = u.services.slice(0, SERVICES_PREVIEW);
            const rest = u.services.slice(SERVICES_PREVIEW);
            return (
              <div
                key={u.id}
                className="usr-partner-card" style={{ '--bdr': u.status ? "#e8ecf3" : "#fee2e2" }}
              >
                <div
                  className="usr-partner-row" style={{ '--bb': isExpanded ? '1px solid #f1f5f9' : 'none', '--bg': u.status ? '#fff' : '#fff9f9' }}
                >
                  <div
                    className="usr-table-cell"
                  >
                    <div
                      className="usr-partner-avatar" style={{ '--bg': u.status ? 'linear-gradient(135deg,#0d9488,#0891b2)' : '#f1f5f9', '--c': u.status ? '#fff' : '#94a3b8' }}
                    >
                      {u.name.slice(0, 3)}
                    </div>
                    <div>
                      <div
                        className="txt-label"
                      >
                        {u.name}
                      </div>
                      <div className="txt-muted-xs">
                        ID: {u.id}
                      </div>
                    </div>
                  </div>
                  <div className="p-card">
                    <span
                      className="usr-plan-badge"
                    >
                      {u.type}
                    </span>
                  </div>
                  <div className="p-card">
                    <div
                      className="txt-body-2"
                    >
                      Last Login
                    </div>
                    <div
                      className="usr-login-val"
                    >
                      {u.lastLogin}
                    </div>
                  </div>
                  <div className="p-card">
                    <div
                      className="txt-body-2"
                    >
                      Last Accessed From
                    </div>
                    <div
                      className="usr-txt-mono"
                    >
                      {u.lastAccessed}
                    </div>
                  </div>
                  {/* Clickable status toggle */}
                  <div className="p-card">
                    <div
                      onClick={() => handlePartnerToggle(u.id)}
                      className="usr-toggle" style={{ '--c': u.status ? T : "#cbd5e1" }}
                    >
                      <div
                        className="usr-toggle-thumb" style={{ '--left': u.status ? '23px' : '3px' }}
                      />
                    </div>
                  </div>
                  <div
                    className="usr-service-wrap"
                  >
                    {preview.map((svc) => (
                      <span
                        key={svc}
                        className="usr-svc-tag" style={{ '--c': T }}
                      >
                        {svc}
                      </span>
                    ))}
                    {rest.length > 0 && (
                      <button
                        onClick={() => toggleAccount(u.id)}
                        className="usr-svc-add" style={{ '--c': T }}
                      >
                        {isExpanded ? "▲ Less" : `+${rest.length} more`}
                      </button>
                    )}
                  </div>
                  <div
                    className="usr-tabs-wrap"
                  >
                    <button
                      title="View"
                      className="usr-icon-teal"
                    >
                      👁
                    </button>
                    <button
                      title="Edit"
                      className="usr-icon-blue"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div
                    className="tab-body"
                  >
                    <div
                      className="txt-section-hd mb-10"
                    >
                      All Services ({u.services.length})
                    </div>
                    <div
                      className="usr-permission-grid"
                    >
                      {u.services.map((svc) => {
                        const isTrue = svc.endsWith("True");
                        return (
                          <div
                            key={svc}
                            className="usr-perm-item" style={{ '--bdr': isTrue ? "#99f6e4" : "#fecaca" }}
                          >
                            <span>{svc.replace(/ - (True|False)$/, "")}</span>
                            <span
                              className="usr-perm-badge" style={{ '--c': isTrue ? T : "#dc2626" }}
                            >
                              {isTrue ? "True" : "False"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Admin view ────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="g-stats4 mb-section">
        {[
          { label: "Total Users", value: TOTAL_USERS, color: BLUE },
          {
            label: "Active",
            value: users.filter((u) => u.status === "active").length,
            color: GREEN,
          },
          {
            label: "Inactive",
            value: users.filter((u) => u.status === "warning").length,
            color: AMBER,
          },
          {
            label: "Blocked",
            value: users.filter((u) => u.status === "blocked").length,
            color: ROSE,
          },
        ].map(({ label, value, color }) => (
          <Card
            key={label}
            className="stat-top-4" style={{ '--c': color }}
          >
            <div
              className="kpi-stat"
            >
              {value}
            </div>
            <div className="stat-sublabel">
              {label}
            </div>
          </Card>
        ))}
      </div>

      <div className="g-split2 mb-section">
        <Card>
          <SectionTitle>Login &amp; Action Activity</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repTrend}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line dataKey="visits" stroke="#2563eb" strokeWidth={2} />
              <Line
                dataKey="clicks"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Users by Type</SectionTitle>
          <div className="f-gap-14">
            <div className="p-rel-sh">
              <PieChart width={110} height={110}>
                <Pie
                  data={TYPE_COUNTS}
                  dataKey="count"
                  cx={52}
                  cy={52}
                  innerRadius={28}
                  outerRadius={50}
                  paddingAngle={2}
                >
                  {TYPE_COUNTS.map((t, i) => (
                    <Cell key={i} fill={t.color} />
                  ))}
                </Pie>
              </PieChart>
              <div
                className="usr-donut-label"
              >
                {TOTAL_USERS}
              </div>
            </div>
            <div
              className="usr-legend-item"
            >
              {TYPE_COUNTS.map((t) => (
                <div
                  key={t.label}
                  className="f-gap-7"
                >
                  <div
                    className="usr-legend-dot" style={{ '--c': t.color }}
                  />
                  <span
                    className="usr-legend-count"
                  >
                    {t.count}
                  </span>
                  <span
                    className="usr-legend-name"
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div
          className="usr-filter-wrap"
        >
          <SectionTitle>User Directory</SectionTitle>
          <div className="f-gap-8">
            <input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="usr-filter-select"
            />
            <button
              onClick={() => setPage && setPage("user-onboarding")}
              className="btn-success"
            >
              + Add User
            </button>
          </div>
        </div>

        <ActiveInactiveTabs
          value={statusTab}
          onChange={(v) => {
            setStatusTab(v);
            setActiveType("All");
          }}
          activeCount={activeUsersCount}
          inactiveCount={inactiveUsersCount}
        />

        <div
          className="usr-perm-filter-bar"
        >
          {USER_TYPES.map((t) => {
            const isActive = activeType === t;
            const color = t === "All" ? BLUE : TYPE_COLORS[t];
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className="usr-perm-filter-pill" style={{ '--bdr': color, '--bg': isActive ? color : "#fff", '--c': isActive ? "#fff" : "#64748b" }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="table-wrap"><table
          className="dt dt-lg"
        >
          <thead>
            <tr className="dt-head-row">
              {[
                "User",
                "Email",
                "Type",
                "Region",
                "Sessions",
                "Last Login",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="dt-th"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr
                key={i}
                className="dt-tr-plain"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td className="p-10">
                  <div
                    className="f-gap-10"
                  >
                    <div
                      className="usr-avatar-sm" style={{ '--bg': TYPE_COLORS[u.role] ? `${TYPE_COLORS[u.role]}22` : "#e2e8f0", '--bdr': TYPE_COLORS[u.role] || "#cbd5e1", '--c': TYPE_COLORS[u.role] || "#334155" }}
                    >
                      {u.name[0]}
                    </div>
                    <span className="txt-strong-w">{u.name}</span>
                  </div>
                </td>
                <td className="td-p-10s">{u.email}</td>
                <td className="p-10">
                  <Badge color={TYPE_COLORS[u.role] || BLUE}>{u.role}</Badge>
                </td>
                <td className="p-10">{u.region}</td>
                <td className="p-10">{u.sessions}</td>
                <td className="td-p-10s">{u.lastLogin}</td>
                <td className="p-10">
                  <span
                    className="usr-status-dot" style={{ '--c': STATUS_COLOR(u.status) }}
                  />
                  <span
                    className="txt-cap"
                  >
                    {u.status}
                  </span>
                </td>
                <td className="td-p">
                  <UserActions
                    user={u}
                    onBlock={handleBlock}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="dt-empty"
                >
                  No {statusTab} users found
                  {activeType !== "All" ? ` for ${activeType}` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}
