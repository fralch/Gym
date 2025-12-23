import api from './api';

/**
 * Asistencias (Attendance) Service
 * Handles all attendance-related API calls
 */
class AsistenciasService {
  /**
   * Get list of attendance records
   * @param {object} filters - Optional filters
   * @param {number} filters.id_usuario - Filter by member ID
   * @param {string} filters.fecha_asistencia - Filter by date (YYYY-MM-DD)
   * @returns {Promise<object>} - List of attendance records
   */
  async getAll(filters = {}) {
    try {
      const response = await api.get('/gimnasio/asistencias', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a specific attendance record by ID
   * @param {number} id_asistencia - Attendance ID
   * @returns {Promise<object>} - Attendance details
   */
  async getById(id_asistencia) {
    try {
      const response = await api.get(`/gimnasio/asistencias/${id_asistencia}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a new attendance record (manual)
   * @param {object} attendanceData - Attendance information
   * @param {number} attendanceData.id_usuario - Member ID
   * @param {string} attendanceData.fecha_asistencia - Attendance date (YYYY-MM-DD)
   * @param {string} attendanceData.hora_entrada - Entry time (HH:mm:ss)
   * @returns {Promise<object>} - Created attendance record
   */
  async create(attendanceData) {
    try {
      const response = await api.post('/gimnasio/asistencias', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update an existing attendance record
   * @param {number} id_asistencia - Attendance ID
   * @param {object} attendanceData - Attendance information to update
   * @returns {Promise<object>} - Updated attendance record
   */
  async update(id_asistencia, attendanceData) {
    try {
      const response = await api.put(`/gimnasio/asistencias/${id_asistencia}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete an attendance record
   * @param {number} id_asistencia - Attendance ID
   * @returns {Promise<object>} - Success response
   */
  async delete(id_asistencia) {
    try {
      const response = await api.delete(`/gimnasio/asistencias/${id_asistencia}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get attendance records for a specific user
   * @param {number} id_usuario - Member ID
   * @param {number} limit - Optional limit of records to fetch
   * @returns {Promise<object>} - List of attendance records
   */
  async getByUser(id_usuario, limit = null) {
    try {
      const response = await this.getAll({ id_usuario });
      if (limit && response.success) {
        return {
          ...response,
          data: response.data.slice(0, limit)
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching user attendance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get today's attendance for a user
   * @param {number} id_usuario - Member ID
   * @returns {Promise<object|null>} - Today's attendance or null
   */
  async getTodayAttendance(id_usuario) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await this.getAll({ id_usuario, fecha_asistencia: today });
      if (response.success && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching today attendance:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AsistenciasService();
