import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import SessionsScreen from '../screens/admin/SessionsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import ProfileScreen from '../screens/admin/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminTabs = ({ authContext }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Sessions') {
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
      <Tab.Screen name="Users">
        {props => <UsersScreen {...props} authContext={authContext} />}
      </Tab.Screen>
      <Tab.Screen name="Sessions">
        {props => <SessionsScreen {...props} authContext={authContext} />}
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

const AdminNavigator = ({ authContext }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs">
        {props => <AdminTabs {...props} authContext={authContext} />}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {props => <SettingsScreen {...props} authContext={authContext} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AdminNavigator;
