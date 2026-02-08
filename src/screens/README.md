# LoginScreen Documentation

## Overview
A beautiful, modern login screen with soft UI design, glassmorphism effects, and smooth animations.

## Features
✅ **Soft UI Design** - Purple/blue gradient background
✅ **Glassmorphism** - Translucent card with blur effect
✅ **Smooth Animations** - Entrance animations and interactive feedback
✅ **Email & Password Inputs** - With focus effects
✅ **Remember Me** - Save user credentials
✅ **Form Validation** - Email format and required field checks
✅ **API Integration** - Connects to authentication endpoint
✅ **Token Storage** - Saves auth token to AsyncStorage
✅ **Error Handling** - User-friendly error messages
✅ **Navigation** - Link to registration screen

## Installation

The required dependencies are already installed:
- `expo-linear-gradient` - For gradient backgrounds
- `@react-native-async-storage/async-storage` - For token storage
- `axios` - For API calls

## Usage

### Integration with React Navigation

```javascript
// App.js or navigation setup
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## API Integration

The LoginScreen connects to:
```
POST https://competitors-meat-request-partition.trycloudflare.com/api/auth/login
```

### Request Format
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Expected Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Stored Data
On successful login, the following data is saved to AsyncStorage:
- `authToken` - JWT authentication token
- `userEmail` - User's email address
- `savedEmail` - Saved email (if "Remember Me" is checked)
- `rememberMe` - Boolean flag for Remember Me preference

## Customization

### Colors
Modify the gradient colors in the component:
```javascript
<LinearGradient
  colors={['#667eea', '#764ba2', '#f093fb']} // Change these
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradient}
>
```

### API Endpoint
Change the API URL in the `handleLogin` function:
```javascript
const response = await axios.post(
  'YOUR_API_ENDPOINT_HERE',
  { email, password }
);
```

### Navigation
After successful login, update the navigation target:
```javascript
// Replace this line in handleLogin:
// navigation.replace('Home');
```

## Error Handling

The screen handles various error scenarios:
- **Empty fields** - Shows alert for missing email or password
- **Invalid email** - Validates email format
- **401 Unauthorized** - Invalid credentials
- **404 Not Found** - Account doesn't exist
- **500 Server Error** - Server-side issues
- **Network Error** - Connection problems

## UI Components

### Input Fields
- Email input with email keyboard type
- Password input with secure text entry
- Focus effects with border highlighting
- Placeholder text with opacity

### Remember Me Checkbox
- Custom checkbox with checkmark animation
- Persists email across app launches
- Toggle functionality

### Login Button
- Gradient background
- Loading indicator during API call
- Disabled state while loading
- Shadow and elevation effects

### Register Link
- Navigate to registration screen
- Smooth fade-out animation

## Animations

1. **Entrance Animations**
   - Fade in (opacity 0 → 1)
   - Slide up (translateY 50 → 0)
   - Scale (0.9 → 1)

2. **Success Animation**
   - Scale pulse effect on successful login

3. **Focus Effects**
   - Input border highlights on focus

## Testing

To test the login screen:
1. Run the app: `npm start`
2. Enter test credentials
3. Check AsyncStorage for saved token
4. Verify error handling with invalid inputs

## Troubleshooting

### Navigation Error
If you get "Cannot navigate to Register":
- Ensure RegisterScreen is defined in your navigator
- Check screen names match exactly

### API Connection Issues
- Verify the API endpoint is accessible
- Check network connectivity
- Review CORS settings if testing on web

### AsyncStorage Errors
- Ensure @react-native-async-storage/async-storage is installed
- Check permissions on mobile devices

## Next Steps

1. Create a RegisterScreen to match
2. Add forgot password functionality
3. Implement biometric authentication
4. Add social login options (Google, Apple, etc.)
5. Create a SplashScreen to check for existing auth token

## Support

For issues or questions, check:
- React Navigation docs: https://reactnavigation.org/
- Expo docs: https://docs.expo.dev/
- AsyncStorage docs: https://react-native-async-storage.github.io/
