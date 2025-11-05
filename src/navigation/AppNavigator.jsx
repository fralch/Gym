import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import QrScreen from '../screens/QrScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import StatsScreen from '../screens/StatsScreen'; // Importar la nueva pantalla
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UserInfo"
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