import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Button, Card } from '../ui';

export default function PermissionsRequest({ hasPermission }) {
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <MaterialIcons 
            name="camera" 
            size={64} 
            color={COLORS.accent} 
            style={styles.icon}
          />
          <Text style={styles.title}>Solicitando permisos</Text>
          <Text style={styles.description}>
            Se requiere acceso a la cámara para escanear códigos QR
          </Text>
        </Card>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <MaterialIcons 
            name="camera-alt" 
            size={64} 
            color={COLORS.error} 
            style={styles.icon}
          />
          <Text style={styles.title}>Sin acceso a la cámara</Text>
          <Text style={styles.description}>
            Para usar el escáner QR, necesitas permitir el acceso a la cámara en la configuración de la app
          </Text>
          <Button
            title="Configurar permisos"
            variant="outline"
            style={styles.button}
            onPress={() => {
              // TODO: Implement settings navigation
            }}
          />
        </Card>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.containerPadding,
  },
  card: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.lg,
  },
  button: {
    width: '100%',
  },
});