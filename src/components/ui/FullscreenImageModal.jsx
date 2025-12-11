import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, StatusBar, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function FullscreenImageModal({ visible, onClose, image }) {
  if (!image) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        
        {/* Background Overlay */}
        <View style={styles.blackOverlay} />
        <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BlurView intensity={30} tint="light" style={styles.closeButtonBlur}>
            <MaterialIcons name="close" size={28} color="#FFFFFF" />
          </BlurView>
        </TouchableOpacity>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Header Info */}
          <View style={styles.headerContainer}>
            {image.nombre && (
              <Text style={styles.memberName} numberOfLines={2}>
                {image.nombre}
              </Text>
            )}
            {image.mensaje && (
              <Text style={styles.memberStatus}>
                {image.mensaje}
              </Text>
            )}
          </View>

          {/* Profile Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />
          </View>

          {/* Footer Info */}
          <View style={styles.footerWrapper}>
             {image.hora && (
              <View style={styles.timeContainer}>
                <MaterialIcons name="access-time" size={18} color="#CCCCCC" />
                <Text style={styles.timeText}>{image.hora}</Text>
              </View>
            )}

            {/* Tap to close hint */}
            <TouchableOpacity
              style={styles.tapToCloseHint}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.tapToCloseText}>Toca para continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 50, // Safe area approximation
    right: 20,
    zIndex: 20,
  },
  closeButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    zIndex: 10,
    paddingTop: 40,
  },
  memberName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  memberStatus: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: '#4ADE80', // Greenish
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: SPACING.xs,
  },
  imageWrapper: {
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footerWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.xl,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  tapToCloseHint: {
    padding: SPACING.md,
  },
  tapToCloseText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: TYPOGRAPHY.fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
