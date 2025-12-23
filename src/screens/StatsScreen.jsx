
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useThemedStyles } from '../hooks/useTheme';
import Card from '../components/ui/Card';
import { TYPOGRAPHY, SPACING } from '../constants';
import { authService, asistenciasService } from '../services';

const screenWidth = Dimensions.get("window").width;

const chartConfig = (theme) => ({
  backgroundColor: theme.cardBackground,
  backgroundGradientFrom: theme.cardBackground,
  backgroundGradientTo: theme.cardBackground,
  decimalPlaces: 0,
  color: (opacity = 1) => `${theme.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  labelColor: (opacity = 1) => theme.textSecondary,
  style: {
    borderRadius: SPACING.borderRadius,
  },
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: theme.primary,
    fill: theme.cardBackground,
  },
  propsForBackgroundLines: {
    strokeDasharray: "4",
    stroke: theme.border,
    strokeWidth: 1,
  },
  fillShadowGradient: theme.primary,
  fillShadowGradientOpacity: 0.1,
});

const StatsScreen = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      // Get stored user data
      const storedUserData = await authService.getUserData();

      if (storedUserData && storedUserData.id_usuario) {
        // Fetch all attendance records for the user
        const response = await asistenciasService.getByUser(storedUserData.id_usuario);

        if (response.success && response.data) {
          const attendances = response.data;

          // Process attendance data for the last 7 days
          const last7Days = getLast7Days();
          const attendanceByDate = {};

          attendances.forEach(record => {
            const date = record.fecha_asistencia;
            attendanceByDate[date] = true;
          });

          // Create chart data
          const chartData = last7Days.map(day => ({
            date: day.date,
            label: day.label,
            attended: attendanceByDate[day.date] ? 1 : 0
          }));

          setAttendanceData({
            labels: chartData.map(d => d.label),
            datasets: [{ data: chartData.map(d => d.attended) }]
          });

          // Calculate total attendance count
          setTotalAttendance(attendances.length);

          // Calculate current streak
          const streak = calculateStreak(attendanceByDate);
          setCurrentStreak(streak);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayLabel = dayLabels[date.getDay()];

      days.push({
        date: dateString,
        label: dayLabel
      });
    }

    return days;
  };

  const calculateStreak = (attendanceByDate) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      if (attendanceByDate[dateString]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const weeklyCount = useMemo(() => {
    const data = attendanceData?.datasets?.[0]?.data || [];
    return data.reduce((sum, v) => sum + (v || 0), 0);
  }, [attendanceData]);

  const weekLength = useMemo(() => attendanceData?.labels?.length || 0, [attendanceData]);
  const weeklyPercent = useMemo(() => (weekLength ? Math.round((weeklyCount / weekLength) * 100) : 0), [weekLength, weeklyCount]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Platform.OS === 'android' ? theme.primary : 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={isDarkMode ? "light-mode" : "dark-mode"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Cards */}
        <View style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="fitness-center" size={24} color={theme.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{weeklyCount}</Text>
                <Text style={styles.statLabel}>Esta Semana</Text>
                <Text style={styles.statChange}>+2 vs anterior</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="trending-up" size={24} color={theme.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{weeklyPercent}%</Text>
                <Text style={styles.statLabel}>Asistencia</Text>
                <Text style={[styles.statChange, { color: theme.success }]}>↗ 12% mejora</Text>
              </View>
            </Card>
          </View>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="local-fire-department" size={24} color={theme.warning} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{loading ? '...' : currentStreak}</Text>
                <Text style={styles.statLabel}>Días Activo</Text>
                <Text style={styles.statChange}>Racha actual</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="timer" size={24} color={theme.accent || theme.secondary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>2.5h</Text>
                <Text style={styles.statLabel}>Promedio</Text>
                <Text style={styles.statChange}>Por sesión</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Tendencias</Text>
          {loading ? (
            <Card style={[styles.card, { alignItems: 'center', justifyContent: 'center', height: 300 }]}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.statLabel, { marginTop: 16 }]}>Cargando estadísticas...</Text>
            </Card>
          ) : (
            <Card style={styles.card}>
            <View style={styles.chartHeader}>
              <View style={styles.chartHeaderLeft}>
                <MaterialIcons name="show-chart" size={20} color={theme.primary} />
                <View style={styles.chartHeaderText}>
                  <Text style={styles.chartTitle}>Progreso de Entrenamiento</Text>
                  <Text style={styles.chartSubtitle}>Últimos {weekLength} días</Text>
                </View>
              </View>
              <View style={styles.chartHeaderRight}>
                <View style={styles.badge}>
                  <MaterialIcons name="schedule" size={16} color={theme.primary} />
                  <Text style={styles.badgeText}>{weeklyPercent}% semanal</Text>
                </View>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={attendanceData}
                width={screenWidth - SPACING.lg * 2 - SPACING.md * 2}
                height={220}
                yAxisInterval={1}
                fromZero={true}
                chartConfig={chartConfig(theme)}
                bezier
                style={styles.chart}
                formatYLabel={(v) => (v === '1' ? 'Sí' : 'No')}
                onDataPointClick={({ value, x, y, index }) => {
                  setTooltip({ value, x, y, index });
                  setTimeout(() => setTooltip(null), 2000);
                }}
              />
              {tooltip && (
                <View
                  style={[
                    styles.chartTooltip,
                    {
                      left: Math.max(tooltip.x - 40, 8),
                      top: Math.max(tooltip.y - 50, 8),
                    },
                  ]}
                >
                  <Text style={styles.chartTooltipTitle}>
                    {attendanceData.labels?.[tooltip.index] || ''}
                  </Text>
                  <Text
                    style={[
                      styles.chartTooltipValue,
                      { color: tooltip.value === 1 ? theme.success : theme.error },
                    ]}
                  >
                    {tooltip.value === 1 ? 'Asistió' : 'No asistió'}
                  </Text>
                </View>
              )}
            </View>
          </Card>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Ver historial"
              activeOpacity={0.8}
            >
              <View style={styles.secondaryActionIcon}>
                <MaterialIcons name="calendar-today" size={24} color={theme.primary} />
              </View>
              <Text style={styles.secondaryActionText}>Historial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Ver análisis"
              activeOpacity={0.8}
            >
              <View style={styles.secondaryActionIcon}>
                <MaterialIcons name="insights" size={24} color={theme.primary} />
              </View>
              <Text style={styles.secondaryActionText}>Análisis</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Compartir estadísticas"
              activeOpacity={0.8}
            >
              <View style={styles.secondaryActionIcon}>
                <MaterialIcons name="share" size={24} color={theme.primary} />
              </View>
              <Text style={styles.secondaryActionText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: theme.primary,
  },
  headerButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  quickStatsSection: {
    paddingTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg - SPACING.xs,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    borderRadius: SPACING.borderRadius,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statChange: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: theme.textTertiary || theme.textSecondary,
    marginTop: 4,
  },
  statsSection: {
    paddingTop: SPACING.lg,
  },
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: SPACING.borderRadius,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  chartHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartHeaderText: {
    marginLeft: SPACING.sm,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: theme.textPrimary,
  },
  chartSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.textSecondary,
    marginTop: 2,
  },
  chartHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: theme.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: 6,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  chart: {
    marginTop: SPACING.sm,
    borderRadius: SPACING.borderRadius,
  },
  chartTooltip: {
    position: 'absolute',
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  chartTooltipTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  chartTooltipValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: theme.textPrimary,
  },
  actionContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  secondaryActionButton: {
    alignItems: 'center',
  },
  secondaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  secondaryActionText: {
    color: theme.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default StatsScreen;
