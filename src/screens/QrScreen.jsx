import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import {
  PermissionsRequest,
  QRCodeScanner
} from '../components/scanner';
import { checkinService } from '../services';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

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

      // Success - show confirmation and navigate
      Alert.alert(
        '¡Asistencia Registrada! ✓',
        `${response.mensaje}\nHora: ${response.hora}`,
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

      Alert.alert(
        'Error al Registrar Asistencia',
        error.message || 'No se pudo registrar la asistencia. Intenta de nuevo.',
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