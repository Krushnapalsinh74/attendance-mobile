import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    biometric: false,
    autoSync: true,
    darkMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadPreferences();
    loadUserInfo();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('userPreferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
        setUserEmail(userData.email || '');
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const savePreference = async (key, value) => {
    try {
      const updated = { ...preferences, [key]: value };
      setPreferences(updated);
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preference:', error);
      Alert.alert('Error', 'Failed to save preference');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['authToken', 'userData']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('cachedData');
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress, rightComponent }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#2196F3" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const SettingToggle = ({ icon, title, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#2196F3" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#ddd', true: '#81C784' }}
        thumbColor={value ? '#4CAF50' : '#f4f3f4'}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#2196F3" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingToggle
          icon="notifications-outline"
          title="Push Notifications"
          value={preferences.notifications}
          onToggle={(value) => savePreference('notifications', value)}
        />

        <SettingToggle
          icon="finger-print-outline"
          title="Biometric Login"
          value={preferences.biometric}
          onToggle={(value) => savePreference('biometric', value)}
        />

        <SettingToggle
          icon="sync-outline"
          title="Auto Sync"
          value={preferences.autoSync}
          onToggle={(value) => savePreference('autoSync', value)}
        />

        <SettingToggle
          icon="moon-outline"
          title="Dark Mode"
          value={preferences.darkMode}
          onToggle={(value) => savePreference('darkMode', value)}
        />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />

        <SettingItem
          icon="lock-closed-outline"
          title="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <SettingItem
          icon="trash-outline"
          title="Clear Cache"
          onPress={handleClearCache}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />

        <SettingItem
          icon="download-outline"
          title="Export Data"
          onPress={() => Alert.alert('Info', 'Export feature coming soon')}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingItem
          icon="information-circle-outline"
          title="App Version"
          rightComponent={<Text style={styles.versionText}>1.0.0</Text>}
        />

        <SettingItem
          icon="document-text-outline"
          title="Terms & Conditions"
          onPress={() => Alert.alert('Info', 'Terms & Conditions')}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Info', 'Privacy Policy')}
          rightComponent={
            <Ionicons name="chevron-forward" size={24} color="#999" />
          }
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default SettingsScreen;
