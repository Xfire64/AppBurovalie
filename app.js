const storageKey = "appburovalie-data-v1";
const sessionKey = "appburovalie-api-session";
const themeKey = "appburovalie-theme";
const defaultApiUrl = "http://15.188.3.163:3000";

const defaultData = {
  users: [
    { id: "u-admin", name: "Admin Burovalie", role: "admin", locationId: "depot-siege" },
    { id: "u-tech-1", name: "Technicien 1", role: "technicien", locationId: "veh-tech-1", allowedLocationIds: ["veh-tech-1", "depot-siege"] },
    { id: "u-resp", name: "Responsable technique", role: "responsable", locationId: "depot-siege" },
    { id: "u-dir", name: "Direction", role: "direction", locationId: "depot-siege" },
  ],
  locations: [
    { id: "depot-siege", name: "Dépôt siège", type: "depot" },
    { id: "depot-site-2", name: "Dépôt site 2", type: "depot" },
    { id: "depot-site-3", name: "Dépôt site 3", type: "depot" },
    { id: "veh-tech-1", name: "Véhicule technicien 1", type: "vehicle", ownerUserId: "u-tech-1" },
  ],
  articles: [
    {
      id: "art-toner",
      name: "Toner noir copieur",
      reference: "TON-NOIR-01",
      barcode: "3760123456789",
      extraCodes: ["3029330003533"],
      minimum: 4,
      category: "Consommable",
    },
    {
      id: "art-carte",
      name: "Carte électronique mise à jour",
      reference: "MAJ-CARTE-22",
      barcode: "8710398501218",
      extraCodes: [],
      minimum: 2,
      category: "Pièce",
    },
    {
      id: "art-rouleau",
      name: "Rouleau d'entraînement",
      reference: "RUL-ENT-12",
      barcode: "1234567890128",
      extraCodes: [],
      minimum: 3,
      category: "Pièce",
    },
  ],
  stocks: {
    "art-toner|depot-siege": 14,
    "art-toner|depot-site-2": 3,
    "art-toner|veh-tech-1": 2,
    "art-carte|depot-siege": 5,
    "art-carte|veh-tech-1": 1,
    "art-rouleau|depot-site-3": 9,
  },
  movements: [],
  batches: [],
  catalog: [
    {
      id: "cat-cyan",
      name: "Toner cyan copieur",
      reference: "TON-CYAN-01",
      barcode: "3760123456796",
      extraCodes: [],
      minimum: 4,
      category: "Consommable",
    },
    {
      id: "cat-four",
      name: "Four unité de fusion",
      reference: "FOUR-FUS-10",
      barcode: "3760123456802",
      extraCodes: ["FUS-UNIT-10"],
      minimum: 1,
      category: "Pièce",
    },
  ],
  currentUserId: "u-admin",
};

const elements = {
  userSelect: document.querySelector("#userSelect"),
  loginView: document.querySelector("#loginView"),
  loginApiUrlInput: document.querySelector("#loginApiUrlInput"),
  loginEmailInput: document.querySelector("#loginEmailInput"),
  loginPasswordInput: document.querySelector("#loginPasswordInput"),
  loginApiBtn: document.querySelector("#loginApiBtn"),
  demoLoginBtn: document.querySelector("#demoLoginBtn"),
  loginMessage: document.querySelector("#loginMessage"),
  serverStatus: document.querySelector("#serverStatus"),
  installBtn: document.querySelector("#installBtn"),
  seedBtn: document.querySelector("#seedBtn"),
  barcodeInput: document.querySelector("#barcodeInput"),
  scanQtyInput: document.querySelector("#scanQtyInput"),
  scanBtn: document.querySelector("#scanBtn"),
  scanEntryBtn: document.querySelector("#scanEntryBtn"),
  scanExitBtn: document.querySelector("#scanExitBtn"),
  scanSearchBtn: document.querySelector("#scanSearchBtn"),
  scanLocationSelect: document.querySelector("#scanLocationSelect"),
  scanMessage: document.querySelector("#scanMessage"),
  cameraScanner: document.querySelector("#cameraScanner"),
  cameraVideo: document.querySelector("#cameraVideo"),
  stopCameraBtn: document.querySelector("#stopCameraBtn"),
  itemCount: document.querySelector("#itemCount"),
  stockValue: document.querySelector("#stockValue"),
  lowCount: document.querySelector("#lowCount"),
  dashboardLowBadge: document.querySelector("#dashboardLowBadge"),
  dashboardAlerts: document.querySelector("#dashboardAlerts"),
  movementCount: document.querySelector("#movementCount"),
  recentMovements: document.querySelector("#recentMovements"),
  locationSummary: document.querySelector("#locationSummary"),
  exportStockBtn: document.querySelector("#exportStockBtn"),
  stockBody: document.querySelector("#stockBody"),
  searchInput: document.querySelector("#searchInput"),
  locationFilter: document.querySelector("#locationFilter"),
  movementForm: document.querySelector("#movementForm"),
  resetMovementBtn: document.querySelector("#resetMovementBtn"),
  movementArticleSelect: document.querySelector("#movementArticleSelect"),
  movementTypeSelect: document.querySelector("#movementTypeSelect"),
  ticketInput: document.querySelector("#ticketInput"),
  fromLocationSelect: document.querySelector("#fromLocationSelect"),
  toLocationSelect: document.querySelector("#toLocationSelect"),
  movementQtyInput: document.querySelector("#movementQtyInput"),
  movementNoteInput: document.querySelector("#movementNoteInput"),
  addMovementLineBtn: document.querySelector("#addMovementLineBtn"),
  movementDraftList: document.querySelector("#movementDraftList"),
  movementBody: document.querySelector("#movementBody"),
  exportMovementsBtn: document.querySelector("#exportMovementsBtn"),
  inventoryList: document.querySelector("#inventoryList"),
  ordersBody: document.querySelector("#ordersBody"),
  exportOrdersBtn: document.querySelector("#exportOrdersBtn"),
  topPeriodSelect: document.querySelector("#topPeriodSelect"),
  topArticlesList: document.querySelector("#topArticlesList"),
  productForm: document.querySelector("#productForm"),
  resetFormBtn: document.querySelector("#resetFormBtn"),
  nameInput: document.querySelector("#nameInput"),
  refInput: document.querySelector("#refInput"),
  codeInput: document.querySelector("#codeInput"),
  extraCodesInput: document.querySelector("#extraCodesInput"),
  minInput: document.querySelector("#minInput"),
  categoryInput: document.querySelector("#categoryInput"),
  articleSearchInput: document.querySelector("#articleSearchInput"),
  articleBody: document.querySelector("#articleBody"),
  printLabelsBtn: document.querySelector("#printLabelsBtn"),
  labelGrid: document.querySelector("#labelGrid"),
  catalogForm: document.querySelector("#catalogForm"),
  resetCatalogBtn: document.querySelector("#resetCatalogBtn"),
  catalogNameInput: document.querySelector("#catalogNameInput"),
  catalogRefInput: document.querySelector("#catalogRefInput"),
  catalogCodeInput: document.querySelector("#catalogCodeInput"),
  catalogExtraCodesInput: document.querySelector("#catalogExtraCodesInput"),
  catalogMinInput: document.querySelector("#catalogMinInput"),
  catalogCategoryInput: document.querySelector("#catalogCategoryInput"),
  catalogImportInput: document.querySelector("#catalogImportInput"),
  importCatalogBtn: document.querySelector("#importCatalogBtn"),
  catalogSearchInput: document.querySelector("#catalogSearchInput"),
  catalogList: document.querySelector("#catalogList"),
  accountForm: document.querySelector("#accountForm"),
  accountNameInput: document.querySelector("#accountNameInput"),
  accountEmailInput: document.querySelector("#accountEmailInput"),
  accountPasswordInput: document.querySelector("#accountPasswordInput"),
  accountRoleSelect: document.querySelector("#accountRoleSelect"),
  accountLocationSelect: document.querySelector("#accountLocationSelect"),
  accountCountBadge: document.querySelector("#accountCountBadge"),
  accountList: document.querySelector("#accountList"),
  rightsList: document.querySelector("#rightsList"),
  appMenuBtn: document.querySelector("#appMenuBtn"),
  appMenu: document.querySelector("#appMenu"),
  logoutBtn: document.querySelector("#logoutBtn"),
  darkModeToggle: document.querySelector("#darkModeToggle"),
  batchControlList: document.querySelector("#batchControlList"),
};

