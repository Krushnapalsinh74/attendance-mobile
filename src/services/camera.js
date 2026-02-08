/**
 * Camera Service
 * Handles camera operations for attendance photo capture
 */

/**
 * Check if camera is available on the device
 * @returns {Promise<boolean>}
 */
export const isCameraAvailable = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
};

/**
 * Request camera permissions
 * @returns {Promise<boolean>}
 */
export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' } 
    });
    // Stop the stream immediately after permission is granted
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
};

/**
 * Get camera stream
 * @param {Object} options - Camera options
 * @param {string} options.facingMode - 'user' for front camera, 'environment' for back camera
 * @param {number} options.width - Desired video width
 * @param {number} options.height - Desired video height
 * @returns {Promise<MediaStream>}
 */
export const getCameraStream = async (options = {}) => {
  const {
    facingMode = 'user',
    width = 1280,
    height = 720
  } = options;

  try {
    const constraints = {
      video: {
        facingMode,
        width: { ideal: width },
        height: { ideal: height }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error getting camera stream:', error);
    throw new Error('Failed to access camera');
  }
};

/**
 * Stop camera stream
 * @param {MediaStream} stream
 */
export const stopCameraStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Capture photo from video element
 * @param {HTMLVideoElement} videoElement
 * @param {Object} options - Capture options
 * @param {number} options.quality - JPEG quality (0-1)
 * @param {number} options.maxWidth - Maximum width for the captured image
 * @param {number} options.maxHeight - Maximum height for the captured image
 * @returns {Promise<{blob: Blob, dataUrl: string}>}
 */
export const capturePhoto = async (videoElement, options = {}) => {
  const {
    quality = 0.9,
    maxWidth = 1280,
    maxHeight = 720
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const video = videoElement;

      // Calculate dimensions maintaining aspect ratio
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        quality
      );
    } catch (error) {
      console.error('Error capturing photo:', error);
      reject(error);
    }
  });
};

/**
 * Convert blob to base64 string
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Compress image blob
 * @param {Blob} blob
 * @param {Object} options
 * @param {number} options.maxWidth - Maximum width
 * @param {number} options.maxHeight - Maximum height
 * @param {number} options.quality - JPEG quality (0-1)
 * @returns {Promise<Blob>}
 */
export const compressImage = async (blob, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (compressedBlob) => {
          URL.revokeObjectURL(url);
          if (compressedBlob) {
            resolve(compressedBlob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Get available cameras
 * @returns {Promise<Array<{deviceId: string, label: string, facingMode: string}>>}
 */
export const getAvailableCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
        facingMode: device.label.toLowerCase().includes('front') ? 'user' : 'environment'
      }));
    
    return cameras;
  } catch (error) {
    console.error('Error getting available cameras:', error);
    return [];
  }
};

/**
 * Switch camera (toggle between front and back)
 * @param {string} currentFacingMode - Current facing mode
 * @returns {string} New facing mode
 */
export const toggleCamera = (currentFacingMode) => {
  return currentFacingMode === 'user' ? 'environment' : 'user';
};

export default {
  isCameraAvailable,
  requestCameraPermission,
  getCameraStream,
  stopCameraStream,
  capturePhoto,
  blobToBase64,
  compressImage,
  getAvailableCameras,
  toggleCamera
};
