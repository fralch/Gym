import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen, QrScreen, UserInfoScreen, StatsScreen, WelcomeScreen } from '../screens';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Welcome Screen */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* QR Scanner */}
        <Stack.Screen
          name="QrScanner"
          component={QrScreen}
          options={{
            title: 'Escáner QR',
          }}
        />

        {/* Login screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Iniciar Sesión',
            gestureEnabled: false,
          }}
        />

        {/* Protected screens - Only accessible when authenticated */}
        <Stack.Screen
          name="UserInfo"
          component={UserInfoScreen}
          options={{
            title: 'Información del Usuario',
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: 'Estadísticas',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
