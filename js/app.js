/* Bova Core Control Center · v2.12.0 · Neon Edition — synced with bot API */
const C = () => window.BOVA_CONFIG || { roles: [], channels: [], hosts: [], servers: [], emojis: [] };
const TZ_LIST = [
  { id: "America/Sao_Paulo", label: "São Paulo (UTC-3)", offset: -3 },
  { id: "UTC", label: "UTC", offset: 0 },
  { id: "America/New_York", label: "New York (UTC-5)", offset: -5 },
  { id: "America/Los_Angeles", label: "Los Angeles (UTC-8)", offset: -8 },
  { id: "Europe/London", label: "London (UTC+0)", offset: 0 },
  { id: "Europe/Paris", label: "Paris (UTC+1)", offset: 1 },
  { id: "Asia/Tokyo", label: "Tokyo (UTC+9)", offset: 9 },
];

const TITLES = {
  dashboard: ["OVERVIEW", "Dashboard"],
  server: ["OVERVIEW", "Server"],
  commands: ["OVERVIEW", "Command Center"],
  diagnostics: ["SYSTEM", "Diagnostics"],
  timestamp: ["AUTOMATION", "Timestamp Reminders"],
  meets: ["ANNOUNCEMENTS", "Meets"],
  arcade: ["AUTOMATION", "Arcade"],
  tickets: ["COMMUNITY", "Tickets"],
  nitro: ["COMMUNITY", "Nitro Raffles"],
  dm: ["PRIVATE SUPPORT", "DM Inbox"],
  namehistory: ["ANALYTICS", "Name History"],
  embed: ["TOOLS", "Embed Builder"],
  stats: ["ANALYTICS", "Stats"],
  weblogs: ["LOGGING", "WebLogs"],
  audit: ["SYSTEM", "Audit & Health"],
  tutorial: ["GUIDE", "Help & Guide"],
};

/* Command catalog synced with bot v2.12.0 — polls discontinued; nitroraffles + fenrir added */
const COMMAND_META = {
  automation: ["timestamp_reminder_config", "timestamp_reminder_status"],
  community: [
    "birthday_announce_channel", "birthday_panel", "invitepanel", "meet",
    "sticky_clear", "sticky_set",
    "ticket_list", "ticket_panel", "ticket_setup",
    "dm_inbox", "dm_history", "dm_reply", "dm_auto_response",
    "nitroraffles", "nitroraffles_panel", "nitroraffles_result",
    "nitroraffles_reset", "nitroraffles_reset_cooldown", "nitroraffles_test",
  ],
  moderation: ["delete", "purge"],
  utility: [
    "avatar", "help", "info", "membercount", "servericon", "serverinfo",
    "timestamp", "userinfo", "say", "panel", "commands_panel", "ping", "bova",
    "fenrir",
  ],
  analytics: [
    "namehistory", "namehistory_export", "stats", "topmedia", "week_summary",
    "peak_hours", "chat_ranking", "media_ranking", "msg_stats", "member_activity",
  ],
  staff: [
    "investigate", "member_invites", "automod_activity", "role_diff",
    "permission_audit", "mass_action_alert", "log_health", "guild_snapshot",
    "who_deleted",
  ],
  system: [
    "backup_export", "backup_hint", "backup_now", "backup_restore", "db_status",
    "weblogs_config", "msglog_test", "memberlog_test", "sync_commands",
  ],
  arcade: [
    "loveprofessor_panel", "loveprofessor_test",
    "nazarspeaks_panel", "nazarspeaks_test",
    "cursedhoroscope_panel", "cursedhoroscope_test",
  ],
  support: ["cmd_add", "cmd_list", "cmd_remove", "run"],
};

