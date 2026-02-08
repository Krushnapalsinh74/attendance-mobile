import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import FacultyNavigator from './FacultyNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        
        setUserToken(token);
        setUserRole(role);
      } catch (e) {
        console.error('Error loading auth state:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Auth context methods
  const authContext = React.useMemo(
    () => ({
      signIn: async (token, role, userData) => {
        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userRole', role);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          
          setUserToken(token);
          setUserRole(role);
        } catch (e) {
          console.error('Error signing in:', e);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userRole');
          await AsyncStorage.removeItem('userData');
          
          setUserToken(null);
          setUserRole(null);
        } catch (e) {
          console.error('Error signing out:', e);
        }
      },
      updateToken: async (token) => {
        try {
          await AsyncStorage.setItem('userToken', token);
          setUserToken(token);
        } catch (e) {
          console.error('Error updating token:', e);
        }
      },
    }),
    []
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Function to get the appropriate navigator based on role
  const getNavigatorByRole = () => {
    if (!userToken) {
      return <AuthNavigator authContext={authContext} />;
    }

    switch (userRole) {
      case 'student':
        return <StudentNavigator authContext={authContext} />;
      case 'faculty':
        return <FacultyNavigator authContext={authContext} />;
      case 'admin':
        return <AdminNavigator authContext={authContext} />;
      default:
        return <AuthNavigator authContext={authContext} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {getNavigatorByRole()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
