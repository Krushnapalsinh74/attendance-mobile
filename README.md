# 📱 KParkIT Attendance - Mobile Application

A comprehensive GPS-based attendance tracking mobile application built with React Native and Expo. This app provides role-based access for students, faculty, and administrators to manage attendance sessions with real-time location tracking.

## 🌟 Features

### 👨‍🎓 Student Features
- **GPS-Based Attendance Marking**
  - Automatic detection of nearby active sessions
  - Real-time distance calculation using Haversine formula
  - 15-meter proximity requirement for marking attendance
  - Location permission handling and error management

- **Dashboard & Statistics**
  - Real-time attendance rate calculation
  - Total classes attended vs total classes
  - Monthly attendance tracking
  - Visual progress bars and statistics cards
  - Pull-to-refresh functionality

- **Attendance History**
  - Complete attendance records
  - Session details (subject, faculty, date, time)
  - Attendance status indicators
  - Search and filter capabilities

- **QR Code Scanner**
  - Quick attendance marking via QR codes
  - Camera permission handling
  - Fallback for GPS-based attendance

- **Profile Management**
  - View and edit personal information
  - Email, phone, department details
  - Secure logout functionality

### 👨‍🏫 Faculty Features
- **Session Management**
  - Create and start attendance sessions
  - Set session location coordinates
  - Real-time active session monitoring
  - End sessions with automatic statistics

- **Session Dashboard**
  - Current active session details
  - Student attendance count
  - Session duration tracking
  - Quick action buttons

- **Attendance History**
  - View all past sessions
  - Student attendance lists per session
  - Session statistics and reports
  - Export capabilities

- **Profile & Settings**
  - Faculty profile management
  - Department and subject information
  - Session preferences

### 👨‍💼 Admin Features
- **System Dashboard**
  - Total users (students and faculty)
  - Active sessions monitoring
  - Total attendance records
  - System-wide statistics

- **User Management**
  - View all students and faculty
  - User details and roles
  - Add, edit, and delete users
  - Role assignment

- **Session Monitoring**
  - Real-time active sessions
  - Session history
  - Attendance reports
  - System analytics

- **Settings & Configuration**
  - System-wide settings
  - Proximity radius configuration
  - Permission management

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: React Native 0.76.6
- **Runtime**: Expo SDK 52
- **Navigation**: React Navigation 7
- **State Management**: React Context API + AsyncStorage
- **HTTP Client**: Axios
- **UI Components**: Custom components with Ionicons
- **Styling**: StyleSheet with LinearGradient

### Key Dependencies
```json
{
  "expo": "~52.0.29",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "@react-navigation/native": "^7.0.13",
  "@react-navigation/stack": "^7.1.1",
  "axios": "^1.7.9",
  "expo-camera": "~17.0.1",
  "expo-location": "~18.0.6",
  "expo-linear-gradient": "~15.0.8",
  "react-native-maps": "1.27.1",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

### Project Structure
```
attendance-mobile/
├── App.js                      # Main app entry with navigation
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── package.json                # Dependencies
├── assets/                     # Images, icons, splash screens
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── theme.js          # Design system constants
│   ├── config/
│   │   └── constants.js      # API URLs and app constants
│   ├── context/
│   │   └── AuthContext.js    # Authentication state management
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── student/          # Student role screens
│   │   │   ├── DashboardScreen.js
│   │   │   ├── MarkAttendanceScreen.js
│   │   │   ├── HistoryScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── faculty/          # Faculty role screens
│   │   │   ├── DashboardScreen.js
│   │   │   ├── HistoryScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── admin/            # Admin role screens
│   │   │   ├── DashboardScreen.js
│   │   │   ├── UsersScreen.js
│   │   │   ├── SessionsScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── QRScannerScreen.js
│   │   └── SettingsScreen.js
│   └── services/
│       └── api.js            # API service with all endpoints
└── node_modules/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Physical device with Expo Go app (recommended for testing location features)

### Installation

