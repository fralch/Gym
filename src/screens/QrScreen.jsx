import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { COLORS } from '../constants';
import { 
  PermissionsRequest, 
  QRCodeScanner, 
  UserInfoModal 
} from '../components/scanner';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    getCameraPermissions();
  }, []);

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Log scan data for debugging
    console.log(`QR Code scanned: ${type} - ${data}`);
    
    // Show user info modal
    toggleModal();
    
    // Optionally show a brief success feedback
    // You could add haptic feedback here if desired
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleFlashToggle = () => {
    setFlashOn(!flashOn);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleScanAgain = (shouldScan) => {
    setScanned(!shouldScan);
  };

  // Show permissions screen if needed
  if (hasPermission === null || hasPermission === false) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <PermissionsRequest hasPermission={hasPermission} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <QRCodeScanner
        scanned={scanned}
        onBarCodeScanned={handleBarCodeScanned}
        flashOn={flashOn}
        onFlashToggle={handleFlashToggle}
      />
      
      <UserInfoModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onScanned={handleScanAgain}
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