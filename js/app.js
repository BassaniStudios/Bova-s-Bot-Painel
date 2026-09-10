const ACCESS_KEY = "BOVA-CORE-2026";

function tryUnlock() {
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-error");
  if (input.value.trim() === ACCESS_KEY) {
    sessionStorage.setItem("bova_auth", "1");
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("app").style.display = "block";
    err.style.display = "none";
    initTools();
  } else {
    err.style.display = "block";
    input.value = "";
    input.focus();
  }
}
document.getElementById("gate-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});
if (sessionStorage.getItem("bova_auth") === "1") {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("app").style.display = "block";
  setTimeout(initTools, 50);
}

function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
}
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

/* ---------- Auto-role ---------- */
let arRoles = JSON.parse(localStorage.getItem("bova_ar_roles") || "[]");

function renderArRoles() {
  const box = document.getElementById("ar-role-list");
  if (!box) return;
  box.innerHTML = arRoles.map((r, i) =>
    `<span class="role-chip">${r.emoji || ""} ${r.label} <code>${r.role_id}</code>
     <button onclick="removeArRole(${i})" title="Remove">×</button></span>`
  ).join("");
  localStorage.setItem("bova_ar_roles", JSON.stringify(arRoles));
  updateArPreview();
}
function addArRole() {
  const id = document.getElementById("ar-role-id").value.trim();
  const label = document.getElementById("ar-role-label").value.trim() || id;
  const emoji = document.getElementById("ar-role-emoji").value.trim() || null;
  if (!id) return alert("Role ID required");
  arRoles = arRoles.filter((r) => String(r.role_id) !== id);
  arRoles.push({ role_id: id, label, emoji });
  document.getElementById("ar-role-id").value = "";
  document.getElementById("ar-role-label").value = "";
  document.getElementById("ar-role-emoji").value = "";
  renderArRoles();
}
function removeArRole(i) {
  arRoles.splice(i, 1);
  renderArRoles();
}
function updateArPreview() {
  const title = document.getElementById("ar-title")?.value || "";
  const desc = document.getElementById("ar-desc")?.value || "";
  const color = document.getElementById("ar-color")?.value || "#B450FF";
  const el = document.getElementById("ar-preview");
  if (!el) return;
  const buttons = arRoles.map((r) =>
    `<span style="display:inline-block;margin:3px;padding:4px 10px;background:#2b2d31;border-radius:3px;font-size:0.8rem">${r.emoji || ""} ${r.label}</span>`
  ).join("");
  el.style.borderLeftColor = color;
  el.innerHTML = `<div class="et">${esc(title)}</div><div class="ed">${esc(desc)}</div>
    <div style="margin-top:8px">${buttons || "<em style='color:#949ba4'>No roles yet</em>"}</div>
    <div class="foot">Bova's Bot · Auto-Role</div>`;
}
function exportArConfig() {
  const cfg = {
    title: document.getElementById("ar-title").value,
    description: document.getElementById("ar-desc").value,
    color: parseInt((document.getElementById("ar-color").value || "#B450FF").replace("#", ""), 16),
    roles: arRoles.map((r) => ({ ...r, role_id: Number(r.role_id) || r.role_id })),
  };
  navigator.clipboard.writeText(JSON.stringify(cfg, null, 2));
  alert("Config JSON copied. Save as data/autorole.json on the bot host, then /autorole_panel");
}

/* ---------- Embed ---------- */
function updateEmPreview() {
  const el = document.getElementById("em-preview");
  if (!el) return;
  const color = document.getElementById("em-color")?.value || "#00E5FF";
  const title = document.getElementById("em-title")?.value || "";
  const desc = document.getElementById("em-desc")?.value || "";
  const img = document.getElementById("em-image")?.value || "";
  const foot = document.getElementById("em-footer")?.value || "";
  const f1n = document.getElementById("em-f1n")?.value || "";
  const f1v = document.getElementById("em-f1v")?.value || "";
  el.style.borderLeftColor = color;
  let html = "";
  if (title) html += `<div class="et">${esc(title)}</div>`;
  if (desc) html += `<div class="ed">${esc(desc)}</div>`;
  if (f1n || f1v) html += `<div class="ef"><div class="efn">${esc(f1n)}</div><div class="efv">${esc(f1v)}</div></div>`;
  if (img) html += `<img class="thumb" src="${esc(img)}" alt="" onerror="this.style.display='none'" />`;
  if (foot) html += `<div class="foot">${esc(foot)}</div>`;
  el.innerHTML = html || "<em style='color:#949ba4'>Fill the form to preview</em>";
}
function copyEmJson() {
  const data = {
    title: document.getElementById("em-title").value,
    description: document.getElementById("em-desc").value,
    color: document.getElementById("em-color").value,
    image: document.getElementById("em-image").value,
    footer: document.getElementById("em-footer").value,
    fields: [{ name: document.getElementById("em-f1n").value, value: document.getElementById("em-f1v").value }],
  };
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  alert("Embed JSON copied to clipboard");
}

