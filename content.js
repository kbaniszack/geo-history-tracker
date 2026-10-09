(function() {
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    if (!event.data || event.data.source !== '__GEO_TRACKER__') return;

    try {
      chrome.runtime.sendMessage({
        type: 'GEO_REQUEST_LOG',
        data: {
          method: event.data.method,
          origin: event.data.origin || window.location.origin,
          href: event.data.href || window.location.href,
          title: event.data.title || document.title,
          timestamp: event.data.timestamp || Date.now(),
          details: event.data.details || {}
        }
      }).catch(function() {
        // Ignoré si le service worker est inactif temporairement
      });
    } catch (e) {
      // Ignorer
    }
  });
})();
