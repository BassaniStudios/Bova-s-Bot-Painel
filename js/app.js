/* Bova Core Control Center · v2.9.7 · Neon Edition */
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
  timestamp: ["AUTOMATION", "Timestamp Reminders"],
  meets: ["ANNOUNCEMENTS", "Meets"],
  arcade: ["AUTOMATION", "Arcade"],
  tickets: ["COMMUNITY", "Tickets"],
  polls: ["COMMUNITY", "Polls"],
  dm: ["PRIVATE SUPPORT", "DM Inbox"],
  namehistory: ["ANALYTICS", "Name History"],
  embed: ["TOOLS", "Embed Builder"],
  stats: ["ANALYTICS", "Stats"],
  weblogs: ["LOGGING", "WebLogs"],
  audit: ["SYSTEM", "Audit & Health"],
  tutorial: ["GUIDE", "Help & Guide"],
};

/* Command catalog synced with bot v2.9.7 — removed autofeed, autorole, boost_config, welcome_*, bovasay, member_time */
const COMMAND_META = {
  automation: ["timestamp_reminder_config", "timestamp_reminder_status"],
  community: [
    "birthday_announce_channel", "birthday_panel", "invitepanel", "meet",
    "poll", "poll_end", "poll_list", "sticky_clear", "sticky_set",
    "ticket_list", "ticket_panel", "ticket_setup",
    "dm_inbox", "dm_history", "dm_reply", "dm_auto_response",
  ],
  moderation: ["delete", "purge"],
  utility: [
    "avatar", "help", "info", "membercount", "servericon", "serverinfo",
    "timestamp", "userinfo", "say", "panel", "commands_panel", "ping", "bova",
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
    "backup_export", "backup_hint", "backup_now", "db_status",
    "weblogs_config", "msglog_test", "memberlog_test",
  ],
  arcade: ["loveprofessor_panel", "loveprofessor_test", "nazarspeaks_panel", "nazarspeaks_test", "cursedhoroscope_panel", "cursedhoroscope_test", "cursedhoroscope_panel", "cursedhoroscope_test"],
  support: ["cmd_add", "cmd_list", "cmd_remove", "run"],
};

