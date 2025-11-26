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
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Si puedes, usa LinearGradient para la tarjeta de membresía, se ve mucho mejor.
// Si no, cambia LinearGradient por View en el renderizado.
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import { SPACING, TYPOGRAPHY } from '../../constants';

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Oscurecer un poco más para foco
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: theme.background, // Usar background general, no card
    borderTopLeftRadius: 30, // Más redondeado
    borderTopRightRadius: 30,
    height: '85%', // Un poco más alto
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  // La pequeña barra gris para indicar que se puede deslizar
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: theme.cardBackground, // Diferenciar cabecera del cuerpo
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
    // Sombra suave para separar la cabecera del scroll
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  closeButtonAbs: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    padding: SPACING.xs,
    backgroundColor: theme.background,
    borderRadius: 20,
  },
  imageContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  detailImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.cardBackground, // Borde blanco/oscuro para separar del fondo
  },
  placeholderImage: {
    backgroundColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800', // Más grueso
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  dniText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textSecondary,
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: theme.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Cuerpo del scroll
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  
  // Grupos de información (Tarjetas)
  infoGroup: {
    backgroundColor: theme.cardBackground,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.border, // Borde muy sutil
  },
  groupTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: theme.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.background, // Fondo suave para el icono
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: theme.textPrimary,
    fontWeight: '600',
  },

  // Tarjeta de Membresía (Estilo Tarjeta de Crédito)
  membershipCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    elevation: 8,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardValue: {
    color: '#FFF',
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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

  const isActive = member.estado === 'Activo';
  const statusColor = isActive ? theme.success : theme.error;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContent}>
          {/* Barra de arrastre visual */}
          <View style={styles.dragHandle} />

          {/* Botón Cerrar Flotante */}
          <TouchableOpacity 
            style={styles.closeButtonAbs} 
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <MaterialIcons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* HEADER SECTION: Foto y Datos principales */}
          <View style={styles.headerSection}>
            <View style={styles.imageContainer}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.detailImage} resizeMode="cover" />
              ) : (
                <View style={[styles.detailImage, styles.placeholderImage]}>
                  <MaterialIcons name="person" size={60} color={theme.textSecondary} />
                </View>
              )}
            </View>

            <Text style={styles.nameText}>{member.nombre}</Text>
            <Text style={styles.dniText}>DNI {member.dni}</Text>

            <View style={[styles.statusContainer, { borderColor: statusColor }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{member.estado}</Text>
            </View>
          </View>

          {/* BODY: Scroll de detalles */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            
            {/* SECCIÓN 1: Datos Personales agrupados */}
            <View style={styles.infoGroup}>
              <Text style={styles.groupTitle}>Información Personal</Text>
              
              {/* Reusable Row Component logic */}
              <InfoRow 
                icon="phone" 
                label="Teléfono" 
                value={member.telefono} 
                theme={theme}
                styles={styles}
                isLink={true}
              />
              <InfoRow 
                icon="cake" 
                label="Fecha de Nacimiento" 
                value={member.fecha_nacimiento ? new Date(member.fecha_nacimiento).toLocaleDateString('es-ES') : null} 
                theme={theme}
                styles={styles}
              />
               <InfoRow 
                icon="wc" 
                label="Género" 
                value={member.genero} 
                theme={theme}
                styles={styles}
                last
              />
            </View>

             <View style={styles.infoGroup}>
                <Text style={styles.groupTitle}>Datos de Registro</Text>
                 <InfoRow 
                  icon="event-available" 
                  label="Miembro desde" 
                  value={new Date(member.fecha_registro).toLocaleDateString('es-ES')} 
                  theme={theme}
                  styles={styles}
                  last
                />
             </View>

            {/* SECCIÓN 2: Membresía (Diseño Premium) */}
            {membership && (
              <View>
                <Text style={[styles.groupTitle, { marginLeft: SPACING.xs }]}>Membresía</Text>
                {/* Si NO tienes expo-linear-gradient, cambia <LinearGradient> por <View style={[styles.membershipCard, {backgroundColor: theme.primary}]}> 
                */}
                <LinearGradient
                  colors={[theme.primary, theme.secondary || '#4a90e2']} // Gradiente del color primario a uno secundario
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.membershipCard}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardLabel}>PLAN ACTUAL</Text>
                      <Text style={styles.planText}>{membership.tipo_plan}</Text>
                    </View>
                    <MaterialIcons name="verified" size={24} color="rgba(255,255,255,0.8)" />
                  </View>

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardLabel}>VENCIMIENTO</Text>
                      <Text style={styles.cardValue}>
                        {new Date(membership.fecha_fin).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                       <Text style={[styles.cardValue, { fontSize: 12 }]}>{membership.estado}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Componente auxiliar para filas limpias
const InfoRow = ({ icon, label, value, theme, styles, isLink, last }) => {
  if (!value) return null;
  
  const Content = (
    <View style={[styles.infoRow, last && { marginBottom: 0 }]}>
      <View style={styles.iconBox}>
        <MaterialIcons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {isLink && <MaterialIcons name="chevron-right" size={20} color={theme.border} />}
    </View>
  );

  if (isLink) {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${value}`)}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};