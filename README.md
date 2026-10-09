# 📍 GeoHistory - Geolocation Access Tracker

[![Version Française](https://img.shields.io/badge/Langue-Français-blue.svg)](README.fr.md)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen.svg)](manifest.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, privacy-focused browser extension (Manifest V3) for Microsoft Edge and Google Chrome that monitors, logs, and audits website geolocation requests (`navigator.geolocation`) in real time.

---

## ✨ Features

* **Transparent & Native Interception:** Detects `getCurrentPosition` and `watchPosition` calls seamlessly without interfering with webpage behavior.
* **Accurate Timestamps & Audit Log:** Records the exact date, time (to the second), hostname, full URL, and page title for every location request.
* **Live Counter Badge:** Displays the total count of captured geolocation events directly on the browser extension icon.
* **Instant Search & Filter:** Filter logs by domain name, query strings, or API method (`getCurrentPosition` vs `watchPosition`).
* **Data Export:** Export your complete privacy audit trail to **CSV** (Excel/Sheets compatible) or **JSON**.
* **Quick Access to Browser Settings:** One-click shortcut to manage and revoke website location permissions (`edge://settings/content/location`).
* **100% Local & Privacy-First:** No telemetry, no third-party tracking, zero external network requests. All data stays strictly stored in your local browser storage (`chrome.storage.local`).

---

## 🚀 Installation Guide (Microsoft Edge & Chrome)

1. Open Microsoft Edge and navigate to:
   ```text
   edge://extensions
   ```
   *(Or `chrome://extensions` in Google Chrome)*.
2. In the left panel (or top right), toggle on **Developer mode**.
3. Click on the **Load unpacked** button.
4. Select the project directory:
   ```text
   D:\Edge-extensions\geo-history-tracker
   ```
5. **GeoHistory** is installed! Click the puzzle icon in your toolbar to pin it next to the address bar.

---

## 🧪 How to Test

1. Visit any website that requests your location (e.g., weather or mapping services like [Windy](https://www.windy.com) or [BrowserLeaks Geolocation](https://browserleaks.com/geo)).
2. Allow the location prompt when asked by the browser.
3. Open the **GeoHistory** popup: the access event appears instantly with domain details and exact time.

---

## 🛠️ Architecture & Under the Hood

* **Manifest V3 Architecture:** Fully compliant with modern Chromium extension security standards.
* **`injected.js` (Main World Execution):** Non-intrusive monkey-patching of `Geolocation.prototype` preserving native browser invocation bindings via `apply(this, arguments)`.
* **`content.js` (Isolated World):** Secure event bridge communicating isolated DOM events to extension runtime APIs.
* **`background.js` (Service Worker):** Handles log persistence, storage management (`MAX_LOGS` queue), and toolbar badge updates.
* **`popup/` (User Interface):** Clean, modern dark-themed dashboard built with vanilla web technologies (HTML5, CSS3, JavaScript).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
