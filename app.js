const storageKey = "stockscan-products";

const elements = {
  barcodeInput: document.querySelector("#barcodeInput"),
  scanBtn: document.querySelector("#scanBtn"),
  scanMessage: document.querySelector("#scanMessage"),
  installBtn: document.querySelector("#installBtn"),
  cameraScanner: document.querySelector("#cameraScanner"),
  cameraVideo: document.querySelector("#cameraVideo"),
  stopCameraBtn: document.querySelector("#stopCameraBtn"),
  seedBtn: document.querySelector("#seedBtn"),
  productForm: document.querySelector("#productForm"),
  resetFormBtn: document.querySelector("#resetFormBtn"),
  nameInput: document.querySelector("#nameInput"),
  codeInput: document.querySelector("#codeInput"),
  qtyInput: document.querySelector("#qtyInput"),
  minInput: document.querySelector("#minInput"),
  locationInput: document.querySelector("#locationInput"),
  searchInput: document.querySelector("#searchInput"),
  inventoryBody: document.querySelector("#inventoryBody"),
  rowTemplate: document.querySelector("#rowTemplate"),
  itemCount: document.querySelector("#itemCount"),
  unitCount: document.querySelector("#unitCount"),
  lowCount: document.querySelector("#lowCount"),
};

let products = loadProducts();
let editingCode = "";
let cameraStream = null;
let scanTimer = 0;
let barcodeDetector = null;
let html5QrScanner = null;
let deferredInstallPrompt = null;

function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function normalizeCode(code) {
  return code.trim();
}

function setMessage(text, type = "") {
  elements.scanMessage.textContent = text;
  elements.scanMessage.className = `status ${type}`.trim();
}

function render() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    return [product.name, product.code, product.location].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  elements.inventoryBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = products.length === 0 ? "Aucun article pour le moment." : "Aucun résultat.";
    row.appendChild(cell);
    elements.inventoryBody.appendChild(row);
  }

  filtered.forEach((product) => {
    const row = elements.rowTemplate.content.firstElementChild.cloneNode(true);
    const isLow = product.quantity <= product.minimum;

    row.querySelector(".item-name").textContent = product.name;
    row.querySelector(".item-code").textContent = product.code;
    row.querySelector(".item-qty").textContent = product.quantity;
    row.querySelector(".item-location").textContent = product.location || "-";
    row.querySelector(".item-alert").textContent = isLow ? "Stock bas" : "";

    row.querySelector(".stock-in").addEventListener("click", () => changeStock(product.code, 1));
    row.querySelector(".stock-out").addEventListener("click", () => changeStock(product.code, -1));
    row.querySelector(".edit").addEventListener("click", () => fillForm(product));
    row.querySelector(".delete").addEventListener("click", () => deleteProduct(product.code));

    elements.inventoryBody.appendChild(row);
  });

  elements.itemCount.textContent = products.length;
  elements.unitCount.textContent = products.reduce((total, product) => total + product.quantity, 0);
  elements.lowCount.textContent = products.filter((product) => product.quantity <= product.minimum).length;
}

function scanCode() {
  const code = normalizeCode(elements.barcodeInput.value);

  if (!code) {
    startCameraScanner();
    return;
  }

  handleScannedCode(code);
  elements.barcodeInput.value = "";
}

function handleScannedCode(code) {
  const product = products.find((item) => item.code === code);

  if (product) {
    changeStock(code, 1);
    setMessage(`${product.name} ajouté au stock.`, "success");
  } else {
    resetForm();
    elements.codeInput.value = code;
    elements.nameInput.focus();
    setMessage("Nouveau code détecté : complète la fiche article.", "warning");
  }
}

async function startCameraScanner() {
  if (!window.isSecureContext) {
    setMessage("La caméra mobile exige HTTPS. Publie l'app ou ouvre-la via une adresse sécurisée.", "warning");
    elements.barcodeInput.focus();
    return;
  }

  if (cameraStream || html5QrScanner) {
    setMessage("Caméra déjà active : place le code-barres devant l'objectif.", "success");
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

  setMessage("Scanner mobile non chargé. Vérifie la connexion internet ou utilise une douchette/saisie manuelle.", "warning");
  elements.cameraScanner.hidden = true;
  elements.barcodeInput.focus();
}

async function startNativeBarcodeScanner() {
  try {
    const formats = await window.BarcodeDetector.getSupportedFormats();
    const wantedFormats = ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "qr_code"];
    const supportedFormats = wantedFormats.filter((format) => formats.includes(format));

    const detectorOptions = supportedFormats.length ? { formats: supportedFormats } : {};
    barcodeDetector = new window.BarcodeDetector(detectorOptions);

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });

    elements.cameraVideo.srcObject = cameraStream;
    await elements.cameraVideo.play();
    setMessage("Caméra active : place le code-barres devant l'objectif.", "success");
    detectBarcodeLoop();
  } catch {
    stopCameraScanner();
    if ("Html5Qrcode" in window) {
      await startHtml5QrScanner();
      return;
    }
    setMessage("Impossible d'activer la caméra. Autorise la caméra ou utilise la saisie/douchette USB.", "warning");
  }
}

