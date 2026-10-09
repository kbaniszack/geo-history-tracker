# 📍 GeoHistory - Traceur d'accès Géolocalisation

Extension de navigateur (Manifest V3) pour Microsoft Edge et Google Chrome permettant de journaliser en temps réel chaque requête d'accès à votre position géographique (`navigator.geolocation`).

## ✨ Fonctionnalités

* **Interception transparente & native :** Détecte les appels `getCurrentPosition` et `watchPosition` sans casser le fonctionnement des sites web.
* **Historique horodaté précis :** Enregistre la date, l'heure exacte à la seconde près, le nom de domaine, l'URL complète et le titre de la page.
* **Badge d'activité :** Affiche le nombre de requêtes directement sur l'icône de l'extension.
* **Filtres & Recherche :** Filtrez instantanément par nom de site, URL ou méthode d'accès.
* **Export de données :** Exportez votre journal d'audit en **CSV** (compatible Excel) ou **JSON**.
* **Accès rapide aux réglages Edge :** Bouton direct vers `edge://settings/content/location` pour révoquer les autorisations des sites abusifs.

---

## 🚀 Installation dans Microsoft Edge (en 30 secondes)

1. Ouvrez Microsoft Edge et tapez dans la barre d'adresse :
   ```text
   edge://extensions
   ```
2. Dans le menu de gauche, activez l'interrupteur **Mode développeur** (*Developer mode*).
3. Cliquez sur le bouton **Charger les composants décompressés** (*Load unpacked*).
4. Sélectionnez le dossier :
   ```text
   D:\Edge-extensions\geo-history-tracker
   ```
5. L'icône **GeoHistory (📍)** apparaît immédiatement dans votre barre d'extensions ! *(Pensez à cliquer sur l'icône de puzzle pour l'épingler visible à côté de votre barre d'adresse).*

---

## 🧪 Comment tester immédiatement ?

1. Ouvrez un site météo ou cartographique (ex: `https://www.windy.com` ou `https://browserleaks.com/geo`).
2. Autorisez la géolocalisation si le site la demande.
3. Cliquez sur l'icône **GeoHistory** dans votre barre Edge : la requête apparaît instantanément avec l'heure exacte et l'URL !

---

## 📦 Prêt pour publication (Microsoft Edge Add-ons & Chrome Web Store)

L'extension respecte à 100 % les standards **Manifest V3** de Microsoft et Google :
* Aucune dépendance externe, code 100 % local et respectueux de la vie privée.
* Aucune donnée n'est transmise sur internet : tout est stocké dans le stockage local de votre navigateur (`chrome.storage.local`).
* Pour générer les PNG requis par le Store si nécessaire, double-cliquez simplement sur `generer_icones.bat`.
