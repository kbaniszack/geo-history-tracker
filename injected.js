(function() {
  if (window.__GEO_TRACKER_HOOKED__) return;
  window.__GEO_TRACKER_HOOKED__ = true;

  function notifyTracker(method, options) {
    try {
      const details = {
        enableHighAccuracy: !!(options && options.enableHighAccuracy),
        timeout: options && typeof options.timeout === 'number' ? options.timeout : null,
        maximumAge: options && typeof options.maximumAge === 'number' ? options.maximumAge : null
      };

      window.postMessage({
        source: '__GEO_TRACKER__',
        method: method,
        origin: window.location.origin,
        href: window.location.href,
        title: document.title || '',
        timestamp: Date.now(),
        details: details
      }, '*');

      console.log(`[GeoHistory] 📍 Requête de géolocalisation détectée (${method}) pour :`, window.location.origin);
    } catch (e) {
      // Ignorer silencieusement si contexte restreint
    }
  }

  // 1. Interception sur Geolocation.prototype (Interception universelle Chromium/Edge/Firefox)
  if (typeof window.Geolocation !== 'undefined' && window.Geolocation.prototype) {
    const proto = window.Geolocation.prototype;

    const originalGet = proto.getCurrentPosition;
    if (typeof originalGet === 'function') {
      proto.getCurrentPosition = function(successCallback, errorCallback, options) {
        notifyTracker('getCurrentPosition', options);
        return originalGet.apply(this, arguments);
      };
    }

    const originalWatch = proto.watchPosition;
    if (typeof originalWatch === 'function') {
      proto.watchPosition = function(successCallback, errorCallback, options) {
        notifyTracker('watchPosition', options);
        return originalWatch.apply(this, arguments);
      };
    }
  }

  // 2. Interception de secours directe si une instance navigator.geolocation surcharge ses propres méthodes
  try {
    if (navigator && navigator.geolocation) {
      const instance = navigator.geolocation;
      if (Object.prototype.hasOwnProperty.call(instance, 'getCurrentPosition')) {
        const instGet = instance.getCurrentPosition;
        instance.getCurrentPosition = function(success, error, options) {
          notifyTracker('getCurrentPosition', options);
          return instGet.apply(this, arguments);
        };
      }
      if (Object.prototype.hasOwnProperty.call(instance, 'watchPosition')) {
        const instWatch = instance.watchPosition;
        instance.watchPosition = function(success, error, options) {
          notifyTracker('watchPosition', options);
          return instWatch.apply(this, arguments);
        };
      }
    }
  } catch (e) {
    // Protégé
  }

  console.log('[GeoHistory] 🛡️ Intercepteur actif sur :', window.location.origin);
})();

