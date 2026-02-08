import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SessionCard = ({ 
  date,
  checkIn,
  checkOut,
  duration,
  status = 'completed', // completed, active, pending
  location,
  onPress,
  style 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'active':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      default:
        return '#4caf50';
    }
  };

  const getStatusGradient = () => {
    switch (status) {
      case 'completed':
        return ['#4caf50', '#66bb6a'];
      case 'active':
        return ['#2196f3', '#42a5f5'];
      case 'pending':
        return ['#ff9800', '#ffa726'];
      default:
        return ['#4caf50', '#66bb6a'];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Status indicator */}
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        
        <View style={styles.content}>
          {/* Date section */}
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>{date}</Text>
            <View style={styles.statusBadge}>
              <LinearGradient
                colors={getStatusGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.statusGradient}
              >
                <Text style={styles.statusText}>{status.toUpperCase()}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Time details */}
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Check In</Text>
                <Text style={styles.timeValue}>{checkIn || '--:--'}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Check Out</Text>
                <Text style={styles.timeValue}>{checkOut || '--:--'}</Text>
              </View>
            </View>

            {duration && (
              <View style={styles.durationContainer}>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>⏱ {duration}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Location */}
          {location && (
            <View style={styles.locationSection}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeCircle} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  content: {
    marginLeft: 8,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  timeSection: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 10,
    borderRadius: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    top: -20,
    right: -20,
  },
});

export default SessionCard;
