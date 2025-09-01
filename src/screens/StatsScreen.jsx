
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { attendanceData, getMuscleFocusData } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';
import { useThemedStyles } from '../hooks/useTheme';
import Card from '../components/ui/Card';
import { TYPOGRAPHY, SPACING } from '../constants';

const screenWidth = Dimensions.get("window").width;

const chartConfig = (theme) => ({
  backgroundColor: theme.cardBackground,
  backgroundGradientFrom: theme.cardBackground,
  backgroundGradientTo: theme.cardBackground,
  decimalPlaces: 0,
  color: (opacity = 1) => theme.textPrimary,
  labelColor: (opacity = 1) => theme.textSecondary,
  style: {
    borderRadius: SPACING.borderRadius,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: theme.primary,
  },
});

const StatsScreen = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const muscleFocusData = getMuscleFocusData(theme);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
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
                <MaterialIcons name="fitness-center" size={28} color={theme.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Esta Semana</Text>
                <Text style={styles.statChange}>+2 vs anterior</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="trending-up" size={28} color={theme.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>71%</Text>
                <Text style={styles.statLabel}>Asistencia</Text>
                <Text style={[styles.statChange, { color: theme.success }]}>↗ 12% mejora</Text>
              </View>
            </Card>
          </View>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="local-fire-department" size={28} color={theme.warning} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Días Activo</Text>
                <Text style={styles.statChange}>Racha actual</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="timer" size={28} color={theme.accent || theme.secondary} />
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
          <Card style={styles.card}>
            <View style={styles.chartHeader}>
              <View style={styles.chartHeaderLeft}>
                <MaterialIcons name="show-chart" size={24} color={theme.primary} />
                <View style={styles.chartHeaderText}>
                  <Text style={styles.chartTitle}>Progreso de Entrenamiento</Text>
                  <Text style={styles.chartSubtitle}>Últimos 7 días • Sesiones completadas</Text>
                </View>
              </View>
              <View style={styles.chartHeaderRight}>
                <View style={styles.trendIndicator}>
                  <MaterialIcons name="trending-up" size={16} color={theme.success} />
                  <Text style={[styles.trendText, { color: theme.success }]}>+15%</Text>
                </View>
              </View>
            </View>
            <LineChart
              data={attendanceData}
              width={screenWidth - SPACING.lg * 4}
              height={240}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1}
              fromZero={true}
              segments={1}
              chartConfig={{
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
                  strokeWidth: "3",
                  stroke: theme.primary,
                  fill: theme.cardBackground
                },
                propsForBackgroundLines: {
                  strokeDasharray: "5,5",
                  stroke: theme.borderLight,
                  strokeWidth: 1,
                },
                fillShadowGradient: theme.primary,
                fillShadowGradientOpacity: 0.1,
              }}
              bezier
              style={styles.chart}
              withDots={true}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={true}
              withHorizontalLines={true}
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.chartHeader}>
              <View style={styles.chartHeaderLeft}>
                <MaterialIcons name="donut-small" size={24} color={theme.primary} />
                <View style={styles.chartHeaderText}>
                  <Text style={styles.chartTitle}>Distribución de Entrenamientos</Text>
                  <Text style={styles.chartSubtitle}>Grupos musculares • Últimas 4 semanas</Text>
                </View>
              </View>
            </View>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={muscleFocusData}
                width={screenWidth - SPACING.lg * 4}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => theme.textPrimary,
                  labelColor: (opacity = 1) => theme.textPrimary,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                center={[0, 0]}
                hasLegend={false}
                absolute
              />
              <View style={styles.legendContainer}>
                {muscleFocusData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name}</Text>
                    <Text style={styles.legendPercentage}>{item.population}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryActionButton} onPress={() => navigation.navigate('QrScanner')}>
            <View style={styles.actionButtonContent}>
              <MaterialIcons name="qr-code-scanner" size={24} color={theme.textInverse} />
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonTitle}>Registrar Sesión</Text>
                <Text style={styles.actionButtonSubtitle}>Escanear código QR</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={theme.textInverse} />
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <MaterialIcons name="calendar-today" size={20} color={theme.primary} />
              <Text style={styles.secondaryActionText}>Historial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <MaterialIcons name="insights" size={20} color={theme.primary} />
              <Text style={styles.secondaryActionText}>Análisis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <MaterialIcons name="share" size={20} color={theme.primary} />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
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
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: SPACING.md,
  },
  quickStatsSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
    lineHeight: TYPOGRAPHY.fontSize.xxl * 1.2,
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
    marginTop: 2,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  chartHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chartHeaderRight: {
    alignItems: 'flex-end',
  },
  chartHeaderText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.borderRadius,
  },
  trendText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: 4,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: SPACING.md,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  legendText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: theme.textPrimary,
  },
  legendPercentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: theme.textSecondary,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: theme.textPrimary,
  },
  chartSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: theme.textSecondary,
    marginTop: SPACING.xs,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: SPACING.borderRadius,
  },
  actionContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  primaryActionButton: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.borderRadius + 4,
    marginBottom: SPACING.md,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButtonTextContainer: {
    marginLeft: SPACING.md,
  },
  actionButtonTitle: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    lineHeight: TYPOGRAPHY.fontSize.md * 1.2,
  },
  actionButtonSubtitle: {
    color: theme.textInverse + 'CC',
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    marginTop: 2,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: SPACING.borderRadius,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  secondaryActionText: {
    color: theme.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
});

export default StatsScreen;