1. **Clone the repository**
   ```bash
   cd ~/domains/kparkit.com/public_html/attendance-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure API endpoint**
   
   Create `src/config/constants.js`:
   ```javascript
   export default {
     API_URL: 'https://your-backend-api.com/api',
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Expo Go**: Scan QR code with Expo Go app

### First Time Setup

1. **Location Permissions**
   - The app will request location permissions on first launch
   - Grant "While Using the App" permission for students
   - Location is required for proximity-based attendance

2. **Camera Permissions**
   - Required for QR code scanning feature
   - Grant camera access when prompted

3. **Create Test Account**
   - Use the Register screen to create a new account
   - Select role (Student/Faculty/Admin)
   - Complete profile information

## 📱 Usage Guide

### For Students

1. **Login**
   - Enter your email and password
   - Enable "Remember Me" for auto-login

2. **Mark Attendance**
   - Dashboard shows nearby active sessions
   - Sessions within 15 meters show "In Range" badge
   - Tap "Mark Attendance" button
   - Confirm your location
   - Attendance is marked instantly

3. **View History**
   - Navigate to History tab
   - See all past attendance records
   - Filter by date or subject

4. **QR Code Scanning**
   - Tap QR Scanner from quick actions
   - Point camera at faculty's QR code
   - Attendance marked automatically

### For Faculty

1. **Start Session**
   - Tap "Start New Session" on dashboard
   - Select subject and class
   - Set session duration
   - Session starts with your current location

2. **Monitor Session**
   - View real-time student attendance
   - See count of present students
   - Monitor session duration

3. **End Session**
   - Tap "End Session" button
   - View session summary
   - Download attendance report

### For Admin

1. **Monitor System**
   - Dashboard shows all system statistics
   - Real-time active sessions
   - User counts and trends

2. **Manage Users**
   - View all students and faculty
   - Edit user details
   - Assign or change roles
   - Delete inactive users

3. **View Reports**
   - Access comprehensive attendance reports
   - Session history and analytics
   - Export data for records

## 🔧 Configuration

### API Integration

The app communicates with the backend via RESTful API. Configure the base URL in `src/config/constants.js`.

**API Endpoints:**

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/register` - New user registration
- `GET /auth/me` - Get current user info

**Sessions (Faculty):**
- `POST /sessions/start` - Start attendance session
- `POST /sessions/end/:id` - End session
- `GET /sessions/active` - Get active session
- `GET /sessions/my-sessions` - Get faculty's sessions
- `GET /sessions/stats` - Session statistics

**Attendance (Student):**
- `GET /attendance/nearby` - Get nearby sessions (with lat/lon)
- `POST /attendance/mark` - Mark attendance
- `GET /attendance/my-attendance` - Get student's attendance
- `GET /attendance/stats` - Attendance statistics

**Admin:**
- `GET /admin/stats` - System-wide statistics
- `GET /admin/students` - All students
- `GET /admin/faculty` - All faculty
- `GET /admin/sessions` - All sessions
- `DELETE /admin/users/:id` - Delete user

### App Configuration

Edit `app.json` for app-level settings:

```json
{
  "expo": {
    "name": "KParkIT Attendance",
    "slug": "kparkit-attendance",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.kparkit.attendance",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.kparkit.attendance",
      "supportsTablet": true
    }
  }
}
```

### Proximity Settings

Default proximity radius is **15 meters**. To change:

1. Edit `src/screens/student/DashboardScreen.js`
2. Find `PROXIMITY_RADIUS` constant
3. Adjust value in meters

```javascript
const PROXIMITY_RADIUS = 15; // meters
```

## 🎨 Customization

### Theme Colors

Edit `src/components/theme.js`:

```javascript
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4ade80',
  danger: '#ef4444',
  warning: '#fbbf24',
  // ... more colors
};
```

### Gradient Presets

Popular gradient combinations:
- **Purple Dream**: `['#667eea', '#764ba2']`
- **Ocean**: `['#2E3192', '#1BFFFF']`
- **Sunset**: `['#FF512F', '#F09819']`
- **Forest**: `['#134E5E', '#71B280']`

## 📦 Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS App

```bash
# Build for iOS
eas build --platform ios --profile preview
```

### App Store Deployment

```bash
# Build production version
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 🧪 Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Login with student credentials
- [ ] Dashboard loads with statistics
- [ ] Location permission granted
- [ ] Nearby sessions displayed
- [ ] Mark attendance in range
- [ ] Error shown when out of range
- [ ] History shows all records
- [ ] Profile loads correctly

