import React, { useState } from 'react';
import { Text, View, StyleSheet, Animated, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { useThemedStyles } from '../../hooks/useTheme';

export default function QRCodeScanner({ scanned, onBarCodeScanned }) {
  const [scanAnimation] = useState(new Animated.Value(0));
  const styles = useThemedStyles(createStyles);

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
      style={StyleSheet.absoluteFillObject}
    >
      <View style={styles.overlay}>
        {/* Logo at the top */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../Images/Majanayim.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
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

          <Text style={[styles.instructionText, { color: '#FFFFFF' }]}>
            Coloca el código QR dentro del marco
          </Text>
          
          <Text style={styles.subText}>
            El código se escaneará automáticamente
          </Text>
        </View>
      </View>
    </CameraView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.scannerOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logoContainer: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    zIndex: 10,
  },
  
  logo: {
    width: 160,
    height: 120,
  },
  
  scanningArea: {
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
    borderColor: theme.scannerCorner,
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
    backgroundColor: theme.scannerCorner,
    top: '50%',
    shadowColor: theme.scannerCorner,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  instructionText: {
    color: theme.textInverse,
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
    color: theme.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.containerPadding,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});