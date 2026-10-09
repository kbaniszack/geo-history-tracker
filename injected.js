(function() {
  if (window.__GEO_TRACKER_HOOKED__) return;
  window.__GEO_TRACKER_HOOKED__ = true;

  function notifyTracker(method, details) {
    try {
      window.postMessage({
        source: '__GEO_TRACKER__',
        method: method,
        origin: window.location.origin,
        href: window.location.href,
        title: document.title || '',
        timestamp: Date.now(),
        details: details || {}
      }, '*');
    } catch (e) {
      // Ignorer silencieusement si la fenêtre est déconnectée
    }
  }

  function hookGeolocation(geo) {
    if (!geo || geo.__GEO_INTERCEPTED__) return;
    geo.__GEO_INTERCEPTED__ = true;

    const originalGetCurrentPosition = geo.getCurrentPosition ? geo.getCurrentPosition.bind(geo) : null;
    const originalWatchPosition = geo.watchPosition ? geo.watchPosition.bind(geo) : null;

    if (originalGetCurrentPosition) {
      geo.getCurrentPosition = function(successCallback, errorCallback, options) {
        notifyTracker('getCurrentPosition', {
          enableHighAccuracy: options && options.enableHighAccuracy,
          timeout: options && options.timeout,
          maximumAge: options && options.maximumAge
        });
        return originalGetCurrentPosition(successCallback, errorCallback, options);
      };
    }

    if (originalWatchPosition) {
      geo.watchPosition = function(successCallback, errorCallback, options) {
        notifyTracker('watchPosition', {
          enableHighAccuracy: options && options.enableHighAccuracy,
          timeout: options && options.timeout,
          maximumAge: options && options.maximumAge
        });
        return originalWatchPosition(successCallback, errorCallback, options);
      };
    }
  }

  // Hook immédiat si navigator.geolocation existe déjà
  if (navigator && navigator.geolocation) {
    hookGeolocation(navigator.geolocation);
  }

  // Hook sur le prototype si disponible
  if (window.Geolocation && window.Geolocation.prototype) {
    hookGeolocation(window.Geolocation.prototype);
  }

  // Observer pour hooker si l'objet est initialisé plus tard
  try {
    let currentGeo = navigator ? navigator.geolocation : null;
    if (navigator) {
      Object.defineProperty(navigator, 'geolocation', {
        configurable: true,
        enumerable: true,
        get: function() {
          return currentGeo;
        },
        set: function(val) {
          currentGeo = val;
          hookGeolocation(val);
        }
      });
      if (currentGeo) {
        hookGeolocation(currentGeo);
      }
    }
  } catch (err) {
    // Si navigator.geolocation est non-configurable dans cette version du navigateur, le hook direct suffit
    if (navigator && navigator.geolocation) {
      hookGeolocation(navigator.geolocation);
    }
  }
})();
