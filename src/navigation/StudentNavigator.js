import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/student/DashboardScreen';
import MarkAttendanceScreen from '../screens/student/MarkAttendanceScreen';
import HistoryScreen from '../screens/student/HistoryScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import IDCardScreen from '../screens/student/IDCardScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StudentTabs = ({ authContext }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ID Card') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard">
        {props => <DashboardScreen {...props} authContext={authContext} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {props => <HistoryScreen {...props} authContext={authContext} />}
      </Tab.Screen>
      <Tab.Screen name="ID Card">
        {props => <IDCardScreen {...props} authContext={authContext} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} authContext={authContext} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const StudentNavigator = ({ authContext }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs">
        {props => <StudentTabs {...props} authContext={authContext} />}
      </Stack.Screen>
      <Stack.Screen name="MarkAttendance">
        {props => <MarkAttendanceScreen {...props} authContext={authContext} />}
      </Stack.Screen>
      <Stack.Screen name="QRScanner">
        {props => <QRScannerScreen {...props} authContext={authContext} />}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {props => <SettingsScreen {...props} authContext={authContext} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StudentNavigator;
