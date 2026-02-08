import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const ReportsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    attendanceTrend: [],
    classDistribution: [],
    studentEngagement: [],
    courseStats: [],
  });
  const [summaryStats, setSummaryStats] = useState({
    totalClasses: 0,
    averageAttendance: 0,
    totalStudents: 0,
    presentToday: 0,
  });

  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod, selectedCourse]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      // Fetch courses
      const coursesResponse = await axios.get(
        'https://kparkit.com/attendance-mobile/api/faculty/courses.php',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(coursesResponse.data.courses || []);

      // Fetch analytics data
      const analyticsResponse = await axios.get(
        'https://kparkit.com/attendance-mobile/api/faculty/reports.php',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: selectedPeriod, course_id: selectedCourse },
        }
      );

      const data = analyticsResponse.data;
      setAnalyticsData(data.analytics || {});
      setSummaryStats(data.summary || {});
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to load reports data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportsData();
  };

  const renderSummaryCard = (title, value, icon, color) => (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={32} color={color} />
      <View style={styles.summaryContent}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderAttendanceTrendChart = () => {
    if (!analyticsData.attendanceTrend || analyticsData.attendanceTrend.length === 0) {
      return <Text style={styles.noDataText}>No trend data available</Text>;
    }

    const labels = analyticsData.attendanceTrend.map(item => item.label);
    const data = analyticsData.attendanceTrend.map(item => item.percentage);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Attendance Trend</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [{
              data: data,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              strokeWidth: 3,
            }],
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#2e7d32',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderClassDistributionChart = () => {
    if (!analyticsData.classDistribution || analyticsData.classDistribution.length === 0) {
      return <Text style={styles.noDataText}>No distribution data available</Text>;
    }

    const labels = analyticsData.classDistribution.map(item => item.course_code);
    const data = analyticsData.classDistribution.map(item => item.class_count);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Classes by Course</Text>
        <BarChart
          data={{
            labels: labels,
            datasets: [{
              data: data,
            }],
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </View>
    );
  };

  const renderEngagementPieChart = () => {
    if (!analyticsData.studentEngagement || analyticsData.studentEngagement.length === 0) {
      return <Text style={styles.noDataText}>No engagement data available</Text>;
    }

    const pieData = analyticsData.studentEngagement.map((item, index) => ({
      name: item.category,
      population: item.count,
      color: ['#4caf50', '#ff9800', '#f44336', '#9e9e9e'][index % 4],
      legendFontColor: '#333',
      legendFontSize: 14,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Student Engagement</Text>
        <PieChart
          data={pieData}
          width={width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        <View style={styles.legendContainer}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}: {item.population}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCourseStats = () => {
    if (!analyticsData.courseStats || analyticsData.courseStats.length === 0) {
      return <Text style={styles.noDataText}>No course statistics available</Text>;
    }

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.chartTitle}>Course Statistics</Text>
        {analyticsData.courseStats.map((course, index) => (
          <View key={index} style={styles.courseStatCard}>
            <View style={styles.courseStatHeader}>
              <Text style={styles.courseStatName}>{course.course_name}</Text>
              <Text style={styles.courseStatCode}>{course.course_code}</Text>
            </View>
            <View style={styles.courseStatRow}>
              <View style={styles.courseStatItem}>
                <Text style={styles.courseStatLabel}>Classes</Text>
                <Text style={styles.courseStatValue}>{course.total_classes}</Text>
              </View>
              <View style={styles.courseStatItem}>
                <Text style={styles.courseStatLabel}>Avg Attendance</Text>
                <Text style={[styles.courseStatValue, { color: getAttendanceColor(course.avg_attendance) }]}>
                  {course.avg_attendance}%
                </Text>
              </View>
              <View style={styles.courseStatItem}>
                <Text style={styles.courseStatLabel}>Students</Text>
                <Text style={styles.courseStatValue}>{course.enrolled_students}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Reports...</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faculty Reports & Analytics</Text>
        <Text style={styles.headerSubtitle}>Performance insights and trends</Text>
      </View>

      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Period:</Text>
          <Picker
            selectedValue={selectedPeriod}
            style={styles.picker}
            onValueChange={(value) => setSelectedPeriod(value)}
          >
            <Picker.Item label="This Week" value="week" />
            <Picker.Item label="This Month" value="month" />
            <Picker.Item label="This Semester" value="semester" />
            <Picker.Item label="This Year" value="year" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Course:</Text>
          <Picker
            selectedValue={selectedCourse}
            style={styles.picker}
            onValueChange={(value) => setSelectedCourse(value)}
          >
            <Picker.Item label="All Courses" value="all" />
            {courses.map((course) => (
              <Picker.Item
                key={course.id}
                label={course.course_code}
                value={course.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        {renderSummaryCard('Total Classes', summaryStats.totalClasses, 'class', '#2196F3')}
        {renderSummaryCard('Avg Attendance', `${summaryStats.averageAttendance}%`, 'trending-up', '#4caf50')}
        {renderSummaryCard('Total Students', summaryStats.totalStudents, 'people', '#ff9800')}
        {renderSummaryCard('Present Today', summaryStats.presentToday, 'check-circle', '#9c27b0')}
      </View>

      {/* Charts */}
      {renderAttendanceTrendChart()}
      {renderClassDistributionChart()}
      {renderEngagementPieChart()}
      {renderCourseStats()}

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Icon name="file-download" size={24} color="#fff" />
        <Text style={styles.exportButtonText}>Export Report (PDF)</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 5,
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  pickerWrapper: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
  },
  summaryContent: {
    marginLeft: 15,
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
  },
  legendContainer: {
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  courseStatCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  courseStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  courseStatCode: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseStatItem: {
    alignItems: 'center',
  },
  courseStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  courseStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ReportsScreen;
