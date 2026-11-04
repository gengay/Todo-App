import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Main/DashboardScreen';
import TaskListScreen from '../screens/Main/TaskListScreen';
import AddEditTaskScreen from '../screens/Main/AddEditTaskScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tasks" component={TaskListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="AddEditTask"
              component={AddEditTaskScreen}
              options={{ headerShown: true, title: 'Manage Task' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}