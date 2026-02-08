import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import { getSessionHistory } from '../../services/api';

const HistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState({});

  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    try {
      setLoading(true);
      const response = await getSessionHistory(user.id);
      if (response.success) {
        setSessions(response.sessions);
      } else {
        Alert.alert('Error', response.message || 'Failed to load session history');
      }
    } catch (error) {
      console.error('Load session history error:', error);
      Alert.alert('Error', 'Failed to load session history');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessionHistory();
    setRefreshing(false);
  };

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      case 'late':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return 'check-circle';
      case 'absent':
        return 'close-circle';
      case 'late':
        return 'clock-alert';
      default:
        return 'help-circle';
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = (attendance) => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

    return { total, present, absent, late, percentage };
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.attendanceLeft}>
        <Icon
          name={getStatusIcon(item.status)}
          size={20}
          color={getStatusColor(item.status)}
        />
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.student_name}</Text>
          <Text style={styles.studentId}>ID: {item.student_id}</Text>
        </View>
      </View>
      {item.marked_at && (
        <Text style={styles.markedTime}>{formatTime(item.marked_at)}</Text>
      )}
    </View>
  );

  const renderSessionItem = ({ item }) => {
    const isExpanded = expandedSessions[item.id];
    const stats = calculateStats(item.attendance || []);

    return (
      <View style={styles.sessionCard}>
        <TouchableOpacity
          style={styles.sessionHeader}
          onPress={() => toggleSession(item.id)}
        >
          <View style={styles.sessionHeaderLeft}>
            <Icon name="calendar-clock" size={24} color="#2196F3" />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionCourse}>{item.course_name}</Text>
              <Text style={styles.sessionDate}>{formatDate(item.session_date)}</Text>
            </View>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {stats.present}
            </Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={[styles.statValue, { color: '#FF9800' }]}>
              {stats.late}
            </Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {stats.absent}
            </Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
        </View>

        <View style={styles.percentageBar}>
          <View
            style={[
              styles.percentageFill,
              { width: `${stats.percentage}%` },
            ]}
          />
          <Text style={styles.percentageText}>{stats.percentage}%</Text>
        </View>

        {isExpanded && item.attendance && item.attendance.length > 0 && (
          <View style={styles.attendanceList}>
            <Text style={styles.attendanceTitle}>Attendance Details</Text>
            <FlatList
              data={item.attendance}
              keyExtractor={(student) => student.student_id.toString()}
              renderItem={renderAttendanceItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {isExpanded && item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading session history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={styles.placeholder} />
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No session history found</Text>
          <Text style={styles.emptySubtext}>
            Your past sessions will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSessionItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 15,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionCourse: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  percentageBar: {
    height: 30,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  percentageFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
  },
  percentageText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    zIndex: 1,
  },
  attendanceList: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentInfo: {
    marginLeft: 10,
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#666',
  },
  markedTime: {
    fontSize: 12,
    color: '#999',
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 15,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HistoryScreen;