const FALLBACK_COMMANDS = [
  ["automod_activity", "List recent Discord AutoMod actions"],
  ["avatar", "Show user avatar"],
  ["backup_export", "[STAFF] Export data from SQLite/Turso"],
  ["backup_hint", "How auto-backup works on Render free"],
  ["backup_now", "[STAFF] Force an immediate backup"],
  ["backup_restore", "[STAFF] Restore from backup"],
  ["birthday_announce_channel", "Channel for daily birthday announcements"],
  ["birthday_panel", "Post the birthday panel (buttons only)"],
  ["bova", "[STAFF] Post the official Bova's Bot GIF"],
  ["chat_ranking", "Top 10 by words in chat ranking channels"],
  ["cmd_add", "Create a custom command (tag)"],
  ["cmd_list", "List custom commands"],
  ["cmd_remove", "Remove a custom command"],
  ["commands_panel", "Post the detailed Bova command hub"],
  ["cursedhoroscope_panel", "[ADMIN] Post Cursed Horoscope panel"],
  ["cursedhoroscope_test", "[ADMIN] Test Cursed Horoscope"],
  ["db_status", "[STAFF] Storage status (SQLite/Turso)"],
  ["delete", "Delete a message by ID anonymously"],
  ["dm_auto_response", "[STAFF] Configure automatic DM acknowledgement"],
  ["dm_history", "[STAFF] View recent DM history with a user"],
  ["dm_inbox", "[STAFF] Show recent users who contacted the bot by DM"],
  ["dm_reply", "[STAFF] Reply to a user by DM through the bot"],
  ["fenrir", "FiveMHosts — Fenrir status tools"],
  ["guild_snapshot", "Create a server snapshot and compare"],
  ["help", "Bova's Bot control panel"],
  ["info", "Bot, server and user information"],
  ["investigate", "Staff investigation panel for a member"],
  ["invitepanel", "Send the official invite request panel"],
  ["log_health", "Check log channels and bot permissions"],
  ["loveprofessor_panel", "[ADMIN] Post The Love Professor panel"],
  ["loveprofessor_test", "[ADMIN] Test the love machine"],
  ["mass_action_alert", "Show recent mass-action alerts"],
  ["media_ranking", "Top 10 media posters"],
  ["meet", "Post a car meet announcement embed"],
  ["member_activity", "Recent activity for a member"],
  ["member_invites", "Invites created by a member"],
  ["membercount", "Server member count"],
  ["memberlog_test", "Sample join/leave/kick/ban embeds"],
  ["msg_stats", "Tracked message statistics for a member"],
  ["msglog_test", "Test message delete/edit log"],
  ["namehistory", "Name history for a member"],
  ["namehistory_export", "Export name history"],
  ["nazarspeaks_panel", "[ADMIN] Post Nazar Speaks panel"],
  ["nazarspeaks_test", "[ADMIN] Test Nazar Speaks"],
  ["nitroraffles", "Nitro raffles system"],
  ["nitroraffles_panel", "Post nitro raffles panel"],
  ["nitroraffles_result", "Post raffle result"],
  ["nitroraffles_reset", "Reset raffle state"],
  ["nitroraffles_reset_cooldown", "Reset raffle cooldown"],
  ["nitroraffles_test", "Test nitro raffles"],
  ["panel", "Link to this web control center"],
  ["peak_hours", "Highest unique-user engagement periods"],
  ["permission_audit", "Permission audit tools"],
  ["ping", "Show bot latency"],
  ["purge", "Purge 1–100 messages"],
  ["role_diff", "Role change comparison"],
  ["say", "[STAFF] Send a message as the bot"],
  ["servericon", "Server icon"],
  ["serverinfo", "Server information"],
  ["stats", "Server stats summary"],
  ["sticky_clear", "Clear sticky message"],
  ["sticky_set", "Set sticky message"],
  ["sync_commands", "[STAFF] Force slash command re-sync"],
  ["ticket_list", "List open tickets"],
  ["ticket_panel", "Post ticket panel"],
  ["ticket_setup", "Configure tickets"],
  ["timestamp", "Generate a Discord timestamp"],
  ["timestamp_reminder_config", "Configure timestamp reminders"],
  ["timestamp_reminder_status", "Reminder engine status"],
  ["topmedia", "Top media contributors"],
  ["userinfo", "User information"],
  ["week_summary", "Weekly activity summary"],
  ["weblogs_config", "Configure WebLogs toggles"],
  ["who_deleted", "Audit-log lookup for message deletion"],
];

/* ===== SESSION ===== */
function getAccessKey() {
  return sessionStorage.getItem("bova_panel_key") || "";
}
function setAccessKey(k) {
  sessionStorage.setItem("bova_panel_key", k);
}
function getDiscordUserId() {
  return sessionStorage.getItem("bova_discord_uid") || "";
}
function setDiscordUserId(id) {
  sessionStorage.setItem("bova_discord_uid", id);
}
function apiBase() {
  const u = (window.BOVA_API && window.BOVA_API.baseUrl) || "";
  return String(u).replace(/\/+$/, "");
}

/* Abortable fetch — cancels previous request for same key */
const _inflight = new Map();
async function apiFetch(path, opts = {}, key) {
  const base = apiBase();
  if (!base) throw new Error("BOVA_API.baseUrl not set in config.js");
  if (key && _inflight.has(key)) {
    try { _inflight.get(key).abort(); } catch (_) {}
  }
  const ctrl = new AbortController();
  if (key) _inflight.set(key, ctrl);
  const headers = Object.assign(
    {
      "Content-Type": "application/json",
      "X-API-Key": getAccessKey(),
      "X-Discord-User-Id": getDiscordUserId(),
    },
    opts.headers || {}
  );
  try {
    const res = await fetch(base + path, { ...opts, headers, signal: ctrl.signal });
    let data = null;
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      const msg = (data && (data.error || data.message || data.detail)) || `HTTP ${res.status}`;
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    return data;
  } finally {
    if (key && _inflight.get(key) === ctrl) _inflight.delete(key);
  }
}
async function apiGet(path, key) {
  return apiFetch(path, {}, key || path);
}
async function apiPost(path, body, key) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body || {}) }, key || path);
}

