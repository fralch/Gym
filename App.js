import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <AppNavigator />
    </ThemeProvider>
  );
}
