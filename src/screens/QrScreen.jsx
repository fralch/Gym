import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert, ActivityIndicator, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';
import {
  PermissionsRequest,
  QRCodeScanner
} from '../components/scanner';
import { checkinService, membresiasService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dniInput, setDniInput] = useState('');
  const [showDniInput, setShowDniInput] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();
  const { dni, setDni, hasDni } = useUser();

  useEffect(() => {
    getCameraPermissions();
  }, []);

  useEffect(() => {
    // Show DNI input if user doesn't have DNI configured
    if (!hasDni) {
      setShowDniInput(true);
    }
  }, [hasDni]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
      setIsProcessing(false);
    });

    return unsubscribe;
  }, [navigation]);

  const getCameraPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      Alert.alert(
        'Error',
        'No se pudo solicitar permisos de cámara. Verifica la configuración de tu dispositivo.'
      );
    }
  };

  const handleLogoPress = () => {
    navigation.navigate('Login');
  };

  const handleDniSubmit = async () => {
    if (!dniInput.trim()) {
      Alert.alert('DNI Requerido', 'Por favor ingresa tu DNI.');
      return;
    }

    // Validate DNI format (basic validation - adjust as needed)
    if (dniInput.trim().length < 7 || dniInput.trim().length > 8) {
      Alert.alert('DNI Inválido', 'El DNI debe tener entre 7 y 8 dígitos.');
      return;
    }

    try {
      await setDni(dniInput.trim());
      setShowDniInput(false);
      Alert.alert('DNI Guardado', 'Tu DNI ha sido guardado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el DNI. Intenta de nuevo.');
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isProcessing) return; // Prevent multiple scans

    // Check if DNI is configured
    if (!hasDni) {
      Alert.alert('DNI Requerido', 'Por favor configura tu DNI antes de escanear el código QR.');
      return;
    }

    setScanned(true);
    setIsProcessing(true);

    // Log scan data for debugging
    console.log(`QR Code scanned: ${type} - ${data}`);

    try {
      // Call the check-in API with the user's DNI
      const response = await checkinService.marcarAsistencia(dni);

      // Success - show confirmation
      const mensaje = response.mensaje || 'Asistencia registrada exitosamente';
      const hora = response.hora || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      Alert.alert(
        '¡Asistencia Registrada!',
        `${mensaje}\nHora: ${hora}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
              setIsProcessing(false);
            }
          }
        ]
      );
    } catch (error) {
      // Handle errors
      setScanned(false);
      setIsProcessing(false);

      // Enhanced error messages
      let errorTitle = 'Error al Registrar Asistencia';
      let errorMessage = error.message || 'No se pudo registrar la asistencia. Intenta de nuevo.';

      // Customize message based on error type
      if (error.message?.includes('membresía está inactiva')) {
        errorTitle = 'Membresía Inactiva';
        errorMessage = 'Tu membresía ha expirado o está inactiva.\n\nPor favor, contacta a recepción para renovar tu membresía y poder acceder al gimnasio.';
      } else if (error.message?.includes('Usuario no encontrado')) {
        errorTitle = 'Usuario No Encontrado';
        errorMessage = 'No se encontró un usuario con este DNI.\n\nPor favor, verifica tu DNI o contacta a recepción.';
      } else if (error.message?.includes('Datos inválidos')) {
        errorTitle = 'Datos Inválidos';
        errorMessage = 'El DNI proporcionado no es válido.\n\nPor favor, verifica tu DNI.';
      }

      Alert.alert(
        errorTitle,
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => setScanned(false)
          }
        ]
      );
    }
  };

  // Show permissions screen if needed
  if (hasPermission === null || hasPermission === false) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <PermissionsRequest hasPermission={hasPermission} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <QRCodeScanner
        scanned={scanned}
        onBarCodeScanned={handleBarCodeScanned}
        onLogoPress={handleLogoPress}
      />

      {/* DNI Input Overlay */}
      {showDniInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          <View style={styles.dniContainer}>
            <Text style={styles.dniTitle}>Configurar DNI</Text>
            <Text style={styles.dniSubtitle}>
              Por favor ingresa tu DNI para poder registrar tu asistencia
            </Text>

            <TextInput
              style={styles.dniInput}
              placeholder="Ingresa tu DNI"
              placeholderTextColor={COLORS.textSecondary}
              value={dniInput}
              onChangeText={setDniInput}
              keyboardType="numeric"
              maxLength={8}
              autoFocus
            />

            <TouchableOpacity
              style={styles.dniButton}
              onPress={handleDniSubmit}
            >
              <Text style={styles.dniButtonText}>Guardar DNI</Text>
            </TouchableOpacity>

            {dni && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDniInput(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  dniContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dniTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  dniSubtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  dniInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  dniButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dniButtonText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.textSecondary,
  },
});