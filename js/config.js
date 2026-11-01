/** Bova Core Panel — config sincronizado com o bot v2.15.3 */
window.BOVA_CONFIG = {
  roles: [
    { id: "1542169549833773156", name: "Líder / Acesso ao Painel" },
    { id: "1384173136177791048", name: "Crew Leader / Organizador de Meet" },
    { id: "1547647694997037137", name: "Staff API" },
    { id: "1537850168999809215", name: "FiveMHosts" },
  ],
  channels: [
    /* Meets / anúncios */
    { id: "1384173136638906401", name: "⭐┃legacy-meets" },
    { id: "1541614511268831313", name: "🦉┃owl-session-legacy" },
    { id: "1532045910073147412", name: "🐺┃fivem-meets" },
    { id: "1384173136638906403", name: "📬┃announcements" },
    { id: "1533492240343629865", name: "🏷️┃fivem-server" },
    /* Mídia (auto-react / ranking) */
    { id: "1384173879295213689", name: "Mídia · auto-react" },
    { id: "1384174586345816134", name: "Mídia · auto-react" },
    { id: "1424515140660760647", name: "Mídia · auto-react" },
    { id: "1537555862372094112", name: "Mídia · auto-react" },
    { id: "1425870476290428978", name: "Mídia · auto-react" },
    { id: "1532220539257622649", name: "Mídia · auto-react" },
    { id: "1531071911499661352", name: "Mídia · auto-react" },
    { id: "1425669117750284318", name: "Mídia · auto-react" },
    { id: "1424509207172087849", name: "Mídia · auto-react" },
    { id: "1384173136853078038", name: "Mídia · auto-react" },
    /* Staff / logs */
    { id: "1441663299065217114", name: "Info / logs de membros" },
    { id: "1432715549116207248", name: "Message log (delete/edit)" },
    { id: "1540532050531061921", name: "Sala ignorada no message log (padrão)" },
    { id: "1548153354675556412", name: "WebLogs" },
    { id: "1424436722984423529", name: "Sala do bot" },
    { id: "1548188378623778847", name: "Canal da caixa de DM" },
  ],
  hosts: ["Bassani_", "JuanLuma99", "BLACKGHOSTz4", "_Mickey-"],
  servers: ["GTAO Legacy", "FiveM Fenrir Yakuza"],
  emojis: ["✨", "🌟", "💥", "🎉", "❤️", "🔥", "💯", "🎀", "🚗", "⭐", "🐺", "🦉", "✅", "🎫", "💜"],
};

/**
 * URL pública da API do bot no Render (sem barra no final).
 * Use a URL real do Web Service no dashboard do Render.
 * Se estiver errada/offline, o painel mostra falha de conexão.
 * Dá para sobrescrever no login (campo URL da API) — fica salvo no navegador.
 *
 * Exemplo: "https://nome-do-seu-servico.onrender.com"
 * A URL antiga bovasbot2-0.onrender.com retorna 404 (serviço inexistente).
 */
window.BOVA_API = {
  baseUrl: "https://bovasbots.onrender.com",
};
