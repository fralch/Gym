import React, { useEffect, useRef } from 'react';
import { Platform, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { SPACING, TYPOGRAPHY } from '../constants';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/ui/Card';

export default function UserInfoScreen({ route }) {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const { qrData } = route.params || {};

  const userInfo = {
    name: 'Alexander Frank Cairampoma',
    dni: '12345678',
    startDate: '19-09-2022',
    endDate: '19-09-2023',
    remainingDays: 298,
    qrData: qrData || 'No data scanned',
  };

  const getStatusColor = (days) => {
    if (days > 60) return theme.success;
    if (days > 30) return theme.warning;
    return theme.error;
  };

  const getDaysText = (days) => {
    if (days > 365) return `${Math.floor(days / 365)} año${Math.floor(days / 365) > 1 ? 's' : ''} restante${Math.floor(days / 365) > 1 ? 's' : ''}`;
    if (days > 30) return `${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''} restante${Math.floor(days / 30) > 1 ? 's' : ''}`;
    return `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`;
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleStatsPress = () => {
    navigation.navigate('Stats');
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Platform.OS === 'android' ? theme.primary : 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: 'white' }]}>Información del Usuario</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons 
              name={isDarkMode ? "light-mode" : "dark-mode"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section with Blue Background */}
        <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
          <View style={styles.blueBackground}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageRing}>
                <Image
                  source={require('../../assets/imgs/user.jpg')}
                  style={styles.profileImage}
                  transition={500}
                />
              </View>
              <View style={styles.checkBadge}>
                <MaterialIcons name="check" size={16} color="white" />
              </View>
            </View>
          </View>
          
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userDni}>DNI: {userInfo.dni}</Text>
            <View style={styles.userStatusPill}>
              <MaterialIcons name="check-circle" size={16} color={theme.textInverse} />
              <Text style={styles.userStatusText}>Activo</Text>
            </View>
          </View>
        </Animated.View>

        {/* User Information */}
        <Card style={styles.menuContainer}>
          <MenuItem
            icon="check-circle"
            label="Estado"
            value="Activo"
            valueColor={theme.success}
          />

          <MenuItem
            icon="badge"
            label="DNI"
            value={userInfo.dni}
          />

          <MenuItem
            icon="event"
            label="Fecha de Inicio"
            value={userInfo.startDate}
          />

          <MenuItem
            icon="event-available"
            label="Fecha de Fin"
            value={userInfo.endDate}
          />

          <MenuItem
            icon="schedule"
            label="Tiempo Restante"
            value={getDaysText(userInfo.remainingDays)}
            valueColor={getStatusColor(userInfo.remainingDays)}
            showBadge
            badgeColor={getStatusColor(userInfo.remainingDays)}
          />

          <MenuItem
            icon="qr-code"
            label="Último QR"
            value={userInfo.qrData}
            noBorder
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleStatsPress}
            accessibilityRole="button"
            accessibilityLabel="Ver estadísticas"
          >
            <MaterialIcons name="bar-chart" size={24} color={theme.textInverse} />
            <Text style={styles.scanAgainText}>Ver Estadísticas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const MenuItem = React.memo(function MenuItem({ icon, label, value, valueColor, showBadge, badgeColor, noBorder }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const a11yLabel = value ? `${label}: ${value}` : label;
  
  return (
    <TouchableOpacity
      style={[styles.menuItem, noBorder && { borderBottomWidth: 0 }]}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        <Text
          style={[styles.menuValue, { color: valueColor || theme.textSecondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
        {showBadge && (
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]} />
        )}
      </View>
    </TouchableOpacity>
  );
});

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.primary,
  },

  headerButton: {
    padding: 5,
  },

  headerTitle: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    letterSpacing: 0.3,
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  blueBackground: {
    backgroundColor: theme.primary,
    width: '100%',
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60, // Increased padding to push the image down
  },

  profileImageContainer: {
    position: 'absolute',
    bottom: -50, // Adjust this to position the image correctly
  },

  profileImageRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  checkBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.success,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.background,
  },

  userInfoSection: {
    alignItems: 'center',
    marginTop: 60, // Increased margin to give space for the image
    paddingHorizontal: 20,
  },

  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },

  userDni: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textSecondary,
    marginBottom: 12,
  },

  userStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  userStatusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: 6,
  },

  menuContainer: {
    marginHorizontal: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  menuLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    marginRight: 10,
    textAlign: 'right',
    flexShrink: 1,
  },

  statusBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  scanAgainText: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: 10,
  },
});