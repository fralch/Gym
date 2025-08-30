
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
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
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialIcons name="fitness-center" size={24} color={theme.primary} />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Esta Semana</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="trending-up" size={24} color={theme.success} />
              <Text style={styles.statNumber}>71%</Text>
              <Text style={styles.statLabel}>Asistencia</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={24} color={theme.warning} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Días Activo</Text>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.statsSection}>
          <Card style={styles.card}>
            <View style={styles.chartHeader}>
              <MaterialIcons name="bar-chart" size={24} color={theme.primary} />
              <View style={styles.chartHeaderText}>
                <Text style={styles.chartTitle}>Historial de Asistencia</Text>
                <Text style={styles.chartSubtitle}>Últimos 7 días</Text>
              </View>
            </View>
            <BarChart
              style={styles.chart}
              data={attendanceData}
              width={screenWidth - SPACING.lg * 2 - SPACING.lg * 2}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig(theme)}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.chartHeader}>
              <MaterialIcons name="pie-chart" size={24} color={theme.primary} />
              <View style={styles.chartHeaderText}>
                <Text style={styles.chartTitle}>Foco Muscular</Text>
                <Text style={styles.chartSubtitle}>Distribución de entrenamiento</Text>
              </View>
            </View>
            <PieChart
              data={muscleFocusData}
              width={screenWidth - SPACING.lg * 2 - SPACING.lg * 2}
              height={220}
              chartConfig={chartConfig(theme)}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 10]}
              absolute
            />
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('QrScanner')}>
            <MaterialIcons name="qr-code-scanner" size={24} color={theme.textInverse} />
            <Text style={styles.actionButtonText}>Escanear Código QR</Text>
          </TouchableOpacity>
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
  quickStatsSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: theme.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: theme.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
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
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  chartHeaderText: {
    marginLeft: SPACING.md,
    flex: 1,
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
  actionButton: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.borderRadius,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginLeft: SPACING.sm,
  },
});

export default StatsScreen;
