/** Server options + API base for the panel (Bovary Club Society) */
window.BOVA_CONFIG = {
  roles: [
    { id: "1424562832573206568", name: "BovaryMember" },
    { id: "1384173136177791048", name: "Crew Leader" },
    { id: "1542169549833773156", name: "Panel Access" },
    { id: "1547647694997037137", name: "Staff API" },
  ],
  channels: [
    { id: "1384173136638906401", name: "⭐┃legacy-meets" },
    { id: "1541614511268831313", name: "🦉┃owl-session-legacy" },
    { id: "1532045910073147412", name: "🐺┃fivem-meets" },
    { id: "1384173136638906403", name: "📬┃announcements" },
    { id: "1533492240343629865", name: "🏷️┃fivem-server" },
  ],
  hosts: ["Bassani_", "JuanLuma99", "BLACKGHOSTz4", "_Mickey-"],
  servers: ["GTAO Legacy", "FiveM Fenrir Yakuza"],
  emojis: ["❤️", "🔥", "💯", "💥", "🎀", "🚗", "⭐", "🐺", "🦉", "✅", "🎫", "💜"],
};

/** Render public URL of the bot API (no trailing slash). Set after deploy. */
window.BOVA_API = {
  baseUrl: "https://bovarybot.onrender.com",
};
