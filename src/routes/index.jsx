import PageOverview from "../pages/Overview";
import PageBlock from "../pages/Block";
import PageAPKs from "../pages/APKs";
import PageReporting from "../pages/Reporting";
import PageUsers from "../pages/Users";
import PageServices from "../pages/Services";
import PageDevice from "../pages/Device_Networks";
import PageGeo from "../pages/Geo";
import PageOnboarding from "../pages/Onboarding";
import PageUserOnboarding from "../pages/Onboarding_users.jsx";
import PagePartners from "../pages/Partners";
import PageStub from "../pages/Stub";

const ALIASES = {
  "users-all": "users",
  "users-roles": "users",
  "svc-registry": "services",
  "svc-api": "services",
  "svc-webhooks": "services",
};

export default function PageRouter({ page, role = "admin", setPage }) {
  const key = ALIASES[page] ?? page;

  if (key === "users") return <PageUsers role={role} setPage={setPage} />;
  if (key === "services") return <PageServices role={role} setPage={setPage} />;
  if (key === "onboarding") return <PageOnboarding setPage={setPage} />;
  if (key === "user-onboarding")
    return <PageUserOnboarding setPage={setPage} />;
  if (key === "partners") return <PagePartners />;

  const ROUTES = {
    overview: <PageOverview />,
    reporting: <PageReporting />,
    block: <PageBlock />,
    apks: <PageAPKs />,
    device: <PageDevice />,
    geo: <PageGeo />,
    audit: <PageStub title="Audit Log" icon="📋" />,
    docs: <PageStub title="Documentation" icon="📖" />,
    sandbox: <PageStub title="Sandbox Environment" icon="🧪" />,
  };

  return ROUTES[key] ?? <PageOverview />;
}