let data = loadData();
let editingArticleId = "";
let editingCatalogId = "";
let deferredInstallPrompt = null;
let cameraStream = null;
let scanTimer = 0;
let barcodeDetector = null;
let html5QrScanner = null;
let movementDraft = [];
let lastDetectedCode = "";
let stableDetectionCount = 0;
let lastAcceptedScanAt = 0;
let apiSession = loadApiSession();
let appUnlocked = isApiMode() || localStorage.getItem("appburovalie-demo-unlocked") === "true";
let darkMode = localStorage.getItem(themeKey) === "dark";

document.body.classList.toggle("dark-mode", darkMode);

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    const merged = stored ? { ...structuredClone(defaultData), ...stored } : structuredClone(defaultData);
    merged.batches = merged.batches || [];
    merged.catalog = merged.catalog || [];
    return merged;
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadApiSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey)) || {
      apiUrl: defaultApiUrl,
      token: "",
      user: null,
    };
  } catch {
    return { apiUrl: defaultApiUrl, token: "", user: null };
  }
}

function saveApiSession() {
  localStorage.setItem(sessionKey, JSON.stringify(apiSession));
}

function isApiMode() {
  return Boolean(apiSession.token);
}

async function apiFetch(path, options = {}) {
  const baseUrl = (apiSession.apiUrl || defaultApiUrl).replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(apiSession.token ? { Authorization: `Bearer ${apiSession.token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `HTTP_${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

function currentUser() {
  return data.users.find((user) => user.id === data.currentUserId) || data.users[0];
}

function canSeeAllStocks() {
  return ["admin", "responsable", "direction"].includes(currentUser().role);
}

function canManageRights() {
  return ["admin", "responsable", "direction"].includes(currentUser().role);
}

function canPointBatches() {
  return ["admin", "responsable", "direction"].includes(currentUser().role);
}

function allowedLocationIdsFor(user) {
  if (!user) return [];
  if (["admin", "responsable", "direction"].includes(user.role)) {
    return data.locations.map((location) => location.id);
  }

  const ids = new Set(user.allowedLocationIds || []);
  ids.add(user.locationId);
  return [...ids];
}

function visibleLocations() {
  if (canSeeAllStocks()) return data.locations;
  const allowedIds = new Set(allowedLocationIdsFor(currentUser()));
  return data.locations.filter((location) => allowedIds.has(location.id));
}

function getArticle(articleId) {
  return data.articles.find((article) => article.id === articleId);
}

function getLocation(locationId) {
  return data.locations.find((location) => location.id === locationId);
}

function stockKey(articleId, locationId) {
  return `${articleId}|${locationId}`;
}

function getStock(articleId, locationId) {
  return Number(data.stocks[stockKey(articleId, locationId)] || 0);
}

function setStock(articleId, locationId, quantity) {
  data.stocks[stockKey(articleId, locationId)] = Math.max(0, Number(quantity) || 0);
}

function normalizeCode(code) {
  return code.trim();
}

function allCodes(article) {
  return [article.barcode, ...(article.extraCodes || [])].filter(Boolean);
}

function findArticleByCode(code) {
  const cleanCode = normalizeCode(code);
  return data.articles.find((article) => allCodes(article).includes(cleanCode));
}

function findCatalogByCode(code) {
  const cleanCode = normalizeCode(code);
  return (data.catalog || []).find((item) => allCodes(item).includes(cleanCode));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function movementLabel(type) {
  return {
    entry: "Entrée",
    exit: "Sortie",
    transfer: "Transfert",
    adjustment: "Correction",
  }[type] || type;
}

function setMessage(text, type = "") {
  elements.scanMessage.textContent = text;
  elements.scanMessage.className = `status ${type}`.trim();
}

function visibleStockRows() {
  const allowedLocations = new Set(visibleLocations().map((location) => location.id));
  const rows = [];

  data.articles.forEach((article) => {
    data.locations.forEach((location) => {
      if (!allowedLocations.has(location.id)) return;
      const quantity = getStock(article.id, location.id);
      rows.push({ article, location, quantity });
    });
  });

  return rows;
}

function lowStockRows() {
  return visibleStockRows().filter((row) => row.quantity <= row.article.minimum);
}

function totalStockUnits() {
  return visibleStockRows().reduce((total, row) => total + row.quantity, 0);
}

function addOptions(select, options, placeholder = "") {
  select.innerHTML = "";
  if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
  }

  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name || item.label;
    select.appendChild(option);
  });
}

function apiRoleToLocal(role) {
  return String(role || "").toLowerCase();
}

function localRoleToApi(role) {
  return String(role || "").toUpperCase();
}

function apiTypeToLocal(type) {
  return String(type || "").toLowerCase() === "vehicule" ? "vehicle" : "depot";
}

function apiMovementToLocal(type) {
  return {
    ENTRY: "entry",
    EXIT: "exit",
    TRANSFER: "transfer",
    ADJUSTMENT: "adjustment",
  }[type] || String(type || "").toLowerCase();
}

function localMovementToApi(type) {
  return {
    entry: "ENTRY",
    exit: "EXIT",
    transfer: "TRANSFER",
    adjustment: "ADJUSTMENT",
  }[type] || String(type || "").toUpperCase();
}

function articleFromApi(article) {
  const codes = article.barcodes?.map((barcode) => barcode.code) || [];
  return {
    id: article.id,
    name: article.description,
    reference: article.reference,
    barcode: codes[0] || "",
    extraCodes: codes.slice(1),
    minimum: article.minimum || 0,
    category: article.category || "",
  };
}

function locationFromApi(location) {
  return {
    id: location.id,
    name: location.name,
    type: apiTypeToLocal(location.type),
  };
}

function userFromApi(user) {
  return {
    id: user.id,
    name: user.name,
    role: apiRoleToLocal(user.role),
    locationId: user.primaryLocationId,
    allowedLocationIds: user.allowedLocationIds || [],
  };
}

function movementFromApi(movement) {
  return {
    id: movement.id,
    date: movement.createdAt,
    type: apiMovementToLocal(movement.type),
    articleId: movement.articleId,
    quantity: movement.quantity,
    fromLocationId: movement.fromLocationId || "",
    toLocationId: movement.toLocationId || "",
    note: movement.note || "",
    batchId: movement.batchId || "",
    ticketNumber: movement.ticketNumber || "",
    userId: movement.userId,
    userName: movement.user?.name || "",
  };
}

function batchFromApi(batch) {
  return {
    id: batch.id,
    date: batch.createdAt,
    type: apiMovementToLocal(batch.type),
    ticketNumber: batch.ticketNumber || "",
    fromLocationId: batch.fromLocationId || "",
    toLocationId: batch.toLocationId || "",
    lines: (batch.movements || []).map((movement) => ({
      articleId: movement.articleId,
      quantity: movement.quantity,
      note: movement.note || "",
    })),
    userId: batch.userId,
    userName: batch.user?.name || "",
    checked: batch.checked,
    checkedBy: batch.checkedBy?.name || "",
    checkedAt: batch.checkedAt || "",
  };
}

function renderUsers() {
  addOptions(elements.userSelect, data.users.map((user) => ({
    id: user.id,
    name: `${user.name} - ${user.role}`,
  })));
  elements.userSelect.value = currentUser().id;

  document.querySelectorAll(".admin-only").forEach((element) => {
    element.hidden = !["admin", "responsable"].includes(currentUser().role);
  });
  document.querySelectorAll(".accounts-only").forEach((element) => {
    element.hidden = !canManageRights();
  });
  document.querySelectorAll(".rights-only").forEach((element) => {
    element.hidden = !canManageRights();
  });
  document.querySelectorAll(".control-only").forEach((element) => {
    element.hidden = !canPointBatches();
  });

  elements.serverStatus.textContent = isApiMode()
    ? `Connecté API : ${apiSession.user?.name || currentUser().name}`
    : "Mode démo local.";
  elements.serverStatus.classList.toggle("online", isApiMode());
  elements.darkModeToggle.checked = darkMode;
}

function renderSelects() {
  const locations = visibleLocations();
  addOptions(elements.scanLocationSelect, locations);
  addOptions(elements.locationFilter, [{ id: "all", name: "Tous les emplacements" }, ...locations]);
  addOptions(elements.fromLocationSelect, [{ id: "", name: "Aucun" }, ...locations]);
  addOptions(elements.toLocationSelect, [{ id: "", name: "Aucun" }, ...locations]);
  addOptions(elements.movementArticleSelect, data.articles.map((article) => ({
    id: article.id,
    name: `${article.reference} - ${article.name}`,
  })));
  addOptions(elements.accountLocationSelect, data.locations);

  elements.scanLocationSelect.value = locations.some((location) => location.id === currentUser().locationId)
    ? currentUser().locationId
    : locations[0]?.id;
  elements.locationFilter.value = "all";
}

function renderStats() {
  elements.itemCount.textContent = data.articles.length;
  elements.stockValue.textContent = totalStockUnits();
  elements.lowCount.textContent = lowStockRows().length;
  elements.dashboardLowBadge.textContent = lowStockRows().length;
  elements.movementCount.textContent = data.movements.length;
}

function renderDashboard() {
  const alerts = lowStockRows().slice(0, 8);
  elements.dashboardAlerts.innerHTML = alerts.length
    ? alerts.map(({ article, location, quantity }) => `
      <article class="list-item">
        <strong>${article.reference} - ${article.name}</strong>
        <span>${location.name} : ${quantity} / mini ${article.minimum}</span>
      </article>
    `).join("")
    : `<p class="empty">Aucune alerte de stock.</p>`;

  const recent = [...data.movements].reverse().slice(0, 8);
  elements.recentMovements.innerHTML = recent.length
    ? recent.map((movement) => {
      const article = getArticle(movement.articleId);
      return `
        <article class="list-item">
          <strong>${movementLabel(movement.type)} - ${article?.reference || "Article supprimé"}</strong>
          <span>${movement.quantity} unité(s), ${formatDate(movement.date)}</span>
        </article>
      `;
    }).join("")
    : `<p class="empty">Aucun mouvement pour le moment.</p>`;

  elements.locationSummary.innerHTML = visibleLocations().map((location) => {
    const total = data.articles.reduce((sum, article) => sum + getStock(article.id, location.id), 0);
    const low = data.articles.filter((article) => getStock(article.id, location.id) <= article.minimum).length;
    return `
      <article class="location-card">
        <strong>${location.name}</strong>
        <span>${location.type === "vehicle" ? "Véhicule" : "Dépôt"}</span>
        <b>${total}</b>
        <small>${low} alerte(s)</small>
      </article>
    `;
  }).join("");
}

function renderStock() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const locationFilter = elements.locationFilter.value || "all";
  const rows = visibleStockRows().filter(({ article, location }) => {
    const matchesQuery = [article.name, article.reference, ...allCodes(article), location.name]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesLocation = locationFilter === "all" || location.id === locationFilter;
    return matchesQuery && matchesLocation;
  });

  elements.stockBody.innerHTML = rows.length ? rows.map(({ article, location, quantity }) => {
    const isLow = quantity <= article.minimum;
    return `
      <tr>
        <td><strong>${article.name}</strong><span>${article.reference}</span></td>
        <td class="item-code">${article.barcode}</td>
        <td>${location.name}</td>
        <td><strong>${quantity}</strong></td>
        <td>${article.minimum}</td>
        <td><span class="badge ${isLow ? "danger" : "ok"}">${isLow ? "À commander" : "OK"}</span></td>
      </tr>
    `;
  }).join("") : `<tr><td class="empty" colspan="6">Aucun stock trouvé.</td></tr>`;
}

function renderMovements() {
  const visibleLocationIds = new Set(visibleLocations().map((location) => location.id));
  const movements = data.movements.filter((movement) => {
    if (canSeeAllStocks()) return true;
    return visibleLocationIds.has(movement.fromLocationId) || visibleLocationIds.has(movement.toLocationId);
  }).reverse();

  elements.movementBody.innerHTML = movements.length ? movements.map((movement) => {
    const article = getArticle(movement.articleId);
    return `
      <tr>
        <td>${formatDate(movement.date)}</td>
        <td>${movementLabel(movement.type)}${movement.ticketNumber ? `<span>Ticket ${movement.ticketNumber}</span>` : ""}</td>
        <td><strong>${article?.reference || "-"}</strong><span>${article?.name || "Article supprimé"}</span></td>
        <td>${movement.quantity}</td>
        <td>${getLocation(movement.fromLocationId)?.name || "-"}</td>
        <td>${getLocation(movement.toLocationId)?.name || "-"}</td>
        <td>${movement.userName}</td>
      </tr>
    `;
  }).join("") : `<tr><td class="empty" colspan="7">Aucun mouvement.</td></tr>`;
}

function renderMovementDraft() {
  elements.movementDraftList.innerHTML = movementDraft.length ? `
    <div class="draft-heading">Liste en préparation</div>
    ${movementDraft.map((line, index) => {
      const article = getArticle(line.articleId);
      return `
        <article class="draft-item">
          <div>
            <strong>${article?.reference || "-"}</strong>
            <span>${article?.name || "Article supprimé"} - ${line.quantity} unité(s)</span>
          </div>
          <button type="button" data-remove-draft="${index}">Retirer</button>
        </article>
      `;
    }).join("")}
  ` : `<p class="empty small-empty">Aucune ligne ajoutée.</p>`;
}

function renderBatchControl() {
  if (!elements.batchControlList) return;
  const batches = [...(data.batches || [])].reverse();
  elements.batchControlList.innerHTML = batches.length ? batches.map((batch) => `
    <article class="batch-card ${batch.checked ? "checked" : ""}">
      <div class="batch-head">
        <div>
          <strong>${movementLabel(batch.type)}${batch.ticketNumber ? ` - Ticket ${batch.ticketNumber}` : ""}</strong>
          <span>${formatDate(batch.date)} - ${batch.userName}</span>
        </div>
        <span class="badge ${batch.checked ? "ok" : "danger"}">${batch.checked ? "Pointé" : "À pointer"}</span>
      </div>
      <div class="batch-meta">
        <span>Depuis : ${getLocation(batch.fromLocationId)?.name || "-"}</span>
        <span>Vers : ${getLocation(batch.toLocationId)?.name || "-"}</span>
      </div>
      <div class="batch-lines">
        ${batch.lines.map((line) => {
          const article = getArticle(line.articleId);
          return `<span>${article?.reference || "-"} - ${article?.name || "Article supprimé"} : ${line.quantity}</span>`;
        }).join("")}
      </div>
      <div class="batch-actions">
        ${batch.checked ? `<small>Pointé par ${batch.checkedBy || "-"} le ${formatDate(batch.checkedAt)}</small>` : `<button type="button" class="primary-btn" data-check-batch="${batch.id}">Pointer</button>`}
      </div>
    </article>
  `).join("") : `<p class="empty">Aucun lot de mouvement à pointer.</p>`;
}

function renderInventory() {
  elements.inventoryList.innerHTML = visibleStockRows().map(({ article, location, quantity }) => `
    <article class="inventory-row">
      <div>
        <strong>${article.reference} - ${article.name}</strong>
        <span>${location.name}</span>
      </div>
      <input type="number" min="0" step="1" value="${quantity}" data-inventory-article="${article.id}" data-inventory-location="${location.id}" />
      <button type="button" data-save-inventory="${article.id}|${location.id}">Valider</button>
    </article>
  `).join("");
}

function renderOrders() {
  const rows = lowStockRows();
  elements.ordersBody.innerHTML = rows.length ? rows.map(({ article, location, quantity }) => `
    <tr>
      <td><strong>${article.reference}</strong><span>${article.name}</span></td>
      <td>${location.name}</td>
      <td>${quantity}</td>
      <td>${article.minimum}</td>
      <td><strong>${Math.max(article.minimum - quantity, 1)}</strong></td>
    </tr>
  `).join("") : `<tr><td class="empty" colspan="5">Aucun article à commander.</td></tr>`;
}

function renderTopArticles() {
  const period = elements.topPeriodSelect.value;
  const minDate = period === "all" ? 0 : Date.now() - Number(period) * 24 * 60 * 60 * 1000;
  const totals = new Map();

  data.movements
    .filter((movement) => movement.type === "exit" && new Date(movement.date).getTime() >= minDate)
    .forEach((movement) => {
      totals.set(movement.articleId, (totals.get(movement.articleId) || 0) + Number(movement.quantity || 0));
    });

  const rows = [...totals.entries()]
    .map(([articleId, quantity]) => ({ article: getArticle(articleId), quantity }))
    .filter((row) => row.article)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 12);

  const max = Math.max(...rows.map((row) => row.quantity), 1);
  elements.topArticlesList.innerHTML = rows.length ? rows.map((row, index) => `
    <article class="top-item">
      <span class="rank">${index + 1}</span>
      <div class="top-info">
        <strong>${row.article.reference} - ${row.article.name}</strong>
        <div class="top-bar"><i style="width:${Math.max(8, (row.quantity / max) * 100)}%"></i></div>
      </div>
      <b>${row.quantity}</b>
    </article>
  `).join("") : `<p class="empty">Aucune sortie sur cette période.</p>`;
}

