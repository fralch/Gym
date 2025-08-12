import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QrScreen from '../screens/QrScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarStyle: 'dark-content',
          statusBarBackgroundColor: COLORS.background,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="QrScanner" 
          component={QrScreen}
          options={{
            title: 'Escáner QR',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}