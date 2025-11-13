import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SPACING, TYPOGRAPHY } from '../constants';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import miembrosService from '../services/miembrosService';
import membresiasService from '../services/membresiasService';

export default function AdminPanelScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'memberships'
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipForm, setMembershipForm] = useState({
    id_membresia: null,
    id_usuario: null,
    tipo_plan: 'Mensual',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Activa',
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

  useEffect(() => {
    if (activeTab === 'members') {
      loadMembers();
    } else {
      loadMemberships();
    }
  }, [activeTab]);

  const loadMembers = async (search = '') => {
    setLoading(true);
    try {
      const response = await miembrosService.getAll(search);
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de miembros');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMemberships = async () => {
    setLoading(true);
    try {
      const response = await membresiasService.getAll();
      if (response.success) {
        // Load member names for each membership
        const membershipsWithNames = await Promise.all(
          response.data.map(async (membership) => {
            try {
              const memberResponse = await miembrosService.getById(membership.id_usuario);
              return {
                ...membership,
                memberName: memberResponse.data?.nombre || 'Desconocido',
              };
            } catch {
              return {
                ...membership,
                memberName: 'Desconocido',
              };
            }
          })
        );
        setMemberships(membershipsWithNames);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de membresías');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (activeTab === 'members') {
      loadMembers(searchQuery);
    } else {
      loadMemberships();
    }
  }, [activeTab, searchQuery]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (activeTab === 'members') {
      loadMembers(text);
    }
  };

  const handleDeleteMember = (member) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar a ${member.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await miembrosService.delete(member.id_usuario);
              Alert.alert('Éxito', 'Miembro eliminado correctamente');
              loadMembers(searchQuery);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el miembro');
            }
          },
        },
      ]
    );
  };

  const handleToggleMemberStatus = async (member) => {
    try {
      const newStatus = member.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await miembrosService.update(member.id_usuario, { estado: newStatus });
      Alert.alert('Éxito', `Estado actualizado a ${newStatus}`);
      loadMembers(searchQuery);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const handleCreateMembership = (member) => {
    const today = new Date();
    const startStr = today.toISOString().split('T')[0];
    const endStr = computeEndDate(startStr, 'Mensual');

    setMembershipForm({
      id_membresia: null,
      id_usuario: member.id_usuario,
      tipo_plan: 'Mensual',
      fecha_inicio: startStr,
      fecha_fin: endStr,
      estado: 'Activa',
    });
    setSelectedStartDate(today);
    setSelectedMember(member);
    setShowMembershipModal(true);
  };

  const handleEditMembership = (membership) => {
    setMembershipForm({
      id_membresia: membership.id_membresia,
      id_usuario: membership.id_usuario,
      tipo_plan: membership.tipo_plan,
      fecha_inicio: membership.fecha_inicio,
      fecha_fin: membership.fecha_fin,
      estado: membership.estado,
    });
    setSelectedStartDate(new Date(membership.fecha_inicio));
    setSelectedMember({ nombre: membership.memberName });
    setShowMembershipModal(true);
  };

  const handleSaveMembership = async () => {
    try {
      if (membershipForm.id_membresia) {
        // Update existing membership
        await membresiasService.update(membershipForm.id_membresia, {
          tipo_plan: membershipForm.tipo_plan,
          fecha_inicio: membershipForm.fecha_inicio,
          fecha_fin: membershipForm.fecha_fin,
          estado: membershipForm.estado,
        });
        Alert.alert('Éxito', 'Membresía actualizada correctamente');
      } else {
        // Create new membership
        await membresiasService.create({
          id_usuario: membershipForm.id_usuario,
          tipo_plan: membershipForm.tipo_plan,
          fecha_inicio: membershipForm.fecha_inicio,
          fecha_fin: membershipForm.fecha_fin,
          estado: membershipForm.estado,
        });
        Alert.alert('Éxito', 'Membresía creada correctamente');
      }
      setShowMembershipModal(false);
      if (activeTab === 'members') {
        loadMembers(searchQuery);
      } else {
        loadMemberships();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la membresía');
    }
  };

  const handleDeleteMembership = (membership) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar esta membresía?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await membresiasService.delete(membership.id_membresia);
              Alert.alert('Éxito', 'Membresía eliminada correctamente');
              loadMemberships();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la membresía');
            }
          },
        },
      ]
    );
  };

  const calculateDaysRemaining = (fecha_fin) => {
    const today = new Date();
    const endDate = new Date(fecha_fin);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthsForPlan = (plan) => {
    switch (plan) {
      case 'Mensual':
        return 1;
      case 'Trimestral':
        return 3;
      case 'Semestral':
        return 6;
      case 'Anual':
        return 12;
      default:
        return 1;
    }
  };

  const computeEndDate = (startDateStr, planType) => {
    if (!startDateStr) return '';
    const startDate = new Date(startDateStr);
    const months = getMonthsForPlan(planType);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    return endDate.toISOString().split('T')[0];
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Seleccionar fecha';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const onStartDateChange = (event, date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedStartDate(date);
      const startStr = date.toISOString().split('T')[0];
      const endStr = computeEndDate(startStr, membershipForm.tipo_plan);
      setMembershipForm({ ...membershipForm, fecha_inicio: startStr, fecha_fin: endStr });
    }
  };

  const renderMemberCard = (member) => (
    <View key={member.id_usuario} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.nombre}</Text>
          <Text style={styles.memberDni}>DNI: {member.dni}</Text>
          <Text style={styles.memberDate}>
            Registro: {new Date(member.fecha_registro).toLocaleDateString()}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: member.estado === 'Activo' ? theme.success : theme.error },
          ]}
        >
          <Text style={styles.statusText}>{member.estado}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => handleCreateMembership(member)}
        >
          <MaterialIcons name="card-membership" size={16} color={theme.textInverse} />
          <Text style={styles.actionButtonText}>Membresía</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.warning }]}
          onPress={() => handleToggleMemberStatus(member)}
        >
          <MaterialIcons
            name={member.estado === 'Activo' ? 'block' : 'check-circle'}
            size={16}
            color={theme.textInverse}
          />
          <Text style={styles.actionButtonText}>
            {member.estado === 'Activo' ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.error }]}
          onPress={() => handleDeleteMember(member)}
        >
          <MaterialIcons name="delete" size={16} color={theme.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMembershipCard = (membership) => {
    const daysRemaining = calculateDaysRemaining(membership.fecha_fin);
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;
    const isExpired = daysRemaining < 0;

    return (
      <View key={membership.id_membresia} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{membership.memberName}</Text>
            <Text style={styles.memberDni}>Plan: {membership.tipo_plan}</Text>
            <Text style={styles.memberDate}>
              Inicio: {new Date(membership.fecha_inicio).toLocaleDateString()}
            </Text>
            <Text style={styles.memberDate}>
              Fin: {new Date(membership.fecha_fin).toLocaleDateString()}
            </Text>
            {daysRemaining >= 0 ? (
              <Text
                style={[
                  styles.memberDate,
                  isExpiringSoon && { color: theme.warning, fontWeight: 'bold' },
                ]}
              >
                Días restantes: {daysRemaining}
              </Text>
            ) : (
              <Text style={[styles.memberDate, { color: theme.error, fontWeight: 'bold' }]}>
                Vencida hace {Math.abs(daysRemaining)} días
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isExpired
                  ? theme.error
                  : membership.estado === 'Activa'
                  ? theme.success
                  : theme.textSecondary,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {isExpired ? 'Vencida' : membership.estado}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() => handleEditMembership(membership)}
          >
            <MaterialIcons name="edit" size={16} color={theme.textInverse} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={() => handleDeleteMembership(membership)}
          >
            <MaterialIcons name="delete" size={16} color={theme.textInverse} />
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textInverse} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Panel de Administración</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        {activeTab === 'members' && (
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o DNI..."
              placeholderTextColor="#FFFFFF"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <MaterialIcons name="clear" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <MaterialIcons
            name="people"
            size={20}
            color={activeTab === 'members' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'members' && { color: theme.primary, fontWeight: 'bold' },
            ]}
          >
            Miembros ({members.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'memberships' && styles.activeTab]}
          onPress={() => setActiveTab('memberships')}
        >
          <MaterialIcons
            name="card-membership"
            size={20}
            color={activeTab === 'memberships' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'memberships' && { color: theme.primary, fontWeight: 'bold' },
            ]}
          >
            Membresías ({memberships.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'members' ? (
              <>
                {members.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="people-outline" size={64} color={theme.textSecondary} />
                    <Text style={styles.emptyText}>
                      {searchQuery ? 'No se encontraron miembros' : 'No hay miembros registrados'}
                    </Text>
                  </View>
                ) : (
                  members.map(renderMemberCard)
                )}
              </>
            ) : (
              <>
                {memberships.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons
                      name="card-membership"
                      size={64}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.emptyText}>No hay membresías registradas</Text>
                  </View>
                ) : (
                  memberships.map(renderMembershipCard)
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Membership Modal */}
      <Modal
        visible={showMembershipModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMembershipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {membershipForm.id_membresia ? 'Editar Membresía' : 'Nueva Membresía'}
              </Text>
              <TouchableOpacity onPress={() => setShowMembershipModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.membershipMemberName}>{selectedMember?.nombre}</Text>

              <Text style={styles.inputLabel}>Tipo de Plan</Text>
              <View style={styles.planButtons}>
                {['Mensual', 'Trimestral', 'Semestral', 'Anual'].map((plan) => (
                  <TouchableOpacity
                    key={plan}
                    style={[
                      styles.planButton,
                      membershipForm.tipo_plan === plan && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                    onPress={() => {
                      const endStr = computeEndDate(membershipForm.fecha_inicio, plan);
                      setMembershipForm({ ...membershipForm, tipo_plan: plan, fecha_fin: endStr });
                    }}
                  >
                    <Text
                      style={[
                        styles.planButtonText,
                        membershipForm.tipo_plan === plan && {
                          color: theme.textInverse,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {plan}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Fecha de Inicio</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <MaterialIcons name="calendar-today" size={20} color={theme.textSecondary} />
                <Text
                  style={[
                    styles.datePickerText,
                    !membershipForm.fecha_inicio && styles.datePickerPlaceholder,
                  ]}
                >
                  {formatDateDisplay(membershipForm.fecha_inicio)}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={theme.textSecondary} />
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={selectedStartDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartDateChange}
                  textColor={theme.textPrimary}
                />
              )}

              <Text style={styles.inputLabel}>Fecha de Fin</Text>
              <TextInput
                style={styles.input}
                value={membershipForm.fecha_fin}
                editable={false}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
              />

              <Text style={styles.inputLabel}>Estado</Text>
              <View style={styles.planButtons}>
                {['Activa', 'Inactiva'].map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    style={[
                      styles.planButton,
                      membershipForm.estado === estado && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                    onPress={() => setMembershipForm({ ...membershipForm, estado })}
                  >
                    <Text
                      style={[
                        styles.planButtonText,
                        membershipForm.estado === estado && {
                          color: theme.textInverse,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveMembership}
              >
                <Text style={styles.saveButtonText}>
                  {membershipForm.id_membresia ? 'Actualizar' : 'Crear'} Membresía
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      paddingTop: 40,
      paddingBottom: SPACING.md,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.md,
      marginBottom: SPACING.md,
    },
    backButton: {
      padding: SPACING.sm,
    },
    headerTitle: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: theme.textInverse,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: SPACING.borderRadius,
      paddingHorizontal: SPACING.md,
      marginHorizontal: SPACING.md,
      marginTop: SPACING.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textInverse,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      gap: SPACING.sm,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
      padding: SPACING.md,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.xxxl,
    },
    loadingText: {
      marginTop: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.xxxl,
    },
    emptyText: {
      marginTop: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: SPACING.borderRadius,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: SPACING.xs,
    },
    memberDni: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: SPACING.xs,
    },
    memberDate: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: theme.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: SPACING.borderRadius / 2,
    },
    statusText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: theme.textInverse,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    },
    cardActions: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.borderRadius / 2,
      gap: SPACING.xs,
    },
    actionButtonText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: theme.textInverse,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
      borderTopLeftRadius: SPACING.borderRadius * 2,
      borderTopRightRadius: SPACING.borderRadius * 2,
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
    modalBody: {
      padding: SPACING.md,
    },
    membershipMemberName: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    inputLabel: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: SPACING.xs,
      marginTop: SPACING.sm,
    },
    input: {
      backgroundColor: theme.background,
      borderRadius: SPACING.borderRadius,
      padding: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    planButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    planButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.borderRadius / 2,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    planButtonText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: theme.textPrimary,
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderRadius: SPACING.borderRadius,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    datePickerText: {
      flex: 1,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textPrimary,
    },
    datePickerPlaceholder: {
      color: theme.textSecondary,
    },
    saveButton: {
      marginTop: SPACING.xl,
      marginBottom: SPACING.md,
      paddingVertical: SPACING.md,
      borderRadius: SPACING.borderRadius,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      color: theme.textInverse,
    },
  });
