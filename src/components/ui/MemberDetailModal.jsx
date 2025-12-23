import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  headerGradient: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerImageWrapper: {
    marginRight: SPACING.md,
  },
  headerImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTexts: {
    flex: 1,
    marginRight: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContainer: {
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusPillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  detailInfo: {
    paddingHorizontal: SPACING.lg,
  },
  infoCard: {
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  detailRowText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    color: theme.textPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginLeft: SPACING.sm,
  },
  membershipCard: {
    backgroundColor: theme.primary + '10',
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: theme.primary + '30',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.primary + '20',
  },
  membershipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    marginLeft: SPACING.sm,
  },
  phoneRow: {
    backgroundColor: theme.primary + '08',
  },
});

export default function MemberDetailModal({
  visible,
  onClose,
  member,
  photoUrl,
  membership,
}) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!member) return null;

  const getStatusColor = (status) => {
    return status === 'Activo' ? '#10B981' : '#EF4444';
  };

  const getGradientColors = () => {
    return [theme.primary, theme.primary + 'DD'];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.dragHandle} />
          
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.headerImageWrapper}>
                  {photoUrl ? (
                    <Image 
                      source={{ uri: photoUrl }} 
                      style={styles.headerImage} 
                      resizeMode="cover" 
                    />
                  ) : (
                    <View style={[styles.headerImage, styles.headerPlaceholder]}>
                      <MaterialIcons name="person" size={32} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.headerTexts}>
                  <Text style={styles.modalTitle}>{member.nombre}</Text>
                  <Text style={styles.modalSubtitle}>DNI {member.dni}</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getStatusColor(member.estado) },
                  ]}
                >
                  <Text style={styles.statusPillText}>{member.estado}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView 
            contentContainerStyle={styles.detailContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailInfo}>
              <View style={styles.infoCard}>
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="person" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Nombre Completo</Text>
                    <Text style={styles.detailValue}>{member.nombre}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="badge" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Documento de Identidad</Text>
                    <Text style={styles.detailValue}>{member.dni}</Text>
                  </View>
                </View>

                {member.telefono && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${member.telefono}`)}
                    style={[styles.detailRow, styles.phoneRow]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="phone" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Teléfono</Text>
                      <Text style={styles.detailValue}>{member.telefono}</Text>
                    </View>
                    <MaterialIcons name="call" size={18} color={theme.primary} />
                  </TouchableOpacity>
                )}

                {member.fecha_nacimiento && (
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="cake" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Fecha de Nacimiento</Text>
                      <Text style={styles.detailValue}>
                        {new Date(member.fecha_nacimiento).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                  </View>
                )}

                {member.genero && (
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="wc" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Género</Text>
                      <Text style={styles.detailValue}>{member.genero}</Text>
                    </View>
                  </View>
                )}

                <View style={[styles.detailRow, styles.detailRowLast]}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="event-available" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Miembro Desde</Text>
                    <Text style={styles.detailValue}>
                      {new Date(member.fecha_registro).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              {membership && (
                <>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="stars" size={22} color={theme.primary} />
                    <Text style={styles.sectionTitle}>Información de Membresía</Text>
                  </View>
                  
                  <View style={styles.membershipCard}>
                    <View style={styles.membershipBadge}>
                      <MaterialIcons name="card-membership" size={24} color={theme.primary} />
                      <Text style={styles.membershipTitle}>{membership.tipo_plan}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <MaterialIcons name="check-circle" size={20} color={theme.primary} />
                      </View>
                      <View style={styles.detailRowText}>
                        <Text style={styles.detailLabel}>Estado del Plan</Text>
                        <Text style={styles.detailValue}>{membership.estado}</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.detailRow, styles.detailRowLast]}>
                      <View style={styles.iconContainer}>
                        <MaterialIcons name="event" size={20} color={theme.primary} />
                      </View>
                      <View style={styles.detailRowText}>
                        <Text style={styles.detailLabel}>Fecha de Vencimiento</Text>
                        <Text style={styles.detailValue}>
                          {new Date(membership.fecha_fin).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}