function renderArticles() {
  const query = elements.articleSearchInput.value.trim().toLowerCase();
  const articles = data.articles.filter((article) =>
    [article.name, article.reference, article.category, ...allCodes(article)].join(" ").toLowerCase().includes(query)
  );

  elements.articleBody.innerHTML = articles.length ? articles.map((article) => `
    <tr>
      <td><strong>${article.name}</strong><span>${article.category || "-"}</span></td>
      <td>${article.reference}</td>
      <td class="item-code">${allCodes(article).join(", ")}</td>
      <td>${article.minimum}</td>
      <td>
        <div class="actions">
          <button type="button" data-edit-article="${article.id}">Modifier</button>
          <button class="delete" type="button" data-delete-article="${article.id}">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join("") : `<tr><td class="empty" colspan="5">Aucun article.</td></tr>`;
}

function renderCatalog() {
  if (!elements.catalogList) return;
  const query = elements.catalogSearchInput.value.trim().toLowerCase();
  const items = (data.catalog || []).filter((item) =>
    [item.name, item.reference, item.category, ...allCodes(item)].join(" ").toLowerCase().includes(query)
  );

  elements.catalogList.innerHTML = items.length ? items.map((item) => {
    const exists = findArticleByCode(item.barcode);
    return `
      <article class="catalog-card">
        <div>
          <strong>${item.reference} - ${item.name}</strong>
          <span>${item.category || "-"} · ${allCodes(item).join(", ")}</span>
        </div>
        <div class="catalog-actions">
          ${exists ? `<span class="badge ok">Déjà en stock</span>` : `<button type="button" class="ghost-btn" data-create-from-catalog="${item.id}">Créer article</button>`}
          <button type="button" data-edit-catalog="${item.id}">Modifier</button>
          <button class="delete" type="button" data-delete-catalog="${item.id}">Supprimer</button>
        </div>
      </article>
    `;
  }).join("") : `<p class="empty">Aucune référence catalogue.</p>`;
}

function renderLabels() {
  elements.labelGrid.innerHTML = data.articles.map((article) => `
    <article class="label-card">
      <strong>${article.reference}</strong>
      <span>${article.name}</span>
      <code>${article.barcode}</code>
      <div class="barcode-bars">${article.barcode.split("").map((digit) => `<i style="width:${(Number(digit) % 4) + 1}px"></i>`).join("")}</div>
    </article>
  `).join("");
}

function roleLabel(role) {
  return {
    admin: "Administrateur",
    responsable: "Responsable",
    direction: "Direction",
    technicien: "Technicien",
  }[role] || role;
}

function renderAccounts() {
  if (!elements.accountList) return;
  elements.accountCountBadge.textContent = data.users.length;
  elements.accountList.innerHTML = data.users.map((user) => `
    <article class="account-card">
      <div>
        <strong>${user.name}</strong>
        <span>${roleLabel(user.role)} - ${getLocation(user.locationId)?.name || "Aucun stock principal"}</span>
      </div>
      <span class="badge">${user.id === currentUser().id ? "Connecté" : roleLabel(user.role)}</span>
    </article>
  `).join("");
}

function renderPermissions() {
  const canManageArticles = ["admin", "responsable"].includes(currentUser().role);
  document.querySelector('[data-view="articles"]').hidden = !canManageArticles;
  if (!canManageArticles && document.querySelector("#articlesView").classList.contains("active-view")) {
    activateView("dashboard");
  }

  document.querySelector('[data-view="accounts"]').hidden = !canManageRights();
  if (!canManageRights() && document.querySelector("#accountsView").classList.contains("active-view")) {
    activateView("dashboard");
  }

  document.querySelector('[data-view="catalog"]').hidden = !canManageRights();
  if (!canManageRights() && document.querySelector("#catalogView").classList.contains("active-view")) {
    activateView("dashboard");
  }

  document.querySelector('[data-view="rights"]').hidden = !canManageRights();
  if (!canManageRights() && document.querySelector("#rightsView").classList.contains("active-view")) {
    activateView("dashboard");
  }

  document.querySelector('[data-view="control"]').hidden = !canPointBatches();
  if (!canPointBatches() && document.querySelector("#controlView").classList.contains("active-view")) {
    activateView("dashboard");
  }
}

function renderRights() {
  if (!elements.rightsList) return;
  const technicians = data.users.filter((user) => user.role === "technicien");
  elements.rightsList.innerHTML = technicians.length ? technicians.map((user) => {
    const allowedIds = new Set(allowedLocationIdsFor(user));
    return `
      <article class="rights-card" data-user-rights="${user.id}">
        <div>
          <strong>${user.name}</strong>
          <span>Stock principal : ${getLocation(user.locationId)?.name || "-"}</span>
        </div>
        <div class="rights-options">
          ${data.locations.map((location) => `
            <label class="check-row">
              <input
                type="checkbox"
                value="${location.id}"
                ${allowedIds.has(location.id) ? "checked" : ""}
                ${location.id === user.locationId ? "disabled" : ""}
              />
              <span>${location.name}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `;
  }).join("") : `<p class="empty">Aucun technicien configuré.</p>`;
}

function renderAll() {
  document.body.classList.toggle("locked", !appUnlocked);
  elements.loginView.hidden = appUnlocked;
  elements.loginApiUrlInput.value = apiSession.apiUrl || defaultApiUrl;
  renderUsers();
  renderSelects();
  renderPermissions();
  renderStats();
  renderDashboard();
  renderStock();
  renderMovements();
  renderInventory();
  renderOrders();
  renderTopArticles();
  renderArticles();
  renderCatalog();
  renderLabels();
  renderAccounts();
  renderRights();
  renderMovementDraft();
  renderBatchControl();
}

async function loginServer() {
  apiSession.apiUrl = elements.loginApiUrlInput.value.trim() || defaultApiUrl;
  const email = elements.loginEmailInput.value.trim();
  const password = elements.loginPasswordInput.value;

  try {
    elements.loginMessage.textContent = "Connexion en cours...";
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    apiSession.token = result.token;
    apiSession.user = result.user;
    saveApiSession();
    elements.loginPasswordInput.value = "";
    await loadServerData();
    appUnlocked = true;
    localStorage.removeItem("appburovalie-demo-unlocked");
    closeAppMenu();
    setMessage("Connexion API réussie.", "success");
  } catch (error) {
    elements.loginMessage.textContent = `Connexion API impossible : ${error.message}`;
    elements.loginMessage.className = "status warning";
  }
}

function logoutServer() {
  apiSession = { apiUrl: apiSession.apiUrl || defaultApiUrl, token: "", user: null };
  saveApiSession();
  localStorage.removeItem("appburovalie-demo-unlocked");
  appUnlocked = false;
  data = loadData();
  renderAll();
  setMessage("Retour au mode démo local.", "warning");
}

function unlockDemoMode() {
  apiSession = { apiUrl: elements.loginApiUrlInput.value.trim() || defaultApiUrl, token: "", user: null };
  saveApiSession();
  localStorage.setItem("appburovalie-demo-unlocked", "true");
  appUnlocked = true;
  data = loadData();
  renderAll();
  setMessage("Mode démo local activé.", "success");
}

async function loadServerData() {
  if (!isApiMode()) return;

  const [me, locations, articles, stocks, movements] = await Promise.all([
    apiFetch("/auth/me"),
    apiFetch("/locations"),
    apiFetch("/articles"),
    apiFetch("/stocks"),
    apiFetch("/movements?limit=500"),
  ]);

  let users = [me.user];
  let batches = [];
  const localCatalog = loadData().catalog || [];

  if (["ADMIN", "RESPONSABLE", "DIRECTION"].includes(me.user.role)) {
    users = await apiFetch("/users");
    batches = await apiFetch("/batches");
  }

  const stockMap = {};
  stocks.forEach((stock) => {
    stockMap[stockKey(stock.articleId, stock.locationId)] = stock.quantity;
  });

  data = {
    users: users.map(userFromApi),
    locations: locations.map(locationFromApi),
    articles: articles.map(articleFromApi),
    stocks: stockMap,
    movements: movements.map(movementFromApi),
    batches: batches.map(batchFromApi),
    catalog: localCatalog,
    currentUserId: me.user.id,
  };

  saveData();
  renderAll();
}

function resetArticleForm() {
  editingArticleId = "";
  elements.productForm.reset();
  elements.minInput.value = 2;
}

function resetCatalogForm() {
  editingCatalogId = "";
  elements.catalogForm.reset();
  elements.catalogMinInput.value = 1;
}

function catalogItemFromForm() {
  return {
    id: editingCatalogId || `cat-${Date.now()}`,
    name: elements.catalogNameInput.value.trim(),
    reference: elements.catalogRefInput.value.trim(),
    barcode: normalizeCode(elements.catalogCodeInput.value),
    extraCodes: elements.catalogExtraCodesInput.value.split(",").map((code) => normalizeCode(code)).filter(Boolean),
    minimum: Number(elements.catalogMinInput.value),
    category: elements.catalogCategoryInput.value.trim(),
  };
}

function fillArticleFormFromCatalog(item, scannedCode = "") {
  editingArticleId = "";
  elements.productForm.reset();
  elements.nameInput.value = item.name;
  elements.refInput.value = item.reference;
  elements.codeInput.value = scannedCode || item.barcode;
  elements.extraCodesInput.value = allCodes(item).filter((code) => code !== elements.codeInput.value).join(", ");
  elements.minInput.value = item.minimum || 1;
  elements.categoryInput.value = item.category || "";
  activateView("articles");
}

function saveCatalogItem(event) {
  event.preventDefault();
  const item = catalogItemFromForm();

  if (!item.name || !item.reference || !item.barcode) {
    setMessage("Description, référence et code-barres catalogue sont obligatoires.", "warning");
    return;
  }

  const usedCode = (data.catalog || []).some((existing) =>
    existing.id !== item.id && allCodes(existing).some((code) => allCodes(item).includes(code))
  );
  if (usedCode) {
    setMessage("Ce code-barres existe déjà dans le catalogue.", "warning");
    return;
  }

  if (editingCatalogId) {
    data.catalog = data.catalog.map((existing) => existing.id === editingCatalogId ? item : existing);
    setMessage("Référence catalogue modifiée.", "success");
  } else {
    data.catalog.push(item);
    setMessage("Référence ajoutée au catalogue.", "success");
  }

  saveData();
  resetCatalogForm();
  renderAll();
}

function importCatalogLines() {
  const lines = elements.catalogImportInput.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let imported = 0;
  for (const line of lines) {
    const separator = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
    const [reference, name, barcode, category = "", minimum = "1"] = line.split(separator).map((part) => part.trim());
    const item = {
      id: `cat-${Date.now()}-${imported}`,
      reference,
      name,
      barcode: normalizeCode(barcode || ""),
      extraCodes: [],
      category,
      minimum: Number(minimum) || 1,
    };

    if (!item.reference || !item.name || !item.barcode) continue;
    if ((data.catalog || []).some((existing) => allCodes(existing).includes(item.barcode))) continue;
    data.catalog.push(item);
    imported += 1;
  }

  if (!imported) {
    setMessage("Aucune ligne catalogue importée. Format attendu : Référence;Description;Code-barres;Catégorie;Mini", "warning");
    return;
  }

  elements.catalogImportInput.value = "";
  saveData();
  renderAll();
  setMessage(`${imported} référence(s) importée(s) dans le catalogue.`, "success");
}

function resetAccountForm() {
  elements.accountForm.reset();
  elements.accountRoleSelect.value = "technicien";
  elements.accountLocationSelect.value = data.locations[0]?.id || "";
}

function createAccount(event) {
  event.preventDefault();
  const user = {
    id: `u-${Date.now()}`,
    name: elements.accountNameInput.value.trim(),
    email: elements.accountEmailInput.value.trim(),
    role: elements.accountRoleSelect.value,
    locationId: elements.accountLocationSelect.value,
    allowedLocationIds: [elements.accountLocationSelect.value].filter(Boolean),
  };
  const password = elements.accountPasswordInput.value;

  if (!user.name || !user.email || !password || !user.locationId) {
    setMessage("Tous les champs du compte sont obligatoires.", "warning");
    return;
  }
  if (password.length < 6) {
    setMessage("Le mot de passe doit contenir au moins 6 caractères.", "warning");
    return;
  }
  if (data.users.some((item) => item.email && item.email.toLowerCase() === user.email.toLowerCase())) {
    setMessage("Un compte utilise déjà cet email.", "warning");
    return;
  }

  if (isApiMode()) {
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password,
        role: localRoleToApi(user.role),
        primaryLocationId: user.locationId,
        allowedLocationIds: user.allowedLocationIds,
      }),
    })
      .then(loadServerData)
      .then(() => {
        resetAccountForm();
        setMessage("Compte créé sur le serveur.", "success");
      })
      .catch((error) => setMessage(`Erreur API : ${error.message}`, "warning"));
    return;
  }

  data.users.push(user);
  saveData();
  resetAccountForm();
  renderAll();
  setMessage("Compte créé en mode démo.", "success");
}

