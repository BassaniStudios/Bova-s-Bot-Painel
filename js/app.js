/* Bova Core Panel · v2.15.3 · PT-BR */
const TAB_META = {
  dashboard: ["VISÃO GERAL", "Painel"],
  server: ["VISÃO GERAL", "Servidor"],
  commands: ["VISÃO GERAL", "Comandos"],
  diagnostics: ["VISÃO GERAL", "Diagnósticos"],
  timestamp: ["AUTOMAÇÃO", "Lembretes"],
  meets: ["AUTOMAÇÃO", "Meets"],
  tickets: ["COMUNIDADE", "Tickets"],
  dm: ["COMUNIDADE", "Caixa de DM"],
  namehistory: ["COMUNIDADE", "Histórico de nomes"],
  embed: ["FERRAMENTAS", "Construtor de embed"],
  stats: ["FERRAMENTAS", "Estatísticas"],
  msglog: ["FERRAMENTAS", "Message Log"],
  weblogs: ["FERRAMENTAS", "WebLogs & mods"],
  audit: ["FERRAMENTAS", "Auditoria"],
  tutorial: ["AJUDA", "Guia"],
};

const TZ_LIST = [
  { id: "America/Sao_Paulo", label: "Brasília (UTC−3)", offset: -3 },
  { id: "America/Manaus", label: "Manaus (UTC−4)", offset: -4 },
  { id: "America/Noronha", label: "Fernando de Noronha (UTC−2)", offset: -2 },
  { id: "UTC", label: "UTC", offset: 0 },
  { id: "Europe/Lisbon", label: "Lisboa (UTC+0/+1)", offset: 0 },
];

/* Catálogo de referência — alinhado ao bot v2.15.3 (sem Arcade/Nitro/Economia) */
const COMMAND_CATALOG = [
  ["msglog status / channel / ignore_* / watch_*", "Configura message log (delete/edit) — LOCKED"],
  ["msglog_test", "Testa o canal de message log — LOCKED"],
  ["memberlog_test", "Amostras de join/leave/kick/ban"],
  ["weblogs_config", "Ajustes legados de WebLogs — LOCKED"],
  ["meet", "Anúncio de meet (também via painel web)"],
  ["sync_commands", "Ressincroniza slash commands — LOCKED"],
  ["antispam / antispam_toggle / antispam_status", "Honeypot anti-spam — LOCKED"],
  ["welcome_message / welcome_channel / welcome_enable", "Boas-vindas"],
  ["boost_announce", "Anúncio manual de boost"],
  ["birthday_panel", "Painel de aniversários"],
  ["ticket_panel / ticket_setup / ticket_list", "Sistema de tickets"],
  ["fenrir", "Status FiveM (role FiveMHosts)"],
  ["purge", "Limpeza de mensagens — LOCKED"],
  ["backup_* / db_status", "Backup e status do banco — LOCKED"],
];

/* ===== AUTH STORAGE ===== */
function getAccessKey() {
  return sessionStorage.getItem("bova_access_key") || "";
}
function setAccessKey(k) {
  sessionStorage.setItem("bova_access_key", k);
}
function getDiscordUserId() {
  return localStorage.getItem("bova_discord_user_id") || "";
}
function setDiscordUserId(id) {
  localStorage.setItem("bova_discord_user_id", id);
}
function getStoredApiUrl() {
  return (localStorage.getItem("bova_api_base_url") || "").trim();
}
function setStoredApiUrl(url) {
  const clean = String(url || "").trim().replace(/\/+$/, "");
  if (clean) localStorage.setItem("bova_api_base_url", clean);
  else localStorage.removeItem("bova_api_base_url");
}
function apiBase() {
  const stored = getStoredApiUrl();
  if (stored) return stored;
  const u = (window.BOVA_API && window.BOVA_API.baseUrl) || "";
  return String(u).replace(/\/+$/, "");
}

