import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { getNearbySessions, getAttendanceStats } from '../../services/api';
import config from '../../config/constants';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbySessions, setNearbySessions] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    attended: 0,
    percentage: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    await Promise.all([
      getLocationAndSessions(),
      fetchStats(),
    ]);
    setLoading(false);
  };

  const getLocationAndSessions = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find nearby sessions.');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation.coords);

      // Fetch nearby sessions
      const response = await getNearbySessions(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      setNearbySessions(response.data.sessions || []);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location or nearby sessions.');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getAttendanceStats();
      setStats(response.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeDashboard();
    setRefreshing(false);
  };

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

    return Math.round(R * c); // Distance in meters
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return config.COLORS.success;
    if (percentage >= 50) return '#f59e0b';
    return config.COLORS.danger;
  };

  const handleMarkAttendance = (session) => {
    if (!location) {
      Alert.alert('Error', 'Location not available. Please enable GPS.');
      return;
    }

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      session.latitude,
      session.longitude
    );

    if (distance > config.GEOFENCE_RADIUS) {
      Alert.alert(
        'Too Far',
        `You are ${distance}m away. You must be within ${config.GEOFENCE_RADIUS}m to mark attendance.`
      );
      return;
    }

    navigation.navigate('MarkAttendance', { session, location });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={config.COLORS.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[config.COLORS.primary]}
          tintColor={config.COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Student!</Text>
          <Text style={styles.subtitle}>Track your attendance</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={40} color={config.COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Attendance Percentage Card */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.largeCard]}
        >
          <View style={styles.statCardHeader}>
            <Ionicons name="pie-chart" size={24} color="white" />
            <Text style={styles.statCardTitle}>Attendance Rate</Text>
          </View>
          <Text style={styles.percentageText}>{stats.percentage}%</Text>
          <Text style={styles.statCardSubtitle}>
            {stats.attended} of {stats.totalClasses} classes attended
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(stats.percentage, 100)}%` },
              ]}
            />
          </View>
        </LinearGradient>

        <View style={styles.smallCardsRow}>
          {/* Total Classes Card */}
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.smallCardContent}>
              <Ionicons name="book" size={28} color="white" />
              <Text style={styles.smallCardNumber}>{stats.totalClasses}</Text>
              <Text style={styles.smallCardLabel}>Total Classes</Text>
            </View>
          </LinearGradient>

          {/* This Month Card */}
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.smallCardContent}>
              <Ionicons name="calendar" size={28} color="white" />
              <Text style={styles.smallCardNumber}>{stats.thisMonth}</Text>
              <Text style={styles.smallCardLabel}>This Month</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MyAttendance')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="list" size={24} color={config.COLORS.primary} />
            </View>
            <Text style={styles.actionLabel}>My Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="qr-code" size={24} color={config.COLORS.success} />
            </View>
            <Text style={styles.actionLabel}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onRefresh()}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="refresh" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionLabel}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="settings" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nearby Sessions */}
      <View style={styles.nearbyContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Sessions</Text>
          {location && (
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color={config.COLORS.success} />
              <Text style={styles.locationText}>GPS Active</Text>
            </View>
          )}
        </View>

        {nearbySessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={config.COLORS.textLight} />
            <Text style={styles.emptyStateText}>No nearby sessions</Text>
            <Text style={styles.emptyStateSubtext}>
              Pull down to refresh or check back later
            </Text>
          </View>
        ) : (
          nearbySessions.map((session) => {
            const distance = location
              ? calculateDistance(
                  location.latitude,
                  location.longitude,
                  session.latitude,
                  session.longitude
                )
              : null;

            const isInRange = distance && distance <= config.GEOFENCE_RADIUS;

            return (
              <TouchableOpacity
                key={session._id}
                style={[styles.sessionCard, isInRange && styles.sessionCardActive]}
                onPress={() => handleMarkAttendance(session)}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionTitleContainer}>
                    <Ionicons
                      name="school"
                      size={24}
                      color={isInRange ? config.COLORS.success : config.COLORS.primary}
                    />
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionSubject}>{session.subject}</Text>
                      <Text style={styles.sessionFaculty}>
                        {session.facultyName || 'Faculty'}
                      </Text>
                    </View>
                  </View>
                  {isInRange && (
                    <View style={styles.inRangeBadge}>
                      <Text style={styles.inRangeText}>In Range</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sessionDetails}>
                  <View style={styles.sessionDetailItem}>
                    <Ionicons name="location" size={16} color={config.COLORS.textLight} />
                    <Text style={styles.sessionDetailText}>
                      {distance ? `${distance}m away` : 'Calculating...'}
                    </Text>
                  </View>
                  <View style={styles.sessionDetailItem}>
                    <Ionicons name="time" size={16} color={config.COLORS.textLight} />
                    <Text style={styles.sessionDetailText}>
                      {new Date(session.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>

                {isInRange && (
                  <View style={styles.sessionFooter}>
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.markAttendanceButton}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                      <Text style={styles.markAttendanceText}>Mark Attendance</Text>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.COLORS.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: config.COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: config.COLORS.white,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: config.COLORS.dark,
  },
  subtitle: {
    fontSize: 14,
    color: config.COLORS.textLight,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  largeCard: {
    minHeight: 160,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardTitle: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  statCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  smallCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  smallCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  smallCardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  smallCardLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: config.COLORS.dark,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: config.COLORS.text,
    textAlign: 'center',
  },
  nearbyContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: config.COLORS.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: config.COLORS.white,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: config.COLORS.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: config.COLORS.textLight,
    marginTop: 8,
  },
  sessionCard: {
    backgroundColor: config.COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sessionCardActive: {
    borderColor: config.COLORS.success,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: config.COLORS.dark,
  },
  sessionFaculty: {
    fontSize: 13,
    color: config.COLORS.textLight,
    marginTop: 2,
  },
  inRangeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inRangeText: {
    fontSize: 11,
    color: config.COLORS.success,
    fontWeight: '600',
  },
  sessionDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  sessionDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailText: {
    fontSize: 13,
    color: config.COLORS.textLight,
    marginLeft: 4,
  },
  sessionFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: config.COLORS.border,
  },
  markAttendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  markAttendanceText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DashboardScreen;
