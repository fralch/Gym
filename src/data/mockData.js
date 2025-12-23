
// Datos de ejemplo para las visualizaciones de estadísticas

// Historial de asistencia para el gráfico de barras
// Simulamos los últimos 7 días. 1 = Asistió, 0 = No asistió
export const attendanceData = {
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  datasets: [
    {
      data: [1, 1, 0, 1, 1, 0, 1],
    },
  ],
};


// Función para generar datos de trabajo muscular con colores del tema
// Representa el porcentaje de enfoque en cada grupo muscular
export const getMuscleFocusData = (theme) => [
  {
    name: "Pecho",
    population: 25,
    color: theme.primary,
    legendFontColor: theme.textSecondary,
    legendFontSize: 15,
  },
  {
    name: "Espalda",
    population: 20,
    color: theme.accent,
    legendFontColor: theme.textSecondary,
    legendFontSize: 15,
  },
  {
    name: "Pierna",
    population: 30,
    color: theme.success,
    legendFontColor: theme.textSecondary,
    legendFontSize: 15,
  },
  {
    name: "Hombro",
    population: 15,
    color: theme.warning,
    legendFontColor: theme.textSecondary,
    legendFontSize: 15,
  },
  {
    name: "Brazo",
    population: 10,
    color: theme.buttonSecondary,
    legendFontColor: theme.textSecondary,
    legendFontSize: 15,
  },
];