**Faculty Flow:**
- [ ] Login with faculty credentials
- [ ] Start new session
- [ ] Session location captured
- [ ] Monitor active session
- [ ] View student attendance
- [ ] End session successfully
- [ ] View session history

**Admin Flow:**
- [ ] Login with admin credentials
- [ ] Dashboard shows all stats
- [ ] View users list
- [ ] Edit user details
- [ ] View all sessions
- [ ] System reports accessible

### Testing Location Features

**Important**: Location-based features require physical device testing.

1. Use actual device with GPS
2. Test in different locations
3. Verify distance calculations
4. Test permission handling
5. Test offline scenarios

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module" error**
```bash
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

**Issue: Metro bundler cache issues**
```bash
npx expo start -c
```

**Issue: Location not working in simulator**
- Simulators use fake GPS data
- Test on physical device for accurate results
- Set custom location in simulator: Debug > Location

**Issue: "Network request failed"**
- Check API URL in `constants.js`
- Verify backend server is running
- Check firewall/network settings
- Test API with Postman first

**Issue: App crashes on camera access**
- Ensure camera permissions granted
- Check `app.json` permissions configuration
- Rebuild app after permission changes

**Issue: Authentication not persisting**
- Check AsyncStorage imports
- Verify token storage logic
- Clear app data and re-login

### Debug Mode

Enable debug logging in `api.js`:

```javascript
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);
```

## 📚 Additional Documentation

- **[COMPONENT_TREE.md](./COMPONENT_TREE.md)** - Component hierarchy and structure
- **[LOGIN_SETUP.md](./LOGIN_SETUP.md)** - Authentication setup guide
- **[INTEGRATION_GUIDE.js](./INTEGRATION_GUIDE.js)** - API integration examples
- **[TASK_COMPLETE.md](./TASK_COMPLETE.md)** - Development checklist

## 🔐 Security Considerations

1. **Authentication**
   - JWT tokens stored securely in AsyncStorage
   - Automatic token refresh on API calls
   - Secure logout clears all stored data

2. **Location Privacy**
   - Location only accessed when needed
   - User controls permission grants
   - No location tracking in background

3. **API Security**
   - HTTPS required for production
   - Bearer token authentication
   - Input validation on all forms

4. **Data Protection**
   - No sensitive data in app code
   - Secure storage for credentials
   - Encrypted communications

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes with clear commits
3. Test thoroughly on device
4. Update documentation
5. Submit pull request

### Code Style

- Use ESLint for code quality
- Follow React Native best practices
- Comment complex logic
- Keep components focused and small

## 📄 License

This project is proprietary software for KParkIT educational institution.

## 📞 Support

For technical support or questions:
- **Email**: support@kparkit.com
- **Documentation**: See docs in project root
- **Issues**: Contact system administrator

## 🎯 Roadmap

### Planned Features
- [ ] Offline attendance marking with sync
- [ ] Biometric authentication
- [ ] Push notifications for sessions
- [ ] Attendance analytics dashboard
- [ ] Export reports to PDF
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Parent portal integration

### Version History
- **v1.0.0** (Current) - Initial release with core features
  - GPS-based attendance
  - Role-based access
  - Real-time session monitoring
  - Comprehensive statistics

---

**Built with ❤️ for KParkIT Educational Institution**

For more information, visit the documentation files in the project root or contact the development team.
