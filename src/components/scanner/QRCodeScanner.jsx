import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

export default function QRCodeScanner({ scanned, onBarCodeScanned, flashOn, onFlashToggle }) {
  const [scanAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [scanned, scanAnimation]);

  const scanLineTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <CameraView
      onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417"],
      }}
      flash={flashOn ? 'on' : 'off'}
      style={StyleSheet.absoluteFillObject}
    >
      <View style={styles.overlay}>
        {/* Header with flash toggle */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.flashButton}
            onPress={onFlashToggle}
          >
            <MaterialIcons 
              name={flashOn ? 'flash-on' : 'flash-off'} 
              size={28} 
              color={flashOn ? COLORS.warning : COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>

        {/* Main scanning area */}
        <View style={styles.scanningArea}>
          <View style={styles.scanFrame}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Animated scan line */}
            {!scanned && (
              <Animated.View 
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineTranslateY }] }
                ]}
              />
            )}
          </View>

          <Text style={styles.instructionText}>
            Coloca el código QR dentro del marco
          </Text>
          
          <Text style={styles.subText}>
            El código se escaneará automáticamente
          </Text>
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.scannerOverlay,
  },
  
  header: {
    flex: 0.15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: SPACING.containerPadding,
    paddingBottom: SPACING.md,
  },
  
  flashButton: {
    backgroundColor: COLORS.scannerBackground,
    padding: SPACING.md,
    borderRadius: SPACING.largeBorderRadius,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  scanningArea: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.scannerCorner,
    borderWidth: 4,
    borderRadius: SPACING.smallBorderRadius,
  },
  
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.scannerCorner,
    top: '50%',
    shadowColor: COLORS.scannerCorner,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  instructionText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textAlign: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.containerPadding,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  
  subText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.containerPadding,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  bottomSpacer: {
    flex: 0.15,
  },
});