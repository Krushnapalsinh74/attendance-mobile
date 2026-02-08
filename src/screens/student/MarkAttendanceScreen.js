import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { markAttendance } from '../../services/api';
import config from '../../config/constants';

const { width, height } = Dimensions.get('window');
const CAMERA_SIZE = Math.min(width * 0.85, 400);

export default function MarkAttendanceScreen({ route, navigation }) {
  const { session } = route.params;
  
  // Camera & Permissions
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [videoUri, setVideoUri] = useState(null);
  const [faceSnapshot, setFaceSnapshot] = useState(null);
  
  // Location State
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('prepare'); // prepare, recording, recorded, submitting
  
  // Animations
  const recordButtonScale = useRef(new Animated.Value(1)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const countdownScale = useRef(new Animated.Value(0)).current;

  // Get location and calculate distance on mount
  useEffect(() => {
    getLocationAndDistance();
  }, []);

  // Request camera permission if not granted
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const getLocationAndDistance = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      // Calculate distance from session location
      const dist = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        session.latitude,
        session.longitude
      );

      setDistance(dist);
      setIsWithinRange(dist <= config.GEOFENCE_RADIUS);

      if (dist > config.GEOFENCE_RADIUS) {
        Alert.alert(
          'Out of Range',
          `You are ${Math.round(dist)}m away from the session. You must be within ${config.GEOFENCE_RADIUS}m to mark attendance.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get your location. Please enable GPS and try again.');
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Start recording with countdown
  const startRecording = async () => {
    if (!cameraRef.current || !isWithinRange) return;

    try {
      setIsRecording(true);
      setStep('recording');
      setCountdown(5);

      // Animate record button
      Animated.sequence([
        Animated.timing(recordButtonScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Countdown animation
      let count = 5;
      const countdownInterval = setInterval(() => {
        count--;
        setCountdown(count);
        
        // Animate countdown number
        Animated.sequence([
          Animated.timing(countdownScale, {
            toValue: 1.5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(countdownScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();

        if (count === 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      // Take snapshot at 2.5 seconds (middle of recording)
      setTimeout(async () => {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.8,
            base64: true,
          });
          setFaceSnapshot(photo);
        } catch (err) {
          console.error('Snapshot error:', err);
        }
      }, 2500);

      // Record video for 5 seconds
      const video = await cameraRef.current.recordAsync({
        maxDuration: 5,
        quality: '720p',
      });

      setVideoUri(video.uri);
      setIsRecording(false);
      setStep('recorded');

      // Reset animations
      recordingPulse.stopAnimation();
      Animated.timing(recordButtonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      setStep('prepare');
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const retake = () => {
    setVideoUri(null);
    setFaceSnapshot(null);
    setStep('prepare');
    setCountdown(5);
  };

  const submitAttendance = async () => {
    if (!videoUri || !faceSnapshot || !location) {
      Alert.alert('Error', 'Missing required data. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setStep('submitting');

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('sessionId', session.id);
      formData.append('latitude', location.coords.latitude);
      formData.append('longitude', location.coords.longitude);
      formData.append('distance', distance);
      
      // Add video file
      formData.append('video', {
        uri: Platform.OS === 'ios' ? videoUri.replace('file://', '') : videoUri,
        type: 'video/mp4',
        name: `attendance_${Date.now()}.mp4`,
      });

      // Add face snapshot
      formData.append('faceSnapshot', {
        uri: Platform.OS === 'ios' ? faceSnapshot.uri.replace('file://', '') : faceSnapshot.uri,
        type: 'image/jpeg',
        name: `face_${Date.now()}.jpg`,
      });

      const response = await markAttendance(formData);

      Alert.alert(
        'Success! ✅',
        'Your attendance has been marked successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('StudentDashboard'),
          },
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to submit attendance. Please try again.',
        [
          { text: 'Retry', onPress: submitAttendance },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={config.COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={80} color={config.COLORS.textLight} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need access to your camera to verify your attendance.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isRecording || isSubmitting}
        >
          <MaterialIcons name="arrow-back" size={24} color={config.COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Session Info */}
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionName}>{session.name}</Text>
        <Text style={styles.sessionDetails}>
          {session.courseName} • {session.facultyName}
        </Text>
        {distance !== null && (
          <View style={[
            styles.distanceBadge,
            { backgroundColor: isWithinRange ? config.COLORS.success : config.COLORS.danger }
          ]}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={config.COLORS.white}
            />
            <Text style={styles.distanceText}>
              {Math.round(distance)}m away
              {isWithinRange ? ' ✓' : ' • Out of range'}
            </Text>
          </View>
        )}
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            mode="video"
          >
            {/* Face Guide Overlay */}
            {step === 'prepare' && (
              <View style={styles.faceGuide}>
                <View style={styles.faceGuideCorner} style={[styles.faceGuideCorner, styles.topLeft]} />
                <View style={[styles.faceGuideCorner, styles.topRight]} />
                <View style={[styles.faceGuideCorner, styles.bottomLeft]} />
                <View style={[styles.faceGuideCorner, styles.bottomRight]} />
              </View>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <Animated.View
                style={[
                  styles.recordingIndicator,
                  { transform: [{ scale: recordingPulse }] }
                ]}
              >
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>RECORDING</Text>
              </Animated.View>
            )}

            {/* Countdown */}
            {isRecording && countdown > 0 && (
              <Animated.View
                style={[
                  styles.countdownContainer,
                  { transform: [{ scale: countdownScale }] }
                ]}
              >
                <Text style={styles.countdownText}>{countdown}</Text>
              </Animated.View>
            )}
          </CameraView>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        {step === 'prepare' && (
          <>
            <Text style={styles.instructionTitle}>Position Your Face</Text>
            <Text style={styles.instructionText}>
              Make sure your face is clearly visible within the frame
            </Text>
          </>
        )}
        {step === 'recording' && (
          <>
            <Text style={styles.instructionTitle}>Hold Still</Text>
            <Text style={styles.instructionText}>
              Keep your face in frame until recording completes
            </Text>
          </>
        )}
        {step === 'recorded' && (
          <>
            <Text style={styles.instructionTitle}>Recording Complete! ✓</Text>
            <Text style={styles.instructionText}>
              Review and submit your attendance
            </Text>
          </>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {step === 'prepare' && (
          <Animated.View style={{ transform: [{ scale: recordButtonScale }] }}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                !isWithinRange && styles.recordButtonDisabled
              ]}
              onPress={startRecording}
              disabled={!isWithinRange || isRecording}
            >
              <View style={styles.recordButtonInner}>
                <MaterialIcons
                  name="fiber-manual-record"
                  size={40}
                  color={config.COLORS.white}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.recordButtonLabel}>
              {isWithinRange ? 'Tap to Record' : 'Move Closer'}
            </Text>
          </Animated.View>
        )}

        {step === 'recording' && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopRecording}
          >
            <View style={styles.stopButtonInner} />
          </TouchableOpacity>
        )}

        {step === 'recorded' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={retake}
            >
              <MaterialIcons name="refresh" size={24} color={config.COLORS.primary} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={submitAttendance}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={config.COLORS.white} />
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={24} color={config.COLORS.white} />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={config.COLORS.primary} />
            <Text style={styles.loadingText}>Submitting Attendance...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.COLORS.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: config.COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  sessionInfo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sessionName: {
    fontSize: 20,
    fontWeight: '700',
    color: config.COLORS.white,
    marginBottom: 5,
  },
  sessionDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanceText: {
    color: config.COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cameraWrapper: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: config.COLORS.primary,
    shadowColor: config.COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    right: '15%',
    bottom: '20%',
  },
  faceGuideCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: config.COLORS.white,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.COLORS.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: config.COLORS.white,
    marginRight: 8,
  },
  recordingText: {
    color: config.COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -50,
    marginTop: -50,
  },
  countdownText: {
    fontSize: 60,
    fontWeight: '700',
    color: config.COLORS.white,
  },
  instructions: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: config.COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  controls: {
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: config.COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: config.COLORS.white,
    shadowColor: config.COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  recordButtonDisabled: {
    backgroundColor: config.COLORS.textLight,
    shadowColor: config.COLORS.textLight,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonLabel: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
    color: config.COLORS.white,
    textAlign: 'center',
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: config.COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: config.COLORS.white,
  },
  stopButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: config.COLORS.white,
    borderRadius: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    gap: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: config.COLORS.primary,
  },
  retakeButtonText: {
    color: config.COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: config.COLORS.success,
    borderWidth: 2,
    borderColor: config.COLORS.success,
  },
  submitButtonText: {
    color: config.COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: config.COLORS.white,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: config.COLORS.text,
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: config.COLORS.textLight,
    marginTop: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: config.COLORS.background,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: config.COLORS.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: config.COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: config.COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: config.COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
