import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '../../config';

const { width } = Dimensions.get('window');

const ReportsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageAttendance: 0,
    onTimePercentage: 0,
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    end: new Date().toISOString().split('T')[0], // Today
  });
  const [departmentStats, setDepartmentStats] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDate, setSelectingDate] = useState('start'); // 'start' or 'end'

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
        setDepartmentStats(response.data.departmentStats || []);
        setMonthlyTrend(response.data.monthlyTrend || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const handleDateSelect = (day) => {
    if (selectingDate === 'start') {
      setDateRange(prev => ({ ...prev, start: day.dateString }));
      setSelectingDate('end');
    } else {
      setDateRange(prev => ({ ...prev, end: day.dateString }));
      setShowCalendar(false);
      setSelectingDate('start');
    }
  };

  const getAttendanceRate = () => {
    if (analytics.totalEmployees === 0) return 0;
    return ((analytics.presentToday / analytics.totalEmployees) * 100).toFixed(1);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const DepartmentCard = ({ name, present, total, rate }) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentName}>{name}</Text>
        <Text style={styles.departmentRate}>{rate}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${rate}%` }]} />
      </View>
      <Text style={styles.departmentStats}>
        {present} / {total} employees present
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
          <Icon name="calendar-range" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectingDate('start');
            setShowCalendar(true);
          }}
        >
          <Icon name="calendar-start" size={20} color="#2196F3" />
          <Text style={styles.dateText}>{dateRange.start}</Text>
        </TouchableOpacity>
        <Icon name="arrow-right" size={20} color="#666" />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectingDate('end');
            setShowCalendar(true);
          }}
        >
          <Icon name="calendar-end" size={20} color="#2196F3" />
          <Text style={styles.dateText}>{dateRange.end}</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [dateRange.start]: { selected: true, selectedColor: '#4CAF50' },
              [dateRange.end]: { selected: true, selectedColor: '#F44336' },
            }}
            maxDate={new Date().toISOString().split('T')[0]}
            theme={{
              selectedDayBackgroundColor: '#2196F3',
              todayTextColor: '#2196F3',
              arrowColor: '#2196F3',
            }}
          />
          <TouchableOpacity
            style={styles.closeCalendarButton}
            onPress={() => setShowCalendar(false)}
          >
            <Text style={styles.closeCalendarText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Employees"
              value={analytics.totalEmployees}
              icon="account-group"
              color="#2196F3"
            />
            <StatCard
              title="Present Today"
              value={analytics.presentToday}
              icon="check-circle"
              color="#4CAF50"
              subtitle={`${getAttendanceRate()}%`}
            />
            <StatCard
              title="Absent Today"
              value={analytics.absentToday}
              icon="close-circle"
              color="#F44336"
            />
            <StatCard
              title="Late Arrivals"
              value={analytics.lateToday}
              icon="clock-alert"
              color="#FF9800"
            />
          </View>
        </View>

        {/* Period Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Period Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Avg. Attendance"
              value={`${analytics.averageAttendance}%`}
              icon="chart-line"
              color="#9C27B0"
            />
            <StatCard
              title="On-Time Rate"
              value={`${analytics.onTimePercentage}%`}
              icon="timer-check"
              color="#00BCD4"
            />
          </View>
        </View>

        {/* Department Statistics */}
        {departmentStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Department Breakdown</Text>
            {departmentStats.map((dept, index) => (
              <DepartmentCard
                key={index}
                name={dept.name}
                present={dept.present}
                total={dept.total}
                rate={dept.rate}
              />
            ))}
          </View>
        )}

        {/* Monthly Trend */}
        {monthlyTrend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Trend</Text>
            <View style={styles.trendContainer}>
              {monthlyTrend.map((month, index) => (
                <View key={index} style={styles.trendItem}>
                  <Text style={styles.trendMonth}>{month.name}</Text>
                  <View style={styles.trendBarContainer}>
                    <View
                      style={[
                        styles.trendBar,
                        { height: `${month.rate}%`, backgroundColor: '#4CAF50' },
                      ]}
                    />
                  </View>
                  <Text style={styles.trendRate}>{month.rate}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DetailedReports')}
          >
            <Icon name="file-chart" size={24} color="#2196F3" />
            <Text style={styles.actionButtonText}>View Detailed Reports</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ExportData')}
          >
            <Icon name="download" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Export Data</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 4,
  },
  closeCalendarButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeCalendarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width - 48) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  departmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  departmentRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  departmentStats: {
    fontSize: 14,
    color: '#666',
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendMonth: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  trendBarContainer: {
    height: 100,
    width: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  trendBar: {
    width: '100%',
    borderRadius: 4,
  },
  trendRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ReportsScreen;