/** Traduz erros de rede do browser para mensagem útil em PT */
function friendlyNetworkError(err, base) {
  const raw = String((err && err.message) || err || "");
  const low = raw.toLowerCase();
  if (low.includes("failed to fetch") || low.includes("networkerror") || low.includes("load failed") || low.includes("network request failed")) {
    return (
      "Não foi possível conectar à API (" + (base || "sem URL") + "). " +
      "Causas comuns: serviço Render offline/dormindo, URL errada, ou rede bloqueando. " +
      "Confira a URL no login e se o Web Service está Up no Render."
    );
  }
  if (low.includes("aborted") || low.includes("abort")) {
    return "Requisição cancelada (outra chamada substituiu esta).";
  }
  return raw || "Erro de rede desconhecido";
}

function setApiStatus(state, label) {
  const el = document.getElementById("api-status");
  if (!el) return;
  el.className = "api-status " + (state || "offline");
  el.textContent = label || "API · —";
}

function showApiBanner(html) {
  const el = document.getElementById("api-banner");
  if (!el) return;
  if (!html) {
    el.style.display = "none";
    el.innerHTML = "";
    return;
  }
  el.style.display = "";
  el.innerHTML = html;
}

/* ===== API ===== */
const _inflight = new Map();
let _apiDown = false;

async function apiFetch(path, opts = {}, key) {
  const base = apiBase();
  if (!base) throw new Error("URL da API não definida. Informe no login ou em js/config.js (BOVA_API.baseUrl).");
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
    if (_apiDown) {
      _apiDown = false;
      setApiStatus("online", "API · online");
      showApiBanner("");
    }
    return data;
  } catch (err) {
    const msgAlreadyFriendly = String(err && err.message || "").includes("Não foi possível conectar");
    const friendly = msgAlreadyFriendly ? String(err.message) : friendlyNetworkError(err, base);
    if (/failed to fetch|networkerror|load failed/i.test(String(err && err.message || ""))) {
      _apiDown = true;
      setApiStatus("offline", "API · offline");
      showApiBanner(
        "<strong>API inacessível.</strong> URL atual: <code>" + esc(base) + "</code><br>" +
        "1) Confirme no Render que o Web Service está <em>Live</em> (não Suspended).<br>" +
        "2) A URL correta é a do serviço (ex.: <code>https://nome-do-servico.onrender.com</code>), sem barra no final.<br>" +
        "3) Free tier: após idle o cold start pode levar 30–60s — use “Testar conexão” no login.<br>" +
        "4) Ajuste a URL no login (campo URL da API) e autentique de novo."
      );
    }
    throw new Error(friendly);
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
async function fetchHealth() {
  const base = apiBase();
  if (!base) throw new Error("URL da API não definida");
  const t0 = performance.now();
  let res;
  try {
    res = await fetch(base + "/health", { method: "GET" });
  } catch (err) {
    throw new Error(friendlyNetworkError(err, base));
  }
  const ms = Math.round(performance.now() - t0);
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "HTTP 404 em /health — o serviço Render não existe ou a URL está errada (" + base + "). " +
        "Abra o dashboard do Render e copie a URL pública do Web Service."
      );
    }
    throw new Error((data && data.error) || `HTTP ${res.status}`);
  }
  return { ...data, _latency_ms: ms };
}