const FALLBACK_COMMANDS = [
  ["automod_activity", "List recent Discord AutoMod actions for this channel"],
  ["avatar", "Show user avatar"],
  ["backup_export", "[STAFF] Export data from SQLite to Discord"],
  ["backup_hint", "How auto-backup works on Render free"],
  ["backup_now", "[STAFF] Force an immediate SQLite backup"],
  ["birthday_announce_channel", "Channel for daily birthday announcements"],
  ["birthday_panel", "Post the easy birthday panel (buttons only)"],
  ["bova", "[STAFF] Post the official Bova's Bot GIF"],
  ["chat_ranking", "Top 10 chat and minigame activity in the configured rooms"],
  ["cmd_add", "Create a custom command (tag)"],
  ["cmd_list", "List custom commands"],
  ["cmd_remove", "Remove a custom command"],
  ["commands_panel", "Post the detailed Bova command hub"],
  ["db_status", "[STAFF] SQLite storage status"],
  ["delete", "Delete a message by ID anonymously"],
  ["dm_auto_response", "[STAFF] Configure automatic DM acknowledgement"],
  ["dm_history", "[STAFF] View recent DM history with a user"],
  ["dm_inbox", "[STAFF] Show recent users who contacted the bot by DM"],
  ["dm_reply", "[STAFF] Reply to a user by DM through the bot"],
  ["guild_snapshot", "Create a server snapshot and compare it with the previous one"],
  ["help", "Bova's Bot cyberpunk control panel"],
  ["info", "Bot, server and user information"],
  ["investigate", "Open a staff investigation panel for a member"],
  ["invitepanel", "Send the official invite request panel"],
  ["log_health", "Check log channels and required bot permissions"],
  ["loveprofessor_panel", "[ADMIN] Post the permanent The Love Professor arcade panel"],
  ["loveprofessor_test", "[ADMIN] Test the love machine — the bot plays with you"],
  ["mass_action_alert", "Show recent automatic mass-action alerts"],
  ["media_ranking", "Top 10 members sending photos and videos in the media category"],
  ["meet", "Post a car meet announcement embed"],
  ["member_activity", "Show recent activity recorded for a selected member"],
  ["member_invites", "List invites created by a selected member"],
  ["membercount", "Server member count"],
  ["memberlog_test", "Send sample join/leave/kick/ban embeds"],
  ["msg_stats", "Show detailed tracked message statistics for a member"],
  ["msglog_test", "Test the dedicated message-log channel"],
  ["namehistory", "Show name history for a member"],
  ["namehistory_export", "Export name history JSON (staff)"],
  ["nazarspeaks_panel", "[ADMIN] Post the permanent Nazar Speaks arcade panel"],
  ["nazarspeaks_test", "[ADMIN] Test Nazar Speaks — works in any channel"],
  ["panel", "[STAFF] Get the web panel link (role-restricted)"],
  ["peak_hours", "Show periods with the highest unique-user engagement"],
  ["permission_audit", "Scan roles and channels for dangerous permissions"],
  ["ping", "Show bot latency"],
  ["poll", "Create a poll (Sesh-style live results)"],
  ["poll_end", "Force-end a poll by ID"],
  ["poll_list", "List active polls"],
  ["purge", "Delete a number of messages in the current channel"],
  ["role_diff", "Show role changes for a member and who made the change"],
  ["run", "Run a custom command / tag"],
  ["say", "[STAFF] Make the bot say something"],
  ["servericon", "Show server icon"],
  ["serverinfo", "Server information"],
  ["stats", "Show server activity statistics (numbers + charts)"],
  ["sticky_clear", "Remove sticky from this channel"],
  ["sticky_set", "Set a sticky message for this channel"],
  ["ticket_list", "[STAFF] List recent submissions"],
  ["ticket_panel", "Post the easy Ticket / Suggestions / Report panel"],
  ["ticket_setup", "Set panel/log channels for easy tickets"],
  ["timestamp", "Generate a Discord timestamp"],
  ["timestamp_reminder_config", "Configure automatic timestamp reminders"],
  ["timestamp_reminder_status", "Show automatic timestamp reminder status"],
  ["topmedia", "Show or post the most reacted media of the period"],
  ["userinfo", "Detailed user info"],
  ["weblogs_config", "Configure WebLogs compatibility settings"],
  ["week_summary", "Activity snapshot for the tracked period"],
  ["who_deleted", "Best-effort audit-log lookup for who deleted a message"],
].map((x) => ({ name: x[0], description: x[1] }));

let commandData = FALLBACK_COMMANDS;
let selectedHosts = new Set();

/* ===== AUTH / STORAGE ===== */
function getAccessKey() { return sessionStorage.getItem("bova_key") || ""; }
function setAccessKey(k) { sessionStorage.setItem("bova_key", k); }
function getDiscordUserId() { return localStorage.getItem("bova_uid") || ""; }
function setDiscordUserId(id) { localStorage.setItem("bova_uid", id); }
function getApiBase() {
  const u = (window.BOVA_API && window.BOVA_API.baseUrl) || "";
  return u.replace(/\/$/, "");
}

/* ===== API ===== */
async function apiFetch(path, opts = {}) {
  const base = getApiBase();
  if (!base) throw new Error("API base URL not configured in js/config.js");
  const headers = Object.assign(
    {
      "Content-Type": "application/json",
      "X-API-Key": getAccessKey(),
      "X-Discord-User-Id": getDiscordUserId(),
    },
    opts.headers || {}
  );
  const res = await fetch(base + path, { ...opts, headers });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
async function apiGet(path) { return apiFetch(path); }
async function apiPost(path, body) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body || {}) });
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
  setTimeout(() => el.remove(), 3500);
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
  /* optional auth check */
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
  const crumb = document.getElementById("crumb");
  const title = document.getElementById("page-title");
  if (crumb) crumb.textContent = `${t[0]} / ${t[1].toUpperCase()}`;
  if (title) title.textContent = t[1];
  document.getElementById("sidebar")?.classList.remove("open");
  if (name === "dashboard") loadOverview();
  if (name === "server") loadServerSummary();
  if (name === "timestamp") loadTimestampConfig();
  if (name === "dm") loadDmInbox();
  if (name === "stats") loadStats();
  if (name === "tickets") loadTicketLog();
  if (name === "audit") refreshAudit();
  if (name === "commands") loadCommands();
}
function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
}
function refreshCurrent() {
  const active = document.querySelector(".tab-btn.active");
  if (active) switchTab(active.dataset.tab);
  else loadOverview();
  toast("Refreshed");
}

