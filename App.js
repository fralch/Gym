import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <StatusBar style="auto" backgroundColor="transparent" translucent />
          <AppNavigator />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