function saveArticle(event) {
  event.preventDefault();
  const article = {
    id: editingArticleId || `art-${Date.now()}`,
    name: elements.nameInput.value.trim(),
    reference: elements.refInput.value.trim(),
    barcode: normalizeCode(elements.codeInput.value),
    extraCodes: elements.extraCodesInput.value.split(",").map((code) => normalizeCode(code)).filter(Boolean),
    minimum: Number(elements.minInput.value),
    category: elements.categoryInput.value.trim(),
  };

  if (!article.name || !article.reference || !article.barcode) {
    setMessage("Description, référence et code-barres sont obligatoires.", "warning");
    return;
  }

  const usedCode = data.articles.some((item) =>
    item.id !== article.id && allCodes(item).some((code) => allCodes(article).includes(code))
  );
  if (usedCode) {
    setMessage("Un des codes-barres existe déjà.", "warning");
    return;
  }

  if (isApiMode()) {
    apiFetch("/articles", {
      method: "POST",
      body: JSON.stringify({
        reference: article.reference,
        description: article.name,
        category: article.category,
        minimum: article.minimum,
        barcodes: allCodes(article),
      }),
    })
      .then(loadServerData)
      .then(() => {
        resetArticleForm();
        setMessage("Article ajouté sur le serveur.", "success");
      })
      .catch((error) => setMessage(`Erreur API : ${error.message}`, "warning"));
    return;
  }

  if (editingArticleId) {
    data.articles = data.articles.map((item) => item.id === editingArticleId ? article : item);
    setMessage("Article modifié.", "success");
  } else {
    data.articles.push(article);
    setMessage("Article ajouté.", "success");
  }

  saveData();
  resetArticleForm();
  renderAll();
}

