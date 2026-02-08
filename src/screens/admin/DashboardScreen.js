import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard-stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, gradient, onPress }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient colors={gradient} style={styles.statGradient}>
        <View style={styles.statContent}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={32} color="#fff" />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ActionButton = ({ title, icon, gradient, onPress }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient colors={gradient} style={styles.actionGradient}>
        <Ionicons name={icon} size={28} color="#fff" />
        <Text style={styles.actionText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your workspace</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="people"
            gradient={['#667eea', '#764ba2']}
            onPress={() => navigation.navigate('UserManagement')}
          />
          <StatCard
            title="Active Today"
            value={stats.activeToday}
            icon="checkmark-circle"
            gradient={['#f093fb', '#f5576c']}
            onPress={() => navigation.navigate('AttendanceList')}
          />
          <StatCard
            title="Departments"
            value={stats.totalDepartments}
            icon="business"
            gradient={['#4facfe', '#00f2fe']}
            onPress={() => navigation.navigate('Departments')}
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon="calendar"
            gradient={['#43e97b', '#38f9d7']}
            onPress={() => navigation.navigate('LeaveRequests')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Management</Text>
          <View style={styles.actionsGrid}>
            <ActionButton
              title="Add User"
              icon="person-add"
              gradient={['#667eea', '#764ba2']}
              onPress={() => navigation.navigate('AddUser')}
            />
            <ActionButton
              title="View All Users"
              icon="people-outline"
              gradient={['#f093fb', '#f5576c']}
              onPress={() => navigation.navigate('UserManagement')}
            />
            <ActionButton
              title="Departments"
              icon="business-outline"
              gradient={['#4facfe', '#00f2fe']}
              onPress={() => navigation.navigate('Departments')}
            />
            <ActionButton
              title="Roles & Permissions"
              icon="shield-checkmark"
              gradient={['#43e97b', '#38f9d7']}
              onPress={() => navigation.navigate('Roles')}
            />
          </View>
        </View>

        {/* Attendance Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Management</Text>
          <View style={styles.actionsGrid}>
            <ActionButton
              title="View Attendance"
              icon="list"
              gradient={['#fa709a', '#fee140']}
              onPress={() => navigation.navigate('AttendanceList')}
            />
            <ActionButton
              title="Reports"
              icon="stats-chart"
              gradient={['#30cfd0', '#330867']}
              onPress={() => navigation.navigate('Reports')}
            />
            <ActionButton
              title="Leave Requests"
              icon="calendar-outline"
              gradient={['#a8edea', '#fed6e3']}
              onPress={() => navigation.navigate('LeaveRequests')}
            />
            <ActionButton
              title="Settings"
              icon="settings"
              gradient={['#ff9a9e', '#fecfef']}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('AttendanceList')}
          >
            <Ionicons name="time-outline" size={24} color="#667eea" />
            <Text style={styles.linkText}>Today's Attendance</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="document-text-outline" size={24} color="#667eea" />
            <Text style={styles.linkText}>Generate Reports</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Ionicons name="person-outline" size={24} color="#667eea" />
            <Text style={styles.linkText}>Manage Users</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 45) / 2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statGradient: {
    padding: 20,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: 15,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 55) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  linkText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default DashboardScreen;
