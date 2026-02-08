# Navigation Setup - Attendance Mobile App

## 📁 Structure

```
src/navigation/
├── AppNavigator.js       # Main navigator with auth logic & role routing
├── AuthNavigator.js      # Stack navigator for login/register flow
├── StudentNavigator.js   # Student: Drawer → Stack → Tabs
├── FacultyNavigator.js   # Faculty: Drawer → Stack → Tabs  
└── AdminNavigator.js     # Admin: Drawer → Stack → Tabs
```

## 🎨 Features

✅ **Role-Based Navigation** - Auto-routes to correct navigator based on user role
✅ **Auth Flow Management** - Automatic login/logout with AsyncStorage
✅ **Beautiful Tab Bars** - Custom tab bar with icons and animations
✅ **Drawer Navigation** - Side menu with settings and logout
✅ **Stack Navigation** - Headers with menu toggle and notifications
✅ **Color-Coded Roles**:
  - 🔵 Student: Blue (#2196F3)
  - 🟢 Faculty: Green (#4CAF50)
  - 🔴 Admin: Orange (#FF5722)

## 🔧 Installation

Install required packages:

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-gesture-handler react-native-reanimated
```

For Expo:
```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-gesture-handler react-native-reanimated
```

## 🚀 Usage

### 1. Update App.js

```javascript
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

### 2. Login Flow

From any auth screen, use the `authContext`:

```javascript
// In LoginScreen.js
const handleLogin = async () => {
  const response = await api.login(email, password);
  
  await authContext.signIn(
    response.token,      // JWT token
    response.role,       // 'student', 'faculty', or 'admin'
    response.userData    // User data object
  );
  // Navigation happens automatically!
};
```

### 3. Logout

```javascript
// From any screen
await authContext.signOut();
// User is redirected to auth flow
```

## 📱 Screen Placeholders

You need to create these screen files:

### Auth Screens
- `src/screens/Auth/WelcomeScreen.js`
- `src/screens/Auth/LoginScreen.js`
- `src/screens/Auth/RegisterScreen.js`
- `src/screens/Auth/ForgotPasswordScreen.js`

### Student Screens
- `src/screens/Student/DashboardScreen.js`
- `src/screens/Student/AttendanceScreen.js`
- `src/screens/Student/ScheduleScreen.js`
- `src/screens/Student/ProfileScreen.js`

### Faculty Screens
- `src/screens/Faculty/DashboardScreen.js`
- `src/screens/Faculty/MarkAttendanceScreen.js`
- `src/screens/Faculty/ClassesScreen.js`
- `src/screens/Faculty/ReportsScreen.js`
- `src/screens/Faculty/ProfileScreen.js`

### Admin Screens
- `src/screens/Admin/DashboardScreen.js`
- `src/screens/Admin/ManageUsersScreen.js`
- `src/screens/Admin/ManageClassesScreen.js`
- `src/screens/Admin/ReportsScreen.js`
- `src/screens/Admin/ProfileScreen.js`

### Common Screens
- `src/screens/Common/SettingsScreen.js`
- `src/screens/Common/NotificationsScreen.js`

## 🎯 Navigation Structure

### Student Flow
```
DrawerNavigator
  └── StackNavigator (with header)
      └── TabNavigator (custom bottom tabs)
          ├── Dashboard
          ├── Attendance
          ├── Schedule
          └── Profile
```

### Faculty Flow
```
DrawerNavigator
  └── StackNavigator (with header)
      └── TabNavigator (custom bottom tabs)
          ├── Dashboard
          ├── Mark Attendance
          ├── Classes
          ├── Reports
          └── Profile
```

### Admin Flow
```
DrawerNavigator
  └── StackNavigator (with header)
      └── TabNavigator (custom bottom tabs)
          ├── Dashboard
          ├── Manage Users
          ├── Manage Classes
          ├── Reports
          └── Profile
```

## 🎨 Customization

### Change Colors

Edit the color constants in each navigator file:

```javascript
// StudentNavigator.js - Change blue theme
color={isFocused ? '#2196F3' : '#757575'}
backgroundColor: '#2196F3',

// FacultyNavigator.js - Change green theme
color={isFocused ? '#4CAF50' : '#757575'}
backgroundColor: '#4CAF50',

// AdminNavigator.js - Change orange theme
color={isFocused ? '#FF5722' : '#757575'}
backgroundColor: '#FF5722',
```

### Add New Tabs

```javascript
<Tab.Screen
  name="NewTab"
  options={{ tabBarLabel: 'New' }}
>
  {props => <NewScreen {...props} authContext={authContext} />}
</Tab.Screen>
```

Update the icon mapping in CustomTabBar:
```javascript
case 'NewTab':
  iconName = isFocused ? 'star' : 'star-outline';
  break;
```

### Add Drawer Items

```javascript
<Drawer.Screen
  name="NewDrawerItem"
  options={{
    title: 'My New Item',
    drawerIcon: ({ color, size }) => (
      <Ionicons name="folder-outline" size={size} color={color} />
    ),
  }}
>
  {props => <NewScreen {...props} authContext={authContext} />}
</Drawer.Screen>
```

## 🔐 Auth Context API

Available throughout the app via props:

```javascript
authContext.signIn(token, role, userData)  // Login
authContext.signOut()                       // Logout
authContext.updateToken(newToken)          // Refresh token
```

Access in any screen:
```javascript
const MyScreen = ({ authContext }) => {
  const handleLogout = () => authContext.signOut();
  // ...
};
```

## 🐛 Troubleshooting

**Navigation not working?**
- Ensure all navigation packages are installed
- Check that babel.config.js includes reanimated plugin:
  ```javascript
  plugins: ['react-native-reanimated/plugin']
  ```

**Screens not found?**
- The navigators use try/catch for screen imports
- Create placeholder screens or update the require paths

**Drawer not opening?**
- Make sure react-native-gesture-handler is installed
- Wrap App in GestureHandlerRootView if needed

**AsyncStorage errors?**
- Install @react-native-async-storage/async-storage
- For web, use @react-native-async-storage/async-storage with polyfill

## 📝 Notes

- All navigators pass `authContext` down to screens
- Custom tab bar provides smooth animations
- Each role has distinct color scheme
- Drawer includes logout functionality
- Notifications button in header (all roles)
- Menu toggle in header opens drawer

## 🎉 Ready to Go!

Your navigation system is now set up with:
- ✅ Auth flow (Welcome → Login → Register)
- ✅ Role-based routing (Student/Faculty/Admin)
- ✅ Beautiful custom tab bars
- ✅ Drawer navigation with settings
- ✅ Professional headers
- ✅ Logout functionality

Just create your screen components and you're ready to build!