function fillArticleForm(articleId) {
  const article = getArticle(articleId);
  if (!article) return;
  editingArticleId = article.id;
  elements.nameInput.value = article.name;
  elements.refInput.value = article.reference;
  elements.codeInput.value = article.barcode;
  elements.extraCodesInput.value = (article.extraCodes || []).join(", ");
  elements.minInput.value = article.minimum;
  elements.categoryInput.value = article.category || "";
  activateView("articles");
}

function fillCatalogForm(catalogId) {
  const item = (data.catalog || []).find((entry) => entry.id === catalogId);
  if (!item) return;
  editingCatalogId = item.id;
  elements.catalogNameInput.value = item.name;
  elements.catalogRefInput.value = item.reference;
  elements.catalogCodeInput.value = item.barcode;
  elements.catalogExtraCodesInput.value = (item.extraCodes || []).join(", ");
  elements.catalogMinInput.value = item.minimum;
  elements.catalogCategoryInput.value = item.category || "";
  activateView("catalog");
}

function deleteCatalogItem(catalogId) {
  data.catalog = (data.catalog || []).filter((item) => item.id !== catalogId);
  saveData();
  renderAll();
  setMessage("Référence retirée du catalogue.", "warning");
}

function deleteArticle(articleId) {
  data.articles = data.articles.filter((article) => article.id !== articleId);
  Object.keys(data.stocks).forEach((key) => {
    if (key.startsWith(`${articleId}|`)) delete data.stocks[key];
  });
  saveData();
  renderAll();
}

