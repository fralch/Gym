import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Modal, 
  Dimensions, 
  ScrollView,
  StatusBar 
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Button, Card } from '../ui';
import SocialLinks from './SocialLinks';

const { height: screenHeight } = Dimensions.get('window');

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Información del Usuario</Text>
            <MaterialIcons name="person" size={24} color={COLORS.accent} />
          </View>

          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <Image 
              source={require('../../../assets/imgs/user.jpg')} 
              style={styles.profileImage}
              transition={500}
            />
            
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <View style={styles.statusBadge}>
                <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.statusText}>Activo</Text>
              </View>
            </View>
          </Card>

          {/* Info Cards */}
          <View style={styles.infoContainer}>
            <InfoCard
              icon="badge"
              label="DNI"
              value={userInfo.dni}
            />
            
            <InfoCard
              icon="event"
              label="Fecha de Inicio"
              value={userInfo.startDate}
            />
            
            <InfoCard
              icon="event-available"
              label="Fecha de Fin"
              value={userInfo.endDate}
            />
            
            <InfoCard
              icon="schedule"
              label="Tiempo Restante"
              value={getDaysText(userInfo.remainingDays)}
              valueStyle={{ color: getStatusColor(userInfo.remainingDays) }}
              showBadge
              badgeColor={getStatusColor(userInfo.remainingDays)}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Escanear Nuevo QR"
              variant="outline"
              onPress={handleClose}
              style={styles.secondaryButton}
            />
            <Button
              title="Cerrar"
              variant="primary"
              onPress={onClose}
              style={styles.primaryButton}
            />
          </View>
        </ScrollView>

        <SocialLinks />
      </View>
    </Modal>
  );
}

function InfoCard({ icon, label, value, valueStyle, showBadge, badgeColor }) {
  return (
    <Card style={styles.infoCard}>
      <View style={styles.infoCardContent}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name={icon} size={20} color={COLORS.accent} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <View style={styles.infoValueContainer}>
            <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
            {showBadge && (
              <View style={[styles.infoBadge, { backgroundColor: badgeColor }]} />
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.containerPadding,
    paddingTop: SPACING.xl,
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  
  profileCard: {
    alignItems: 'center',
    marginHorizontal: SPACING.containerPadding,
    marginBottom: SPACING.lg,
  },
  
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
  },
  
  nameContainer: {
    alignItems: 'center',
  },
  
  userName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.largeBorderRadius,
  },
  
  statusText: {
    color: COLORS.success,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
  
  infoContainer: {
    paddingHorizontal: SPACING.containerPadding,
    marginBottom: SPACING.lg,
  },
  
  infoCard: {
    marginBottom: SPACING.md,
  },
  
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  infoTextContainer: {
    flex: 1,
  },
  
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  
  infoBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  
  buttonContainer: {
    paddingHorizontal: SPACING.containerPadding,
    gap: SPACING.md,
  },
  
  primaryButton: {
    backgroundColor: COLORS.accent,
  },
  
  secondaryButton: {
    borderColor: COLORS.accent,
  },
});