/** Server options + API base for the panel (Bovary Club Society) */
window.BOVA_CONFIG = {
  roles: [
    { id: "1424562832573206568", name: "BovaryMember" },
    { id: "1384173136177791048", name: "Crew Leader" },
    { id: "1542169549833773156", name: "Panel Access" },
    { id: "1547647694997037137", name: "Staff API" },
  ],
  channels: [
    // Meets / announcements (panel pickers)
    { id: "1384173136638906401", name: "⭐┃legacy-meets" },
    { id: "1541614511268831313", name: "🦉┃owl-session-legacy" },
    { id: "1532045910073147412", name: "🐺┃fivem-meets" },
    { id: "1384173136638906403", name: "📬┃announcements" },
    { id: "1533492240343629865", name: "🏷️┃fivem-server" },
    { id: "1425297078816473109", name: "Polls channel" },
    // Media / auto-react channels (IDs only — names optional in Discord)
    { id: "1384173879295213689", name: "Media · auto-react" },
    { id: "1384174586345816134", name: "Media · auto-react" },
    { id: "1537555862372094112", name: "Media · auto-react" },
    { id: "1424515140660760647", name: "Media · auto-react" },
    { id: "1425870476290428978", name: "Media · auto-react" },
    { id: "1532220539257622649", name: "Media · auto-react" },
    { id: "1531071911499661352", name: "Media · auto-react" },
    { id: "1425669117750284318", name: "Media · auto-react" },
    { id: "1424509207172087849", name: "Media · auto-react" },
    { id: "1384173136853078038", name: "Media · auto-react" },
    { id: "1533128981774340176", name: "Media · auto-react" },
    { id: "1545100118103949442", name: "Media · auto-react" },
    { id: "1384173137071177753", name: "Media · auto-react" },
  ],
  hosts: ["Bassani_", "JuanLuma99", "BLACKGHOSTz4", "_Mickey-"],
  servers: ["GTAO Legacy", "FiveM Fenrir Yakuza"],
  emojis: ["✨", "🌟", "💥", "🎉", "❤️", "🔥", "💯", "🎀", "🚗", "⭐", "🐺", "🦉", "✅", "🎫", "💜"],
};

/** Render public URL of the bot API (no trailing slash). Set after deploy. */
window.BOVA_API = {
  baseUrl: "https://bovarybot.onrender.com",
};