function createMovement({ type, articleId, quantity, fromLocationId = "", toLocationId = "", note = "", batchId = "", ticketNumber = "", skipRender = false }) {
  const article = getArticle(articleId);
  if (!article) {
    setMessage("Article introuvable.", "warning");
    return false;
  }

  const qty = Number(quantity);
  if (!qty || qty < 1) {
    setMessage("Quantité invalide.", "warning");
    return false;
  }

  const allowedIds = new Set(allowedLocationIdsFor(currentUser()));
  const checkedLocations = [fromLocationId, toLocationId].filter(Boolean);
  const forbiddenLocation = checkedLocations.find((locationId) => !allowedIds.has(locationId));
  if (forbiddenLocation) {
    setMessage("Tu n'as pas accès à ce stock.", "warning");
    return false;
  }

  if (type === "entry") {
    setStock(articleId, toLocationId, getStock(articleId, toLocationId) + qty);
  }

  if (type === "exit") {
    if (getStock(articleId, fromLocationId) < qty) {
      setMessage("Stock insuffisant pour cette sortie.", "warning");
      return false;
    }
    setStock(articleId, fromLocationId, getStock(articleId, fromLocationId) - qty);
  }

  if (type === "transfer") {
    if (!fromLocationId || !toLocationId || fromLocationId === toLocationId) {
      setMessage("Choisis deux emplacements différents.", "warning");
      return false;
    }
    if (getStock(articleId, fromLocationId) < qty) {
      setMessage("Stock insuffisant pour ce transfert.", "warning");
      return false;
    }
    setStock(articleId, fromLocationId, getStock(articleId, fromLocationId) - qty);
    setStock(articleId, toLocationId, getStock(articleId, toLocationId) + qty);
  }

  if (type === "adjustment") {
    setStock(articleId, toLocationId || fromLocationId, qty);
  }

  data.movements.push({
    id: `mvt-${Date.now()}`,
    date: new Date().toISOString(),
    type,
    articleId,
    quantity: qty,
    fromLocationId,
    toLocationId,
    note,
    batchId,
    ticketNumber,
    userId: currentUser().id,
    userName: currentUser().name,
  });

  saveData();
  if (!skipRender) {
    renderAll();
    setMessage(`${movementLabel(type)} enregistré pour ${article.reference}.`, "success");
  }
  return true;
}

function addMovementLine() {
  const articleId = elements.movementArticleSelect.value;
  const quantity = Number(elements.movementQtyInput.value);
  const article = getArticle(articleId);

  if (!article || !quantity || quantity < 1) {
    setMessage("Choisis un article et une quantité valide.", "warning");
    return;
  }

  movementDraft.push({
    articleId,
    quantity,
    note: elements.movementNoteInput.value.trim(),
  });
  elements.movementQtyInput.value = 1;
  elements.movementNoteInput.value = "";
  renderMovementDraft();
}

function resetMovementDraft() {
  movementDraft = [];
  elements.movementForm.reset();
  elements.movementQtyInput.value = 1;
  renderMovementDraft();
}

function createMovementBatch(event) {
  event.preventDefault();
  const type = elements.movementTypeSelect.value;
  const ticketNumber = elements.ticketInput.value.trim();
  const fromLocationId = elements.fromLocationSelect.value;
  const toLocationId = elements.toLocationSelect.value;

  if (movementDraft.length === 0) {
    addMovementLine();
  }

  if (movementDraft.length === 0) return;

  if (type === "exit" && !ticketNumber) {
    setMessage("Le numéro de ticket est obligatoire pour une sortie.", "warning");
    return;
  }

  if (isApiMode()) {
    apiFetch("/movements/batches", {
      method: "POST",
      body: JSON.stringify({
        type: localMovementToApi(type),
        ticketNumber,
        fromLocationId: fromLocationId || null,
        toLocationId: toLocationId || null,
        lines: movementDraft.map((line) => ({
          articleId: line.articleId,
          quantity: line.quantity,
          note: line.note,
        })),
      }),
    })
      .then(() => {
        movementDraft = [];
        return loadServerData();
      })
      .then(() => setMessage("Liste envoyée au serveur.", "success"))
      .catch((error) => setMessage(`Erreur API : ${error.message}`, "warning"));
    return;
  }

  const batchId = `lot-${Date.now()}`;
  const originalStocks = structuredClone(data.stocks);
  const originalMovements = [...data.movements];

  for (const line of movementDraft) {
    const ok = createMovement({
      type,
      articleId: line.articleId,
      quantity: line.quantity,
      fromLocationId,
      toLocationId,
      note: line.note,
      batchId,
      ticketNumber,
      skipRender: true,
    });

    if (!ok) {
      data.stocks = originalStocks;
      data.movements = originalMovements;
      saveData();
      renderAll();
      return;
    }
  }

  data.batches.push({
    id: batchId,
    date: new Date().toISOString(),
    type,
    ticketNumber,
    fromLocationId,
    toLocationId,
    lines: movementDraft.map((line) => ({ ...line })),
    userId: currentUser().id,
    userName: currentUser().name,
    checked: false,
    checkedBy: "",
    checkedAt: "",
  });

  movementDraft = [];
  saveData();
  renderAll();
  setMessage("Liste de mouvement validée. Elle apparaît dans le pointage admin.", "success");
}

