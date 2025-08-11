import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <AppNavigator />
    </>
  );
}
