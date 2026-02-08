# Student Dashboard Screen

## Overview
Beautiful, modern student dashboard with GPS tracking, real-time nearby sessions, and attendance statistics.

## Features Implemented

### 📊 Stats Cards with Gradients
- **Main Attendance Card**: Large gradient card (purple-to-violet) showing overall attendance percentage with animated progress bar
- **Total Classes Card**: Green gradient card displaying total classes count
- **This Month Card**: Orange gradient card showing current month's attendance

### 📍 GPS Location Tracking
- Real-time location tracking using Expo Location
- Automatic permission requests on mount
- Distance calculation to nearby sessions using Haversine formula
- "GPS Active" badge when location is enabled
- Location updates on pull-to-refresh

### 🎯 Nearby Sessions List
- Displays all active sessions within range
- Shows distance in meters from current location
- Real-time distance calculation
- "In Range" badge for sessions within geofence radius (15m)
- Visual highlighting for accessible sessions
- Faculty name and subject display
- Session start time formatting

### 🔄 Pull to Refresh
- Native RefreshControl component
- Refreshes both location and attendance stats
- Smooth animation with brand colors
- Updates nearby sessions list

### 📈 Attendance Percentage Display
- Large, prominent percentage display (48pt font)
- Dynamic color coding:
  - Green (≥75%): Good attendance
  - Orange (50-74%): Warning
  - Red (<50%): Critical
- Visual progress bar
- "X of Y classes attended" subtitle

### ⚡ Quick Actions Buttons
- **My Records**: View attendance history
- **Scan QR**: Quick access to QR scanner
- **Refresh**: Manual refresh trigger
- **Settings**: Navigate to settings
- Color-coded icons with soft backgrounds
- Modern rounded icon containers

### 🎨 Modern Design with Soft Shadows
- Consistent 16-20px border radius for cards
- Soft shadow effects (shadowOpacity: 0.08-0.15)
- Elevation for Android compatibility
- White cards on light gray background
- Smooth gradients using expo-linear-gradient
- Proper spacing and padding throughout

### 🔗 API Integration
- `getNearbySessions()`: Fetches nearby active sessions based on GPS
- `getAttendanceStats()`: Retrieves attendance statistics
- Error handling with user-friendly alerts
- Loading states with spinner
- Automatic token inclusion via axios interceptors

## Component Structure

```
DashboardScreen
├── Header (Greeting + Profile Button)
├── Stats Container
│   ├── Large Attendance Card (Gradient)
│   └── Small Cards Row
│       ├── Total Classes Card (Green)
│       └── This Month Card (Orange)
├── Quick Actions
│   └── 4 Action Buttons (Grid Layout)
└── Nearby Sessions
    ├── Section Header with GPS Badge
    ├── Empty State (if no sessions)
    └── Session Cards (with distances)
```

## Key Functions

### `initializeDashboard()`
Loads location and stats on mount

### `getLocationAndSessions()`
- Requests location permissions
- Gets current GPS coordinates
- Fetches nearby sessions from API
- Handles errors gracefully

### `fetchStats()`
Retrieves attendance statistics from backend

### `onRefresh()`
Handles pull-to-refresh action

### `calculateDistance(lat1, lon1, lat2, lon2)`
Haversine formula implementation for accurate distance calculation

### `handleMarkAttendance(session)`
- Validates GPS availability
- Checks distance from session location
- Navigates to attendance marking flow if within range
- Shows helpful error messages if too far

## Dependencies Used
- `expo-linear-gradient`: Beautiful gradient cards
- `expo-location`: GPS tracking and permissions
- `@expo/vector-icons`: Ionicons for consistent iconography
- `react-native`: Core components (ScrollView, RefreshControl, etc.)
- `axios`: API integration via centralized service

## Navigation Props
Expects navigation object with these routes:
- `MarkAttendance`: For marking attendance
- `Profile`: User profile screen
- `MyAttendance`: Attendance history
- `QRScanner`: QR code scanner
- `Settings`: App settings

## Color Scheme
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Violet)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)

## Performance Optimizations
- Single initialization call combining async operations
- Efficient re-renders using proper state management
- Memoized distance calculations per session
- Smart refresh logic (doesn't reload unnecessarily)

## User Experience Enhancements
- Loading state with spinner on first load
- Empty state with helpful icon and text
- Contextual error messages
- Visual feedback for active/inactive sessions
- Smooth scrolling with proper content padding
- Touch feedback on all interactive elements

## File Location
`src/screens/student/DashboardScreen.js`

## Usage Example
```javascript
import DashboardScreen from './src/screens/student/DashboardScreen';

// In navigation stack:
<Stack.Screen 
  name="Dashboard" 
  component={DashboardScreen}
  options={{ headerShown: false }}
/>
```

## Future Enhancements
- [ ] Animated percentage counter
- [ ] Skeleton loading states
- [ ] Haptic feedback on interactions
- [ ] Background location updates
- [ ] Push notifications for nearby sessions
- [ ] Swipe actions on session cards
- [ ] Filter/sort nearby sessions
- [ ] Session details modal
