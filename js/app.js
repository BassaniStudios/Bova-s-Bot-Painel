/** Access key — must match PANEL_ACCESS_KEY on Render */
const ACCESS_KEY = "BovaClub#CoreAccess-2026!";

/** Fallback if config.js is missing or still has the placeholder */
const DEFAULT_API_BASE = "https://bovarybot.onrender.com";

function getApiBase() {
  const fromConfig = window.BOVA_API && window.BOVA_API.baseUrl;
  if (fromConfig && !String(fromConfig).includes("YOUR-RENDER")) {
    return String(fromConfig).replace(/\/$/, "");
  }
  return DEFAULT_API_BASE;
}

function getDiscordUserId() {
  return sessionStorage.getItem("bova_discord_id") || localStorage.getItem("bova_discord_id") || "";
}

function setDiscordUserId(id) {
  sessionStorage.setItem("bova_discord_id", id);
  localStorage.setItem("bova_discord_id", id);
}

async function apiPost(path, body) {
  const base = getApiBase();
  if (!base) {
    alert("API base URL missing. Check js/config.js");
    throw new Error("no api");
  }
  if (!getDiscordUserId()) {
    const entered = prompt(
      "Your Discord User ID (Developer Mode → right-click yourself → Copy ID):"
    );
    if (!entered) throw new Error("no user id");
    setDiscordUserId(entered.trim());
  }
  const res = await fetch(base + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": ACCESS_KEY,
      "X-Discord-User-Id": getDiscordUserId(),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert("API error: " + (data.detail || data.error || res.status));
    throw new Error(data.error || "api error");
  }
  return data;
}

