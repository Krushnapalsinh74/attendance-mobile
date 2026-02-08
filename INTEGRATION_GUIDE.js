// Example: How to integrate DashboardScreen into your app

// 1. In your main navigation file (e.g., App.js or Navigation.js):

import DashboardScreen from './src/screens/student/DashboardScreen';
// ... other imports

// 2. Add to your Stack Navigator:

const StudentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ headerShown: false }} // Dashboard has custom header
      />
      {/* Add other student screens here */}
    </Stack.Navigator>
  );
};

// 3. Expected navigation routes (implement these screens):

// - MarkAttendance: Screen for video selfie + attendance marking
// - Profile: Student profile screen
// - MyAttendance: Attendance history/records
// - QRScanner: QR code scanner for quick check-in
// - Settings: App settings

// 4. API endpoints expected (already in src/services/api.js):

// GET /attendance/nearby?latitude={lat}&longitude={lon}
// Response: { sessions: [{ _id, subject, facultyName, latitude, longitude, startTime }] }

// GET /attendance/stats
// Response: { totalClasses, attended, percentage, thisMonth }

// 5. Config constants (already in src/config/constants.js):

// - GEOFENCE_RADIUS: Distance in meters (default: 15m)
// - COLORS: Color scheme object
// - API_URL: Backend API base URL

// 6. Permissions needed (add to app.json):

{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location for finding nearby classes."
        }
      ]
    ]
  }
}

// 7. Test the dashboard:

// a) Start your Expo dev server:
//    npm start

// b) Make sure backend API is running and accessible

// c) Grant location permissions when prompted

// d) Pull down to refresh and see nearby sessions

// 8. Troubleshooting:

// - "No nearby sessions": Check if backend has active sessions
// - Location not working: Verify permissions in device settings
// - API errors: Check network connection and API_URL in constants.js
// - Gradient not showing: Ensure expo-linear-gradient is installed

// 9. Optional enhancements:

// - Add skeleton loaders during initial load
// - Implement haptic feedback on button presses
// - Add animations using react-native-reanimated
// - Cache location data to reduce battery drain
// - Add dark mode support