/* ===== COMMANDS ===== */
function commandCategory(name) {
  for (const [cat, names] of Object.entries(COMMAND_META)) {
    if (names.includes(name)) return cat;
  }
  return "utility";
}
function isStaffCommand(name) {
  return [
    "backup_export", "backup_now", "cmd_add", "cmd_remove", "delete",
    "dm_auto_response", "dm_history", "dm_inbox", "dm_reply", "panel",
    "purge", "say", "ticket_list", "ticket_setup", "namehistory_export",
    "weblogs_config", "timestamp_reminder_config", "bova", "investigate",
    "permission_audit", "guild_snapshot", "mass_action_alert", "who_deleted",
    "loveprofessor_panel", "loveprofessor_test", "nazarspeaks_panel", "nazarspeaks_test", "cursedhoroscope_panel", "cursedhoroscope_test",
    "db_status", "log_health", "memberlog_test", "msglog_test",
  ].includes(name);
}
async function loadCommands() {
  try {
    const d = await apiGet("/api/commands");
    if (Array.isArray(d.commands) && d.commands.length) commandData = d.commands;
  } catch (_) {}
  renderCommands();
  const m = document.getElementById("m-commands");
  if (m) m.textContent = String(commandData.length);
}
function renderCommands() {
  const list = document.getElementById("command-list");
  if (!list) return;
  const q = (document.getElementById("command-search")?.value || "").toLowerCase();
  const filter = document.getElementById("command-filter")?.value || "all";
  const rows = commandData.filter(
    (c) =>
      (!q || `${c.name} ${c.description}`.toLowerCase().includes(q)) &&
      (filter === "all" || commandCategory(c.name) === filter)
  );
  const cnt = document.getElementById("command-count");
  if (cnt) cnt.textContent = `${commandData.length} commands · showing ${rows.length}`;
  list.innerHTML =
    rows
      .map(
        (c) =>
          `<div class="command-card"><div class="cmd-top"><code>/${esc(c.name)}</code><span class="tag">${esc(commandCategory(c.name))}</span>${isStaffCommand(c.name) ? '<span class="tag staff">staff</span>' : ""}</div><p>${esc(c.description || "")}</p></div>`
      )
      .join("") || '<div class="muted">No commands match your search.</div>';
}

/* ===== OVERVIEW / SERVER / AUDIT ===== */
async function loadOverview() {
  try {
    const t0 = performance.now();
    const d = await apiGet("/api/overview");
    const ms = Math.round(performance.now() - t0);
    const mLat = document.getElementById("m-latency");
    const mGuild = document.getElementById("m-guild");
    const mDb = document.getElementById("m-db");
    if (mLat) mLat.textContent = ms + " ms";
    if (mGuild) mGuild.textContent = d.guild?.name ? "Online" : "—";
    if (mDb) mDb.textContent = formatBytes(d.database?.size_bytes || 0);
    const st = document.getElementById("dash-status");
    if (st) {
      st.innerHTML = `
        <div class="health-row"><span>Guild</span><span>${esc(d.guild?.name || "—")}</span></div>
        <div class="health-row"><span>Members</span><span>${esc(d.guild?.member_count ?? "—")}</span></div>
        <div class="health-row"><span>DB size</span><span>${formatBytes(d.database?.size_bytes || 0)}</span></div>
        <div class="health-row"><span>Audit rows</span><span>${esc(d.database?.audit_rows ?? "—")}</span></div>
        <div class="health-row"><span>Last auto backup</span><span>${esc(formatDate(d.backup?.last_auto))}</span></div>`;
    }
  } catch (e) {
    const st = document.getElementById("dash-status");
    if (st) st.textContent = e.message;
  }
}
async function loadServerSummary() {
  const el = document.getElementById("server-out");
  if (!el) return;
  try {
    const d = await apiGet("/api/server/summary");
    el.innerHTML = `
      <div class="server-kpis">
        <div class="server-kpi"><strong>${esc(d.member_count ?? "—")}</strong><small>members</small></div>
        <div class="server-kpi"><strong>${esc(d.humans ?? "—")}</strong><small>humans</small></div>
        <div class="server-kpi"><strong>${esc(d.bots ?? "—")}</strong><small>bots</small></div>
        <div class="server-kpi"><strong>${esc(d.channels ?? "—")}</strong><small>channels</small></div>
        <div class="server-kpi"><strong>${esc(d.roles ?? "—")}</strong><small>roles</small></div>
        <div class="server-kpi"><strong>L${esc(d.boost_tier ?? "0")}</strong><small>${esc(d.boosts ?? 0)} boosts</small></div>
      </div>
      <strong>${esc(d.name || "Server")}</strong>
      <div class="muted">ID ${esc(d.id || "")}</div>`;
  } catch (e) {
    el.textContent = e.message;
  }
}
async function refreshAudit() {
  try {
    const d = await apiGet("/api/overview");
    const el = document.getElementById("audit-db");
    if (!el) return;
    el.innerHTML = `
      <div class="server-kpis">
        <div class="server-kpi"><strong>${formatBytes(d.database?.size_bytes || 0)}</strong><small>DB size</small></div>
        <div class="server-kpi"><strong>${esc(d.database?.kv_documents ?? 0)}</strong><small>KV docs</small></div>
        <div class="server-kpi"><strong>${esc(d.database?.audit_rows ?? 0)}</strong><small>audit rows</small></div>
        <div class="server-kpi"><strong>${esc(d.backup?.interval_hours || 24)}h</strong><small>backup interval</small></div>
      </div>
      <div class="health-row"><span>Last automatic backup</span><span>${esc(formatDate(d.backup?.last_auto))}</span></div>
      <div class="health-row"><span>Backup channel</span><span>${esc(d.backup?.channel_id || "—")}</span></div>`;
  } catch (e) {
    const el = document.getElementById("audit-db");
    if (el) el.textContent = e.message;
  }
}

