// background.js - BurProxy Service Worker

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8080;

// Apply proxy settings
function enableProxy(host, port) {
  const config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: "http",
        host: host,
        port: parseInt(port)
      },
      bypassList: []
    }
  };

  chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
    console.log(`[BurProxy] Proxy enabled → ${host}:${port}`);
  });
}

// Clear proxy settings (direct connection)
function disableProxy() {
  chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" }, () => {
    console.log("[BurProxy] Proxy disabled → direct connection");
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setProxy") {
    const { enabled, host, port } = message;
    if (enabled) {
      enableProxy(host || DEFAULT_HOST, port || DEFAULT_PORT);
    } else {
      disableProxy();
    }
    sendResponse({ success: true });
  }

  if (message.action === "getProxyState") {
    chrome.proxy.settings.get({ incognito: false }, (details) => {
      const isEnabled = details.value.mode === "fixed_servers";
      const proxyInfo = isEnabled && details.value.rules
        ? details.value.rules.singleProxy
        : null;
      sendResponse({
        enabled: isEnabled,
        host: proxyInfo ? proxyInfo.host : DEFAULT_HOST,
        port: proxyInfo ? proxyInfo.port : DEFAULT_PORT
      });
    });
    return true; // Keep channel open for async response
  }
});

// On install: set defaults in storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    proxyEnabled: false,
    proxyHost: DEFAULT_HOST,
    proxyPort: DEFAULT_PORT
  });
});
