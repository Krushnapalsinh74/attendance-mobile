import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/api';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const studentId = await AsyncStorage.getItem('studentId');

      const response = await fetch(`${API_URL}/student/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'studentId', 'userRole']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const ProfileItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <Icon name={icon} size={24} color="#2196F3" style={styles.itemIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemValue}>{value || 'N/A'}</Text>
        </View>
      </View>
      {onPress && <Icon name="chevron-right" size={24} color="#999" />}
    </TouchableOpacity>
  );

  const SettingsItem = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Icon
          name={icon}
          size={24}
          color={danger ? '#f44336' : '#2196F3'}
          style={styles.itemIcon}
        />
        <Text style={[styles.settingsLabel, danger && styles.dangerText]}>
          {label}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#999" />
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile.avatar ? (
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
              defaultSource={require('../../assets/default-avatar.png')}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('Info', 'Avatar change feature coming soon')}
          >
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRoll}>{profile.roll_number}</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <ProfileItem
            icon="account"
            label="Full Name"
            value={profile.name}
          />
          <ProfileItem
            icon="card-account-details"
            label="Roll Number"
            value={profile.roll_number}
          />
          <ProfileItem
            icon="email"
            label="Email"
            value={profile.email}
          />
          <ProfileItem
            icon="phone"
            label="Phone"
            value={profile.phone}
          />
          <ProfileItem
            icon="book-education"
            label="Class"
            value={profile.class_name}
          />
          <ProfileItem
            icon="google-classroom"
            label="Section"
            value={profile.section}
          />
          <ProfileItem
            icon="calendar"
            label="Admission Date"
            value={profile.admission_date ? new Date(profile.admission_date).toLocaleDateString() : 'N/A'}
          />
        </View>
      </View>

      {/* Attendance Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Overview</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="calendar-check" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{profile.total_present || 0}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="calendar-remove" size={32} color="#f44336" />
            <Text style={styles.statValue}>{profile.total_absent || 0}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="percent" size={32} color="#2196F3" />
            <Text style={styles.statValue}>
              {profile.attendance_percentage
                ? `${profile.attendance_percentage.toFixed(1)}%`
                : '0%'}
            </Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="bell-outline"
            label="Notifications"
            onPress={() => Alert.alert('Info', 'Notifications settings coming soon')}
          />
          <SettingsItem
            icon="lock-outline"
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SettingsItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Alert.alert('Info', 'Help & Support coming soon')}
          />
          <SettingsItem
            icon="information-outline"
            label="About"
            onPress={() => Alert.alert('Attendance App', 'Version 1.0.0\n\nDeveloped for student attendance management')}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <View style={styles.card}>
          <SettingsItem
            icon="logout"
            label="Logout"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileRoll: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dangerText: {
    color: '#f44336',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProfileScreen;
