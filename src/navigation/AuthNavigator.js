import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ authContext }) => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash">
        {props => <SplashScreen {...props} authContext={authContext} />}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} authContext={authContext} />}
      </Stack.Screen>

      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} authContext={authContext} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
