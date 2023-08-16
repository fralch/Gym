import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Qr from './components/qr';
import Detail from './components/detail';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Qr" options={{headerShown: false}}  component={Qr} />
        <Stack.Screen name="Detail" options={{headerShown: false}}  component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
