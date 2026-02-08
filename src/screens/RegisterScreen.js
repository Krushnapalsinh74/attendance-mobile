import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'https://kparkit.com/api';

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  
  const [idCardImage, setIdCardImage] = useState(null);
  const [idCardUri, setIdCardUri] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const roles = [
    { id: 'student', label: 'Student', icon: 'school', color: '#4A90E2' },
    { id: 'teacher', label: 'Teacher', icon: 'person', color: '#50C878' },
    { id: 'staff', label: 'Staff', icon: 'work', color: '#F39C12' },
    { id: 'visitor', label: 'Visitor', icon: 'tour', color: '#9B59B6' },
  ];

  // Request camera permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Camera and photo library permissions are required to upload ID card.');
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIdCardUri(result.assets[0].uri);
        setIdCardImage(result.assets[0]);
        performOCR(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
      console.error(error);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIdCardUri(result.assets[0].uri);
        setIdCardImage(result.assets[0]);
        performOCR(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
      console.error(error);
    }
  };

  // Perform OCR on ID card
  const performOCR = async (imageAsset) => {
    setOcrLoading(true);
    try {
      const formDataOCR = new FormData();
      
      // Prepare image for upload
      const imageUri = imageAsset.uri;
      const fileName = imageUri.split('/').pop();
      const fileType = imageAsset.type || 'image/jpeg';
      
      formDataOCR.append('image', {
        uri: imageUri,
        name: fileName,
        type: fileType,
      });

      const response = await axios.post(`${API_URL}/ocr/id-card`, formDataOCR, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.data.success) {
        const ocrData = response.data.data;
        setFormData(prev => ({
          ...prev,
          name: ocrData.name || prev.name,
          idNumber: ocrData.idNumber || prev.idNumber,
          phone: ocrData.phone || prev.phone,
        }));
        Alert.alert('Success', 'ID card information extracted successfully!');
      } else {
        Alert.alert('OCR Failed', 'Could not extract information from ID card. Please enter manually.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('OCR Failed', 'Could not process ID card. Please enter information manually.');
    } finally {
      setOcrLoading(false);
    }
  };

  // Show image picker options
  const showImagePickerOptions = () => {
    Alert.alert(
      'Upload ID Card',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!idCardUri) {
        newErrors.idCard = 'Please upload your ID card';
      }
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.idNumber.trim()) {
        newErrors.idNumber = 'ID number is required';
      }
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number is invalid';
      }
      
      if (!formData.role) {
        newErrors.role = 'Please select a role';
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      } else {
        handleRegister();
      }
    }
  };

  // Handle back
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const registerData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
          registerData.append(key, formData[key]);
        }
      });

      // Append ID card image
      if (idCardImage) {
        const fileName = idCardImage.uri.split('/').pop();
        const fileType = idCardImage.type || 'image/jpeg';
        
        registerData.append('idCard', {
          uri: idCardImage.uri,
          name: fileName,
          type: fileType,
        });
      }

      const response = await axios.post(`${API_URL}/auth/register`, registerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.data.success) {
        Alert.alert(
          'Success!',
          'Registration successful! Please wait for admin approval.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Registration Failed', response.data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Render step 1: ID Card Upload
  const renderStep1 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Upload ID Card</Text>
      <Text style={styles.stepDescription}>Take a photo or upload your ID card for verification</Text>

      <TouchableOpacity
        style={[styles.uploadContainer, errors.idCard && styles.errorBorder]}
        onPress={showImagePickerOptions}
        disabled={ocrLoading}
      >
        {ocrLoading ? (
          <View style={styles.uploadContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.uploadText}>Processing ID Card...</Text>
          </View>
        ) : idCardUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: idCardUri }} style={styles.idCardPreview} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={showImagePickerOptions}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.changeImageText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            <Ionicons name="card-outline" size={64} color="#4A90E2" />
            <Text style={styles.uploadText}>Tap to upload ID card</Text>
            <Text style={styles.uploadSubtext}>Photo or Gallery</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.idCard && <Text style={styles.errorText}>{errors.idCard}</Text>}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />
        </BlurView>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ID Number</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.idNumber && styles.inputError]}
            placeholder="Enter your ID number"
            placeholderTextColor="#999"
            value={formData.idNumber}
            onChangeText={(value) => updateField('idNumber', value)}
          />
        </BlurView>
        {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}
      </View>
    </Animated.View>
  );

  // Render step 2: Contact & Role
  const renderStep2 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Contact & Role</Text>
      <Text style={styles.stepDescription}>Provide your contact details and select your role</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="your@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
          />
        </BlurView>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="+1234567890"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
          />
        </BlurView>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Select Your Role</Text>
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                formData.role === role.id && styles.roleCardSelected,
              ]}
              onPress={() => updateField('role', role.id)}
            >
              <BlurView
                intensity={formData.role === role.id ? 40 : 20}
                tint="light"
                style={styles.roleCardBlur}
              >
                <MaterialIcons
                  name={role.icon}
                  size={32}
                  color={formData.role === role.id ? role.color : '#666'}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    formData.role === role.id && { color: role.color, fontWeight: '700' },
                  ]}
                >
                  {role.label}
                </Text>
                {formData.role === role.id && (
                  <Ionicons name="checkmark-circle" size={24} color={role.color} style={styles.roleCheck} />
                )}
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
        {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
      </View>
    </Animated.View>
  );

  // Render step 3: Security
  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Security</Text>
      <Text style={styles.stepDescription}>Create a secure password for your account</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Create a password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
          />
        </BlurView>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <BlurView intensity={20} tint="light" style={styles.inputBlur}>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
          />
        </BlurView>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      <BlurView intensity={20} tint="light" style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#4A90E2" />
        <Text style={styles.infoText}>
          Your account will be reviewed by an administrator before activation.
        </Text>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => step > 1 ? handleBack() : navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={styles.progressStepContainer}>
                <View
                  style={[
                    styles.progressStep,
                    s <= step && styles.progressStepActive,
                  ]}
                >
                  {s < step ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.progressStepText}>{s}</Text>
                  )}
                </View>
                {s < 3 && (
                  <View
                    style={[
                      styles.progressLine,
                      s < step && styles.progressLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Form Content */}
          <BlurView intensity={30} tint="light" style={styles.formCard}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {step === 3 ? 'Complete Registration' : 'Continue'}
                    </Text>
                    {step < 3 && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#4A90E2',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#4A90E2',
  },
  formCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  stepContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  uploadContainer: {
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  errorBorder: {
    borderColor: '#FF6B6B',
  },
  uploadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  imagePreviewContainer: {
    flex: 1,
    position: 'relative',
  },
  idCardPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  roleCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  roleCardBlur: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  roleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    marginLeft: 12,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLinkBold: {
    fontWeight: '700',
    color: '#fff',
  },
});
