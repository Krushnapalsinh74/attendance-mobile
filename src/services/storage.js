import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Service
 * Provides helper methods for AsyncStorage operations
 */

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@attendance:userToken',
  USER_DATA: '@attendance:userData',
  REMEMBER_ME: '@attendance:rememberMe',
  LAST_SYNC: '@attendance:lastSync',
  OFFLINE_RECORDS: '@attendance:offlineRecords',
  APP_SETTINGS: '@attendance:appSettings',
};

/**
 * Store a value in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {Promise<boolean>} Success status
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

/**
 * Retrieve a value from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any|null>} Parsed value or null if not found
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

/**
 * Remove a value from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

/**
 * Clear all data from AsyncStorage
 * @returns {Promise<boolean>} Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Store multiple key-value pairs
 * @param {Array<[string, any]>} pairs - Array of [key, value] pairs
 * @returns {Promise<boolean>} Success status
 */
export const storeMultiple = async (pairs) => {
  try {
    const jsonPairs = pairs.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(jsonPairs);
    return true;
  } catch (error) {
    console.error('Error storing multiple items:', error);
    return false;
  }
};

/**
 * Retrieve multiple values from AsyncStorage
 * @param {Array<string>} keys - Array of storage keys
 * @returns {Promise<Object>} Object with key-value pairs
 */
export const getMultiple = async (keys) => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result = {};
    pairs.forEach(([key, value]) => {
      result[key] = value != null ? JSON.parse(value) : null;
    });
    return result;
  } catch (error) {
    console.error('Error retrieving multiple items:', error);
    return {};
  }
};

/**
 * Remove multiple keys from AsyncStorage
 * @param {Array<string>} keys - Array of storage keys
 * @returns {Promise<boolean>} Success status
 */
export const removeMultiple = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error removing multiple items:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns {Promise<Array<string>>} Array of all keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

// User-specific helpers

/**
 * Store user authentication token
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>}
 */
export const storeUserToken = async (token) => {
  return await storeData(STORAGE_KEYS.USER_TOKEN, token);
};

/**
 * Get user authentication token
 * @returns {Promise<string|null>}
 */
export const getUserToken = async () => {
  return await getData(STORAGE_KEYS.USER_TOKEN);
};

/**
 * Store user data
 * @param {Object} userData - User information
 * @returns {Promise<boolean>}
 */
export const storeUserData = async (userData) => {
  return await storeData(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * Get user data
 * @returns {Promise<Object|null>}
 */
export const getUserData = async () => {
  return await getData(STORAGE_KEYS.USER_DATA);
};

/**
 * Clear user session (token and data)
 * @returns {Promise<boolean>}
 */
export const clearUserSession = async () => {
  return await removeMultiple([
    STORAGE_KEYS.USER_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ]);
};

/**
 * Store offline attendance records
 * @param {Array} records - Offline records to store
 * @returns {Promise<boolean>}
 */
export const storeOfflineRecords = async (records) => {
  return await storeData(STORAGE_KEYS.OFFLINE_RECORDS, records);
};

/**
 * Get offline attendance records
 * @returns {Promise<Array>}
 */
export const getOfflineRecords = async () => {
  const records = await getData(STORAGE_KEYS.OFFLINE_RECORDS);
  return records || [];
};

/**
 * Add a single offline record
 * @param {Object} record - Attendance record
 * @returns {Promise<boolean>}
 */
export const addOfflineRecord = async (record) => {
  const existingRecords = await getOfflineRecords();
  existingRecords.push(record);
  return await storeOfflineRecords(existingRecords);
};

/**
 * Clear offline records
 * @returns {Promise<boolean>}
 */
export const clearOfflineRecords = async () => {
  return await removeData(STORAGE_KEYS.OFFLINE_RECORDS);
};

/**
 * Store app settings
 * @param {Object} settings - App settings
 * @returns {Promise<boolean>}
 */
export const storeSettings = async (settings) => {
  return await storeData(STORAGE_KEYS.APP_SETTINGS, settings);
};

/**
 * Get app settings
 * @returns {Promise<Object|null>}
 */
export const getSettings = async () => {
  return await getData(STORAGE_KEYS.APP_SETTINGS);
};

export default {
  // Core methods
  storeData,
  getData,
  removeData,
  clearAll,
  storeMultiple,
  getMultiple,
  removeMultiple,
  getAllKeys,
  
  // User methods
  storeUserToken,
  getUserToken,
  storeUserData,
  getUserData,
  clearUserSession,
  
  // Offline methods
  storeOfflineRecords,
  getOfflineRecords,
  addOfflineRecord,
  clearOfflineRecords,
  
  // Settings methods
  storeSettings,
  getSettings,
  
  // Storage keys
  STORAGE_KEYS,
};
