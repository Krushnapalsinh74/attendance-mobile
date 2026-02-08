/**
 * Network utility for checking internet connectivity
 */

/**
 * Check if the device has internet connectivity
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
export async function checkInternetConnectivity() {
  // Check if navigator.onLine is available
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }

  try {
    // Attempt to fetch a lightweight resource with cache busting
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.warn('Internet connectivity check failed:', error.message);
    return false;
  }
}

/**
 * Get the current network connection type
 * @returns {string} Connection type (wifi, cellular, none, unknown)
 */
export function getConnectionType() {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  if (!navigator.onLine) {
    return 'none';
  }

  // Check for Network Information API support
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const type = connection.effectiveType || connection.type;
    
    if (connection.type === 'wifi' || type === '4g') {
      return 'wifi';
    } else if (connection.type === 'cellular' || ['3g', '2g', 'slow-2g'].includes(type)) {
      return 'cellular';
    }
  }

  return navigator.onLine ? 'unknown' : 'none';
}

/**
 * Listen for network status changes
 * @param {Function} callback - Callback function to execute on network change
 * @returns {Function} Cleanup function to remove listeners
 */
export function onNetworkChange(callback) {
  const handleOnline = () => callback({ online: true, type: getConnectionType() });
  const handleOffline = () => callback({ online: false, type: 'none' });

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Also listen for connection changes if available
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    connection.addEventListener('change', () => {
      callback({ online: navigator.onLine, type: getConnectionType() });
    });
  }

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    if (connection) {
      connection.removeEventListener('change', handleOnline);
    }
  };
}

/**
 * Check network quality/speed
 * @returns {Object} Network quality information
 */
export function getNetworkQuality() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return {
      effectiveType: 'unknown',
      downlink: null,
      rtt: null,
      saveData: false
    };
  }

  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || null, // Mbps
    rtt: connection.rtt || null, // Round trip time in ms
    saveData: connection.saveData || false
  };
}

export default {
  checkInternetConnectivity,
  getConnectionType,
  onNetworkChange,
  getNetworkQuality
};
