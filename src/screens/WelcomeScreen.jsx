import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SPACING, TYPOGRAPHY } from '../constants';
import { useThemedStyles, useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      
      {/* Header / Logo Area */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image 
              source={require('../Images/Majanayim.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
        </View>
        <Text style={styles.title}>GYM APP</Text>
        <Text style={styles.subtitle}>Tu compañero de entrenamiento</Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.content}>
        
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('Login')}
        >
          <MaterialIcons name="login" size={24} color={theme.textInverse} style={styles.buttonIcon} />
          <Text style={styles.buttonTextPrimary}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Register')}
        >
          <MaterialIcons name="person-add" size={24} color={theme.primary} style={styles.buttonIcon} />
          <Text style={styles.buttonTextSecondary}>Crear Cuenta</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Acceso Rápido</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.buttonAccent}
          onPress={() => navigation.navigate('QrScanner')}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color={theme.textInverse} style={styles.buttonIcon} />
          <Text style={styles.buttonTextAccent}>Escanear Código QR</Text>
        </TouchableOpacity>

      </View>
      
      <Text style={styles.footerText}>Versión 1.0.0</Text>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flex: 1,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomRightRadius: 50,
      borderBottomLeftRadius: 50,
      marginBottom: SPACING.xl,
      paddingBottom: SPACING.xl,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    logoContainer: {
        marginBottom: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.xxxl,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: theme.textInverse,
      letterSpacing: 2,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: 'rgba(255,255,255,0.8)',
      marginTop: SPACING.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: SPACING.xl,
      justifyContent: 'center',
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: SPACING.borderRadius,
      marginBottom: SPACING.lg,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    buttonTextPrimary: {
      color: theme.textInverse,
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    buttonSecondary: {
      backgroundColor: theme.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: SPACING.borderRadius,
      marginBottom: SPACING.lg,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    buttonTextSecondary: {
      color: theme.primary,
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    buttonAccent: {
      backgroundColor: theme.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: SPACING.borderRadius,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    buttonTextAccent: {
      color: theme.textInverse, // Assuming textInverse (white) looks good on secondary
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    buttonIcon: {
      marginRight: SPACING.md,
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
      marginHorizontal: SPACING.md,
      color: theme.textSecondary,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    footerText: {
      textAlign: 'center',
      color: theme.textSecondary,
      fontSize: TYPOGRAPHY.fontSize.sm,
      marginBottom: SPACING.lg,
    },
  });