/* ===== TIMESTAMP ===== */
async function loadTimestampConfig() {
  try {
    const d = await apiGet("/api/timestamp-reminder");
    const en = document.getElementById("ts-enabled");
    const off = document.getElementById("ts-offset");
    const ch = document.getElementById("ts-channel");
    const msg = document.getElementById("ts-message");
    if (en) en.checked = !!d.enabled;
    if (off && d.offset_seconds != null) off.value = d.offset_seconds;
    if (ch && d.channel_id) ch.value = d.channel_id;
    if (msg && d.message) msg.value = d.message;
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
  const offset = d?.offset_seconds ?? document.getElementById("ts-offset")?.value;
  p.innerHTML = `<div class="health-row"><span>Status</span><span>${enabled ? "Enabled ✓" : "Disabled"}</span></div>
    <div class="health-row"><span>Offset</span><span>${esc(offset)} s</span></div>
    <div class="health-row"><span>Window</span><span>±45 seconds</span></div>`;
}
async function saveTimestampConfig() {
  try {
    const body = {
      enabled: !!document.getElementById("ts-enabled")?.checked,
      offset_seconds: Number(document.getElementById("ts-offset")?.value || 300),
      channel_id: document.getElementById("ts-channel")?.value || null,
      message: document.getElementById("ts-message")?.value || null,
    };
    await apiPost("/api/timestamp-reminder", body);
    toast("Timestamp config saved");
    updateTsPreview(body);
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== EMBED ===== */
function updateEmPreview() {
  const title = document.getElementById("em-title")?.value || "Title";
  const desc = document.getElementById("em-desc")?.value || "";
  const color = document.getElementById("em-color")?.value || "#a855f7";
  const img = document.getElementById("em-image")?.value || "";
  const el = document.getElementById("em-preview");
  if (!el) return;
  el.innerHTML = `<div class="embed-preview"><div class="embed-bar" style="background:${esc(color)};box-shadow:0 0 10px ${esc(color)}"></div><div class="embed-body"><strong>${esc(title)}</strong><p>${esc(desc)}</p>${img ? `<img src="${esc(img)}" alt="" style="max-width:100%;border-radius:6px;margin-top:8px" onerror="this.style.display='none'">` : ""}</div></div>`;
}
async function postEmToDiscord() {
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
function copyEmJson() {
  const body = {
    title: document.getElementById("em-title")?.value,
    description: document.getElementById("em-desc")?.value,
    color: document.getElementById("em-color")?.value,
    image: document.getElementById("em-image")?.value || undefined,
  };
  copyText(JSON.stringify(body, null, 2));
}

/* ===== MEETS ===== */
function renderMtHosts() {
  const el = document.getElementById("mt-hosts");
  if (!el) return;
  const hosts = C().hosts || [];
  el.innerHTML = hosts
    .map(
      (h) =>
        `<span class="chip ${selectedHosts.has(h) ? "active" : ""}" data-host="${esc(h)}">${esc(h)}</span>`
    )
    .join("");
  el.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const h = chip.dataset.host;
      if (selectedHosts.has(h)) selectedHosts.delete(h);
      else selectedHosts.add(h);
      chip.classList.toggle("active");
      updateMtPreview();
    });
  });
}
function updateMtPreview() {
  const el = document.getElementById("mt-preview");
  if (!el) return;
  const title = document.getElementById("mt-title")?.value || "Meet";
  const date = document.getElementById("mt-date")?.value || "";
  const time = document.getElementById("mt-time")?.value || "";
  const server = document.getElementById("mt-server")?.value || "";
  const desc = document.getElementById("mt-desc")?.value || "";
  const hosts = [...selectedHosts].join(", ") || "—";
  el.innerHTML = `<div class="embed-preview"><div class="embed-bar"></div><div class="embed-body"><strong>${esc(title)}</strong>
    <p>📅 ${esc(date)} · 🕐 ${esc(time)}<br>🎮 ${esc(server)}<br>👤 Hosts: ${esc(hosts)}<br><br>${esc(desc)}</p></div></div>`;
}
async function postMtToDiscord() {
  try {
    const body = {
      title: document.getElementById("mt-title")?.value,
      date: document.getElementById("mt-date")?.value,
      time: document.getElementById("mt-time")?.value,
      timezone: document.getElementById("mt-tz")?.value,
      server: document.getElementById("mt-server")?.value,
      description: document.getElementById("mt-desc")?.value,
      hosts: [...selectedHosts],
      role_id: document.getElementById("mt-role")?.value || null,
      channel_id: document.getElementById("mt-rem-ch")?.value,
    };
    await apiPost("/api/meet", body);
    toast("Meet posted");
  } catch (e) {
    toast(e.message, "error");
  }
}
function copyMtCommand() {
  copyText(`/meet title:${document.getElementById("mt-title")?.value || ""}`);
}

