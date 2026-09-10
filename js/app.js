const ACCESS_KEY = "BOVA-CORE-2026";
const C = () => window.BOVA_CONFIG || { roles: [], channels: [], hosts: [], servers: [], emojis: [] };

function tryUnlock() {
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-error");
  if (input.value.trim() === ACCESS_KEY) {
    sessionStorage.setItem("bova_auth", "1");
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("app").style.display = "block";
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
  document.getElementById("app").style.display = "block";
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
    const r = arRoles[arRoles.length - 1];
    hint.innerHTML = `After export / setup, run in Discord:<br><code>/autorole_add role:${r.label} label:${r.label}</code> then <code>/autorole_panel</code>`;
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
  el.style.borderLeftColor = color;
  const buttons = arRoles
    .map(
      (r) =>
        `<span style="display:inline-block;margin:3px;padding:4px 10px;background:#2b2d31;border-radius:3px;font-size:0.8rem">${r.emoji || ""} ${esc(r.label)}</span>`
    )
    .join("");
  el.innerHTML = `<div class="et">${esc(title)}</div><div class="ed">${esc(desc)}</div>
    <div style="margin-top:8px">${buttons || "<em style='color:#949ba4'>No roles yet</em>"}</div>
    <div class="foot">Bova's Bot · Auto-Role</div>`;
}
function exportArConfig() {
  const colorRaw = document.getElementById("ar-color").value || "#B450FF";
  const cfg = {
    title: document.getElementById("ar-title").value,
    description: document.getElementById("ar-desc").value,
    color: parseInt(colorRaw.replace("#", ""), 16),
    roles: arRoles.map((r) => ({ ...r, role_id: Number(r.role_id) || r.role_id })),
  };
  copyText(JSON.stringify(cfg, null, 2));
}

/* ---------- Embed ---------- */
function updateEmPreview() {
  const el = document.getElementById("em-preview");
  if (!el) return;
  const color = document.getElementById("em-color")?.value || "#00E5FF";
  el.style.borderLeftColor = color;
  const title = document.getElementById("em-title")?.value || "";
  const desc = document.getElementById("em-desc")?.value || "";
  const img = document.getElementById("em-image")?.value || "";
  const foot = document.getElementById("em-footer")?.value || "";
  let html = "";
  if (title) html += `<div class="et">${esc(title)}</div>`;
  if (desc) html += `<div class="ed">${esc(desc)}</div>`;
  if (img) html += `<img class="thumb" src="${esc(img)}" onerror="this.style.display='none'" />`;
  if (foot) html += `<div class="foot">${esc(foot)}</div>`;
  el.innerHTML = html || "<em style='color:#949ba4'>Fill the form</em>";
}
function copyEmJson() {
  copyText(
    JSON.stringify(
      {
        title: document.getElementById("em-title").value,
        description: document.getElementById("em-desc").value,
        color: document.getElementById("em-color").value,
        image: document.getElementById("em-image").value,
        footer: document.getElementById("em-footer").value,
        channel_id: document.getElementById("em-channel")?.value,
        role_id: document.getElementById("em-role")?.value,
      },
      null,
      2
    )
  );
}
function copyEmWebhookPayload() {
  const color = document.getElementById("em-color").value || "#00E5FF";
  const payload = {
    content: document.getElementById("em-role")?.value
      ? `<@&${document.getElementById("em-role").value}>`
      : "",
    embeds: [
      {
        title: document.getElementById("em-title").value,
        description: document.getElementById("em-desc").value,
        color: parseInt(color.replace("#", ""), 16),
        image: document.getElementById("em-image").value
          ? { url: document.getElementById("em-image").value }
          : undefined,
        footer: { text: document.getElementById("em-footer").value },
      },
    ],
  };
  const ch = document.getElementById("em-channel");
  const chName = ch?.options[ch.selectedIndex]?.text || "channel";
  copyText(JSON.stringify(payload, null, 2));
  alert("Webhook JSON copied.\nCreate a webhook in #" + chName + " and POST this JSON to the webhook URL.");
}

/* ---------- Meets ---------- */
function updateMtPreview() {
  const el = document.getElementById("mt-preview");
  if (!el) return;
  const title = document.getElementById("mt-title")?.value || "Meet";
  const desc = document.getElementById("mt-desc")?.value || "";
  const date = document.getElementById("mt-date")?.value;
  const time = document.getElementById("mt-time")?.value || "20:00";
  const hosts = [...document.querySelectorAll("#mt-hosts input:checked")].map((x) => x.value);
  const server = document.getElementById("mt-server")?.value || "";
  const img = document.getElementById("mt-image")?.value || "";
  let dateLabel = "Set date & time";
  let slashDate = "";
  if (date) {
    const [y, m, d] = date.split("-");
    slashDate = `${d}/${m}/${y} ${time}`;
    dateLabel = slashDate + " (São Paulo)";
  }
  el.style.borderLeftColor = "#B450FF";
  el.innerHTML = `
    <div class="et">🚗 ${esc(title)}</div>
    <div class="ed">${esc(desc)}</div>
    <div class="ef"><div class="efn">📅 Date & Time</div><div class="efv">${esc(dateLabel)}</div></div>
    <div class="ef"><div class="efn">👤 Hosts</div><div class="efv">${esc(hosts.join(", ") || "—")}</div></div>
    <div class="ef"><div class="efn">🖥️ Server</div><div class="efv">${esc(server)}</div></div>
    ${img ? `<img class="thumb" src="${esc(img)}" onerror="this.style.display='none'" />` : ""}
    <div class="foot">Bova's Bot · Bovary Club Society</div>`;
  const hint = document.getElementById("mt-cmd-hint");
  if (hint) {
    hint.textContent = slashDate
      ? `Ready — use Copy /meet command and paste in Discord`
      : `Select date and time`;
  }
}
function copyMtCommand() {
  const title = document.getElementById("mt-title").value;
  const desc = document.getElementById("mt-desc").value;
  const date = document.getElementById("mt-date").value;
  const time = document.getElementById("mt-time").value || "20:00";
  if (!date) return alert("Select a date");
  const [y, m, d] = date.split("-");
  const dateTime = `${d}/${m}/${y} ${time}`;
  const hosts = [...document.querySelectorAll("#mt-hosts input:checked")].map((x) => x.value).join(", ");
  const server = document.getElementById("mt-server").value;
  const image = document.getElementById("mt-image").value;
  const reminder = document.getElementById("mt-reminder").checked;
  const remCh = document.getElementById("mt-rem-ch").value;
  let cmd = `/meet title:${title} description:${desc} date_time:${dateTime} hosts:${hosts} server:${server}`;
  if (image) cmd += ` image_url:${image}`;
  if (reminder && remCh) cmd += ` enable_reminder:True`;
  copyText(cmd);
}

/* ---------- Timestamp ---------- */
function updateTs() {
  const date = document.getElementById("ts-date")?.value;
  const time = document.getElementById("ts-time")?.value || "00:00";
  const offset = parseFloat(document.getElementById("ts-offset")?.value ?? "-3");
  const out = document.getElementById("ts-out");
  const live = document.getElementById("ts-live-preview");
  if (!out) return;
  if (!date) {
    out.innerHTML = "";
    if (live) live.textContent = "Select date & time";
    return;
  }
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - offset * 3600 * 1000;
  const unix = Math.floor(utcMs / 1000);
  const local = new Date(utcMs);
  if (live) {
    live.innerHTML = `<strong>Preview:</strong> ${local.toUTCString()}<br>
      Relative style will show as Discord relative time for each user.<br>
      <code>&lt;t:${unix}:F&gt;</code>`;
  }
  const formats = [
    ["F", "Full"],
    ["f", "Short full"],
    ["D", "Date"],
    ["t", "Time"],
    ["R", "Relative"],
  ];
  out.innerHTML = formats
    .map(
      ([code, label]) =>
        `<div class="ts-row"><span><strong>${label}</strong> · <code>&lt;t:${unix}:${code}&gt;</code></span>
      <button class="btn btn-ghost" onclick="copyText('<t:${unix}:${code}>')">COPY</button></div>`
    )
    .join("");
}

/* ---------- Auto feeds / boost / weblogs helpers ---------- */
function copyAfCommand() {
  const msg = document.getElementById("af-message").value;
  const ch = document.getElementById("af-channel");
  const chName = ch.options[ch.selectedIndex]?.text || "";
  const interval = document.getElementById("af-interval").value;
  const start = document.getElementById("af-start").value;
  const cmd = `/autofeed_add message:${msg} channel:#${chName} interval_minutes:${interval} start_in_minutes:${start}`;
  document.getElementById("af-cmd-hint").textContent = "Paste in Discord (pick channel from slash UI if name differs)";
  copyText(cmd);
}
function copyBoostCommand() {
  const msg = document.getElementById("boost-msg").value;
  const ch = document.getElementById("boost-channel");
  const chName = ch.options[ch.selectedIndex]?.text || "";
  document.getElementById("boost-preview").querySelector(".ed").textContent = msg.replace("{user}", "@Booster");
  copyText(`/boost_config channel:#${chName} message:${msg} enabled:True`);
}
function copyWlCommand() {
  const ch = document.getElementById("wl-channel");
  const chName = ch.options[ch.selectedIndex]?.text || "";
  copyText(`/weblogs_config channel:#${chName}`);
}

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
  fillSelect(document.getElementById("boost-channel"), cfg.channels);
  fillSelect(document.getElementById("wl-channel"), cfg.channels);

  const hostBox = document.getElementById("mt-hosts");
  if (hostBox) {
    hostBox.innerHTML = cfg.hosts
      .map(
        (h) =>
          `<label class="chip"><input type="checkbox" value="${h}" onchange="updateMtPreview()" /> ${h}</label>`
      )
      .join("");
  }

  // default role label
  document.getElementById("ar-role-select")?.addEventListener("change", (e) => {
    const opt = e.target.options[e.target.selectedIndex];
    document.getElementById("ar-role-label").value = opt?.text || "";
  });

  document.getElementById("boost-msg")?.addEventListener("input", () => {
    const el = document.getElementById("boost-preview")?.querySelector(".ed");
    if (el) el.textContent = document.getElementById("boost-msg").value.replace("{user}", "@Booster");
  });

  const now = new Date();
  const ds = now.toISOString().slice(0, 10);
  const ts = now.toTimeString().slice(0, 5);
  ["ts-date", "mt-date"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = ds;
  });
  ["ts-time", "mt-time"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = ts;
  });

  renderArRoles();
  updateEmPreview();
  updateMtPreview();
  updateTs();
}
