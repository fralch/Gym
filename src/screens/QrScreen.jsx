import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';
import {
  PermissionsRequest,
  QRCodeScanner
} from '../components/scanner';
import FullscreenImageModal from '../components/ui/FullscreenImageModal';
import { checkinService, membresiasService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dniInput, setDniInput] = useState('');
  const [showDniInput, setShowDniInput] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null); // { url, nombre }
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'info'
  });
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

  const showAlert = (title, message, buttons = [], type = 'info') => {
    const formattedButtons = buttons.length > 0 
      ? buttons.map(btn => ({
          ...btn,
          onPress: () => {
            setAlertConfig(prev => ({ ...prev, visible: false }));
            if (btn.onPress) btn.onPress();
          }
        }))
      : [{ 
          text: 'OK', 
          onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) 
        }];

    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: formattedButtons,
      type
    });
  };

  const getCameraPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      showAlert(
        'Error',
        'No se pudo solicitar permisos de cámara. Verifica la configuración de tu dispositivo.',
        [],
        'error'
      );
    }
  };

  const handleLogoPress = () => {
    navigation.navigate('Login');
  };

  const handleDniSubmit = async () => {
    if (!dniInput.trim()) {
      showAlert('DNI Requerido', 'Por favor ingresa tu DNI.', [], 'warning');
      return;
    }

    // Validate DNI format (basic validation - adjust as needed)
    if (dniInput.trim().length < 7 || dniInput.trim().length > 8) {
      showAlert('DNI Inválido', 'El DNI debe tener entre 7 y 8 dígitos.', [], 'warning');
      return;
    }

    try {
      await setDni(dniInput.trim());
      setShowDniInput(false);
      setShowSuccessModal(true);
    } catch (error) {
      showAlert('Error', 'No se pudo guardar el DNI. Intenta de nuevo.', [], 'error');
    }
  };

  const handleCloseFullscreenImage = () => {
    const imageData = fullscreenImage;
    setFullscreenImage(null);
    setScanned(false);
    setIsProcessing(false);

    // Show success alert after closing the image
    if (imageData) {
      showAlert(
        '¡Asistencia Registrada!',
        `${imageData.mensaje}\nHora: ${imageData.hora}`,
        [{ text: 'OK' }],
        'success'
      );
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isProcessing) return; // Prevent multiple scans

    // Check if DNI is configured
    if (!hasDni) {
      showAlert('DNI Requerido', 'Por favor configura tu DNI antes de escanear el código QR.', [], 'warning');
      return;
    }

    setScanned(true);
    setIsProcessing(true);

    // Log scan data for debugging
    console.log(`QR Code scanned: ${type} - ${data}`);
    console.log('Using DNI for check-in:', dni);

    try {
      // Call the check-in API with the user's DNI
      const response = await checkinService.marcarAsistencia(dni);
      console.log('Checkin response:', JSON.stringify(response, null, 2));

      // Extract member data from response
      const memberData = response.data?.miembro || response.miembro;
      const fotoPerfil = memberData?.foto_perfil;
      const nombreMiembro = memberData?.nombre;
      const mensaje = response.mensaje || 'Asistencia registrada exitosamente';
      const hora = response.hora || response.data?.hora_entrada || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      // Show fullscreen image if available
      if (fotoPerfil) {
        setFullscreenImage({
          url: fotoPerfil,
          nombre: nombreMiembro,
          mensaje,
          hora
        });
      } else {
        // No image available, show alert directly
        showAlert(
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
          ],
          'success'
        );
      }
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

      showAlert(
        errorTitle,
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => setScanned(false)
          }
        ],
        'error'
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

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.successTitle}>¡DNI Guardado!</Text>
            <Text style={styles.successMessage}>
              Tu DNI ha sido guardado correctamente.
              Ahora puedes escanear el código QR.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Image Modal */}
      <FullscreenImageModal
        visible={!!fullscreenImage}
        image={fullscreenImage}
        onClose={handleCloseFullscreenImage}
      />

      {/* Custom Alert Modal */}
      <Modal
        visible={alertConfig.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.alertIconContainer}>
              <MaterialIcons 
                name={
                  alertConfig.type === 'success' ? 'check-circle' : 
                  alertConfig.type === 'error' ? 'error' : 
                  'info'
                } 
                size={64} 
                color={
                  alertConfig.type === 'success' ? COLORS.primary : 
                  alertConfig.type === 'error' ? '#FF5252' : 
                  COLORS.primary
                } 
              />
            </View>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            
            <View style={styles.alertButtonsContainer}>
              {alertConfig.buttons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alertButton,
                    btn.style === 'cancel' ? styles.alertButtonCancel : styles.alertButtonDefault,
                    alertConfig.buttons.length > 1 && { flex: 1, marginHorizontal: 5 }
                  ]}
                  onPress={btn.onPress}
                >
                  <Text style={[
                    styles.alertButtonText,
                    btn.style === 'cancel' ? styles.alertButtonTextCancel : styles.alertButtonTextDefault
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: COLORS.surface,
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
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  dniSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  dniInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
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
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successIconContainer: {
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  successButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  alertIconContainer: {
    marginBottom: SPACING.lg,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  alertButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  alertButton: {
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    minWidth: 100,
  },
  alertButtonDefault: {
    backgroundColor: COLORS.primary,
  },
  alertButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  alertButtonTextDefault: {
    color: '#FFFFFF',
  },
  alertButtonTextCancel: {
    color: COLORS.textSecondary,
  },
});