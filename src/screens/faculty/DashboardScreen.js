import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { getActiveSession, startSession, endSession, getSessionStats } from '../../services/api';
import config from '../../config/constants';

const { width } = Dimensions.get('window');

const FacultyDashboard = ({ navigation }) => {
  // State management
  const [activeSession, setActiveSession] = useState(null);
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAttendance: 0,
    todaySessions: 0,
    todayAttendance: 0,
  });
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    fetchActiveSession();
    fetchStats();
  }, []);

  useEffect(() => {
    let interval;
    if (activeSession) {
      // Poll for attendance updates every 10 seconds when session is active
      interval = setInterval(() => {
        fetchActiveSession();
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to start sessions.'
        );
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Location fetch error:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  // Fetch active session
  const fetchActiveSession = async () => {
    try {
      const response = await getActiveSession();
      if (response.data.session) {
        setActiveSession(response.data.session);
      } else {
        setActiveSession(null);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Fetch active session error:', error);
      }
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getSessionStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchActiveSession(), fetchStats()]);
    setRefreshing(false);
  };

  // Start session
  const handleStartSession = async () => {
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Please enter a subject name');
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Please wait for location to be detected');
      await getCurrentLocation();
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        subject: subject.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await startSession(sessionData);
      setActiveSession(response.data.session);
      setSubject('');
      Alert.alert('Success', 'Session started successfully!');
      await fetchStats();
    } catch (error) {
      console.error('Start session error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to start session'
      );
    } finally {
      setLoading(false);
    }
  };

  // End session
  const handleEndSession = async () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await endSession(activeSession._id);
              setActiveSession(null);
              Alert.alert('Success', 'Session ended successfully!');
              await fetchStats();
            } catch (error) {
              console.error('End session error:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to end session'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate session duration
  const getSessionDuration = () => {
    if (!activeSession?.startTime) return '0m';
    const start = new Date(activeSession.startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60);
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[config.COLORS.primary, config.COLORS.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Faculty Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your sessions</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Active Session Card */}
        {activeSession ? (
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.activeSessionCard}
          >
            <View style={styles.activeSessionHeader}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulse} />
                <Text style={styles.activeSessionBadge}>● LIVE</Text>
              </View>
              <Text style={styles.sessionDuration}>{getSessionDuration()}</Text>
            </View>

            <Text style={styles.activeSessionSubject}>{activeSession.subject}</Text>

            <View style={styles.activeSessionStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeSession.attendanceCount || 0}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(activeSession.startTime)}</Text>
                <Text style={styles.statLabel}>Started</Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>
                {location
                  ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                  : 'Getting location...'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.endButton}
              onPress={handleEndSession}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.endButtonText}>End Session</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          /* Start Session Card */
          <LinearGradient
            colors={[config.COLORS.primary, config.COLORS.secondary]}
            style={styles.startSessionCard}
          >
            <Text style={styles.startSessionTitle}>Start New Session</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subject Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Computer Science 101"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={subject}
                onChangeText={setSubject}
                editable={!loading}
              />
            </View>

            <View style={styles.locationStatus}>
              <Text style={styles.locationStatusIcon}>
                {location ? '✓' : '○'}
              </Text>
              <Text style={styles.locationStatusText}>
                {location
                  ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Detecting location...'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.startButton,
                (!location || !subject.trim() || loading) && styles.startButtonDisabled,
              ]}
              onPress={handleStartSession}
              disabled={!location || !subject.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color={config.COLORS.primary} />
              ) : (
                <>
                  <Text style={styles.startButtonText}>Start Session</Text>
                  <Text style={styles.startButtonIcon}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.statCard}
          >
            <Text style={styles.statCardValue}>{stats.totalSessions}</Text>
            <Text style={styles.statCardLabel}>Total Sessions</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.statCard}
          >
            <Text style={styles.statCardValue}>{stats.totalAttendance}</Text>
            <Text style={styles.statCardLabel}>Total Attendance</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#ec4899', '#db2777']}
            style={styles.statCard}
          >
            <Text style={styles.statCardValue}>{stats.todaySessions}</Text>
            <Text style={styles.statCardLabel}>Today's Sessions</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.statCard}
          >
            <Text style={styles.statCardValue}>{stats.todayAttendance}</Text>
            <Text style={styles.statCardLabel}>Today's Attendance</Text>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SessionHistory')}
          >
            <Text style={styles.actionButtonIcon}>📊</Text>
            <Text style={styles.actionButtonText}>Session History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.actionButtonIcon}>📈</Text>
            <Text style={styles.actionButtonText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 20,
  },
  // Active Session Styles
  activeSessionCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  activeSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  activeSessionBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activeSessionSubject: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  activeSessionStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#fff',
    flex: 1,
  },
  endButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Start Session Styles
  startSessionCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  startSessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  locationStatusIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
    fontWeight: 'bold',
  },
  locationStatusText: {
    fontSize: 13,
    color: '#fff',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: config.COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  startButtonIcon: {
    fontSize: 18,
    color: config.COLORS.primary,
    fontWeight: 'bold',
  },
  // Statistics Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: config.COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FacultyDashboard;
