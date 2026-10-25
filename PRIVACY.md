# Privacy Policy for GeoHistory

*Last updated: October 25, 2026*

GeoHistory ("the Extension") is committed to protecting your privacy. This Privacy Policy explains how information is handled when you use the GeoHistory browser extension for Microsoft Edge and Google Chrome.

---

## 1. Single Purpose & Data Processing

The sole purpose of GeoHistory is to provide users with transparent visibility, monitoring, and audit logging of website requests made to the browser's Geolocation API (`navigator.geolocation`).

### What Data Is Handled:
When a website requests your geolocation, the Extension intercepts the API call and logs:
- **Timestamp:** Date and exact time of the request.
- **Website Information:** Hostname/domain, full URL, and document title of the requesting page.
- **API Method:** Whether `getCurrentPosition` or `watchPosition` was called.
- **Request Parameters:** High accuracy flag, timeout, and maximum age options passed by the website.

---

## 2. 100% Local Storage — No External Data Transmission

- **No Remote Servers:** GeoHistory operates entirely client-side. The extension does **not** communicate with any remote server, cloud storage, or external database.
- **No Third-Party Sharing:** We do not sell, rent, monetize, trade, or transfer any user data to third parties, advertisers, or data brokers.
- **No Telemetry or Tracking:** GeoHistory contains no analytics, tracking pixels, cookies, or telemetry scripts.
- **Local Storage Only:** All logs are saved exclusively on your local machine using the browser's native local storage API (`chrome.storage.local`).

---

## 3. User Control & Data Retention

- **History Limit:** The local audit trail is strictly capped to the most recent 1,000 entries.
- **Clear Data Anytime:** You can instantly and permanently erase all logged geolocation history at any time by clicking the **"Vider l'historique"** (Clear History) button inside the extension popup.
- **Uninstallation:** Uninstalling or removing the extension from your browser automatically and permanently deletes all stored data from your machine.

---

## 4. Permissions Justification

- **`storage`:** Required exclusively to store the local access log on your device.
- **`<all_urls>` (Host permissions):** Required strictly to inject the lightweight client-side listener script on visited web pages to detect calls to the Geolocation API. No page content or user inputs are read or exfiltrated.

---

## 5. Contact & Inquiries

If you have questions, feedback, or concerns regarding this Privacy Policy or the GeoHistory extension, you can reach out directly:

- **Developer:** Amaury Richard
- **Email:** [contact@amaury.bzh](mailto:contact@amaury.bzh)
- **Website:** [https://amaury.bzh](https://amaury.bzh)
- **Source Code & Issue Tracker:** [https://github.com/kbaniszack/geo-history-tracker](https://github.com/kbaniszack/geo-history-tracker)