async function apiGet(path) {
  const base = getApiBase();
  if (!base) {
    alert("API base URL missing. Check js/config.js");
    throw new Error("no api");
  }
  if (!getDiscordUserId()) {
    const entered = prompt("Your Discord User ID:");
    if (!entered) throw new Error("no user id");
    setDiscordUserId(entered.trim());
  }
  const res = await fetch(base + path, {
    headers: {
      "X-API-Key": ACCESS_KEY,
      "X-Discord-User-Id": getDiscordUserId(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert("API error: " + (data.detail || data.error || res.status));
    throw new Error(data.error || "api error");
  }
  return data;
}

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

function fillTz(sel, preferred) {
  if (!sel) return;
  sel.innerHTML = "";
  TZ_LIST.forEach((t) => {
    const o = document.createElement("option");
    o.value = String(t.offset);
    o.textContent = t.label;
    o.dataset.id = t.id;
    if (preferred != null && t.offset === preferred) o.selected = true;
    sel.appendChild(o);
  });
}

function onTsTz() {
  const sel = document.getElementById("ts-tz");
  const off = document.getElementById("ts-offset");
  if (sel && off) off.value = sel.value;
  updateTs();
}

function renderNameHistory() {
  const raw = document.getElementById("nh-json")?.value || "";
  const out = document.getElementById("nh-out");
  if (!out) return;
  try {
    const data = JSON.parse(raw);
    const members = data.members || data;
    const rows = Object.values(members)
      .slice(0, 80)
      .map((m) => {
        const names = (m.names || [])
          .slice(-5)
          .map((n) => {
            if (n.reason === "rename")
              return `${n.previous_display_name || "?"} → <strong>${esc(n.display_name || "?")}</strong>`;
            return `first: <strong>${esc(n.display_name || "?")}</strong>`;
          })
          .join("<br/>");
        return `<div class="card" style="margin-bottom:0.5rem">
        <strong>${esc(m.display_name || m.username || m.user_id)}</strong>
        <code>${m.user_id || ""}</code>
        <div style="color:var(--dim);margin-top:0.4rem;font-size:0.8rem">${names || "—"}</div>
      </div>`;
      });
    out.innerHTML = rows.join("") || "<p style='color:var(--dim)'>No members in file.</p>";
  } catch (e) {
    out.innerHTML = `<p style="color:#ff4060">Invalid JSON: ${esc(e.message)}</p>`;
  }
}

function tryUnlock() {
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-error");
  if (input.value.trim() === ACCESS_KEY) {
    sessionStorage.setItem("bova_auth", "1");
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("app").style.display = "flex";
    err.style.display = "none";
    initAll();
  } else {
    err.style.display = "block";
  }
}

document.getElementById("gate-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

if (sessionStorage.getItem("bova_auth") === "1") {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("app").style.display = "flex";
  setTimeout(initAll, 30);
}

function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === name)
  );
  document.querySelectorAll(".panel").forEach((p) =>
    p.classList.toggle("active", p.id === `panel-${name}`)
  );
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function fillSelect(sel, items, withEmpty) {
  if (!sel) return;
  sel.innerHTML = withEmpty ? '<option value="">— none —</option>' : "";
  items.forEach((it) => {
    const o = document.createElement("option");
    if (typeof it === "string") {
      o.value = it;
      o.textContent = it;
    } else {
      o.value = it.id;
      o.textContent = it.name || it.id;
    }
    sel.appendChild(o);
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function copyText(t) {
  navigator.clipboard.writeText(t).then(() => alert("Copied!")).catch(() => prompt("Copy:", t));
}

/* ---------- Auto-role ---------- */
let arRoles = JSON.parse(localStorage.getItem("bova_ar_roles") || "[]");

function renderArRoles() {
  const box = document.getElementById("ar-role-list");
  if (!box) return;
  box.innerHTML = arRoles
    .map(
      (r, i) =>
        `<span class="role-chip">${r.emoji || ""} ${esc(r.label)} <code>${r.role_id}</code>
     <button onclick="removeArRole(${i})">×</button></span>`
    )
    .join("");
  localStorage.setItem("bova_ar_roles", JSON.stringify(arRoles));
  updateArPreview();
  const hint = document.getElementById("ar-cmd-hint");
  if (hint && arRoles.length) {
    hint.innerHTML = `Roles ready (${arRoles.length}). In Discord run <code>/autorole_add</code> for each, then <code>/autorole_panel</code>.`;
  }
}

function addArRole() {
  const sel = document.getElementById("ar-role-select");
  const id = sel.value;
  const name = sel.options[sel.selectedIndex]?.text || id;
  const label = document.getElementById("ar-role-label").value.trim() || name;
  const emoji = document.getElementById("ar-emoji-select").value || null;
  if (!id) return alert("Select a role");
  arRoles = arRoles.filter((r) => String(r.role_id) !== id);
  arRoles.push({ role_id: id, label, emoji });
  renderArRoles();
  document.getElementById("ar-role-label").value = "";
}

function removeArRole(i) {
  arRoles.splice(i, 1);
  renderArRoles();
}

function updateArPreview() {
  const title = document.getElementById("ar-title")?.value || "";
  const desc = document.getElementById("ar-desc")?.value || "";
  const color = document.getElementById("ar-color")?.value || "#B450FF";
  const box = document.getElementById("ar-preview");
  if (!box) return;
  const btns =
    arRoles.map((r) => `${r.emoji || ""} ${esc(r.label)}`).join(" · ") || "(no roles yet)";
  box.innerHTML = `<div class="ep-title" style="border-left:4px solid ${color};padding-left:8px">${esc(title)}</div>
    <div class="ep-desc">${esc(desc)}</div>
    <div style="margin-top:0.6rem;font-size:0.8rem;color:var(--dim)">Buttons: ${btns}</div>`;
}

function exportArConfig() {
  const data = {
    title: document.getElementById("ar-title")?.value,
    description: document.getElementById("ar-desc")?.value,
    color: parseInt((document.getElementById("ar-color")?.value || "#B450FF").slice(1), 16),
    roles: arRoles,
  };
  copyText(JSON.stringify(data, null, 2));
}

/* ---------- Embed ---------- */
function updateEmPreview() {
  const title = document.getElementById("em-title")?.value || "";
  const desc = document.getElementById("em-desc")?.value || "";
  const color = document.getElementById("em-color")?.value || "#00E5FF";
  const img = document.getElementById("em-image")?.value || "";
  const footer = document.getElementById("em-footer")?.value || "";
  const box = document.getElementById("em-preview");
  if (!box) return;
  box.style.borderLeftColor = color;
  box.innerHTML = `<div class="ep-title">${esc(title)}</div>
    <div class="ep-desc">${esc(desc)}</div>
    ${img ? `<img src="${esc(img)}" alt="" onerror="this.style.display='none'" />` : ""}
    <div style="margin-top:0.5rem;font-size:0.75rem;color:var(--dim)">${esc(footer)}</div>`;
}

function copyEmWebhookPayload() {
  const payload = {
    content: (() => {
      const r = document.getElementById("em-role");
      return r?.value ? `<@&${r.value}>` : undefined;
    })(),
    embeds: [
      {
        title: document.getElementById("em-title")?.value || undefined,
        description: document.getElementById("em-desc")?.value || undefined,
        color: parseInt((document.getElementById("em-color")?.value || "#00E5FF").slice(1), 16),
        image: document.getElementById("em-image")?.value
          ? { url: document.getElementById("em-image").value }
          : undefined,
        footer: document.getElementById("em-footer")?.value
          ? { text: document.getElementById("em-footer").value }
          : undefined,
      },
    ],
  };
  copyText(JSON.stringify(payload, null, 2));
}

function copyEmJson() {
  copyEmWebhookPayload();
}

/* ---------- Meets ---------- */
let mtSelectedHosts = [];

function renderMtHosts() {
  const box = document.getElementById("mt-hosts");
  if (!box) return;
  const hosts = C().hosts || [];
  box.innerHTML = hosts
    .map(
      (h) =>
        `<span class="chip ${mtSelectedHosts.includes(h) ? "selected" : ""}" onclick="toggleMtHost('${h}')">${esc(h)}</span>`
    )
    .join("");
}

function toggleMtHost(h) {
  if (mtSelectedHosts.includes(h)) mtSelectedHosts = mtSelectedHosts.filter((x) => x !== h);
  else mtSelectedHosts.push(h);
  renderMtHosts();
  updateMtPreview();
}

function updateMtPreview() {
  const title = document.getElementById("mt-title")?.value || "Meet";
  const desc = document.getElementById("mt-desc")?.value || "";
  const date = document.getElementById("mt-date")?.value || "";
  const time = document.getElementById("mt-time")?.value || "";
  const server = document.getElementById("mt-server")?.value || "";
  const img = document.getElementById("mt-image")?.value || "";
  const box = document.getElementById("mt-preview");
  if (!box) return;
  box.innerHTML = `<div class="ep-title">🚗 ${esc(title)}</div>
    <div class="ep-desc">${esc(desc)}</div>
    <div style="margin-top:0.5rem;font-size:0.85rem">📅 ${esc(date)} ${esc(time)} (SP)<br/>👤 ${esc(mtSelectedHosts.join(", ") || "—")}<br/>🖥️ ${esc(server)}</div>
    ${img ? `<img src="${esc(img)}" alt="" onerror="this.style.display='none'" />` : ""}`;
  const hint = document.getElementById("mt-cmd-hint");
  if (hint && date && time) {
    const [y, m, d] = date.split("-");
    const dt = `${d}/${m}/${y} ${time}`;
    hint.textContent = `Suggested: /meet title:${title} date_time:${dt} ...`;
  }
}

function copyMtCommand() {
  const title = document.getElementById("mt-title")?.value || "Meet";
  const desc = document.getElementById("mt-desc")?.value || "";
  const date = document.getElementById("mt-date")?.value || "";
  const time = document.getElementById("mt-time")?.value || "20:00";
  const server = document.getElementById("mt-server")?.value || "";
  const img = document.getElementById("mt-image")?.value || "";
  const role = document.getElementById("mt-role")?.value || "";
  const rem = document.getElementById("mt-reminder")?.checked;
  const remCh = document.getElementById("mt-rem-ch")?.value || "";
  if (!date) return alert("Select a date");
  const [y, m, d] = date.split("-");
  const dt = `${d}/${m}/${y} ${time}`;
  const tz = document.getElementById("mt-tz")?.value || "-3";
  let cmd = `/meet title:${title} description:${desc} date_time:${dt} hosts:${mtSelectedHosts.join(", ") || "TBD"} server:${server} timezone_offset:${tz}`;
  if (role) cmd += ` mention_role:@Role`;
  if (img) cmd += ` image_url:${img}`;
  if (rem && remCh) cmd += ` enable_reminder:True reminder_channel:#channel`;
  copyText(cmd);
}

/* ---------- Timestamp ---------- */
function updateTs() {
  const date = document.getElementById("ts-date")?.value;
  const time = document.getElementById("ts-time")?.value || "00:00";
  const offset = parseFloat(document.getElementById("ts-offset")?.value || "-3");
  const live = document.getElementById("ts-live-preview");
  const out = document.getElementById("ts-out");
  if (!date || !live || !out) return;
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - offset * 3600 * 1000;
  const unix = Math.floor(utcMs / 1000);
  live.textContent = `Unix: ${unix} · Local preview`;
  out.innerHTML = `
    <code>&lt;t:${unix}:F&gt;</code> Full<br/>
    <code>&lt;t:${unix}:f&gt;</code> Short full<br/>
    <code>&lt;t:${unix}:D&gt;</code> Date<br/>
    <code>&lt;t:${unix}:t&gt;</code> Time<br/>
    <code>&lt;t:${unix}:R&gt;</code> Relative`;
}

/* ---------- Auto Feeds ---------- */
function toggleAfMode() {
  const mode = document.getElementById("af-mode")?.value;
  document.getElementById("af-interval-box").style.display = mode === "interval" ? "block" : "none";
  document.getElementById("af-fixed-box").style.display = mode === "fixed" ? "block" : "none";
  updateAfHint();
}

function updateAfHint() {
  const hint = document.getElementById("af-cmd-hint");
  if (!hint) return;
  const mode = document.getElementById("af-mode")?.value;
  if (mode === "fixed") {
    const h = document.getElementById("af-hour")?.value || 20;
    const m = document.getElementById("af-minute")?.value || 0;
    hint.textContent = `Fixed daily at ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} (São Paulo)`;
  } else {
    hint.textContent = `Interval every ${document.getElementById("af-interval")?.value || 1440} minutes`;
  }
}

function copyAfCommand() {
  const msg = document.getElementById("af-msg")?.value || "";
  const ch = document.getElementById("af-channel");
  const chName = ch?.options[ch.selectedIndex]?.text || "#channel";
  const mode = document.getElementById("af-mode")?.value;
  const useEmbed = document.getElementById("af-embed")?.checked;
  const embTitle = document.getElementById("af-embed-title")?.value || "";
  let cmd = `/autofeed_add message:${msg} channel:${chName}`;
  if (mode === "fixed") {
    cmd += ` fixed_hour:${document.getElementById("af-hour")?.value || 20} fixed_minute:${document.getElementById("af-minute")?.value || 0}`;
  } else {
    cmd += ` interval_minutes:${document.getElementById("af-interval")?.value || 1440}`;
  }
  if (useEmbed) {
    cmd += ` use_embed:True`;
    if (embTitle) cmd += ` embed_title:${embTitle}`;
  }
  copyText(cmd);
}

/* ---------- Poll / API actions ---------- */
async function postPoll() {
  const status = document.getElementById("poll-status");
  const channel = document.getElementById("poll-channel").value;
  const title = document.getElementById("poll-title").value.trim();
  const desc = document.getElementById("poll-desc").value.trim();
  const raw = document.getElementById("poll-options").value;
  const options = raw
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const single = document.getElementById("poll-single").checked;
  const hours = parseFloat(document.getElementById("poll-hours").value) || 0;
  const color = document.getElementById("poll-color").value;
  if (!channel || !title || options.length < 2) {
    status.textContent = "Need channel, title and at least 2 options.";
    return;
  }
  status.textContent = "Creating…";
  try {
    const res = await apiPost("/api/poll", {
      channel_id: channel,
      title,
      description: desc,
      options,
      single_vote: single,
      hours: hours > 0 ? hours : null,
      color,
    });
    status.textContent = res.ok ? "✅ Poll created · id " + res.id : "❌ " + (res.error || "fail");
  } catch (e) {
    status.textContent = "❌ " + e.message;
  }
}

function initAll() {
  const pollCh = document.getElementById("poll-channel");
  if (pollCh && window.BOVA_CONFIG && window.BOVA_CONFIG.channels) {
    fillSelect(pollCh, window.BOVA_CONFIG.channels, true);
  }
  const cfg = C();
  fillSelect(document.getElementById("ar-role-select"), cfg.roles);
  fillSelect(document.getElementById("ar-emoji-select"), cfg.emojis);
  fillSelect(document.getElementById("em-channel"), cfg.channels);
  fillSelect(document.getElementById("em-role"), cfg.roles, true);
  fillSelect(document.getElementById("mt-server"), cfg.servers);
  fillSelect(document.getElementById("mt-role"), cfg.roles, true);
  fillSelect(document.getElementById("mt-rem-ch"), cfg.channels);
  fillSelect(document.getElementById("af-channel"), cfg.channels);
  fillSelect(document.getElementById("af-role"), cfg.roles, true);
  document.getElementById("ar-role-select")?.addEventListener("change", () => {
    const sel = document.getElementById("ar-role-select");
    const name = sel.options[sel.selectedIndex]?.text || "";
    const label = document.getElementById("ar-role-label");
    if (label && !label.value) label.value = name;
  });
  fillTz(document.getElementById("mt-tz"), -3);
  fillTz(document.getElementById("ts-tz"), -3);
  fillTz(document.getElementById("af-tz"), -3);
  renderArRoles();
  renderMtHosts();
  updateArPreview();
  updateEmPreview();
  updateMtPreview();
  updateTs();
  toggleAfMode();
}

async function postEmToDiscord() {
  try {
    const role = document.getElementById("em-role");
    const data = await apiPost("/api/embed", {
      channel_id: document.getElementById("em-channel")?.value,
      title: document.getElementById("em-title")?.value,
      description: document.getElementById("em-desc")?.value,
      color: document.getElementById("em-color")?.value,
      image_url: document.getElementById("em-image")?.value || null,
      footer: document.getElementById("em-footer")?.value,
      role_id: role?.value || null,
    });
    alert("Embed posted! message_id=" + data.message_id);
  } catch (e) {}
}

async function postArPanel() {
  try {
    const ch = prompt("Channel ID to post the auto-role panel:");
    if (!ch) return;
    const title = document.getElementById("ar-title")?.value;
    const description = document.getElementById("ar-desc")?.value;
    const color = document.getElementById("ar-color")?.value;
    const data = await apiPost("/api/autorole/panel", {
      channel_id: ch,
      title,
      description,
      color,
      roles: arRoles,
    });
    alert("Auto-role panel posted! message_id=" + data.message_id);
  } catch (e) {}
}

async function postMtToDiscord() {
  try {
    const date = document.getElementById("mt-date")?.value;
    const time = document.getElementById("mt-time")?.value || "20:00";
    if (!date) return alert("Select a date");
    const [y, m, d] = date.split("-");
    const dt = `${d}/${m}/${y} ${time}`;
    const ch = prompt("Channel ID to post the meet:");
    if (!ch) return;
    const role = document.getElementById("mt-role")?.value;
    const rem = document.getElementById("mt-reminder")?.checked;
    const remCh = document.getElementById("mt-rem-ch")?.value;
    const data = await apiPost("/api/meet", {
      channel_id: ch,
      title: document.getElementById("mt-title")?.value || "Meet",
      description: document.getElementById("mt-desc")?.value || "",
      date_time: dt,
      hosts: mtSelectedHosts.join(", ") || "TBD",
      server: document.getElementById("mt-server")?.value || "",
      timezone_offset: parseFloat(document.getElementById("mt-tz")?.value || "-3"),
      mention_role_id: role || null,
      image_url: document.getElementById("mt-image")?.value || null,
      enable_reminder: !!rem,
      reminder_channel_id: rem ? remCh : null,
    });
    alert("Meet posted! message_id=" + data.message_id);
  } catch (e) {}
}

async function postAfToDiscord() {
  try {
    const mode = document.getElementById("af-mode")?.value;
    const body = {
      message: document.getElementById("af-msg")?.value || "",
      channel_id: document.getElementById("af-channel")?.value,
      role_id: document.getElementById("af-role")?.value || null,
      mode,
      use_embed: document.getElementById("af-embed")?.checked,
      embed_title: document.getElementById("af-embed-title")?.value || null,
    };
    if (mode === "fixed") {
      body.fixed_hour = parseInt(document.getElementById("af-hour")?.value || "20", 10);
      body.fixed_minute = parseInt(document.getElementById("af-minute")?.value || "0", 10);
    } else {
      body.interval_minutes = parseInt(document.getElementById("af-interval")?.value || "1440", 10);
    }
    const data = await apiPost("/api/autofeed", body);
    alert("AutoFeed created #" + data.id);
  } catch (e) {}
}

async function loadServerSummary() {
  const el = document.getElementById("server-summary");
  if (!el) return;
  el.textContent = "Loading…";
  try {
    const data = await apiGet("/api/server/summary");
    if (data.error) {
      el.textContent = "Error: " + data.error;
      return;
    }
    const roles = (data.roles || [])
      .slice(0, 12)
      .map((r) => `• ${r.name} — ${r.members} members`)
      .join("<br/>");
    el.innerHTML = `
      <strong style="color:var(--text)">${esc(data.name)}</strong> · <code>${esc(data.id)}</code><br/>
      Members: <strong>${data.member_count}</strong> (👤 ${data.humans} · 🤖 ${data.bots})<br/>
      Channels: 💬 ${data.text_channels} · 🔊 ${data.voice_channels}<br/>
      Roles: ${data.roles_count} · Boosts: L${data.boost_tier} / ${data.boosts}<br/>
      Created: <code>${esc(data.created_at || "")}</code><br/><br/>
      <strong>Top roles</strong><br/>${roles || "—"}
    `;
  } catch (e) {
    el.textContent = "Failed: " + e.message;
  }
}

async function loadAuditLog() {
  const el = document.getElementById("audit-log");
  if (!el) return;
  el.textContent = "Loading…";
  try {
    const data = await apiGet("/api/audit");
    const entries = data.entries || [];
    if (!entries.length) {
      el.textContent = "No audit entries yet.";
      return;
    }
    el.innerHTML = entries
      .map((e) => {
        const ok = e.success ? "OK" : "FAIL";
        return `<div style="margin-bottom:0.5rem;border-bottom:1px solid #2a2a45;padding-bottom:0.35rem">
        <span style="color:var(--text)">${esc(e.ts || "")}</span>
        · actor <code>${esc(String(e.actor_id || "—"))}</code>
        · <strong>${esc(e.action || "")}</strong>
        · ${ok}
        ${e.detail ? `<br/><span style="opacity:0.75">${esc(JSON.stringify(e.detail).slice(0, 180))}</span>` : ""}
      </div>`;
      })
      .join("");
  } catch (e) {
    el.textContent = "Failed: " + e.message;
  }
}

async function loadTicketLog() {
  const el = document.getElementById("ticket-log-list");
  if (!el) return;
  el.textContent = "Loading…";
  try {
    const data = await apiGet("/api/tickets");
    const entries = data.entries || [];
    if (!entries.length) {
      el.textContent = "No submissions yet.";
      return;
    }
    el.innerHTML = entries
      .map((e) => {
        const kind = esc(e.kind || "");
        const subj = esc(e.subject || "");
        const body = esc((e.body || "").slice(0, 280));
        return `<div style="margin-bottom:0.75rem;padding-bottom:0.6rem;border-bottom:1px solid #2a2a45">
        <strong style="color:var(--text)">[${kind}]</strong> ${subj}<br/>
        <span style="opacity:0.8">by <code>${esc(String(e.user_id || ""))}</code> · ${esc(e.created_at || "")} · id ${esc(String(e.id || ""))}</span><br/>
        <span style="color:var(--dim)">${body}</span>
      </div>`;
      })
      .join("");
  } catch (err) {
    el.textContent = "Failed: " + err.message;
  }
}