/* ===== POLLS ===== */
let pollOpts = ["Option A", "Option B"];
function renderPollOptions() {
  const el = document.getElementById("poll-options");
  if (!el) return;
  el.innerHTML = pollOpts
    .map(
      (o, i) =>
        `<div class="poll-opt"><input value="${esc(o)}" oninput="pollOpts[${i}]=this.value;updatePollPreview()" /><button type="button" onclick="removePollOption(${i})">×</button></div>`
    )
    .join("");
}
function addPollOption() {
  if (pollOpts.length >= 10) return toast("Max 10 options", "error");
  pollOpts.push("Option " + (pollOpts.length + 1));
  renderPollOptions();
  updatePollPreview();
}
function removePollOption(i) {
  if (pollOpts.length <= 2) return toast("Need at least 2 options", "error");
  pollOpts.splice(i, 1);
  renderPollOptions();
  updatePollPreview();
}
function updatePollPreview() {
  const el = document.getElementById("poll-preview");
  if (!el) return;
  const q = document.getElementById("poll-q")?.value || "Question?";
  el.innerHTML = `<strong>${esc(q)}</strong><ul style="margin:0.5rem 0 0 1.1rem;color:var(--muted)">${pollOpts.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>`;
}
async function postPoll() {
  try {
    const body = {
      question: document.getElementById("poll-q")?.value,
      channel_id: document.getElementById("poll-channel")?.value,
      options: pollOpts.filter(Boolean),
    };
    await apiPost("/api/poll", body);
    toast("Poll posted");
  } catch (e) {
    toast(e.message, "error");
  }
}