/* ---------- Meets ---------- */
function parseSpDate(str) {
  if (!str) return null;
  const m = str.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [_, d, mo, y, h, mi] = m;
  // Treat as UTC-3
  const utc = Date.UTC(+y, +mo - 1, +d, (+h || 0) + 3, +mi || 0);
  return Math.floor(utc / 1000);
}
function updateMtPreview() {
  const el = document.getElementById("mt-preview");
  if (!el) return;
  const title = document.getElementById("mt-title")?.value || "Meet";
  const desc = document.getElementById("mt-desc")?.value || "";
  const dateStr = document.getElementById("mt-date")?.value || "";
  const hosts = document.getElementById("mt-hosts")?.value || "—";
  const server = document.getElementById("mt-server")?.value || "—";
  const img = document.getElementById("mt-image")?.value || "";
  const unix = parseSpDate(dateStr);
  let timeBlock = dateStr || "Set a date";
  if (unix) {
    timeBlock = `Unix ${unix} · Discord: <t:${unix}:F> · <t:${unix}:R>`;
  }
  el.style.borderLeftColor = "#B450FF";
  el.innerHTML = `
    <div class="et">🚗 ${esc(title)}</div>
    <div class="ed">${esc(desc)}</div>
    <div class="ef"><div class="efn">📅 Date & Time</div><div class="efv">${esc(timeBlock)}</div></div>
    <div class="ef"><div class="efn">👤 Hosts</div><div class="efv">${esc(hosts)}</div></div>
    <div class="ef"><div class="efn">🖥️ Server</div><div class="efv">${esc(server)}</div></div>
    ${img ? `<img class="thumb" src="${esc(img)}" onerror="this.style.display='none'" />` : ""}
    <div class="foot">Bova's Bot · Bovary Club Society</div>`;
  const hint = document.getElementById("mt-ts-hint");
  if (hint) {
    hint.textContent = unix
      ? `Reminder uses this start time. Enable checkbox + channel ID, then post with /meet.`
      : `Enter date as DD/MM/YYYY HH:MM (São Paulo).`;
  }
}

/* ---------- Timestamp tool ---------- */
function updateTs() {
  const date = document.getElementById("ts-date")?.value;
  const time = document.getElementById("ts-time")?.value || "00:00";
  const offset = parseFloat(document.getElementById("ts-offset")?.value ?? "-3");
  const out = document.getElementById("ts-out");
  if (!out) return;
  if (!date) {
    out.innerHTML = "<span style='color:var(--dim)'>Select a date</span>";
    return;
  }
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // Local as offset from UTC
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - offset * 3600 * 1000;
  const unix = Math.floor(utcMs / 1000);
  const formats = [
    ["F", "Full"],
    ["f", "Short full"],
    ["D", "Date"],
    ["d", "Short date"],
    ["t", "Time"],
    ["T", "Long time"],
    ["R", "Relative"],
  ];
  out.innerHTML = formats.map(([code, label]) => {
    const md = `&lt;t:${unix}:${code}&gt;`;
    return `<div class="ts-row"><span><strong>${label}</strong> · <code>&lt;t:${unix}:${code}&gt;</code></span>
      <button class="btn btn-ghost" onclick="copyText('<t:${unix}:${code}>')">COPY</button></div>`;
  }).join("");
}
function copyText(t) {
  navigator.clipboard.writeText(t);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initTools() {
  const lat = document.getElementById("stat-latency");
  if (lat) lat.textContent = (18 + Math.random() * 40).toFixed(0) + "ms";
  renderArRoles();
  updateEmPreview();
  updateMtPreview();
  // default ts to now
  const now = new Date();
  const dateEl = document.getElementById("ts-date");
  const timeEl = document.getElementById("ts-time");
  if (dateEl && !dateEl.value) {
    dateEl.value = now.toISOString().slice(0, 10);
  }
  if (timeEl && !timeEl.value) {
    timeEl.value = now.toTimeString().slice(0, 5);
  }
  updateTs();
}
