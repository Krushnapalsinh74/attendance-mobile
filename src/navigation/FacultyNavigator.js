import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/faculty/DashboardScreen';
import HistoryScreen from '../screens/faculty/HistoryScreen';
import ReportsScreen from '../screens/faculty/ReportsScreen';
import ProfileScreen from '../screens/faculty/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const FacultyTabs = ({ authContext }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
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
      <Tab.Screen name="Reports">
        {props => <ReportsScreen {...props} authContext={authContext} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} authContext={authContext} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const FacultyNavigator = ({ authContext }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FacultyTabs">
        {props => <FacultyTabs {...props} authContext={authContext} />}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {props => <SettingsScreen {...props} authContext={authContext} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default FacultyNavigator;
