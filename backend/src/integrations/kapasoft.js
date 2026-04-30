const DEFAULT_TIMEOUT_MS = 8000;

function getKapasoftConfig() {
  return {
    baseUrl: normalizeBaseUrl(process.env.KAPASOFT_BASE_URL),
    apiKey: process.env.KAPASOFT_API_KEY || "",
    authHeader: process.env.KAPASOFT_AUTH_HEADER || "Authorization",
    authScheme: process.env.KAPASOFT_AUTH_SCHEME || "Bearer",
    healthPath: process.env.KAPASOFT_HEALTH_PATH || "/health",
    timeoutMs: Number(process.env.KAPASOFT_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  };
}

function isKapasoftConfigured(config = getKapasoftConfig()) {
  return Boolean(config.baseUrl && config.apiKey);
}

async function kapasoftRequest(path, options = {}) {
  const config = getKapasoftConfig();

  if (!isKapasoftConfigured(config)) {
    throw new KapasoftConfigError("KAPASOFT_NOT_CONFIGURED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(new URL(path, config.baseUrl), {
      method: options.method || "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [config.authHeader]: formatAuthValue(config),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = parseJson(text);

    if (!response.ok) {
      const error = new Error("KAPASOFT_REQUEST_FAILED");
      error.statusCode = response.status;
      error.payload = data || text;
      throw error;
    }

    return data ?? { ok: true };
  } finally {
    clearTimeout(timeout);
  }
}

async function pingKapasoft() {
  const config = getKapasoftConfig();
  return kapasoftRequest(config.healthPath);
}

function publicKapasoftStatus() {
  const config = getKapasoftConfig();
  return {
    configured: isKapasoftConfigured(config),
    baseUrl: config.baseUrl || null,
    authHeader: config.authHeader,
    healthPath: config.healthPath,
    timeoutMs: config.timeoutMs,
  };
}

function formatAuthValue(config) {
  return config.authScheme ? `${config.authScheme} ${config.apiKey}` : config.apiKey;
}

function normalizeBaseUrl(value) {
  if (!value) return "";
  return value.endsWith("/") ? value : `${value}/`;
}

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

class KapasoftConfigError extends Error {}

module.exports = {
  KapasoftConfigError,
  getKapasoftConfig,
  isKapasoftConfigured,
  kapasoftRequest,
  pingKapasoft,
  publicKapasoftStatus,
};
