const MAX_LOGS = 1000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'GEO_REQUEST_LOG' && message.data) {
    handleGeoLog(message.data, sender);
  }
});

async function handleGeoLog(data, sender) {
  const item = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: data.timestamp || Date.now(),
    method: data.method || 'getCurrentPosition',
    origin: data.origin || (sender && sender.origin) || 'Inconnu',
    href: data.href || (sender && sender.url) || '',
    title: data.title || (sender && sender.tab && sender.tab.title) || '',
    tabId: sender && sender.tab ? sender.tab.id : null,
    details: data.details || {}
  };

  try {
    const result = await chrome.storage.local.get({ geoLogs: [] });
    const currentLogs = Array.isArray(result.geoLogs) ? result.geoLogs : [];
    
    // Ajoute en tête (du plus récent au plus ancien)
    const updatedLogs = [item, ...currentLogs].slice(0, MAX_LOGS);
    await chrome.storage.local.set({ geoLogs: updatedLogs });

    updateBadge(updatedLogs.length);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde du log de géolocalisation:', err);
  }
}

function updateBadge(count) {
  try {
    if (count > 0) {
      chrome.action.setBadgeText({ text: count > 999 ? '999+' : count.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#2563EB' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (err) {
    // Ignorer
  }
}

// Initialise le badge au démarrage
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get({ geoLogs: [] });
  updateBadge(result.geoLogs ? result.geoLogs.length : 0);
});

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get({ geoLogs: [] });
  updateBadge(result.geoLogs ? result.geoLogs.length : 0);
});
