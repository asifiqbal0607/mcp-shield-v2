import { useState } from "react";
import { groupsForRole } from "../constants/nav";

export default function TopNav({ role, page, setPage }) {
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
  const partnerVisible = allPartnerItems.slice(0, 4);
  const partnerMore = allPartnerItems.slice(4);
  const moreHasActive = partnerMore.some((i) => i.key === page);
  const closeAll = () => setOpenGroup(null);
  const toggleGroup = (g) => setOpenGroup((open) => (open === g ? null : g));

  const NavTabs = () => (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
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
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                className={`group-btn${moreHasActive ? " active" : ""}${openGroup === "__more__" ? " open" : ""}`}
                onClick={() => toggleGroup("__more__")}
              >
                ⊞ MORE <span className="chev">▾</span>
              </button>
              {openGroup === "__more__" && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 499 }}
                    onClick={closeAll}
                  />
                  <div
                    className="group-drop"
                    style={{ left: "auto", right: 0 }}
                  >
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
                        <span style={{ flex: 1 }}>{p.label}</span>
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
              <div
                key={sec.group}
                style={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  className={`group-btn${secActive ? " active" : ""}${isOpen ? " open" : ""}`}
                  onClick={() => toggleGroup(sec.group)}
                >
                  {sec.group} <span className="chev">▾</span>
                </button>
                {isOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 499 }}
                      onClick={closeAll}
                    />
                    <div className="group-drop">
                      <div
                        style={{
                          padding: "4px 12px 8px",
                          fontSize: 9,
                          fontWeight: 600,
                          color: "var(--gold)",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          fontFamily: "'Poppins Condensed', sans-serif",
                        }}
                      >
                        {sec.group}
                      </div>
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
                          <span style={{ flex: 1 }}>{p.label}</span>
                          {p.badge && (
                            <span
                              style={{
                                background: `${p.badge.c}25`,
                                color: p.badge.c,
                                fontSize: 9,
                                fontWeight: 600,
                                padding: "2px 6px",
                                borderRadius: 6,
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
    <header
      style={{
        background:
          "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)",
        borderBottom: "3px solid var(--gold)",
        position: "sticky",
        top: 0,
        zIndex: 200,
        boxShadow: "0 4px 20px rgba(10,22,40,.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          height: 54,
          gap: 0,
        }}
        onClick={(e) => {
          if (e.currentTarget === e.target) closeAll();
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginRight: 24,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: "linear-gradient(135deg, var(--gold), #f5c842)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--navy)",
              boxShadow: "0 2px 10px rgba(232,160,32,.4)",
            }}
          >
            S
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "'Poppins Condensed', sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              MCP Shield
            </div>
            <div
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,.5)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: 1,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {isPartner ? "Partner Portal" : "Admin Portal"}
            </div>
          </div>
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: "rgba(232,160,32,.15)",
              color: "var(--gold)",
              border: "1px solid rgba(232,160,32,.35)",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {isPartner ? "Partner" : "Admin"}
          </div>
        </div>

        <div className="nav-divider" />
        <div style={{ flex: 1, height: "100%" }}>
          <NavTabs />
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 11px",
              borderRadius: 4,
              background: "rgba(13,158,110,.15)",
              border: "1px solid rgba(13,158,110,.3)",
            }}
          >
            <span
              className="live-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0d9e6e",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#0d9e6e",
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: "1px",
              }}
            >
              LIVE · ZA
            </span>
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
          <div style={{ position: "relative" }}>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,.2)",
                background: "rgba(255,255,255,.08)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🔔
            </button>
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#dc2626",
                border: "2px solid var(--navy)",
              }}
            />
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "linear-gradient(135deg, var(--gold), #f5c842)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--navy)",
              cursor: "pointer",
            }}
          >
            {isPartner ? "P" : "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
