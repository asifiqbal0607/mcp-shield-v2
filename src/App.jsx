import { useState } from "react";
import AppLayout from "./layout/AppLayout";
import PageRouter from "./routes";
import Login from "./authentication/Login.jsx";
import Logout from "./authentication/Logout.jsx";

/* ─────────────────────────────────────────────────────────────────────────────
   App.jsx — root component
   ➜ auth + role persisted in localStorage so page refresh keeps session alive
   ➜ auth state:
       null          → <Login />
       'logging-out' → <Logout />
       'admin' | 'partner' → dashboard
───────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY_AUTH = "shield_auth";
const STORAGE_KEY_ROLE = "shield_role";

function readStorage(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_ROLE);
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [auth, setAuth] = useState(() => readStorage(STORAGE_KEY_AUTH, null));
  const [role, setRole] = useState(() =>
    readStorage(STORAGE_KEY_ROLE, "admin"),
  );
  const [page, setPage] = useState("overview");

  /* ── Auth handlers ─────────────────────────────────────────────────────── */
  const handleLogin = (selectedRole) => {
    writeStorage(STORAGE_KEY_AUTH, selectedRole);
    writeStorage(STORAGE_KEY_ROLE, selectedRole);
    setRole(selectedRole);
    setAuth(selectedRole);
    setPage("overview");
  };

  const handleLogoutRequest = () => setAuth("logging-out");

  const handleLogoutConfirm = () => {
    clearStorage();
    setAuth(null);
    setRole("admin");
    setPage("overview");
  };

  const handleLogoutCancel = () => setAuth(role);

  /* ── Nav handler ───────────────────────────────────────────────────────── */
  const handleNav = (newPage, newRole) => {
    if (newRole !== undefined) {
      writeStorage(STORAGE_KEY_ROLE, newRole);
      setRole(newRole);
      setPage("overview");
    } else {
      setPage(newPage);
    }
  };

  /* ── Render gates ──────────────────────────────────────────────────────── */
  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  if (auth === "logging-out") {
    return (
      <Logout
        role={role}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    );
  }

  return (
    <AppLayout
      role={role}
      page={page}
      setPage={handleNav}
      onLogout={handleLogoutRequest}
    >
      <PageRouter page={page} role={role} setPage={handleNav} />
    </AppLayout>
  );
}
