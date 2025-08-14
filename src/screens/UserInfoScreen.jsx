import React from 'react';
import { Platform } from 'react-native';
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.statusBarBackground} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: 55 }]}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textInverse} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Información del Usuario</Text>
          <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
            <MaterialIcons 
              name={isDarkMode ? "light-mode" : "dark-mode"} 
              size={24} 
              color={theme.textInverse} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section with Blue Background */}
        <View style={styles.profileSection}>
          <View style={styles.blueBackground}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../../assets/imgs/user.jpg')}
                style={styles.profileImage}
                transition={500}
              />
              <View style={styles.checkBadge}>
                <MaterialIcons name="check" size={16} color="white" />
              </View>
            </View>
          </View>
          
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userDni}>DNI: {userInfo.dni}</Text>
            <Text style={styles.userStatus}>Activo</Text>
          </View>
        </View>

        {/* User Information */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="check-circle"
            label="Estado"
            value="Activo"
            valueColor="#4CAF50"
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

         
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleBackPress}>
            <MaterialIcons name="qr-code-scanner" size={24} color={theme.textInverse} />
            <Text style={styles.scanAgainText}>Escanear Nuevo Código</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, value, valueColor, showBadge, badgeColor }) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        <Text style={[styles.menuValue, { color: valueColor || theme.textPrimary }]}>
          {value}
        </Text>
        {showBadge && (
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

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
  },

  headerButton: {
    padding: 5,
  },

  headerTitle: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
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

  userStatus: {
    fontSize: 12,
    color: theme.success,
    fontWeight: '500',
  },

  menuContainer: {
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
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
  },

  scanAgainText: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: 10,
  },
});