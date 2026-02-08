/**
 * Location Service
 * Handles GPS location tracking and geofencing for attendance
 */

class LocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.isTracking = false;
  }

  /**
   * Check if geolocation is supported
   * @returns {boolean}
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Request location permission and get current position
   * @param {Object} options - Geolocation options
   * @returns {Promise<GeolocationPosition>}
   */
  async getCurrentPosition(options = {}) {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const finalOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          reject(this.handleGeolocationError(error));
        },
        finalOptions
      );
    });
  }

  /**
   * Start watching position changes
   * @param {Function} onPositionUpdate - Callback for position updates
   * @param {Function} onError - Callback for errors
   * @param {Object} options - Geolocation options
   * @returns {number} Watch ID
   */
  startWatching(onPositionUpdate, onError, options = {}) {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    if (this.isTracking) {
      this.stopWatching();
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const finalOptions = { ...defaultOptions, ...options };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        this.isTracking = true;
        if (onPositionUpdate) {
          onPositionUpdate(position);
        }
      },
      (error) => {
        const errorMessage = this.handleGeolocationError(error);
        if (onError) {
          onError(errorMessage);
        }
      },
      finalOptions
    );

    return this.watchId;
  }

  /**
   * Stop watching position changes
   */
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in meters
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δφ = this.toRadians(lat2 - lat1);
    const Δλ = this.toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Check if user is within a geofence
   * @param {number} userLat - User's latitude
   * @param {number} userLon - User's longitude
   * @param {number} targetLat - Target latitude
   * @param {number} targetLon - Target longitude
   * @param {number} radius - Radius in meters
   * @returns {boolean}
   */
  isWithinGeofence(userLat, userLon, targetLat, targetLon, radius) {
    const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
    return distance <= radius;
  }

  /**
   * Check if current position is within geofence
   * @param {number} targetLat - Target latitude
   * @param {number} targetLon - Target longitude
   * @param {number} radius - Radius in meters
   * @returns {Promise<Object>} Object with isWithin boolean and distance
   */
  async checkGeofence(targetLat, targetLon, radius) {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      const distance = this.calculateDistance(latitude, longitude, targetLat, targetLon);
      const isWithin = distance <= radius;

      return {
        isWithin,
        distance,
        userLocation: { latitude, longitude },
        accuracy: position.coords.accuracy
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get formatted location data
   * @param {GeolocationPosition} position - Position object
   * @returns {Object} Formatted location data
   */
  formatLocationData(position) {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees
   * @returns {number} Radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   * @param {number} radians
   * @returns {number} Degrees
   */
  toDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Handle geolocation errors
   * @param {GeolocationPositionError} error
   * @returns {Object} Error object with message and code
   */
  handleGeolocationError(error) {
    let message = 'An unknown error occurred';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied. Please enable location access in your device settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable. Please check your GPS settings.';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out. Please try again.';
        break;
    }

    return {
      code: error.code,
      message: message,
      originalError: error
    };
  }

  /**
   * Get accuracy description based on accuracy value
   * @param {number} accuracy - Accuracy in meters
   * @returns {string} Description
   */
  getAccuracyDescription(accuracy) {
    if (accuracy < 10) return 'Excellent';
    if (accuracy < 50) return 'Good';
    if (accuracy < 100) return 'Fair';
    return 'Poor';
  }

  /**
   * Request high accuracy location (for critical operations)
   * @returns {Promise<GeolocationPosition>}
   */
  async getHighAccuracyPosition() {
    return this.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
  }

  /**
   * Get cached position (faster, less accurate)
   * @returns {Promise<GeolocationPosition>}
   */
  async getCachedPosition() {
    return this.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000 // 5 minutes
    });
  }
}

// Export singleton instance
const locationService = new LocationService();
export default locationService;
