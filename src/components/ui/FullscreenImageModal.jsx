import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, StatusBar, Dimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.75;

export default function FullscreenImageModal({ visible, onClose, image }) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!image) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Background Overlay */}
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacityAnim }]}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1} 
              onPress={onClose} 
            />
          </Animated.View>
        </BlurView>

        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <View style={styles.closeButtonInner}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Profile Card */}
        <Animated.View 
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Image Section with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
            {/* Gradient overlay for better text readability */}
            <View style={styles.gradientOverlay} />
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Name and Verified Badge */}
            <View style={styles.headerRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {image.nombre}
                </Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={20} color="#3B82F6" />
                </View>
              </View>
            </View>

            {/* Description/Status */}
            {image.mensaje && (
              <View style={styles.messageContainer}>
                <Text style={styles.statusText} numberOfLines={3}>
                  {image.mensaje}
                </Text>
              </View>
            )}

            {/* Stats / Info Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="schedule" size={18} color="#EF4444" />
                </View>
                <Text style={styles.statLabel}>Hora de registro</Text>
                <Text style={styles.statValue}>{image.hora}</Text>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  imageContainer: {
    height: '60%',
    width: '100%',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contentContainer: {
    height: '40%',
    width: '100%',
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    marginBottom: SPACING.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginRight: SPACING.xs,
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    fontWeight: '400',
  },
  statsRow: {
    marginBottom: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: SPACING.xs,
  },
});