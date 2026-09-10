/** Access key — change via PANEL_ACCESS_KEY in bot .env and update here for the static panel */
const ACCESS_KEY = "BOVA-CORE-2026";
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
    const rows = Object.values(members).slice(0, 80).map((m) => {
      const names = (m.names || []).slice(-5).map((n) => {
        if (n.reason === "rename")
          return `${(n.previous_display_name||"?")} → <strong>${esc(n.display_name||"?")}</strong>`;
        return `first: <strong>${esc(n.display_name||"?")}</strong>`;
      }).join("<br/>");
      return `<div class="card" style="margin-bottom:0.5rem">
        <strong>${esc(m.display_name||m.username||m.user_id)}</strong>
        <code>${m.user_id||""}</code>
        <div style="color:var(--dim);margin-top:0.4rem;font-size:0.8rem">${names||"—"}</div>
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
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
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
  const btns = arRoles.map((r) => `${r.emoji || ""} ${esc(r.label)}`).join(" · ") || "(no roles yet)";
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
    embeds: [{
      title: document.getElementById("em-title")?.value || undefined,
      description: document.getElementById("em-desc")?.value || undefined,
      color: parseInt((document.getElementById("em-color")?.value || "#00E5FF").slice(1), 16),
      image: document.getElementById("em-image")?.value ? { url: document.getElementById("em-image").value } : undefined,
      footer: document.getElementById("em-footer")?.value ? { text: document.getElementById("em-footer").value } : undefined,
    }],
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

/* ---------- Init ---------- */
function initAll() {
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
