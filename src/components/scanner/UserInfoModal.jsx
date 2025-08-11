import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import SocialLinks from './SocialLinks';

export default function UserInfoModal({ isVisible, onClose, onScanned }) {
  const handleClose = () => {
    onScanned(false);
    onClose();
  };

  const userInfo = {
    name: 'Alexander Frank Cairampoma',
    dni: '12345678',
    startDate: '19-09-2022',
    endDate: '19-09-2023',
    remainingDays: 298,
  };

  const getStatusColor = (days) => {
    if (days > 60) return COLORS.success;
    if (days > 30) return COLORS.warning;
    return COLORS.error;
  };

  const getDaysText = (days) => {
    if (days > 365) return `${Math.floor(days / 365)} año${Math.floor(days / 365) > 1 ? 's' : ''} restante${Math.floor(days / 365) > 1 ? 's' : ''}`;
    if (days > 30) return `${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''} restante${Math.floor(days / 30) > 1 ? 's' : ''}`;
    return `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section with Blue Background */}
          <View style={styles.profileSection}>
            <View style={styles.blueBackground}>
              <View style={styles.profileImageContainer}>
                <Image
                 source={require('../../../assets/imgs/user.jpg')}
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

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color="#666" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

function MenuItem({ icon, label, value, valueColor, showBadge, badgeColor }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons name={icon} size={20} color="#4A90E2" />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        <Text style={[styles.menuValue, { color: valueColor || '#333' }]}>
          {value}
        </Text>
        {showBadge && (
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#4A90E2',
  },

  headerButton: {
    padding: 5,
  },

  editText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  blueBackground: {
    backgroundColor: '#4A90E2',
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
    borderColor: 'white',
  },

  checkBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  userInfoSection: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },

  userDni: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },

  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },

  menuContainer: {
    backgroundColor: 'white',
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
    borderBottomColor: '#f0f0f0',
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  messageBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  logoutContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  logoutText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 8,
  },
});