function checkBatch(batchId) {
  if (isApiMode()) {
    apiFetch(`/batches/${batchId}/check`, { method: "PATCH" })
      .then(loadServerData)
      .then(() => setMessage("Lot pointé sur le serveur.", "success"))
      .catch((error) => setMessage(`Erreur API : ${error.message}`, "warning"));
    return;
  }

  data.batches = data.batches.map((batch) => {
    if (batch.id !== batchId) return batch;
    return {
      ...batch,
      checked: true,
      checkedBy: currentUser().name,
      checkedAt: new Date().toISOString(),
    };
  });
  saveData();
  renderAll();
  setMessage("Lot pointé.", "success");
}

function submitMovement(event) {
  createMovementBatch(event);
}

function scanCode(mode = "search") {
  const code = normalizeCode(elements.barcodeInput.value);
  if (!code) {
    startCameraScanner();
    return;
  }

  handleScannedCode(code, mode);
  elements.barcodeInput.value = "";
}

function handleScannedCode(code, mode = "search") {
  const article = findArticleByCode(code);
  if (!article) {
    const catalogItem = findCatalogByCode(code);
    if (catalogItem) {
      fillArticleFormFromCatalog(catalogItem, code);
      setMessage("Article reconnu dans le catalogue : fiche préremplie, tu peux l'enregistrer.", "success");
      return;
    }

    elements.codeInput.value = code;
    activateView("articles");
    setMessage("Nouveau code détecté : complète la fiche article.", "warning");
    return;
  }

  const locationId = elements.scanLocationSelect.value || currentUser().locationId;
  const quantity = Number(elements.scanQtyInput.value) || 1;

  if (mode === "entry") {
    createMovement({ type: "entry", articleId: article.id, quantity, toLocationId: locationId, note: "Scan rapide" });
    return;
  }

  if (mode === "exit") {
    createMovement({ type: "exit", articleId: article.id, quantity, fromLocationId: locationId, note: "Scan rapide" });
    return;
  }

  elements.searchInput.value = article.reference;
  activateView("stock");
  renderStock();
  setMessage(`${article.reference} trouvé.`, "success");
}

async function startCameraScanner() {
  if (!window.isSecureContext) {
    setMessage("La caméra mobile exige HTTPS. Publie l'app ou ouvre-la via une adresse sécurisée.", "warning");
    return;
  }

  if (cameraStream || html5QrScanner) {
    setMessage("Caméra déjà active.", "success");
    return;
  }

  elements.cameraScanner.hidden = false;

  if ("BarcodeDetector" in window && navigator.mediaDevices?.getUserMedia) {
    await startNativeBarcodeScanner();
    return;
  }

  if ("Html5Qrcode" in window) {
    await startHtml5QrScanner();
    return;
  }

  setMessage("Scanner mobile non chargé. Vérifie la connexion internet.", "warning");
  elements.cameraScanner.hidden = true;
}

async function startNativeBarcodeScanner() {
  try {
    const formats = await window.BarcodeDetector.getSupportedFormats();
    const wantedFormats = ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "qr_code"];
    const supportedFormats = wantedFormats.filter((format) => formats.includes(format));
    barcodeDetector = new window.BarcodeDetector(supportedFormats.length ? { formats: supportedFormats } : {});
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    elements.cameraVideo.srcObject = cameraStream;
    await elements.cameraVideo.play();
    detectBarcodeLoop();
    setMessage("Caméra active.", "success");
  } catch {
    stopCameraScanner();
    if ("Html5Qrcode" in window) {
      await startHtml5QrScanner();
      return;
    }
    setMessage("Impossible d'activer la caméra.", "warning");
  }
}

async function startHtml5QrScanner() {
  try {
    elements.cameraVideo.hidden = true;
    const reader = document.createElement("div");
    reader.id = "qrReader";
    elements.cameraVideo.parentElement.appendChild(reader);
    html5QrScanner = new window.Html5Qrcode("qrReader");
    await html5QrScanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: (width, height) => ({
          width: Math.floor(Math.min(width * 0.72, 320)),
          height: Math.floor(Math.min(height * 0.55, 190)),
        }),
      },
      (decodedText) => {
        if (!isStableScan(decodedText)) return;
        stopCameraScanner();
        elements.barcodeInput.value = decodedText;
        handleScannedCode(decodedText, "search");
      }
    );
    setMessage("Scanner mobile actif.", "success");
  } catch {
    stopCameraScanner();
    setMessage("Impossible d'activer le scanner mobile.", "warning");
  }
}

async function detectBarcodeLoop() {
  if (!barcodeDetector || !cameraStream) return;
  try {
    const barcodes = await barcodeDetector.detect(elements.cameraVideo);
    if (barcodes.length > 0) {
      const barcode = barcodes.find(isBarcodeOnScanLine);
      if (!barcode) {
        scanTimer = window.setTimeout(detectBarcodeLoop, 180);
        return;
      }
      const code = normalizeCode(barcode.rawValue);
      if (!isStableScan(code)) {
        scanTimer = window.setTimeout(detectBarcodeLoop, 180);
        return;
      }
      stopCameraScanner();
      elements.barcodeInput.value = code;
      handleScannedCode(code, "search");
      return;
    }
  } catch {
    setMessage("Lecture en cours.", "warning");
  }
  scanTimer = window.setTimeout(detectBarcodeLoop, 250);
}

function isBarcodeOnScanLine(barcode) {
  if (!barcode.boundingBox || !elements.cameraVideo.videoHeight) return true;
  const lineY = elements.cameraVideo.videoHeight / 2;
  const boxTop = barcode.boundingBox.y;
  const boxBottom = barcode.boundingBox.y + barcode.boundingBox.height;
  return lineY >= boxTop && lineY <= boxBottom;
}

function isStableScan(code) {
  const cleanCode = normalizeCode(code);
  const now = Date.now();
  if (now - lastAcceptedScanAt < 1600) return false;

  if (cleanCode === lastDetectedCode) {
    stableDetectionCount += 1;
  } else {
    lastDetectedCode = cleanCode;
    stableDetectionCount = 1;
  }

  if (stableDetectionCount < 2) return false;
  lastAcceptedScanAt = now;
  stableDetectionCount = 0;
  lastDetectedCode = "";
  return true;
}

function stopCameraScanner() {
  window.clearTimeout(scanTimer);
  scanTimer = 0;
  barcodeDetector = null;
  stableDetectionCount = 0;
  lastDetectedCode = "";

  if (html5QrScanner) {
    html5QrScanner.stop().catch(() => {}).finally(() => {
      html5QrScanner?.clear();
      html5QrScanner = null;
    });
  }

  document.querySelector("#qrReader")?.remove();
  elements.cameraVideo.hidden = false;

  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }

  elements.cameraVideo.srcObject = null;
  elements.cameraScanner.hidden = true;
}

function activateView(viewName) {
  document.querySelectorAll("[data-view]").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === `${viewName}View`);
  });
  closeAppMenu();
}

function toggleAppMenu() {
  const willOpen = elements.appMenu.hidden;
  elements.appMenu.hidden = !willOpen;
  elements.appMenuBtn.setAttribute("aria-expanded", String(willOpen));
}

function closeAppMenu() {
  elements.appMenu.hidden = true;
  elements.appMenuBtn.setAttribute("aria-expanded", "false");
}