async function startHtml5QrScanner() {
  try {
    elements.cameraScanner.hidden = false;
    elements.cameraVideo.hidden = true;
    const reader = document.createElement("div");
    reader.id = "qrReader";
    elements.cameraVideo.parentElement.appendChild(reader);

    html5QrScanner = new window.Html5Qrcode("qrReader");
    const mobileFormats = window.Html5QrcodeSupportedFormats
      ? [
          window.Html5QrcodeSupportedFormats.EAN_13,
          window.Html5QrcodeSupportedFormats.EAN_8,
          window.Html5QrcodeSupportedFormats.CODE_128,
          window.Html5QrcodeSupportedFormats.CODE_39,
          window.Html5QrcodeSupportedFormats.UPC_A,
          window.Html5QrcodeSupportedFormats.UPC_E,
          window.Html5QrcodeSupportedFormats.QR_CODE,
        ]
      : undefined;
    const scannerOptions = {
      fps: 10,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.72);
        return { width: size, height: size };
      },
    };

    if (mobileFormats) {
      scannerOptions.formatsToSupport = mobileFormats;
    }

    await html5QrScanner.start(
      { facingMode: "environment" },
      scannerOptions,
      (decodedText) => {
        const code = normalizeCode(decodedText);
        stopCameraScanner();
        handleScannedCode(code);
      }
    );
    setMessage("Scanner mobile actif : place le code-barres dans le cadre.", "success");
  } catch {
    stopCameraScanner();
    setMessage("Impossible d'activer le scanner mobile. Autorise la caméra ou utilise la saisie manuelle.", "warning");
  }
}

async function detectBarcodeLoop() {
  if (!barcodeDetector || !cameraStream) return;

  try {
    const barcodes = await barcodeDetector.detect(elements.cameraVideo);
    if (barcodes.length > 0) {
      const code = normalizeCode(barcodes[0].rawValue);
      stopCameraScanner();
      elements.barcodeInput.value = code;
      handleScannedCode(code);
      elements.barcodeInput.value = "";
      return;
    }
  } catch {
    setMessage("Lecture en cours. Garde le code-barres bien éclairé et stable.", "warning");
  }

  scanTimer = window.setTimeout(detectBarcodeLoop, 250);
}

function stopCameraScanner() {
  window.clearTimeout(scanTimer);
  scanTimer = 0;
  barcodeDetector = null;

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

function changeStock(code, amount) {
  products = products.map((product) => {
    if (product.code !== code) return product;
    return {
      ...product,
      quantity: Math.max(0, product.quantity + amount),
    };
  });
  saveProducts();
  render();
}

function fillForm(product) {
  editingCode = product.code;
  elements.nameInput.value = product.name;
  elements.codeInput.value = product.code;
  elements.qtyInput.value = product.quantity;
  elements.minInput.value = product.minimum;
  elements.locationInput.value = product.location;
  elements.nameInput.focus();
}

function resetForm() {
  editingCode = "";
  elements.productForm.reset();
  elements.qtyInput.value = 0;
  elements.minInput.value = 5;
}

function deleteProduct(code) {
  products = products.filter((product) => product.code !== code);
  saveProducts();
  render();
  setMessage("Article supprimé.", "warning");
}

function saveProduct(event) {
  event.preventDefault();

  const product = {
    name: elements.nameInput.value.trim(),
    code: normalizeCode(elements.codeInput.value),
    quantity: Number(elements.qtyInput.value),
    minimum: Number(elements.minInput.value),
    location: elements.locationInput.value.trim(),
  };

  if (!product.name || !product.code) {
    setMessage("Le nom et le code-barres sont obligatoires.", "warning");
    return;
  }

  const duplicate = products.some((item) => item.code === product.code && item.code !== editingCode);
  if (duplicate) {
    setMessage("Ce code-barres existe déjà.", "warning");
    return;
  }

  if (editingCode) {
    products = products.map((item) => (item.code === editingCode ? product : item));
    setMessage("Article modifié.", "success");
  } else {
    products = [...products, product];
    setMessage("Article ajouté.", "success");
  }

  saveProducts();
  resetForm();
  render();
  elements.barcodeInput.focus();
}

function seedProducts() {
  products = [
    { name: "Café en grains 1 kg", code: "3760123456789", quantity: 12, minimum: 5, location: "Rayon A1" },
    { name: "Gobelets carton x50", code: "3029330003533", quantity: 4, minimum: 8, location: "Rayon B2" },
    { name: "Sucre en sticks", code: "8710398501218", quantity: 22, minimum: 10, location: "Réserve" },
  ];
  saveProducts();
  resetForm();
  render();
  setMessage("Exemple chargé. Tu peux scanner 3760123456789.", "success");
}

elements.scanBtn.addEventListener("click", scanCode);
elements.barcodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    scanCode();
  }
});
elements.productForm.addEventListener("submit", saveProduct);
elements.resetFormBtn.addEventListener("click", resetForm);
elements.seedBtn.addEventListener("click", seedProducts);
elements.searchInput.addEventListener("input", render);
elements.stopCameraBtn.addEventListener("click", () => {
  stopCameraScanner();
  setMessage("Caméra arrêtée.", "warning");
  elements.barcodeInput.focus();
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
    navigator.serviceWorker.register("sw.js").catch(() => {
      setMessage("Mode hors ligne indisponible sur ce navigateur.", "warning");
    });
  });
}

window.addEventListener("beforeunload", stopCameraScanner);

render();
