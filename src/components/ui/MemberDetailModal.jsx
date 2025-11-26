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

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
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
    borderTopLeftRadius: SPACING.borderRadius * 2,
    borderTopRightRadius: SPACING.borderRadius * 2,
    maxHeight: '80%',
    elevation: 6,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTexts: {
    flexDirection: 'column',
    flex: 1,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailContainer: {
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: theme.primary,
  },
  placeholderImage: {
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: SPACING.borderRadius,
  },
  statusPillText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: theme.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  detailInfo: {
    paddingHorizontal: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  detailRowText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: theme.textPrimary,
    marginLeft: SPACING.sm,
  },
  membershipCard: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.md,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
          <View style={styles.modalHeader}>
            <View style={styles.headerTexts}>
              <Text style={styles.modalTitle}>{member.nombre}</Text>
              <Text style={styles.modalSubtitle}>DNI {member.dni}</Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: member.estado === 'Activo' ? theme.success : theme.error },
                ]}
              >
                <Text style={styles.statusPillText}>{member.estado}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.detailContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.detailImage} resizeMode="cover" />
              ) : (
                <View style={[styles.detailImage, styles.placeholderImage]}>
                  <MaterialIcons name="person" size={80} color={theme.textSecondary} />
                </View>
              )}
            </View>

            <View style={styles.detailInfo}>
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={20} color={theme.textSecondary} />
                <View style={styles.detailRowText}>
                  <Text style={styles.detailLabel}>Nombre</Text>
                  <Text style={styles.detailValue}>{member.nombre}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="badge" size={20} color={theme.textSecondary} />
                <View style={styles.detailRowText}>
                  <Text style={styles.detailLabel}>DNI</Text>
                  <Text style={styles.detailValue}>{member.dni}</Text>
                </View>
              </View>

              {member.telefono ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${member.telefono}`)}
                  accessibilityRole="button"
                  style={styles.detailRow}
                >
                  <MaterialIcons name="phone" size={20} color={theme.textSecondary} />
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Teléfono</Text>
                    <Text style={styles.detailValue}>{member.telefono}</Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {member.fecha_nacimiento ? (
                <View style={styles.detailRow}>
                  <MaterialIcons name="event" size={20} color={theme.textSecondary} />
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Fecha de Nacimiento</Text>
                    <Text style={styles.detailValue}>
                      {new Date(member.fecha_nacimiento).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                </View>
              ) : null}

              {member.genero ? (
                <View style={styles.detailRow}>
                  <MaterialIcons name="wc" size={20} color={theme.textSecondary} />
                  <View style={styles.detailRowText}>
                    <Text style={styles.detailLabel}>Género</Text>
                    <Text style={styles.detailValue}>{member.genero}</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.detailRow}>
                <MaterialIcons name="event-available" size={20} color={theme.textSecondary} />
                <View style={styles.detailRowText}>
                  <Text style={styles.detailLabel}>Fecha de Registro</Text>
                  <Text style={styles.detailValue}>
                    {new Date(member.fecha_registro).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              </View>

              {membership && (
                <View style={styles.membershipCard}>
                  <View style={styles.membershipHeader}>
                    <MaterialIcons name="card-membership" size={20} color={theme.primary} />
                    <Text style={styles.sectionTitle}>Membresía Actual</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="assignment" size={20} color={theme.textSecondary} />
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Plan</Text>
                      <Text style={styles.detailValue}>{membership.tipo_plan}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="check-circle" size={20} color={theme.textSecondary} />
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Estado</Text>
                      <Text style={styles.detailValue}>{membership.estado}</Text>
                    </View>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }] }>
                    <MaterialIcons name="event-busy" size={20} color={theme.textSecondary} />
                    <View style={styles.detailRowText}>
                      <Text style={styles.detailLabel}>Vence</Text>
                      <Text style={styles.detailValue}>
                        {new Date(membership.fecha_fin).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
