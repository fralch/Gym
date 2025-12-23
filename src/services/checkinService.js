import api from './api';

/**
 * Check-in Service
 * Handles QR code check-in functionality
 */
class CheckinService {
  /**
   * Mark attendance using DNI (new endpoint)
   * @param {string} dni - User DNI
   * @returns {Promise<object>} - Check-in response
   *
   * Response codes:
   * - 200: Success (new check-in)
   * - 400: Invalid data
   * - 500: Server error
   */
  async marcarAsistencia(dni) {
    try {
      // Get current date and time
      const now = new Date();
      const fecha_asistencia = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const hora_entrada = now.toTimeString().split(' ')[0]; // HH:MM:SS

      const response = await api.post('/gimnasio/asistencias', {
        dni: dni,
        fecha_asistencia: fecha_asistencia,
        hora_entrada: hora_entrada
      });

      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          throw new Error(data.error || 'Datos inválidos. Verifica el DNI.');
        }

        if (status === 404) {
          throw new Error('Usuario no encontrado. Verifica el DNI.');
        }

        if (status === 403) {
          if (data.error === 'Membresía inactiva') {
            throw new Error('Tu membresía está inactiva. Por favor renueva tu membresía.');
          }
          throw new Error(data.error || 'Acceso denegado.');
        }

        throw new Error(data.error || 'Error al marcar asistencia.');
      }

      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Mark attendance using QR code (legacy endpoint)
   * @param {string} qrToken - QR token to validate (e.g., "GYM_TOKEN_2025")
   * @returns {Promise<object>} - Check-in response
   *
   * Response codes:
   * - 200: Success (new check-in or already checked in today)
   * - 401: Not authenticated
   * - 403: Invalid QR token or inactive membership
   */
  async marcarAsistenciaConQR(qrToken) {
    try {
      const response = await api.post('/gimnasio/marcar-asistencia', {
        qr_token: qrToken
      });
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          throw new Error('No autenticado. Por favor inicia sesión.');
        }

        if (status === 403) {
          if (data.error === 'QR inválido') {
            throw new Error('Código QR inválido. Por favor intenta de nuevo.');
          }
          if (data.error === 'Membresía inactiva') {
            throw new Error('Tu membresía está inactiva. Por favor renueva tu membresía.');
          }
          throw new Error(data.error || 'Acceso denegado.');
        }

        throw new Error(data.error || 'Error al marcar asistencia.');
      }

      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * Check if user has already checked in today
   * @returns {Promise<boolean>} - True if already checked in today
   */
  async hasCheckedInToday() {
    try {
      const response = await api.get('/gimnasio/asistencias', {
        params: {
          fecha_asistencia: new Date().toISOString().split('T')[0]
        }
      });

      if (response.data.success && response.data.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking today attendance:', error);
      return false;
    }
  }
}

export default new CheckinService();
