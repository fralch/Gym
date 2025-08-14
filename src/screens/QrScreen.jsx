import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import { 
  PermissionsRequest, 
  QRCodeScanner
} from '../components/scanner';

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getCameraPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Log scan data for debugging
    console.log(`QR Code scanned: ${type} - ${data}`);
    
    // Navigate to UserInfo screen with scanned data
    navigation.navigate('UserInfo', { qrData: data });
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