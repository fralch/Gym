import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SPACING, TYPOGRAPHY } from '../constants';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { login } = useAuth();
  const navigation = useNavigation();

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!dni || !password) {
      Alert.alert('Error', 'Por favor ingresa tu DNI y contraseña');
      return;
    }

    setLoading(true);

    try {
      await login(dni, password);
      // Navigation handled manually since AuthContext just updates state
      navigation.replace('UserInfo');
    } catch (error) {
      Alert.alert(
        'Error de Autenticación',
        error.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        
        <MaterialIcons name="fitness-center" size={60} color={theme.textInverse} />
        <Text style={styles.title}>Gimnasio</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="badge" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="DNI"
            placeholderTextColor={theme.textSecondary}
            value={dni}
            onChangeText={setDni}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.textInverse} />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      paddingTop: 60,
      paddingBottom: 40,
      alignItems: 'center',
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      padding: 10,
      zIndex: 10,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.xxl,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: theme.textInverse,
      marginTop: 16,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textInverse,
      marginTop: 8,
      opacity: 0.9,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: SPACING.xl,
      paddingTop: 40,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: SPACING.borderRadius,
      paddingHorizontal: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textPrimary,
    },
    loginButton: {
      backgroundColor: theme.primary,
      paddingVertical: SPACING.md,
      borderRadius: SPACING.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      minHeight: 50,
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      color: theme.textInverse,
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    },
  });
