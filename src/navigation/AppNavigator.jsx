import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QrScreen from '../screens/QrScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}