/* Public health (no auth) — for diagnostics */
async function fetchHealth() {
  const base = apiBase();
  if (!base) throw new Error("BOVA_API.baseUrl not set");
  const t0 = performance.now();
  const res = await fetch(base + "/health", { method: "GET" });
  const ms = Math.round(performance.now() - t0);
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);
  return { ...data, _latency_ms: ms };
}

/* ===== UI HELPERS ===== */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function toast(msg, type) {
  const wrap = document.getElementById("toasts");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " error" : "");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}
function formatBytes(n) {
  n = Number(n) || 0;
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(2) + " MB";
}
function formatDate(v) {
  if (!v) return "—";
  try { return new Date(v).toLocaleString(); } catch (_) { return String(v); }
}
function formatUptime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return sec + "s";
  if (sec < 3600) return Math.floor(sec / 60) + "m " + (sec % 60) + "s";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h + "h " + m + "m";
}
function fillSelect(el, items, optional) {
  if (!el) return;
  const keep = optional ? '<option value="">None</option>' : "";
  if (Array.isArray(items) && items.length && typeof items[0] === "object") {
    el.innerHTML = keep + items.map((i) => `<option value="${esc(i.id || i)}">${esc(i.name || i.id || i)}</option>`).join("");
  } else if (Array.isArray(items)) {
    el.innerHTML = keep + items.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`).join("");
  }
}
function fillTz(el, defOffset) {
  if (!el) return;
  el.innerHTML = TZ_LIST.map((t) => `<option value="${t.id}" data-offset="${t.offset}" ${t.offset === defOffset ? "selected" : ""}>${esc(t.label)}</option>`).join("");
}
function copyText(t) {
  navigator.clipboard.writeText(t).then(() => toast("Copied")).catch(() => toast("Copy failed", "error"));
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}

/* ===== GATE ===== */
function tryUnlock() {
  const key = (document.getElementById("gate-input")?.value || "").trim();
  const uid = (document.getElementById("gate-user-id")?.value || "").trim();
  const err = document.getElementById("gate-error");
  if (!uid || !/^\d{15,22}$/.test(uid)) {
    err.textContent = "Enter a valid Discord User ID (snowflake).";
    return;
  }
  if (!key) {
    err.textContent = "Enter the access key.";
    return;
  }
  setAccessKey(key);
  setDiscordUserId(uid);
  document.getElementById("gate").style.display = "none";
  document.getElementById("app").style.display = "";
  initAll();
  apiGet("/api/auth/check").then(() => toast("Authenticated")).catch((e) => {
    toast("Auth check: " + e.message, "error");
  });
}

/* ===== ARCADE ===== */
async function runArcade(game, action) {
  const status = document.getElementById("arcade-status");
  const labels = {
    loveprofessor: "The Love Professor",
    nazarspeaks: "Nazar Speaks",
    cursedhoroscope: "Cursed Horoscope",
  };
  const actionLabel = action === "panel" ? "Post Panel" : "Run Test";
  if (status) status.textContent = `Running ${actionLabel} for ${labels[game] || game}…`;
  try {
    const d = await apiPost("/api/arcade", { game, action });
    if (d.error) throw new Error(d.error);
    const msg = `${labels[game] || game}: ${actionLabel} OK` +
      (d.channel_id ? ` · channel ${d.channel_id}` : "") +
      (d.message_id ? ` · msg ${d.message_id}` : "");
    if (status) status.textContent = msg;
    toast(msg);
  } catch (e) {
    const err = e.message || String(e);
    if (status) status.textContent = "Error: " + err;
    toast("Arcade failed: " + err, "error");
  }
}

/* ===== TABS ===== */
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
  const t = TITLES[name] || ["BOVA CORE", name];
  setText("crumb", `${t[0]} / ${t[1].toUpperCase()}`);
  setText("page-title", t[1]);
  document.getElementById("sidebar")?.classList.remove("open");
  if (name === "dashboard") loadOverview();
  if (name === "server") loadServerSummary();
  if (name === "timestamp") loadTimestampConfig();
  if (name === "dm") loadDmInbox();
  if (name === "stats") loadStats();
  if (name === "tickets") loadTicketLog();
  if (name === "audit") refreshAudit();
  if (name === "commands") loadCommands();
  if (name === "diagnostics") loadDiagnostics();
  if (name === "namehistory") loadNameHistoryApi();
}
function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
}
function refreshCurrent() {
  const active = document.querySelector(".tab-btn.active");
  if (active) switchTab(active.dataset.tab);
  else loadOverview();
}

/* ===== COMMANDS ===== */
async function loadCommands() {
  const el = document.getElementById("cmd-list");
  if (!el) return;
  let rows = FALLBACK_COMMANDS.map(([name, description]) => ({ name, description }));
  try {
    const d = await apiGet("/api/commands");
    if (d.commands && d.commands.length) rows = d.commands;
    setText("m-commands", String(d.count || rows.length));
  } catch (_) { /* use fallback */ }
  const q = (document.getElementById("cmd-search")?.value || "").toLowerCase().trim();
  const filtered = q
    ? rows.filter((c) => c.name.includes(q) || (c.description || "").toLowerCase().includes(q))
    : rows;
  el.innerHTML = filtered
    .map((c) => {
      let cat = "other";
      for (const [k, list] of Object.entries(COMMAND_META)) {
        if (list.includes(c.name)) { cat = k; break; }
      }
      return `<div class="cmd-row"><code>/${esc(c.name)}</code><span class="cmd-cat">${esc(cat)}</span><span class="muted">${esc(c.description || "")}</span></div>`;
    })
    .join("") || '<div class="muted">No commands match.</div>';
}

/* ===== OVERVIEW / DASHBOARD ===== */
async function loadOverview() {
  const t0 = performance.now();
  try {
    const d = await apiGet("/api/overview");
    const ms = Math.round(performance.now() - t0);
    setText("m-latency", ms + " ms");
    setText("m-guild", d.bot_ready ? "Online" : "Starting");
    setText("m-commands", String(d.command_count ?? "—"));
    const dbLabel = d.database?.mode === "turso" ? "Turso" : formatBytes(d.database?.size_bytes || 0);
    setText("m-db", dbLabel);

    const st = document.getElementById("dash-status");
    if (st) {
      st.innerHTML = `
        <div class="health-row"><span>Bot ready</span><span>${d.bot_ready ? "Yes ✓" : "No"}</span></div>
        <div class="health-row"><span>Uptime</span><span>${esc(formatUptime(d.uptime_seconds))}</span></div>
        <div class="health-row"><span>Slash commands</span><span>${esc(d.command_count ?? "—")}</span></div>
        <div class="health-row"><span>DB mode</span><span>${esc(d.database?.mode || "—")}</span></div>
        <div class="health-row"><span>KV docs</span><span>${esc(d.database?.kv_documents ?? "—")}</span></div>
        <div class="health-row"><span>Audit rows</span><span>${esc(d.database?.audit_rows ?? "—")}</span></div>
        <div class="health-row"><span>DM users</span><span>${esc(d.dm_inbox?.users ?? "—")}</span></div>
        <div class="health-row"><span>Timestamp reminders</span><span>${d.timestamp_reminder?.enabled ? "On · " + (d.timestamp_reminder.minutes || "?") + " min" : "Off"}</span></div>
        <div class="health-row"><span>Last auto backup</span><span>${esc(formatDate(d.backup?.last_auto))}</span></div>`;
    }
  } catch (e) {
    const st = document.getElementById("dash-status");
    if (st) st.textContent = e.message;
    setText("m-latency", "err");
    setText("m-guild", "—");
  }
}

async function loadServerSummary() {
  const el = document.getElementById("server-out");
  if (!el) return;
  try {
    const d = await apiGet("/api/server/summary");
    if (d.error) throw new Error(d.error);
    const channels = (d.text_channels ?? 0) + (d.voice_channels ?? 0);
    const rolesCount = d.roles_count ?? (Array.isArray(d.roles) ? d.roles.length : "—");
    el.innerHTML = `
      <div class="server-kpis">
        <div class="server-kpi"><strong>${esc(d.member_count ?? "—")}</strong><small>members</small></div>
        <div class="server-kpi"><strong>${esc(d.humans ?? "—")}</strong><small>humans</small></div>
        <div class="server-kpi"><strong>${esc(d.bots ?? "—")}</strong><small>bots</small></div>
        <div class="server-kpi"><strong>${esc(channels)}</strong><small>channels</small></div>
        <div class="server-kpi"><strong>${esc(rolesCount)}</strong><small>roles</small></div>
        <div class="server-kpi"><strong>L${esc(d.boost_tier ?? "0")}</strong><small>${esc(d.boosts ?? 0)} boosts</small></div>
      </div>
      <strong>${esc(d.name || "Server")}</strong>
      <div class="muted">ID ${esc(d.id || "")}</div>
      ${Array.isArray(d.roles) && d.roles.length ? `<div class="muted" style="margin-top:0.75rem">Top roles: ${d.roles.slice(0, 8).map((r) => esc(r.name) + " (" + r.members + ")").join(" · ")}</div>` : ""}`;
  } catch (e) {
    el.textContent = e.message;
  }
}

async function refreshAudit() {
  try {
    const [ov, audit] = await Promise.all([
      apiGet("/api/overview"),
      apiGet("/api/audit").catch(() => ({ entries: [] })),
    ]);
    const el = document.getElementById("audit-db");
    if (el) {
      el.innerHTML = `
        <div class="server-kpis">
          <div class="server-kpi"><strong>${esc(ov.database?.mode || "—")}</strong><small>mode</small></div>
          <div class="server-kpi"><strong>${esc(ov.database?.kv_documents ?? 0)}</strong><small>KV docs</small></div>
          <div class="server-kpi"><strong>${esc(ov.database?.audit_rows ?? 0)}</strong><small>audit rows</small></div>
          <div class="server-kpi"><strong>${esc(ov.backup?.interval_hours || 24)}h</strong><small>backup interval</small></div>
        </div>
        <div class="health-row"><span>Last automatic backup</span><span>${esc(formatDate(ov.backup?.last_auto))}</span></div>
        <div class="health-row"><span>Backup channel</span><span>${esc(ov.backup?.channel_id || "—")}</span></div>
        <div class="health-row"><span>Bot ready</span><span>${ov.bot_ready ? "Yes" : "No"}</span></div>
        <div class="health-row"><span>Uptime</span><span>${esc(formatUptime(ov.uptime_seconds))}</span></div>`;
    }
    const log = document.getElementById("audit-log");
    if (log) {
      const entries = audit.entries || [];
      if (!entries.length) {
        log.innerHTML = '<div class="muted">No audit entries yet.</div>';
      } else {
        log.innerHTML = entries.slice(0, 40).map((e) =>
          `<div class="archive-card"><strong>${esc(e.action || "?")}</strong>
            <span class="muted">${esc(formatDate(e.ts))} · actor ${esc(e.actor_id || "—")} · ${e.success === false ? "FAIL" : "ok"}</span>
            <div class="muted">${esc(JSON.stringify(e.detail || {}).slice(0, 180))}</div></div>`
        ).join("");
      }
    }
  } catch (e) {
    const el = document.getElementById("audit-db");
    if (el) el.textContent = e.message;
  }
}

/* ===== DIAGNOSTICS (bot health, sync, logs) ===== */
async function loadDiagnostics() {
  await Promise.all([runHealthCheck(), loadAuditLogOnly()]);
}

async function runHealthCheck() {
  const el = document.getElementById("diag-health");
  if (!el) return;
  el.innerHTML = '<div class="muted">Checking /health…</div>';
  try {
    const h = await fetchHealth();
    const loops = h.background_loops || {};
    const loopHtml = Object.keys(loops).length
      ? Object.entries(loops).map(([k, v]) => `<div class="health-row"><span>${esc(k)}</span><span>${v === true ? "running" : esc(String(v))}</span></div>`).join("")
      : '<div class="muted">No loop status reported.</div>';
    const cache = h.message_cache || {};
    el.innerHTML = `
      <div class="server-kpis">
        <div class="server-kpi"><strong>${h.bot_ready ? "READY" : "STARTING"}</strong><small>bot</small></div>
        <div class="server-kpi"><strong>${esc(h._latency_ms)} ms</strong><small>HTTP latency</small></div>
        <div class="server-kpi"><strong>${esc(formatUptime(h.uptime_seconds))}</strong><small>uptime</small></div>
        <div class="server-kpi"><strong>${esc(h.database?.mode || "—")}</strong><small>database</small></div>
      </div>
      <div class="health-row"><span>Status</span><span>${esc(h.status || "—")}</span></div>
      <div class="health-row"><span>KV documents</span><span>${esc(h.database?.kv_documents ?? "—")}</span></div>
      <div class="health-row"><span>Audit rows</span><span>${esc(h.database?.audit_rows ?? "—")}</span></div>
      <div class="health-row"><span>Msg cache size</span><span>${esc(cache.size ?? "—")} / ${esc(cache.limit ?? "—")}</span></div>
      <div class="card-title" style="margin-top:1rem">BACKGROUND LOOPS</div>
      ${loopHtml}
      <pre class="diag-raw" style="margin-top:0.75rem;font-size:0.75rem;max-height:160px;overflow:auto">${esc(JSON.stringify(h, null, 2).slice(0, 2500))}</pre>`;
    toast("Health OK · " + h._latency_ms + " ms");
  } catch (e) {
    el.innerHTML = `<div class="muted" style="color:var(--danger,#f66)">Health failed: ${esc(e.message)}</div>
      <p class="muted">If this fails while Discord is silent, the Render service may be sleeping or restarting. Check UptimeRobot + Render logs.</p>`;
    toast("Health failed: " + e.message, "error");
  }
}

async function loadAuditLogOnly() {
  const log = document.getElementById("diag-audit");
  if (!log) return;
  try {
    const audit = await apiGet("/api/audit");
    const entries = audit.entries || [];
    if (!entries.length) {
      log.innerHTML = '<div class="muted">No audit entries.</div>';
      return;
    }
    log.innerHTML = entries.slice(0, 30).map((e) =>
      `<div class="archive-card"><strong>${esc(e.action || "?")}</strong>
        <span class="muted">${esc(formatDate(e.ts))} · ${esc(e.actor_id || "—")} · ${e.success === false ? "FAIL" : "ok"}</span>
        <div class="muted">${esc(JSON.stringify(e.detail || {}).slice(0, 160))}</div></div>`
    ).join("");
  } catch (e) {
    log.textContent = e.message;
  }
}

async function runSyncCommands(forceWipe) {
  const el = document.getElementById("diag-sync-out");
  if (el) el.textContent = forceWipe ? "Force wipe + sync… (can take up to 5 min)" : "Syncing slash commands…";
  try {
    const d = await apiPost("/api/sync-commands", { force_wipe: !!forceWipe }, "sync-commands");
    if (d.error) throw new Error(d.error);
    const guilds = (d.guilds || []).map((g) => `guild ${g.guild_id}: ${g.count}`).join(" · ");
    const sample = (d.commands || []).slice(0, 12).join(", ");
    if (el) {
      el.innerHTML = `<div class="health-row"><span>OK</span><span>${esc(String(d.count ?? "—"))} commands</span></div>
        <div class="muted">${esc(guilds)}</div>
        <div class="muted" style="margin-top:0.5rem">Sample: ${esc(sample)}${(d.commands || []).length > 12 ? "…" : ""}</div>`;
    }
    toast("Slash commands synced · " + (d.count ?? "?"));
  } catch (e) {
    if (el) el.textContent = e.message;
    toast("Sync failed: " + e.message, "error");
  }
}

async function runAuthCheck() {
  const el = document.getElementById("diag-auth-out");
  if (el) el.textContent = "Checking…";
  try {
    await apiGet("/api/auth/check");
    if (el) el.innerHTML = '<span style="color:var(--ok,#0f8)">Auth OK — key + staff role accepted.</span>';
    toast("Auth OK");
  } catch (e) {
    if (el) el.innerHTML = `<span style="color:var(--danger,#f66)">${esc(e.message)}</span>`;
    toast("Auth failed: " + e.message, "error");
  }
}

/* ===== TIMESTAMP (API: enabled, minutes, text) ===== */
async function loadTimestampConfig() {
  try {
    const d = await apiGet("/api/timestamp-reminder");
    const en = document.getElementById("ts-enabled");
    const mins = document.getElementById("ts-minutes");
    const msg = document.getElementById("ts-message");
    if (en) en.checked = !!d.enabled;
    if (mins && d.minutes != null) mins.value = d.minutes;
    if (msg && d.text != null) msg.value = d.text;
    updateTsPreview(d);
  } catch (e) {
    const p = document.getElementById("ts-preview");
    if (p) p.textContent = e.message;
  }
}
function updateTsPreview(d) {
  const p = document.getElementById("ts-preview");
  if (!p) return;
  const enabled = d ? d.enabled : document.getElementById("ts-enabled")?.checked;
  const minutes = d?.minutes ?? document.getElementById("ts-minutes")?.value;
  const pending = d?.pending;
  p.innerHTML = `<div class="health-row"><span>Status</span><span>${enabled ? "Enabled ✓" : "Disabled"}</span></div>
    <div class="health-row"><span>Minutes before</span><span>${esc(minutes)} min</span></div>
    <div class="health-row"><span>Pending</span><span>${esc(pending ?? "—")}</span></div>
    <div class="health-row"><span>Window</span><span>±45 seconds</span></div>`;
}
async function saveTimestampConfig() {
  try {
    const body = {
      enabled: !!document.getElementById("ts-enabled")?.checked,
      minutes: Number(document.getElementById("ts-minutes")?.value || 30),
      text: document.getElementById("ts-message")?.value || undefined,
    };
    const d = await apiPost("/api/timestamp-reminder", body);
    toast("Timestamp config saved");
    updateTsPreview({ ...body, pending: d.pending });
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== EMBED ===== */
function updateEmPreview() {
  const title = document.getElementById("em-title")?.value || "Title";
  const desc = document.getElementById("em-desc")?.value || "Description";
  const color = document.getElementById("em-color")?.value || "#a855f7";
  const el = document.getElementById("em-preview");
  if (!el) return;
  el.innerHTML = `<div style="border-left:4px solid ${esc(color)};padding:0.5rem 0.75rem;background:rgba(0,0,0,0.25);border-radius:4px"><strong>${esc(title)}</strong><div class="muted" style="margin-top:0.35rem;white-space:pre-wrap">${esc(desc)}</div></div>`;
}
async function postEmbed() {
  try {
    const body = {
      channel_id: document.getElementById("em-channel")?.value,
      title: document.getElementById("em-title")?.value,
      description: document.getElementById("em-desc")?.value,
      color: document.getElementById("em-color")?.value,
      role_id: document.getElementById("em-role")?.value || null,
      image_url: document.getElementById("em-image")?.value || null,
    };
    await apiPost("/api/embed", body);
    toast("Embed posted");
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== MEETS ===== */
let mtHosts = [];
function renderMtHosts() {
  const el = document.getElementById("mt-hosts-list");
  if (!el) return;
  el.innerHTML = mtHosts.map((h, i) =>
    `<span class="chip">${esc(h)} <button type="button" onclick="mtHosts.splice(${i},1);renderMtHosts();updateMtPreview()">×</button></span>`
  ).join("") || '<span class="muted">No hosts added</span>';
}
function addMtHost() {
  const sel = document.getElementById("mt-host-sel");
  const custom = document.getElementById("mt-host-custom");
  const v = (custom?.value || sel?.value || "").trim();
  if (!v) return;
  if (!mtHosts.includes(v)) mtHosts.push(v);
  if (custom) custom.value = "";
  renderMtHosts();
  updateMtPreview();
}
function updateMtPreview() {
  const el = document.getElementById("mt-preview");
  if (!el) return;
  const server = document.getElementById("mt-server")?.value || "Server";
  const date = document.getElementById("mt-date")?.value || "—";
  const time = document.getElementById("mt-time")?.value || "—";
  el.innerHTML = `<strong>${esc(server)}</strong><div class="muted">${esc(date)} ${esc(time)} · hosts: ${esc(mtHosts.join(", ") || "—")}</div>`;
}
async function postMeet() {
  try {
    const tzEl = document.getElementById("mt-tz");
    const opt = tzEl?.selectedOptions?.[0];
    const body = {
      server: document.getElementById("mt-server")?.value,
      date: document.getElementById("mt-date")?.value,
      time: document.getElementById("mt-time")?.value,
      timezone: tzEl?.value,
      timezone_offset: opt ? Number(opt.dataset.offset) : -3,
      hosts: mtHosts.slice(),
      role_id: document.getElementById("mt-role")?.value || null,
      reminder_channel_id: document.getElementById("mt-rem-ch")?.value || null,
      notes: document.getElementById("mt-notes")?.value || null,
    };
    await apiPost("/api/meet", body);
    toast("Meet posted");
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== DM (API returns conversations[], auto uses text) ===== */
async function loadDmInbox() {
  const el = document.getElementById("dm-inbox");
  if (!el) return;
  try {
    const d = await apiGet("/api/dm/inbox");
    const items = d.conversations || [];
    const autoOn = document.getElementById("dm-auto-on");
    const autoMsg = document.getElementById("dm-auto-msg");
    if (autoOn) autoOn.checked = !!d.auto_response_enabled;
    if (autoMsg && d.auto_response_text != null) autoMsg.value = d.auto_response_text;
    if (!items.length) {
      el.innerHTML = '<div class="muted">No recent DM contacts.</div>';
      return;
    }
    el.innerHTML = items.slice(0, 40).map((u) => {
      const id = u.user_id || "";
      const preview = (u.last_content || "").slice(0, 80);
      return `<div class="dm-item" onclick="document.getElementById('dm-user-id').value='${esc(id)}';loadDmHistory()">
        <div><strong>${esc(id)}</strong><div class="muted">${esc(preview) || "—"} · ${esc(u.message_count || 0)} msgs</div></div>
        <span class="muted">${esc(formatDate(u.last_timestamp))}</span></div>`;
    }).join("");
  } catch (e) {
    el.textContent = e.message;
  }
}
async function loadDmHistory() {
  const el = document.getElementById("dm-history");
  const uid = document.getElementById("dm-user-id")?.value?.trim();
  if (!el || !uid) return;
  try {
    const d = await apiGet(`/api/dm/history/${uid}`);
    const msgs = d.messages || [];
    if (!msgs.length) {
      el.innerHTML = '<div class="muted">No messages.</div>';
      return;
    }
    el.innerHTML = msgs.slice(-50).map((m) =>
      `<div class="archive-card"><strong>${esc(m.direction || "")}</strong>
        <span class="muted">${esc(formatDate(m.timestamp || m.created_at))}</span>
        <div>${esc(m.content || m.message || "")}</div></div>`
    ).join("");
  } catch (e) {
    el.textContent = e.message;
  }
}
async function sendDmReply() {
  try {
    await apiPost("/api/dm/reply", {
      user_id: document.getElementById("dm-user-id")?.value,
      message: document.getElementById("dm-reply-msg")?.value,
    });
    toast("Reply sent");
    const msg = document.getElementById("dm-reply-msg");
    if (msg) msg.value = "";
    loadDmHistory();
  } catch (e) {
    toast(e.message, "error");
  }
}
async function saveDmAuto() {
  try {
    await apiPost("/api/dm/auto", {
      enabled: !!document.getElementById("dm-auto-on")?.checked,
      text: document.getElementById("dm-auto-msg")?.value,
    });
    toast("Auto-response saved");
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== STATS / TICKETS / NAME HISTORY ===== */
async function loadStats() {
  const el = document.getElementById("stats-out");
  if (!el) return;
  try {
    const d = await apiGet("/api/stats/summary");
    const top = (d.top_messages || []).slice(0, 10)
      .map(([uid, n]) => `<div class="health-row"><span>${esc(uid)}</span><span>${esc(n)}</span></div>`).join("");
    el.innerHTML = `<div class="server-kpis">
      <div class="server-kpi"><strong>${esc(d.joins ?? "—")}</strong><small>joins</small></div>
      <div class="server-kpi"><strong>${esc(d.leaves ?? "—")}</strong><small>leaves</small></div>
    </div>
    <div class="card-title" style="margin-top:0.75rem">TOP MESSAGES</div>
    ${top || '<div class="muted">No message stats yet.</div>'}
    <pre style="margin-top:0.75rem;font-size:0.75rem;max-height:200px;overflow:auto">${esc(JSON.stringify(d, null, 2).slice(0, 2000))}</pre>`;
  } catch (e) {
    el.textContent = e.message;
  }
}
async function loadTicketLog() {
  const el = document.getElementById("ticket-log");
  if (!el) return;
  try {
    const d = await apiGet("/api/tickets");
    const items = d.tickets || d.items || (Array.isArray(d) ? d : []);
    if (!Array.isArray(items) || !items.length) {
      el.innerHTML = '<div class="muted">No ticket data from API (use Discord /ticket_* commands).</div>';
      return;
    }
    el.innerHTML = items.slice(0, 25).map((t) =>
      `<div class="archive-card"><strong>${esc(t.type || t.kind || "ticket")}</strong> · ${esc(t.user || t.user_id || "")}
        <div class="muted">${esc(String(t.content || t.message || "").slice(0, 200))}</div></div>`
    ).join("");
  } catch (e) {
    el.textContent = e.message;
  }
}
async function loadNameHistoryApi() {
  const out = document.getElementById("nh-out");
  if (!out) return;
  try {
    const data = await apiGet("/api/namehistory");
    const members = data.members || data;
    const vals = Object.values(members || {});
    if (!vals.length) {
      out.innerHTML = '<div class="muted">No name history in storage yet.</div>';
      return;
    }
    out.innerHTML = vals.slice(0, 80).map((m) => {
      const names = (m.names || []).slice(-5).map((n) =>
        n.reason === "rename"
          ? `${esc(n.previous_display_name || "?")} → <strong>${esc(n.display_name || "?")}</strong>`
          : `first: <strong>${esc(n.display_name || "?")}</strong>`
      ).join("<br>");
      return `<div class="archive-card"><strong>${esc(m.display_name || m.username || m.user_id)}</strong> <code>${esc(m.user_id || "")}</code><div class="muted" style="margin-top:5px">${names || "—"}</div></div>`;
    }).join("");
  } catch (e) {
    out.innerHTML = `<div class="muted">${esc(e.message)}</div>`;
  }
}
function renderNameHistory() {
  const raw = document.getElementById("nh-json")?.value || "";
  const out = document.getElementById("nh-out");
  if (!out) return;
  try {
    const data = JSON.parse(raw);
    const members = data.members || data;
    out.innerHTML =
      Object.values(members).slice(0, 80).map((m) => {
        const names = (m.names || []).slice(-5).map((n) =>
          n.reason === "rename"
            ? `${esc(n.previous_display_name || "?")} → <strong>${esc(n.display_name || "?")}</strong>`
            : `first: <strong>${esc(n.display_name || "?")}</strong>`
        ).join("<br>");
        return `<div class="archive-card"><strong>${esc(m.display_name || m.username || m.user_id)}</strong> <code>${esc(m.user_id || "")}</code><div class="muted" style="margin-top:5px">${names || "—"}</div></div>`;
      }).join("") || '<div class="muted">No members in file.</div>';
  } catch (e) {
    out.innerHTML = `<div class="muted">Invalid JSON: ${esc(e.message)}</div>`;
  }
}

/* ===== INIT ===== */
function initAll() {
  const cfg = C();
  fillSelect(document.getElementById("em-channel"), cfg.channels);
  fillSelect(document.getElementById("em-role"), cfg.roles, true);
  fillSelect(document.getElementById("mt-server"), cfg.servers);
  fillSelect(document.getElementById("mt-role"), cfg.roles, true);
  fillSelect(document.getElementById("mt-rem-ch"), cfg.channels);
  fillSelect(document.getElementById("mt-host-sel"), cfg.hosts);
  fillTz(document.getElementById("mt-tz"), -3);
  const today = new Date().toISOString().slice(0, 10);
  const md = document.getElementById("mt-date");
  if (md && !md.value) md.value = today;
  renderMtHosts();
  updateEmPreview();
  updateMtPreview();
  loadOverview();
  loadCommands();
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  const uid = getDiscordUserId();
  if (uid && document.getElementById("gate-user-id")) document.getElementById("gate-user-id").value = uid;
}

document.addEventListener("DOMContentLoaded", () => {
  const uidEl = document.getElementById("gate-user-id");
  if (uidEl && getDiscordUserId()) uidEl.value = getDiscordUserId();
  if (getAccessKey() && getDiscordUserId()) {
    document.getElementById("gate").style.display = "none";
    document.getElementById("app").style.display = "";
    initAll();
  }
});
