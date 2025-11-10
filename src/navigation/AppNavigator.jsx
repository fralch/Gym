import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen, QrScreen, UserInfoScreen, StatsScreen } from '../screens';
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
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack - Show login screen when not authenticated
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Iniciar Sesión',
              gestureEnabled: false,
            }}
          />
        ) : (
          // Main App Stack - Show main screens when authenticated
          <>
            <Stack.Screen
              name="QrScanner"
              component={QrScreen}
              options={{
                title: 'Escáner QR',
              }}
            />
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}