import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import { SPACING, TYPOGRAPHY } from '../../constants';

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: SPACING.borderRadius * 2,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
  },
  detailContainer: {
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  detailImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: theme.primary,
  },
  placeholderImage: {
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailInfo: {
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: theme.textPrimary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: SPACING.md,
  },
  membershipDetail: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: theme.border,
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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Miembro</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.detailContainer}>
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
              <Text style={styles.detailLabel}>Nombre:</Text>
              <Text style={styles.detailValue}>{member.nombre}</Text>

              <Text style={styles.detailLabel}>DNI:</Text>
              <Text style={styles.detailValue}>{member.dni}</Text>

              {member.telefono && (
                <>
                  <Text style={styles.detailLabel}>Teléfono:</Text>
                  <Text style={styles.detailValue}>{member.telefono}</Text>
                </>
              )}

              {member.fecha_nacimiento && (
                <>
                  <Text style={styles.detailLabel}>Fecha de Nacimiento:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(member.fecha_nacimiento).toLocaleDateString()}
                  </Text>
                </>
              )}

              {member.genero && (
                <>
                  <Text style={styles.detailLabel}>Género:</Text>
                  <Text style={styles.detailValue}>{member.genero}</Text>
                </>
              )}

              <Text style={styles.detailLabel}>Fecha de Registro:</Text>
              <Text style={styles.detailValue}>
                {new Date(member.fecha_registro).toLocaleDateString()}
              </Text>

              <Text style={styles.detailLabel}>Estado:</Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: member.estado === 'Activo' ? theme.success : theme.error,
                    fontWeight: 'bold',
                  },
                ]}
              >
                {member.estado}
              </Text>

              {membership && (
                <View style={styles.membershipDetail}>
                  <Text style={styles.sectionTitle}>Membresía Actual</Text>
                  <Text style={styles.detailLabel}>Plan: {membership.tipo_plan}</Text>
                  <Text style={styles.detailLabel}>Estado: {membership.estado}</Text>
                  <Text style={styles.detailLabel}>
                    Vence: {new Date(membership.fecha_fin).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
