import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import {
  PermissionsRequest,
  QRCodeScanner
} from '../components/scanner';
import { checkinService, membresiasService } from '../services';
import { useAuth } from '../contexts/AuthContext';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    getCameraPermissions();
  }, []);

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

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isProcessing) return; // Prevent multiple scans

    setScanned(true);
    setIsProcessing(true);

    // Log scan data for debugging
    console.log(`QR Code scanned: ${type} - ${data}`);

    try {
      // Call the check-in API with the scanned QR token
      const response = await checkinService.marcarAsistencia(data);

      // Fetch membership details to show in confirmation
      let membershipInfo = '';
      if (user?.id_usuario) {
        try {
          const membership = await membresiasService.getActiveMembership(user.id_usuario);
          if (membership) {
            const fechaFin = new Date(membership.fecha_fin).toLocaleDateString('es-ES');
            membershipInfo = `\n\nMembresía: ${membership.tipo_plan}\nVence: ${fechaFin}`;
          }
        } catch (membershipError) {
          console.error('Error fetching membership:', membershipError);
          // Continue without membership info
        }
      }

      // Success - show confirmation with membership details
      Alert.alert(
        '¡Asistencia Registrada! ✓',
        `${response.mensaje}\nHora: ${response.hora}${membershipInfo}`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('UserInfo', {
                checkinSuccess: true,
                checkinTime: response.hora
              });
            }
          }
        ]
      );
    } catch (error) {
      // Handle errors
      setScanned(false);
      setIsProcessing(false);

      // Enhanced error messages for membership issues
      let errorTitle = 'Error al Registrar Asistencia';
      let errorMessage = error.message || 'No se pudo registrar la asistencia. Intenta de nuevo.';

      // Customize message based on error type
      if (error.message?.includes('membresía está inactiva')) {
        errorTitle = 'Membresía Inactiva';
        errorMessage = 'Tu membresía ha expirado o está inactiva.\n\nPor favor, contacta a recepción para renovar tu membresía y poder acceder al gimnasio.';
      } else if (error.message?.includes('QR inválido')) {
        errorTitle = 'Código QR Inválido';
        errorMessage = 'El código QR escaneado no es válido.\n\nAsegúrate de escanear el código QR oficial del gimnasio.';
      } else if (error.message?.includes('No autenticado')) {
        errorTitle = 'Sesión Expirada';
        errorMessage = 'Tu sesión ha expirado.\n\nPor favor, inicia sesión nuevamente.';
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});