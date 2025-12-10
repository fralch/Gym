import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SPACING, TYPOGRAPHY } from '../constants';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import registroService from '../services/registroService';
import Button from '../components/ui/Button';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1)); // Default to Jan 1, 2000
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    fecha_nacimiento: '',
    genero: '',
    celular: '',
  });
  const [successVisible, setSuccessVisible] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android

    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      updateField('fecha_nacimiento', formattedDate);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Seleccionar fecha';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!formData.dni.trim()) {
      Alert.alert('Error', 'El DNI es requerido');
      return false;
    }
    if (!formData.fecha_nacimiento.trim()) {
      Alert.alert('Error', 'La fecha de nacimiento es requerida');
      return false;
    }
    if (!formData.genero) {
      Alert.alert('Error', 'El género es requerido');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const memberData = {
        nombre: formData.nombre.trim(),
        dni: formData.dni.trim(),
        fecha_nacimiento: formData.fecha_nacimiento.trim(),
        genero: formData.genero,
        celular: formData.celular.trim() || null,
        estado: 'Activo',
        fecha_registro: new Date().toISOString().split('T')[0], // Today's date
      };

      const response = await registroService.register(memberData);
      
      // Show success message
      setCreatedUser(response.data);
      setSuccessVisible(true);
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'No se pudo crear el usuario';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessVisible(false);
    navigation.navigate('Login');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.introText}>
          Ingresa tus datos para registrarte en el gimnasio.
        </Text>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor={theme.textSecondary}
              value={formData.nombre}
              onChangeText={(value) => updateField('nombre', value)}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* DNI */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DNI *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="badge" size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ej: 12345678"
              placeholderTextColor={theme.textSecondary}
              value={formData.dni}
              onChangeText={(value) => updateField('dni', value)}
              editable={!loading}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
        </View>

        {/* Fecha de Nacimiento */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Nacimiento *</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <MaterialIcons name="calendar-today" size={20} color={theme.textSecondary} />
            <Text
              style={[
                styles.datePickerText,
                !formData.fecha_nacimiento && styles.datePickerPlaceholder,
              ]}
            >
              {formatDateDisplay(formData.fecha_nacimiento)}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor={theme.textPrimary}
            />
          )}
        </View>

        {/* Género */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Género *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.genero === 'M' && styles.genderButtonActive,
              ]}
              onPress={() => updateField('genero', 'M')}
              disabled={loading}
            >
              <MaterialIcons
                name="male"
                size={20}
                color={formData.genero === 'M' ? theme.textInverse : theme.textSecondary}
              />
              <Text
                style={[
                  styles.genderButtonText,
                  formData.genero === 'M' && styles.genderButtonTextActive,
                ]}
              >
                Masculino
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.genero === 'F' && styles.genderButtonActive,
              ]}
              onPress={() => updateField('genero', 'F')}
              disabled={loading}
            >
              <MaterialIcons
                name="female"
                size={20}
                color={formData.genero === 'F' ? theme.textInverse : theme.textSecondary}
              />
              <Text
                style={[
                  styles.genderButtonText,
                  formData.genero === 'F' && styles.genderButtonTextActive,
                ]}
              >
                Femenino
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Celular */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="smartphone" size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="987654321"
              placeholderTextColor={theme.textSecondary}
              value={formData.celular}
              onChangeText={(value) => updateField('celular', value)}
              editable={!loading}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Text style={styles.requiredNote}>* Campos obligatorios</Text>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.textInverse} />
          ) : (
            <Text style={styles.submitButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal (reused logic but simple implementation) */}
      {successVisible && (
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={48} color={theme.textInverse} />
            </View>
            <Text style={styles.successTitle}>¡Registro Exitoso!</Text>
            <Text style={styles.successSubtitle}>Usuario creado correctamente</Text>
            {createdUser?.nombre ? (
              <Text style={styles.successDetail}>{createdUser.nombre}</Text>
            ) : null}
            <View style={styles.successActions}>
              <Button title="Ir a Iniciar Sesión" onPress={handleSuccessConfirm} style={styles.successButton} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : SPACING.md,
    },
    backButton: {
      padding: SPACING.xs,
    },
    headerTitle: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: theme.textInverse,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    introText: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
      marginBottom: SPACING.xl,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: SPACING.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: SPACING.borderRadius,
      paddingHorizontal: SPACING.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textPrimary,
    },
    genderContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    genderButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.cardBackground,
      borderRadius: SPACING.borderRadius,
      borderWidth: 1,
      borderColor: theme.border,
      gap: SPACING.xs,
    },
    genderButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    genderButtonText: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    genderButtonTextActive: {
      color: theme.textInverse,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
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
    requiredNote: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: theme.textSecondary,
      marginTop: SPACING.sm,
      marginBottom: SPACING.xl,
      fontStyle: 'italic',
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: SPACING.md,
      borderRadius: SPACING.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: SPACING.xxxl,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: theme.textInverse,
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    successContainer: {
      width: '86%',
      backgroundColor: theme.background,
      borderRadius: 16,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    successIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.success,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    successTitle: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: theme.textPrimary,
      marginBottom: SPACING.xs,
    },
    successSubtitle: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: theme.textSecondary,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    successDetail: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: SPACING.lg,
    },
    successActions: {
      width: '100%',
    },
    successButton: {
      width: '100%',
    },
  });
