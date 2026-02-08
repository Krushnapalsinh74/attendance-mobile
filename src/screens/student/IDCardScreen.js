import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IDCardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/profile');
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      Alert.alert('Error', 'Failed to load student information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading ID Card...</Text>
      </View>
    );
  }

  if (!studentData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load ID card</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStudentData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const qrData = JSON.stringify({
    studentId: studentData.id,
    rollNumber: studentData.rollNumber,
    timestamp: Date.now(),
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ID Card Container */}
      <View style={styles.idCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.instituteName}>KPARKIT INSTITUTION</Text>
          <Text style={styles.cardTitle}>STUDENT ID CARD</Text>
        </View>

        {/* Photo Section */}
        <View style={styles.photoSection}>
          {studentData.photo ? (
            <Image
              source={{ uri: studentData.photo }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="person" size={60} color="#CCCCCC" />
            </View>
          )}
        </View>

        {/* Student Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{studentData.name || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Roll No:</Text>
            <Text style={styles.detailValue}>{studentData.rollNumber || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Class:</Text>
            <Text style={styles.detailValue}>
              {studentData.class || 'N/A'} - {studentData.section || 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DOB:</Text>
            <Text style={styles.detailValue}>
              {studentData.dateOfBirth
                ? new Date(studentData.dateOfBirth).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Blood Group:</Text>
            <Text style={styles.detailValue}>{studentData.bloodGroup || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{studentData.contactNumber || 'N/A'}</Text>
          </View>

          {studentData.guardianName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guardian:</Text>
              <Text style={styles.detailValue}>{studentData.guardianName}</Text>
            </View>
          )}

          {studentData.address && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {studentData.address}
              </Text>
            </View>
          )}
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={140}
              backgroundColor="white"
              color="black"
            />
          </View>
          <Text style={styles.qrLabel}>Scan for Attendance</Text>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            Valid Until: {studentData.validUntil || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert('Download', 'ID Card download feature coming soon!');
          }}
        >
          <Icon name="download" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert('Share', 'ID Card share feature coming soon!');
          }}
        >
          <Icon name="share" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Icon name="info-outline" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Present this QR code at the attendance scanner for quick check-in
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 12,
    marginBottom: 20,
  },
  instituteName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#CCCCCC',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  qrContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  qrLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 10,
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#007AFF',
    marginLeft: 12,
    lineHeight: 18,
  },
});

export default IDCardScreen;
