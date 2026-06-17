<h1 align="center">
  <img src="icons/icon128.png" width="64" alt="BurProxy Icon"/><br/>
  BurProxy
</h1>

<p align="center">
  <strong>A minimal Chrome extension to toggle Burp Suite proxy on/off in one click.</strong><br/>
  No bloat. No setup. Just intercept.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-orange?style=flat-square&logo=googlechrome&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Made%20for-Burp%20Suite-ff6633?style=flat-square"/>
</p>

---

## ✨ Features

- 🔴 **One-click toggle** — enable or disable Burp Suite proxy instantly
- 🖊️ **Editable host & port** — default `127.0.0.1:8080`, fully customizable
- 💾 **Persistent settings** — your config survives browser restarts
- 🌑 **Dark minimal UI** — clean, distraction-free design
- ⚡ **Zero dependencies** — pure HTML/CSS/JS, no npm, no build step
- 🛡️ **Manifest V3** — built on Chrome's latest extension standard

---

## 📸 Preview

| Proxy OFF | Proxy ON |
|-----------|----------|
| ![off state](screenshots/off.png) | ![on state](screenshots/on.png) |

> _Screenshots coming soon — load the extension and see for yourself!_

---

## 🚀 Installation

### Option A — Load Unpacked (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/burproxy.git
   ```
2. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select the `burproxy/` folder
6. The BurProxy icon will appear in your Chrome toolbar 🎉

### Option B — Manual Download

1. Download the [latest release](https://github.com/YOUR_USERNAME/burproxy/releases) as a `.zip`
2. Extract it
3. Follow steps 2–6 above

---

## 🛠️ Usage

1. **Start Burp Suite** and ensure the proxy listener is running on `127.0.0.1:8080`
2. Click the **BurProxy** icon in your Chrome toolbar
3. **Toggle the switch ON** → Chrome traffic now routes through Burp
4. To change the port (e.g. `8081`), edit the **Port** field and click **Apply Settings**
5. **Toggle OFF** when done → direct connection restored

---

## 📁 File Structure

```
burproxy/
├── manifest.json      # Chrome Extension Manifest V3
├── background.js      # Service worker — proxy logic via chrome.proxy API
├── popup.html         # Extension popup UI
├── popup.css          # Dark minimal styles
├── popup.js           # UI logic & state management
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🔧 How It Works

BurProxy uses the [`chrome.proxy`](https://developer.chrome.com/docs/extensions/reference/proxy/) API to programmatically configure Chrome's proxy settings:

**Proxy ON** — sets a `fixed_servers` config routing all traffic through your Burp listener:
```json
{
  "mode": "fixed_servers",
  "rules": {
    "singleProxy": { "scheme": "http", "host": "127.0.0.1", "port": 8080 }
  }
}
```

**Proxy OFF** — restores Chrome to a direct connection:
```json
{ "mode": "direct" }
```

Settings are persisted using `chrome.storage.local` and survive browser restarts.

---

## 🔒 Permissions

| Permission | Reason |
|------------|--------|
| `proxy` | Read and write Chrome proxy configuration |
| `storage` | Save host/port settings across sessions |
| `host_permissions: <all_urls>` | Required by Chrome for proxy API access |

No data is collected. No network requests are made. Everything runs 100% locally.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📋 Roadmap

- [ ] Chrome Web Store release
- [ ] HTTPS/SOCKS5 proxy scheme support
- [ ] Multiple proxy profiles (switch between configs)
- [ ] Auto-detect if Burp is running
- [ ] Firefox (WebExtensions) port

---

## ⚠️ Disclaimer

This tool is intended for **security research, penetration testing, and educational purposes** on systems you own or have explicit permission to test.  
Always comply with applicable laws and responsible disclosure policies.

---

## 📄 License

[MIT](LICENSE) © 2024 YOUR_USERNAME

---

<p align="center">
  Made with ❤️ for security researchers & pentesters
</p>
