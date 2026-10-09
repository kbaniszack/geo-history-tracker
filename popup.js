let allLogs = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadLogs();

  // Écoute les nouveaux logs en temps réel si la popup est ouverte
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.geoLogs) {
      allLogs = changes.geoLogs.newValue || [];
      renderUI();
    }
  });

  // Filtres
  document.getElementById('search-input').addEventListener('input', renderLogsList);
  document.getElementById('method-filter').addEventListener('change', renderLogsList);

  // Bouton vider l'historique
  document.getElementById('btn-clear').addEventListener('click', async () => {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique des demandes de géolocalisation ?')) {
      await chrome.storage.local.set({ geoLogs: [] });
      chrome.action.setBadgeText({ text: '' });
      allLogs = [];
      renderUI();
    }
  });

  // Export CSV
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);

  // Export JSON
  document.getElementById('btn-export-json').addEventListener('click', exportJSON);

  // Lien direct vers les réglages Edge
  document.getElementById('open-edge-settings').addEventListener('click', () => {
    chrome.tabs.create({ url: 'edge://settings/content/location' });
  });
});

async function loadLogs() {
  const result = await chrome.storage.local.get({ geoLogs: [] });
  allLogs = Array.isArray(result.geoLogs) ? result.geoLogs : [];
  renderUI();
}

function renderUI() {
  updateStats();
  renderLogsList();
}

function updateStats() {
  const totalEl = document.getElementById('stat-total');
  const sitesEl = document.getElementById('stat-sites');
  const lastEl = document.getElementById('stat-last');

  totalEl.textContent = allLogs.length;

  const uniqueOrigins = new Set(allLogs.map(l => l.origin).filter(Boolean));
  sitesEl.textContent = uniqueOrigins.size;

  if (allLogs.length > 0) {
    const lastTimestamp = allLogs[0].timestamp;
    lastEl.textContent = formatRelativeTime(lastTimestamp);
    lastEl.title = new Date(lastTimestamp).toLocaleString('fr-FR');
  } else {
    lastEl.textContent = '--';
    lastEl.title = '';
  }
}

function renderLogsList() {
  const container = document.getElementById('logs-list');
  const emptyState = document.getElementById('empty-state');
  const search = document.getElementById('search-input').value.toLowerCase().trim();
  const methodFilter = document.getElementById('method-filter').value;

  const filtered = allLogs.filter(item => {
    if (methodFilter !== 'all' && item.method !== methodFilter) return false;
    if (!search) return true;
    const matchOrigin = (item.origin || '').toLowerCase().includes(search);
    const matchHref = (item.href || '').toLowerCase().includes(search);
    const matchTitle = (item.title || '').toLowerCase().includes(search);
    return matchOrigin || matchHref || matchTitle;
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = filtered.map(item => {
    const dateObj = new Date(item.timestamp);
    const exactTime = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const exactDate = dateObj.toLocaleDateString('fr-FR');
    const relativeTime = formatRelativeTime(item.timestamp);
    const displayOrigin = cleanOrigin(item.origin || item.href);
    const badgeClass = item.method === 'watchPosition' ? 'badge-watch' : 'badge-get';
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(displayOrigin)}&sz=32`;

    return `
      <li class="log-item">
        <div class="log-header">
          <div class="log-site" title="${escapeHtml(item.title || item.origin)}">
            <img class="site-icon" src="${faviconUrl}" onerror="this.style.display='none'" alt="" />
            <span>${escapeHtml(displayOrigin)}</span>
          </div>
          <span class="log-time" title="${exactDate} ${exactTime}">${exactTime} (${relativeTime})</span>
        </div>
        <div class="log-details">
          <span class="log-url" title="${escapeHtml(item.href)}">${escapeHtml(item.href || item.origin)}</span>
          <span class="badge ${badgeClass}">${escapeHtml(item.method)}</span>
        </div>
      </li>
    `;
  }).join('');
}

function cleanOrigin(urlStr) {
  try {
    const url = new URL(urlStr);
    return url.hostname;
  } catch (e) {
    return urlStr || 'Inconnu';
  }
}

function formatRelativeTime(timestamp) {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return "à l'instant";
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}j`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function exportCSV() {
  if (allLogs.length === 0) {
    alert('Aucun log à exporter.');
    return;
  }

  const headers = ['ID', 'Date', 'Heure', 'Méthode', 'Origine', 'URL', 'Titre'];
  const rows = allLogs.map(item => {
    const d = new Date(item.timestamp);
    return [
      item.id,
      d.toLocaleDateString('fr-FR'),
      d.toLocaleTimeString('fr-FR'),
      item.method,
      item.origin,
      `"${(item.href || '').replace(/"/g, '""')}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  downloadFile(csvContent, `geohistory-export-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
}

function exportJSON() {
  if (allLogs.length === 0) {
    alert('Aucun log à exporter.');
    return;
  }
  const jsonContent = JSON.stringify(allLogs, null, 2);
  downloadFile(jsonContent, `geohistory-export-${Date.now()}.json`, 'application/json');
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