function toggleDarkMode() {
  darkMode = elements.darkModeToggle.checked;
  document.body.classList.toggle("dark-mode", darkMode);
  localStorage.setItem(themeKey, darkMode ? "dark" : "light");
}

function exportCsv(filename, rows) {
  const csv = rows.map((row) =>
    row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")
  ).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportStock() {
  exportCsv("stock-appburovalie.csv", [
    ["Article", "Référence", "Code", "Emplacement", "Stock", "Minimum"],
    ...visibleStockRows().map(({ article, location, quantity }) => [
      article.name,
      article.reference,
      article.barcode,
      location.name,
      quantity,
      article.minimum,
    ]),
  ]);
}

function exportMovements() {
  exportCsv("mouvements-appburovalie.csv", [
    ["Date", "Type", "Ticket", "Article", "Référence", "Quantité", "Depuis", "Vers", "Utilisateur", "Commentaire"],
    ...data.movements.map((movement) => {
      const article = getArticle(movement.articleId);
      return [
        formatDate(movement.date),
        movementLabel(movement.type),
        movement.ticketNumber || "",
        article?.name || "",
        article?.reference || "",
        movement.quantity,
        getLocation(movement.fromLocationId)?.name || "",
        getLocation(movement.toLocationId)?.name || "",
        movement.userName,
        movement.note || "",
      ];
    }),
  ]);
}

function exportOrders() {
  exportCsv("a-commander-appburovalie.csv", [
    ["Article", "Référence", "Emplacement", "Stock", "Minimum", "À commander"],
    ...lowStockRows().map(({ article, location, quantity }) => [
      article.name,
      article.reference,
      location.name,
      quantity,
      article.minimum,
      Math.max(article.minimum - quantity, 1),
    ]),
  ]);
}

function updateTechnicianRights(userId, selectedIds) {
  if (isApiMode()) {
    apiFetch(`/users/${userId}/locations`, {
      method: "PATCH",
      body: JSON.stringify({ locationIds: selectedIds }),
    })
      .then(loadServerData)
      .then(() => setMessage("Droits technicien mis à jour sur le serveur.", "success"))
      .catch((error) => setMessage(`Erreur API : ${error.message}`, "warning"));
    return;
  }

  data.users = data.users.map((user) => {
    if (user.id !== userId) return user;
    const ids = new Set(selectedIds);
    ids.add(user.locationId);
    return { ...user, allowedLocationIds: [...ids] };
  });
  saveData();
  renderAll();
  setMessage("Droits technicien mis à jour.", "success");
}

function seedData() {
  data = structuredClone(defaultData);
  saveData();
  renderAll();
  setMessage("Données exemple chargées.", "success");
}

document.querySelectorAll("[data-view]").forEach((item) => {
  item.addEventListener("click", () => activateView(item.dataset.view));
});

elements.appMenuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleAppMenu();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".app-menu")) closeAppMenu();
});

elements.userSelect.addEventListener("change", () => {
  data.currentUserId = elements.userSelect.value;
  saveData();
  renderAll();
  closeAppMenu();
  setMessage(`Connecté : ${currentUser().name}.`, "success");
});
elements.logoutBtn.addEventListener("click", () => {
  logoutServer();
  activateView("dashboard");
});
elements.loginApiBtn.addEventListener("click", loginServer);
elements.demoLoginBtn.addEventListener("click", unlockDemoMode);
elements.seedBtn.addEventListener("click", seedData);
elements.scanBtn.addEventListener("click", () => startCameraScanner());
elements.scanEntryBtn.addEventListener("click", () => scanCode("entry"));
elements.scanExitBtn.addEventListener("click", () => scanCode("exit"));
elements.scanSearchBtn.addEventListener("click", () => scanCode("search"));
elements.barcodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    scanCode("search");
  }
});
elements.stopCameraBtn.addEventListener("click", () => {
  stopCameraScanner();
  setMessage("Caméra arrêtée.", "warning");
});

elements.searchInput.addEventListener("input", renderStock);
elements.locationFilter.addEventListener("change", renderStock);
elements.movementForm.addEventListener("submit", submitMovement);
elements.addMovementLineBtn.addEventListener("click", addMovementLine);
elements.resetMovementBtn.addEventListener("click", resetMovementDraft);
elements.productForm.addEventListener("submit", saveArticle);
elements.catalogForm.addEventListener("submit", saveCatalogItem);
elements.accountForm.addEventListener("submit", createAccount);
elements.resetFormBtn.addEventListener("click", resetArticleForm);
elements.resetCatalogBtn.addEventListener("click", resetCatalogForm);
elements.importCatalogBtn.addEventListener("click", importCatalogLines);
elements.articleSearchInput.addEventListener("input", renderArticles);
elements.catalogSearchInput.addEventListener("input", renderCatalog);
elements.darkModeToggle.addEventListener("change", toggleDarkMode);
elements.exportStockBtn.addEventListener("click", exportStock);
elements.exportMovementsBtn.addEventListener("click", exportMovements);
elements.exportOrdersBtn.addEventListener("click", exportOrders);
elements.topPeriodSelect.addEventListener("change", renderTopArticles);
elements.printLabelsBtn.addEventListener("click", () => window.print());

elements.articleBody.addEventListener("click", (event) => {
  const editId = event.target.dataset.editArticle;
  const deleteId = event.target.dataset.deleteArticle;
  if (editId) fillArticleForm(editId);
  if (deleteId) deleteArticle(deleteId);
});

elements.catalogList.addEventListener("click", (event) => {
  const editId = event.target.dataset.editCatalog;
  const deleteId = event.target.dataset.deleteCatalog;
  const createId = event.target.dataset.createFromCatalog;
  if (editId) fillCatalogForm(editId);
  if (deleteId) deleteCatalogItem(deleteId);
  if (createId) {
    const item = (data.catalog || []).find((entry) => entry.id === createId);
    if (item) {
      fillArticleFormFromCatalog(item);
      setMessage("Fiche article préremplie depuis le catalogue.", "success");
    }
  }
});

elements.inventoryList.addEventListener("click", (event) => {
  const key = event.target.dataset.saveInventory;
  if (!key) return;
  const [articleId, locationId] = key.split("|");
  const input = elements.inventoryList.querySelector(`[data-inventory-article="${articleId}"][data-inventory-location="${locationId}"]`);
  const oldQuantity = getStock(articleId, locationId);
  const newQuantity = Number(input.value);
  createMovement({
    type: "adjustment",
    articleId,
    quantity: newQuantity,
    toLocationId: locationId,
    note: `Inventaire : ancien stock ${oldQuantity}`,
  });
});

elements.movementDraftList.addEventListener("click", (event) => {
  const index = event.target.dataset.removeDraft;
  if (index === undefined) return;
  movementDraft.splice(Number(index), 1);
  renderMovementDraft();
});

elements.batchControlList.addEventListener("click", (event) => {
  const batchId = event.target.dataset.checkBatch;
  if (!batchId) return;
  checkBatch(batchId);
});

elements.rightsList.addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const card = event.target.closest("[data-user-rights]");
  if (!card) return;
  const selectedIds = [...card.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
  updateTechnicianRights(card.dataset.userRights, selectedIds);
});

elements.movementTypeSelect.addEventListener("change", () => {
  const type = elements.movementTypeSelect.value;
  elements.fromLocationSelect.disabled = type === "entry";
  elements.toLocationSelect.disabled = type === "exit";
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  elements.installBtn.hidden = false;
});

elements.installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  elements.installBtn.hidden = true;
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((registration) => registration.update())
      .catch(() => {
        setMessage("Mode hors ligne indisponible sur ce navigateur.", "warning");
      });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

window.addEventListener("beforeunload", stopCameraScanner);

renderAll();
if (isApiMode()) {
  loadServerData().catch((error) => {
    setMessage(`API indisponible : ${error.message}. Mode local conservé.`, "warning");
  });
}
