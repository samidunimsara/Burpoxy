// popup.js - BurProxy UI Logic

const toggle     = document.getElementById('proxyToggle');
const toggleText = document.getElementById('toggleText');
const hostInput  = document.getElementById('hostInput');
const portInput  = document.getElementById('portInput');
const applyBtn   = document.getElementById('applyBtn');
const statusBadge= document.getElementById('statusBadge');
const statusDot  = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// ── Helpers ──────────────────────────────────────────────

function setUIState(enabled, host, port) {
  toggle.checked = enabled;
  toggleText.textContent = enabled ? 'Proxy Enabled' : 'Proxy Disabled';
  toggleText.className = enabled ? 'on' : '';
  statusBadge.textContent = enabled ? 'ON' : 'OFF';
  statusBadge.className = enabled ? 'badge active' : 'badge';
  statusDot.className = enabled ? 'status-dot active' : 'status-dot';
  statusText.className = enabled ? 'active' : '';
  statusText.textContent = enabled
    ? `Routing traffic → ${host}:${port}`
    : 'No proxy active';
  hostInput.value = host || '127.0.0.1';
  portInput.value = port || 8080;
}

function flashApply(success) {
  applyBtn.textContent = success ? '✓ Applied' : '✗ Error';
  applyBtn.className = success ? 'apply-btn saved' : 'apply-btn';
  setTimeout(() => {
    applyBtn.textContent = 'Apply Settings';
    applyBtn.className = 'apply-btn';
  }, 1500);
}

// ── Load current state ────────────────────────────────────

chrome.runtime.sendMessage({ action: 'getProxyState' }, (res) => {
  if (res) {
    // Also load saved host/port from storage for display
    chrome.storage.local.get(['proxyHost', 'proxyPort'], (data) => {
      const host = res.enabled ? res.host : (data.proxyHost || '127.0.0.1');
      const port = res.enabled ? res.port : (data.proxyPort || 8080);
      setUIState(res.enabled, host, port);
    });
  }
});

// ── Toggle handler ────────────────────────────────────────

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  const host = hostInput.value.trim() || '127.0.0.1';
  const port = parseInt(portInput.value) || 8080;

  chrome.storage.local.set({ proxyEnabled: enabled, proxyHost: host, proxyPort: port });
  chrome.runtime.sendMessage({ action: 'setProxy', enabled, host, port });

  setUIState(enabled, host, port);
});

// ── Apply settings ────────────────────────────────────────

applyBtn.addEventListener('click', () => {
  const host = hostInput.value.trim();
  const port = parseInt(portInput.value);

  // Validate
  if (!host) {
    hostInput.focus();
    return;
  }
  if (!port || port < 1 || port > 65535) {
    portInput.focus();
    return;
  }

  chrome.storage.local.set({ proxyHost: host, proxyPort: port }, () => {
    const enabled = toggle.checked;
    chrome.runtime.sendMessage({ action: 'setProxy', enabled, host, port }, (res) => {
      flashApply(res && res.success);
      setUIState(enabled, host, port);
    });
  });
});

// ── Enter key applies settings ────────────────────────────

[hostInput, portInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyBtn.click();
  });
});
