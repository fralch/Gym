import publicApi from './publicApi';

/**
 * Registro Service
 * Handles public user registration without authentication
 */
class RegistroService {
  /**
   * Register a new member (public endpoint)
   * @param {object} memberData - Member information
   * @param {string} memberData.nombre - Full name
   * @param {string} memberData.dni - National ID
   * @param {string} memberData.fecha_nacimiento - Birth date (YYYY-MM-DD)
   * @param {string} memberData.genero - Gender (M/F)
   * @param {string|null} memberData.telefono - Phone number
   * @returns {Promise<object>} - Created member
   */
  async register(memberData) {
    try {
      // Use the correct endpoint according to API documentation
      // Note: /gimnasio/registro does not exist in the API
      const response = await publicApi.post('/gimnasio/miembros', memberData);
      return response.data;
    } catch (error) {
      console.error('Error registering member:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new RegistroService();
