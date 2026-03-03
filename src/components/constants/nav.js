import { GREEN } from "./colors";

export const NAV_GROUPS = [
  {
    group: null,
    items: [
      {
        key: "overview",
        label: "Dashboard",
        icon: "▦",
        roles: ["admin", "partner"],
      },
    ],
  },
  {
    group: "Analytics",
    items: [
      {
        key: "reporting",
        label: "Reporting",
        icon: "≡",
        roles: ["admin", "partner"],
      },
      {
        key: "block",
        label: "Block Reasons",
        icon: "⊗",
        roles: ["admin", "partner"],
      },
      {
        key: "device",
        label: "Device Stats",
        icon: "⊡",
        roles: ["admin", "partner"],
      },
      {
        key: "apks",
        label: "APK Stats",
        icon: "📦",
        roles: ["admin", "partner"],
      },
    ],
  },
  {
    group: "Management",
    items: [
      {
        key: "users",
        label: "Manage Users",
        icon: "◎",
        roles: ["admin", "partner"],
      },
      {
        key: "services",
        label: "Manage Services",
        icon: "⚙",
        roles: ["admin", "partner"],
      },
      {
        key: "geo",
        label: "GEO Stats",
        icon: "⊕",
        roles: ["admin", "partner"],
      },
      {
        key: "partners",
        label: "Partners",
        icon: "◈",
        roles: ["admin"],
        badge: { n: "12", c: GREEN },
      },
      {
        key: "audit",
        label: "Audit Log",
        icon: "📋",
        roles: ["admin"],
        badge: { n: "New", c: GREEN },
      },
    ],
  },
  {
    group: "Resources",
    items: [
      {
        key: "docs",
        label: "Documentation",
        icon: "📖",
        roles: ["admin", "partner"],
      },
      {
        key: "sandbox",
        label: "Sandbox Environment",
        icon: "📋",
        roles: ["admin"],
        badge: { n: "New", c: GREEN },
      },
    ],
  },
];

export const ALL_PAGES = NAV_GROUPS.flatMap((g) => g.items);

export function groupsForRole(role) {
  const groups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);

  // 👉 Special rule for Partner
  if (role === "partner") {
    const topKeys = ["overview", "users", "services"];

    const topItems = [];
    const moreItems = [];

    groups.forEach((g) => {
      g.items.forEach((item) => {
        if (topKeys.includes(item.key)) {
          topItems.push(item);
        } else {
          moreItems.push(item);
        }
      });
    });

    return [
      { group: null, items: topItems },
      { group: "More", items: moreItems },
    ];
  }

  return groups;
}
