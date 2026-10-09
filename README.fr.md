# 📍 GeoHistory - Traceur d'accès Géolocalisation

[![English Version](https://img.shields.io/badge/Language-English-blue.svg)](README.md)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen.svg)](manifest.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Extension de navigateur (Manifest V3) pour Microsoft Edge et Google Chrome permettant de surveiller et journaliser en temps réel chaque requête d'accès à votre position géographique (`navigator.geolocation`).

---

## ✨ Fonctionnalités

* **Interception transparente & native :** Détecte les appels `getCurrentPosition` et `watchPosition` sans altérer le fonctionnement normal des sites web.
* **Historique horodaté précis :** Enregistre la date, l'heure exacte à la seconde près, le nom de domaine, l'URL complète et le titre de l'onglet.
* **Badge d'activité dynamique :** Affiche le nombre de requêtes directement sur l'icône de l'extension.
* **Filtres & Recherche en temps réel :** Filtrez instantanément par nom de site, URL ou méthode d'accès.
* **Export des données d'audit :** Exportez votre historique en **CSV** (compatible Excel/Sheets) ou **JSON**.
* **Accès rapide aux autorisations :** Raccourci vers les paramètres de localisation du navigateur (`edge://settings/content/location`) pour révoquer les autorisations accordées.
* **100 % Privé & Local :** Aucune donnée n'est transmise sur internet, tout est stocké localement dans `chrome.storage.local`.

---

## 🚀 Installation dans Microsoft Edge (en 30 secondes)

1. Ouvrez Microsoft Edge et accédez à :
   ```text
   edge://extensions
   ```
2. Dans le volet de gauche, activez le **Mode développeur**.
3. Cliquez sur **Charger l'extension décompressée** (*Load unpacked*).
4. Sélectionnez le dossier du projet :
   ```text
   D:\Edge-extensions\geo-history-tracker
   ```
5. L'extension **GeoHistory** apparaît dans votre liste d'extensions ! *(Pensez à cliquer sur l'icône de puzzle pour l'épingler dans votre barre d'outils).*

---

## 🧪 Comment tester ?

1. Ouvrez un site demandant votre localisation (ex : un service météo ou cartographique).
2. Autorisez la géolocalisation lorsque le navigateur la sollicite.
3. Cliquez sur l'icône **GeoHistory** : la requête apparaît immédiatement avec le domaine, l'URL, la méthode et l'horodatage précis.

---

## 🛠️ Architecture technique

* **Manifest V3** : Conforme aux dernières exigences de sécurité Chromium (Edge & Chrome).
* **`injected.js` (Main World)** : Monkey-patching sécurisé de `Geolocation.prototype` via `apply(this, arguments)`.
* **`content.js` (Isolated World)** : Passerelle d'écoute isolée relayant les requêtes via l'API `chrome.runtime`.
* **`background.js` (Service Worker)** : Gestion de la persistance (`chrome.storage.local`), de la limitation d'historique et des badges.
* **`popup.html` / `popup.js` / `popup.css`** : Interface sombre moderne, ergonomique et responsive.
