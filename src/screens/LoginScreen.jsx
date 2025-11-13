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
import UserCreateModal from '../components/ui/UserCreateModal';

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { login, setAuthData } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
      return;
    }

    // Check for admin credentials
    if (email === 'admin' && password === 'password') {
      // Navigate to admin panel
      navigation.navigate('AdminPanel');
      // Clear fields
      setEmail('');
      setPassword('');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      Alert.alert(
        'Error de Autenticación',
        error.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = (userData) => {
    // Optionally, you can show a success message or update the UI
    console.log('User created successfully:', userData);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      <View style={styles.header}>
        <MaterialIcons name="fitness-center" size={60} color={theme.textInverse} />
        <Text style={styles.title}>Gimnasio</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.createUserButton}
          onPress={() => setShowCreateUserModal(true)}
          disabled={loading}
        >
          <MaterialIcons name="person-add" size={20} color={theme.primary} />
          <Text style={styles.createUserButtonText}>Crear Usuario</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Crea nuevos usuarios para el gimnasio
        </Text>
      </View>

      <UserCreateModal
        visible={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSuccess={handleUserCreated}
      />
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
      justifyContent: 'center',
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
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textSecondary,
      paddingHorizontal: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    createUserButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.cardBackground,
      paddingVertical: SPACING.md,
      borderRadius: SPACING.borderRadius,
      borderWidth: 1,
      borderColor: theme.primary,
      minHeight: 50,
    },
    createUserButtonText: {
      color: theme.primary,
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      marginLeft: SPACING.sm,
    },
    infoText: {
      textAlign: 'center',
      color: theme.textSecondary,
      fontSize: TYPOGRAPHY.fontSize.sm,
      marginTop: SPACING.md,
      lineHeight: 20,
    },
  });