/* ===== DM ===== */
async function loadDmInbox() {
  const el = document.getElementById("dm-inbox");
  if (!el) return;
  try {
    const d = await apiGet("/api/dm/inbox");
    const items = d.users || d.inbox || d || [];
    if (!Array.isArray(items) || !items.length) {
      el.innerHTML = '<div class="muted">No recent DM contacts.</div>';
      return;
    }
    el.innerHTML = items
      .slice(0, 30)
      .map((u) => {
        const id = u.user_id || u.id || "";
        const name = u.username || u.display_name || id;
        return `<div class="dm-item" onclick="document.getElementById('dm-user-id').value='${esc(id)}';loadDmHistory()"><div><strong>${esc(name)}</strong><div class="muted">${esc(id)}</div></div><span class="muted">${esc(formatDate(u.last_at || u.updated_at))}</span></div>`;
      })
      .join("");
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
    const msgs = d.messages || d.history || [];
    if (!msgs.length) {
      el.innerHTML = '<div class="muted">No messages.</div>';
      return;
    }
    el.innerHTML = msgs
      .slice(0, 40)
      .map(
        (m) =>
          `<div class="archive-card"><strong>${esc(m.direction || m.author || "")}</strong> <span class="muted">${esc(formatDate(m.created_at || m.at))}</span><div>${esc(m.content || m.message || "")}</div></div>`
      )
      .join("");
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
    document.getElementById("dm-reply-msg").value = "";
    loadDmHistory();
  } catch (e) {
    toast(e.message, "error");
  }
}
async function saveDmAuto() {
  try {
    await apiPost("/api/dm/auto", {
      enabled: !!document.getElementById("dm-auto-on")?.checked,
      message: document.getElementById("dm-auto-msg")?.value,
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
    el.innerHTML = `<div class="server-kpis">
      <div class="server-kpi"><strong>${esc(d.messages ?? d.total_messages ?? "—")}</strong><small>messages</small></div>
      <div class="server-kpi"><strong>${esc(d.active_users ?? d.users ?? "—")}</strong><small>active users</small></div>
      <div class="server-kpi"><strong>${esc(d.media ?? "—")}</strong><small>media</small></div>
      <div class="server-kpi"><strong>${esc(d.period || "tracked")}</strong><small>period</small></div>
    </div>
    <pre style="margin-top:0.75rem">${esc(JSON.stringify(d, null, 2).slice(0, 2000))}</pre>`;
  } catch (e) {
    el.textContent = e.message;
  }
}
async function loadTicketLog() {
  const el = document.getElementById("ticket-log");
  if (!el) return;
  try {
    const d = await apiGet("/api/tickets");
    const items = d.tickets || d.items || d || [];
    if (!Array.isArray(items) || !items.length) {
      el.innerHTML = '<div class="muted">No submissions loaded.</div>';
      return;
    }
    el.innerHTML = items
      .slice(0, 25)
      .map(
        (t) =>
          `<div class="archive-card"><strong>${esc(t.type || t.kind || "ticket")}</strong> · ${esc(t.user || t.user_id || "")}<div class="muted">${esc(t.content || t.message || "").slice(0, 200)}</div></div>`
      )
      .join("");
  } catch (e) {
    el.textContent = e.message;
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
      Object.values(members)
        .slice(0, 80)
        .map((m) => {
          const names = (m.names || [])
            .slice(-5)
            .map((n) =>
              n.reason === "rename"
                ? `${esc(n.previous_display_name || "?")} → <strong>${esc(n.display_name || "?")}</strong>`
                : `first: <strong>${esc(n.display_name || "?")}</strong>`
            )
            .join("<br>");
          return `<div class="archive-card"><strong>${esc(m.display_name || m.username || m.user_id)}</strong> <code>${esc(m.user_id || "")}</code><div class="muted" style="margin-top:5px">${names || "—"}</div></div>`;
        })
        .join("") || '<div class="muted">No members in file.</div>';
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
  fillSelect(document.getElementById("poll-channel"), cfg.channels);
  fillTz(document.getElementById("mt-tz"), -3);
  const today = new Date().toISOString().slice(0, 10);
  const md = document.getElementById("mt-date");
  if (md && !md.value) md.value = today;
  renderMtHosts();
  updateEmPreview();
  updateMtPreview();
  renderPollOptions();
  updatePollPreview();
  loadOverview();
  loadTimestampConfig();
  loadCommands();
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  /* restore gate fields if reopening */
  const uid = getDiscordUserId();
  if (uid && document.getElementById("gate-user-id")) document.getElementById("gate-user-id").value = uid;
}

/* auto-open if session key exists */
document.addEventListener("DOMContentLoaded", () => {
  const uidEl = document.getElementById("gate-user-id");
  if (uidEl && getDiscordUserId()) uidEl.value = getDiscordUserId();
  if (getAccessKey() && getDiscordUserId()) {
    document.getElementById("gate").style.display = "none";
    document.getElementById("app").style.display = "";
    initAll();
  }
});
