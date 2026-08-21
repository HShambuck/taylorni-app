import Constants from "expo-constants";

const DEFAULT_PORT = "8000";

const getHostFromExpo = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    "";

  if (!hostUri) {
    return "";
  }

  return hostUri.split(":")[0];
};

export const getBackendBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  const host = getHostFromExpo();
  if (!host || host === "localhost" || host === "127.0.0.1") {
    // Android emulator loopback.
    return `http://10.0.2.2:${DEFAULT_PORT}/api`;
  }

  return `http://${host}:${DEFAULT_PORT}/api`;
};

export const checkBackendHealth = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${getBackendBaseUrl()}/health`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      return { ok: false };
    }
    const data = await response.json().catch(() => ({}));
    return { ok: true, data };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
};
