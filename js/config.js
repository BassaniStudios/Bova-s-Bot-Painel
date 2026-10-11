/** Bova Core Panel config — synced with bot v2.12.0 */
window.BOVA_CONFIG = {
  roles: [
    { id: "1542169549833773156", name: "Lider / Panel Access" },
    { id: "1384173136177791048", name: "Crew Leader / Host Meet Organizer" },
    { id: "1547647694997037137", name: "Staff API" },
    { id: "1537850168999809215", name: "FiveMHosts" },
  ],
  channels: [
    /* Meets / announcements */
    { id: "1384173136638906401", name: "⭐┃legacy-meets" },
    { id: "1541614511268831313", name: "🦉┃owl-session-legacy" },
    { id: "1532045910073147412", name: "🐺┃fivem-meets" },
    { id: "1384173136638906403", name: "📬┃announcements" },
    { id: "1533492240343629865", name: "🏷️┃fivem-server" },
    /* Media (auto-react / ranking) — bot CHANNEL_IDS defaults 2026-10 */
    { id: "1384173879295213689", name: "Media · auto-react" },
    { id: "1384174586345816134", name: "Media · auto-react" },
    { id: "1424515140660760647", name: "Media · auto-react" },
    { id: "1537555862372094112", name: "Media · auto-react" },
    { id: "1425870476290428978", name: "Media · auto-react" },
    { id: "1532220539257622649", name: "Media · auto-react" },
    { id: "1531071911499661352", name: "Media · auto-react" },
    { id: "1425669117750284318", name: "Media · auto-react" },
    { id: "1424509207172087849", name: "Media · auto-react" },
    { id: "1384173136853078038", name: "Media · auto-react" },
    /* Staff / logs */
    { id: "1441663299065217114", name: "Info / logs" },
    { id: "1432715549116207248", name: "Message log" },
    { id: "1548153354675556412", name: "WebLogs" },
    { id: "1424436722984423529", name: "Bot room" },
    { id: "1548188378623778847", name: "DM inbox channel" },
    /* Arcade fixed channels */
    { id: "1553823431349371042", name: "The Love Professor" },
    { id: "1531417799300350073", name: "Nazar Speaks" },
    { id: "1554302868293554196", name: "Cursed Horoscope" },
  ],
  hosts: ["Bassani_", "JuanLuma99", "BLACKGHOSTz4", "_Mickey-"],
  servers: ["GTAO Legacy", "FiveM Fenrir Yakuza"],
  emojis: ["✨", "🌟", "💥", "🎉", "❤️", "🔥", "💯", "🎀", "🚗", "⭐", "🐺", "🦉", "✅", "🎫", "💜"],
};

/**
 * Render public URL of the bot API (no trailing slash).
 * Production service: bovasbot2-0.onrender.com
 */
window.BOVA_API = {
  baseUrl: "https://bovasbot2-0.onrender.com",
};