async function testApiConnection() {
  const input = document.getElementById("gate-api-url");
  const err = document.getElementById("gate-error");
  if (input && input.value.trim()) {
    setStoredApiUrl(input.value.trim());
  }
  const base = apiBase();
  if (!base) {
    if (err) err.textContent = "Informe a URL da API (https://seu-servico.onrender.com).";
    return;
  }
  if (err) {
    err.style.color = "";
    err.textContent = "Testando " + base + " … (cold start pode demorar)";
  }
  setApiStatus("checking", "API · testando");
  try {
    const h = await fetchHealth();
    if (err) {
      err.style.color = "#34d399";
      err.textContent = "OK · " + (h._latency_ms || "?") + " ms · " + base;
    }
    setApiStatus("online", "API · online");
    toast("API respondendo (" + (h._latency_ms || "?") + " ms)");
  } catch (e) {
    if (err) {
      err.style.color = "";
      err.textContent = e.message;
    }
    setApiStatus("offline", "API · offline");
    toast(e.message, "error");
  }
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
  try { return new Date(v).toLocaleString("pt-BR"); } catch (_) { return String(v); }
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
  const keep = optional ? '<option value="">Nenhum</option>' : "";
  if (Array.isArray(items) && items.length && typeof items[0] === "object") {
    el.innerHTML = keep + items.map((i) => `<option value="${esc(i.id || i)}">${esc(i.name || i.id || i)}</option>`).join("");
  } else if (Array.isArray(items)) {
    el.innerHTML = keep + items.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`).join("");
  }
}
function fillTz(el) {
  if (!el) return;
  el.innerHTML = TZ_LIST.map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("");
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}
function pretty(obj) {
  try { return JSON.stringify(obj, null, 2); } catch (_) { return String(obj); }
}

/* ===== GATE ===== */
async function tryUnlock() {
  const key = (document.getElementById("gate-input")?.value || "").trim();
  const uid = (document.getElementById("gate-user-id")?.value || "").trim();
  const apiUrl = (document.getElementById("gate-api-url")?.value || "").trim();
  const err = document.getElementById("gate-error");
  if (err) err.style.color = "";
  if (!uid || !/^\d{15,22}$/.test(uid)) {
    err.textContent = "Informe um ID Discord válido (snowflake numérico).";
    return;
  }
  if (!key) {
    err.textContent = "Informe a chave de acesso.";
    return;
  }
  if (apiUrl) setStoredApiUrl(apiUrl);
  if (!apiBase()) {
    err.textContent = "Informe a URL da API do Render (https://….onrender.com).";
    return;
  }
  setAccessKey(key);
  setDiscordUserId(uid);
  err.textContent = "Verificando API…";
  setApiStatus("checking", "API · testando");
  try {
    await fetchHealth();
    setApiStatus("online", "API · online");
    showApiBanner("");
  } catch (e) {
    // Ainda permite entrar para ver o painel, mas avisa com clareza
    setApiStatus("offline", "API · offline");
    err.textContent = e.message;
    toast(e.message, "error");
    // não bloqueia o login — o banner dentro do app explica o que fazer
  }
  document.getElementById("gate").style.display = "none";
  document.getElementById("app").style.display = "";
  initAll();
  apiGet("/api/auth/check").then(() => toast("Autenticado")).catch((e) => {
    toast("Auth: " + e.message, "error");
  });
}

/* ===== TABS ===== */
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === "panel-" + name));
  const meta = TAB_META[name] || ["", name];
  setText("crumb", meta[0] + " / " + meta[1].toUpperCase());
  setText("page-title", meta[1]);
  const sb = document.getElementById("sidebar");
  if (sb) sb.classList.remove("open");

  if (name === "dashboard") loadOverview();
  if (name === "server") loadServerSummary();
  if (name === "timestamp") loadTimestampConfig();
  if (name === "dm") loadDmInbox();
  if (name === "commands") loadCommands();
  if (name === "stats") loadStats();
  if (name === "audit") loadAudit();
  if (name === "tickets") loadTickets();
}
function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
}
function refreshCurrent() {
  const active = document.querySelector(".tab-btn.active");
  if (active) switchTab(active.dataset.tab);
}

/* ===== LOADERS ===== */
async function loadOverview() {
  try {
    const h = await fetchHealth();
    setText("m-latency", (h._latency_ms ?? "—") + " ms");
    setText("m-guild", h.ok || h.status === "ok" ? "Online" : "Verificar");
    setText("m-uptime", h.uptime_seconds != null ? formatUptime(h.uptime_seconds) : (h.uptime || "—"));
    setText("m-cmds", h.commands != null ? String(h.commands) : "—");
  } catch (e) {
    setText("m-latency", "erro");
    setText("m-guild", "offline?");
    toast("Health: " + e.message, "error");
  }
  try {
    const o = await apiGet("/api/overview");
    document.getElementById("overview-raw").textContent = pretty(o);
    if (o.commands != null) setText("m-cmds", String(o.commands));
  } catch (e) {
    document.getElementById("overview-raw").textContent = "Erro: " + e.message;
  }
}

async function loadHealth() {
  const el = document.getElementById("health-raw");
  el.textContent = "Carregando…";
  try {
    const h = await fetchHealth();
    el.textContent = pretty(h);
    toast("Saúde OK · " + (h._latency_ms || "?") + " ms");
  } catch (e) {
    el.textContent = "Erro: " + e.message;
    toast(e.message, "error");
  }
}

async function syncCommands() {
  const el = document.getElementById("sync-raw");
  el.textContent = "Sincronizando…";
  try {
    const d = await apiPost("/api/sync-commands", {});
    el.textContent = pretty(d);
    toast("Comandos sincronizados");
  } catch (e) {
    el.textContent = "Erro: " + e.message;
    toast(e.message, "error");
  }
}

async function loadServerSummary() {
  const el = document.getElementById("server-raw");
  el.textContent = "Carregando…";
  try {
    const d = await apiGet("/api/server/summary");
    el.textContent = pretty(d);
  } catch (e) {
    el.textContent = "Erro: " + e.message;
  }
}

async function loadCommands() {
  const list = document.getElementById("commands-list");
  list.innerHTML = "<p class='muted'>Carregando…</p>";
  try {
    const d = await apiGet("/api/commands");
    const cmds = d.commands || d || [];
    if (Array.isArray(cmds) && cmds.length) {
      list.innerHTML = '<div class="feature-grid">' + cmds.map((c) => {
        const name = typeof c === "string" ? c : (c.name || c.qualified_name || JSON.stringify(c));
        const desc = typeof c === "object" ? (c.description || "") : "";
        return `<div class="feature-card"><h4><span class="cmd-chip">/${esc(name)}</span></h4><p>${esc(desc)}</p></div>`;
      }).join("") + "</div>";
    } else {
      list.innerHTML = "<p class='muted'>Nenhum comando retornado pela API. Veja o catálogo abaixo.</p>";
    }
  } catch (e) {
    list.innerHTML = `<p class="muted">API: ${esc(e.message)}</p>`;
  }
  renderCatalog();
}

function renderCatalog() {
  const el = document.getElementById("commands-catalog");
  if (!el) return;
  el.innerHTML = COMMAND_CATALOG.map(([cmd, desc]) =>
    `<div style="margin:0.35rem 0"><span class="cmd-chip">${esc(cmd)}</span> <span class="muted">${esc(desc)}</span></div>`
  ).join("");
}

async function loadTimestampConfig() {
  try {
    const d = await apiGet("/api/timestamp-reminder");
    const cfg = d.config || d || {};
    const en = document.getElementById("ts-enabled");
    if (en) en.value = cfg.enabled === false ? "false" : "true";
    if (cfg.channel_id) {
      const sel = document.getElementById("ts-channel");
      if (sel) sel.value = String(cfg.channel_id);
    }
    if (cfg.timezone) {
      const tz = document.getElementById("ts-tz");
      if (tz) tz.value = cfg.timezone;
    }
    if (cfg.message != null) {
      document.getElementById("ts-message").value = cfg.message;
    }
    updateTsPreview();
    document.getElementById("ts-raw").textContent = pretty(d);
  } catch (e) {
    document.getElementById("ts-raw").textContent = "Erro: " + e.message;
  }
}

async function saveTimestampConfig() {
  const body = {
    enabled: document.getElementById("ts-enabled").value === "true",
    channel_id: document.getElementById("ts-channel").value,
    timezone: document.getElementById("ts-tz").value,
    message: document.getElementById("ts-message").value,
  };
  try {
    const d = await apiPost("/api/timestamp-reminder", body);
    document.getElementById("ts-raw").textContent = pretty(d);
    toast("Lembrete salvo");
  } catch (e) {
    toast(e.message, "error");
    document.getElementById("ts-raw").textContent = "Erro: " + e.message;
  }
}

function updateTsPreview() {
  const t = document.getElementById("ts-message")?.value || "—";
  const el = document.getElementById("ts-preview");
  if (el) el.textContent = t;
}

async function postMeet() {
  const body = {
    channel_id: document.getElementById("meet-channel").value,
    server: document.getElementById("meet-server").value,
    host: document.getElementById("meet-host").value,
    emoji: document.getElementById("meet-emoji").value,
    title: document.getElementById("meet-title").value,
    description: document.getElementById("meet-desc").value,
    time: document.getElementById("meet-time").value,
    image: document.getElementById("meet-image").value || undefined,
  };
  try {
    const d = await apiPost("/api/meet", body);
    document.getElementById("meet-raw").textContent = pretty(d);
    toast("Meet publicado");
  } catch (e) {
    document.getElementById("meet-raw").textContent = "Erro: " + e.message;
    toast(e.message, "error");
  }
}

function updateMeetPreview() {
  setText("meet-prev-title", document.getElementById("meet-title")?.value || "Título do meet");
  const parts = [
    document.getElementById("meet-desc")?.value,
    document.getElementById("meet-time")?.value ? "Horário: " + document.getElementById("meet-time").value : "",
    document.getElementById("meet-host")?.value ? "Host: " + document.getElementById("meet-host").value : "",
    document.getElementById("meet-server")?.value ? "Servidor: " + document.getElementById("meet-server").value : "",
  ].filter(Boolean);
  setText("meet-prev-desc", parts.join("\n") || "A descrição aparece aqui.");
}

async function loadTickets() {
  const el = document.getElementById("tickets-raw");
  el.textContent = "Carregando…";
  try {
    const d = await apiGet("/api/tickets");
    el.textContent = pretty(d);
  } catch (e) {
    el.textContent = "Erro: " + e.message;
  }
}

async function loadDmInbox() {
  const box = document.getElementById("dm-inbox");
  box.innerHTML = "<p class='muted'>Carregando…</p>";
  try {
    const d = await apiGet("/api/dm/inbox");
    const items = d.messages || d.inbox || d || [];
    if (!Array.isArray(items) || !items.length) {
      box.innerHTML = "<p class='muted'>Inbox vazia.</p>";
    } else {
      box.innerHTML = items.slice(0, 30).map((m) => {
        const uid = m.user_id || m.author_id || "?";
        const content = m.content || m.text || "";
        const when = formatDate(m.created_at || m.ts);
        return `<div class="feature-card" style="margin-bottom:0.5rem">
          <h4>User <code>${esc(uid)}</code></h4>
          <p>${esc(content)}</p>
          <small class="muted">${esc(when)}</small>
          <button class="btn btn-ghost" style="margin-top:0.35rem" onclick="document.getElementById('dm-user-id').value='${esc(uid)}'">Usar este ID</button>
        </div>`;
      }).join("");
    }
    document.getElementById("dm-raw").textContent = pretty(d);
  } catch (e) {
    box.innerHTML = `<p class="muted">Erro: ${esc(e.message)}</p>`;
  }
}

async function sendDmReply() {
  const user_id = document.getElementById("dm-user-id").value.trim();
  const content = document.getElementById("dm-reply").value.trim();
  if (!user_id || !content) {
    toast("Preencha ID e mensagem", "error");
    return;
  }
  try {
    const d = await apiPost("/api/dm/reply", { user_id: Number(user_id), content });
    document.getElementById("dm-raw").textContent = pretty(d);
    toast("Resposta enviada");
    document.getElementById("dm-reply").value = "";
  } catch (e) {
    toast(e.message, "error");
    document.getElementById("dm-raw").textContent = "Erro: " + e.message;
  }
}

async function saveDmAuto() {
  const body = {
    enabled: document.getElementById("dm-auto-on").value === "true",
    message: document.getElementById("dm-auto-text").value,
  };
  try {
    const d = await apiPost("/api/dm/auto", body);
    document.getElementById("dm-raw").textContent = pretty(d);
    toast("Auto-resposta salva");
  } catch (e) {
    toast(e.message, "error");
  }
}

async function loadNameHistory() {
  const uid = document.getElementById("nh-user-id").value.trim();
  if (!uid) {
    toast("Informe o ID do usuário", "error");
    return;
  }
  const el = document.getElementById("nh-raw");
  el.textContent = "Buscando…";
  try {
    const d = await apiGet("/api/namehistory?user_id=" + encodeURIComponent(uid));
    el.textContent = pretty(d);
  } catch (e) {
    el.textContent = "Erro: " + e.message;
  }
}

async function postEmbed() {
  const body = {
    channel_id: document.getElementById("embed-channel").value,
    title: document.getElementById("embed-title").value,
    description: document.getElementById("embed-desc").value,
    color: document.getElementById("embed-color").value,
    footer: document.getElementById("embed-footer").value,
    image: document.getElementById("embed-image").value || undefined,
  };
  try {
    const d = await apiPost("/api/embed", body);
    document.getElementById("embed-raw").textContent = pretty(d);
    toast("Embed enviado");
  } catch (e) {
    document.getElementById("embed-raw").textContent = "Erro: " + e.message;
    toast(e.message, "error");
  }
}

function updateEmbedPreview() {
  setText("embed-prev-title", document.getElementById("embed-title")?.value || "Título");
  setText("embed-prev-desc", document.getElementById("embed-desc")?.value || "Descrição");
  setText("embed-prev-footer", document.getElementById("embed-footer")?.value || "Bova's Bot");
  const color = document.getElementById("embed-color")?.value || "#a855f7";
  const prev = document.getElementById("embed-preview");
  if (prev) prev.style.borderLeftColor = color;
}

async function loadStats() {
  const el = document.getElementById("stats-raw");
  el.textContent = "Carregando…";
  try {
    const d = await apiGet("/api/stats/summary");
    el.textContent = pretty(d);
  } catch (e) {
    el.textContent = "Erro: " + e.message;
  }
}

async function loadAudit() {
  const el = document.getElementById("audit-raw");
  el.textContent = "Carregando…";
  try {
    const d = await apiGet("/api/audit");
    el.textContent = pretty(d);
  } catch (e) {
    el.textContent = "Erro: " + e.message;
  }
}

/* ===== INIT ===== */
function initSelects() {
  const cfg = window.BOVA_CONFIG || {};
  fillSelect(document.getElementById("ts-channel"), cfg.channels);
  fillSelect(document.getElementById("meet-channel"), cfg.channels);
  fillSelect(document.getElementById("embed-channel"), cfg.channels);
  fillSelect(document.getElementById("meet-server"), cfg.servers);
  fillSelect(document.getElementById("meet-host"), cfg.hosts);
  fillSelect(document.getElementById("meet-emoji"), cfg.emojis);
  fillTz(document.getElementById("ts-tz"));
}

function bindPreviews() {
  ["ts-message"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateTsPreview);
  });
  ["meet-title", "meet-desc", "meet-time", "meet-host", "meet-server"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateMeetPreview);
    document.getElementById(id)?.addEventListener("change", updateMeetPreview);
  });
  ["embed-title", "embed-desc", "embed-footer", "embed-color"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateEmbedPreview);
  });
}

function initAll() {
  initSelects();
  bindPreviews();
  renderCatalog();
  updateTsPreview();
  updateMeetPreview();
  updateEmbedPreview();
  loadOverview();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  const uid = getDiscordUserId();
  if (uid && document.getElementById("gate-user-id")) {
    document.getElementById("gate-user-id").value = uid;
  }
  const apiInput = document.getElementById("gate-api-url");
  if (apiInput) {
    apiInput.value = getStoredApiUrl() || apiBase() || "";
  }
});
