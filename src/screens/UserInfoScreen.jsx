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
        <View style={styles.menuContainer}>
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

         
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
         
          <TouchableOpacity
            style={[styles.scanAgainButton, { marginTop: 15, backgroundColor: theme.success }]}
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
          style={[styles.menuValue, { color: valueColor || theme.textPrimary }]}
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
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    ...Platform.select({ android: { elevation: 4 } }),
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
    marginBottom: 30,
  },

  blueBackground: {
    backgroundColor: theme.primary,
    width: '100%',
    height: 120,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  profileImageContainer: {
    position: 'relative',
    marginBottom: -40,
  },

  profileImageRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    ...Platform.select({ android: { elevation: 4 } }),
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.textInverse,
  },

  checkBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.success,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.textInverse,
  },

  userInfoSection: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },

  userDni: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 3,
  },

  userStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  userStatusText: {
    fontSize: 12,
    color: theme.textInverse,
    fontWeight: '600',
    marginLeft: 6,
  },

  menuContainer: {
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    ...Platform.select({ android: { elevation: 3 } }),
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: theme.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  menuLabel: {
    fontSize: 16,
    color: theme.textPrimary,
    fontWeight: '500',
    flex: 1,
  },

  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },

  menuValue: {
    fontSize: 14,
    color: theme.textSecondary,
    marginRight: 10,
    textAlign: 'right',
    flexShrink: 1,
  },

  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  actionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 250,
    justifyContent: 'center',
  },

  scanAgainText: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: 10,
  },
});