import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  useEffect(() => {
    loadAttendanceHistory();
  }, []);

  const loadAttendanceHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const studentId = await AsyncStorage.getItem('studentId');

      if (!token || !studentId) {
        console.error('Missing authentication');
        return;
      }

      const response = await axios.get(
        `${API_URL}/attendance/student/${studentId}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setAttendanceData(data);
        processAttendanceData(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading attendance history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processAttendanceData = (data) => {
    const marked = {};
    
    data.forEach((record) => {
      const date = record.date.split('T')[0]; // Extract YYYY-MM-DD
      let color = '#4CAF50'; // Green for present
      
      if (record.status === 'absent') {
        color = '#F44336'; // Red for absent
      } else if (record.status === 'late') {
        color = '#FF9800'; // Orange for late
      }

      marked[date] = {
        marked: true,
        dotColor: color,
        selected: selectedDate === date,
        selectedColor: color,
      };
    });

    setMarkedDates(marked);
  };

  const calculateStats = (data) => {
    const present = data.filter(r => r.status === 'present').length;
    const absent = data.filter(r => r.status === 'absent').length;
    const late = data.filter(r => r.status === 'late').length;

    setStats({
      present,
      absent,
      late,
      total: data.length,
    });
  };

  const onDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    
    // Update marked dates to highlight selected
    const updated = { ...markedDates };
    Object.keys(updated).forEach(key => {
      updated[key].selected = key === date;
    });
    setMarkedDates(updated);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendanceHistory();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return { name: 'check-circle', color: '#4CAF50' };
      case 'absent':
        return { name: 'close-circle', color: '#F44336' };
      case 'late':
        return { name: 'clock-alert', color: '#FF9800' };
      default:
        return { name: 'help-circle', color: '#9E9E9E' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRecords = selectedDate
    ? attendanceData.filter(r => r.date.startsWith(selectedDate))
    : attendanceData;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading attendance history...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="check-circle" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.present}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
          <Icon name="close-circle" size={32} color="#F44336" />
          <Text style={styles.statNumber}>{stats.absent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="clock-alert" size={32} color="#FF9800" />
          <Text style={styles.statNumber}>{stats.late}</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="calendar-check" size={32} color="#2196F3" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Attendance Rate */}
      {stats.total > 0 && (
        <View style={styles.rateContainer}>
          <Text style={styles.rateLabel}>Attendance Rate</Text>
          <Text style={styles.rateValue}>
            {((stats.present / stats.total) * 100).toFixed(1)}%
          </Text>
        </View>
      )}

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2196F3',
            selectedDayBackgroundColor: '#2196F3',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2196F3',
            dayTextColor: '#2c3e50',
            textDisabledColor: '#d9e1e8',
            dotColor: '#2196F3',
            selectedDotColor: '#ffffff',
            arrowColor: '#2196F3',
            monthTextColor: '#2c3e50',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          markingType="dot"
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Late</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
      </View>

      {/* Records List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {selectedDate ? `Records for ${formatDate(selectedDate)}` : 'All Records'}
        </Text>
        {selectedDate && (
          <TouchableOpacity onPress={() => setSelectedDate('')}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Attendance Records List */}
      <View style={styles.recordsContainer}>
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-remove" size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>
              {selectedDate
                ? 'No attendance records for this date'
                : 'No attendance history available'}
            </Text>
          </View>
        ) : (
          filteredRecords.map((record, index) => {
            const statusIcon = getStatusIcon(record.status);
            return (
              <View key={index} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordDateContainer}>
                    <Icon name="calendar" size={20} color="#757575" />
                    <Text style={styles.recordDate}>
                      {formatDate(record.date)}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Icon
                      name={statusIcon.name}
                      size={24}
                      color={statusIcon.color}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusIcon.color },
                      ]}
                    >
                      {record.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.recordDetails}>
                  {record.checkInTime && (
                    <View style={styles.detailRow}>
                      <Icon name="login" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Check In:</Text>
                      <Text style={styles.detailValue}>
                        {formatTime(record.checkInTime)}
                      </Text>
                    </View>
                  )}

                  {record.checkOutTime && (
                    <View style={styles.detailRow}>
                      <Icon name="logout" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Check Out:</Text>
                      <Text style={styles.detailValue}>
                        {formatTime(record.checkOutTime)}
                      </Text>
                    </View>
                  )}

                  {record.subject && (
                    <View style={styles.detailRow}>
                      <Icon name="book-open-variant" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Subject:</Text>
                      <Text style={styles.detailValue}>{record.subject}</Text>
                    </View>
                  )}

                  {record.notes && (
                    <View style={styles.notesContainer}>
                      <Icon name="note-text" size={18} color="#757575" />
                      <Text style={styles.notesText}>{record.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#212121',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  rateContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rateLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calendarContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#757575',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  clearButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  recordsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  recordDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordDate: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});

export default HistoryScreen;
