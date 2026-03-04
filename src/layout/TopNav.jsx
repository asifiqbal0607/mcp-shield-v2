import { useState } from "react";
import { groupsForRole } from "../constants/nav";

export default function TopNav({ role, page, setPage, onLogout }) {
  const [openGroup, setOpenGroup] = useState(null);
  const groups = groupsForRole(role);
  const isPartner = role === "partner";
  const flatItems = groups
    .filter((g) => g.group === null)
    .flatMap((g) => g.items);
  const groupedSecs = groups.filter((g) => g.group !== null);
  const allPartnerItems = [
    ...flatItems,
    ...groupedSecs.flatMap((g) => g.items),
  ];
  const partnerVisible = allPartnerItems.slice(0, 3);
  const partnerMore = allPartnerItems.slice(3);
  const moreHasActive = partnerMore.some((i) => i.key === page);
  const closeAll = () => setOpenGroup(null);
  const toggleGroup = (g) => setOpenGroup((open) => (open === g ? null : g));

  const NavTabs = () => (
    <div className="tnav-nav-hl">
      {isPartner ? (
        <>
          {partnerVisible.map((p) => (
            <button
              key={p.key}
              className={`nav-tab${page === p.key ? " active" : ""}`}
              onClick={() => {
                setPage(p.key);
                closeAll();
              }}
            >
              <span className="t-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
          {partnerMore.length > 0 && (
            <div className="tnav-nav-link">
              <button
                className={`group-btn${moreHasActive ? " active" : ""}${openGroup === "__more__" ? " open" : ""}`}
                onClick={() => toggleGroup("__more__")}
              >
                ⊞ MORE <span className="chev">▾</span>
              </button>
              {openGroup === "__more__" && (
                <>
                  <div className="tnav-overlay" onClick={closeAll} />
                  <div className="group-drop tnav-dropdown">
                    {partnerMore.map((p) => (
                      <button
                        key={p.key}
                        className={`drop-item${page === p.key ? " active" : ""}`}
                        onClick={() => {
                          setPage(p.key);
                          closeAll();
                        }}
                      >
                        <span className="di-ic">{p.icon}</span>
                        <span className="tnav-dropdown-flex">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {flatItems.map((p) => (
            <button
              key={p.key}
              className={`nav-tab${page === p.key ? " active" : ""}`}
              onClick={() => {
                setPage(p.key);
                closeAll();
              }}
            >
              <span className="t-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
          {groupedSecs.map((sec) => {
            const secActive = sec.items.some((i) => i.key === page);
            const isOpen = openGroup === sec.group;
            return (
              <div key={sec.group} className="tnav-nav-link">
                <button
                  className={`group-btn${secActive ? " active" : ""}${isOpen ? " open" : ""}`}
                  onClick={() => toggleGroup(sec.group)}
                >
                  {sec.group} <span className="chev">▾</span>
                </button>
                {isOpen && (
                  <>
                    <div className="tnav-overlay" onClick={closeAll} />
                    <div className="group-drop">
                      <div className="tnav-dropdown-label">{sec.group}</div>
                      {sec.items.map((p) => (
                        <button
                          key={p.key}
                          className={`drop-item${page === p.key ? " active" : ""}`}
                          onClick={() => {
                            setPage(p.key);
                            closeAll();
                          }}
                        >
                          <span className="di-ic">{p.icon}</span>
                          <span className="tnav-dropdown-flex">{p.label}</span>
                          {p.badge && (
                            <span
                              className="tnav-dropdown-badge"
                              style={{
                                "--bg": `${p.badge.c}25`,
                                "--c": p.badge.c,
                              }}
                            >
                              {p.badge.n}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  return (
    <header className="tnav-header">
      <div
        className="tnav-inner"
        onClick={(e) => {
          if (e.currentTarget === e.target) closeAll();
        }}
      >
        {/* Logo */}
        <div className="tnav-brand">
          <div className="tnav-logo">S</div>
          <div>
            <div className="tnav-product-name">MCP Shield</div>
            <div className="tnav-product-sub">
              {isPartner ? "Partner Portal" : "Admin Portal"}
            </div>
          </div>
        </div>

        <div className="nav-divider" />
        <div className="tnav-nav-area">
          <NavTabs />
        </div>

        {/* Right */}
        <div className="tnav-right">
          <div className="tnav-status">
            <span className="tnav-status-dot" />
            <span className="tnav-status-text">LIVE · ZA</span>
          </div>
          <div className="nav-divider" />
          <div className="role-pill">
            {["admin", "partner"].map((r) => (
              <button
                key={r}
                className={`rp-btn ${role === r ? "on" : "off"}`}
                onClick={() => setPage("overview", r)}
              >
                {r === "admin" ? "Admin" : "Partner"}
              </button>
            ))}
          </div>
          <div className="nav-divider" />
          <div className="tnav-notif-wrap">
            <button className="tnav-notif-btn">🔔</button>
            <span className="tnav-notif-pip" />
          </div>
          <div className="tnav-avatar">{isPartner ? "P" : "A"}</div>
          <div className="nav-divider" />
          <button className="tnav-logout-btn" onClick={onLogout} type="button">
            ⏻ Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
