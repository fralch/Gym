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
      // Try public registration endpoint first
      const response = await publicApi.post('/gimnasio/registro', memberData);
      return response.data;
    } catch (error) {
      // If public endpoint doesn't exist, try the regular miembros endpoint
      // (This will work if the backend allows public creation)
      if (error.response?.status === 404) {
        try {
          const response = await publicApi.post('/gimnasio/miembros', memberData);
          return response.data;
        } catch (fallbackError) {
          console.error('Error registering member (fallback):', fallbackError.response?.data || fallbackError.message);
          throw fallbackError;
        }
      }
      console.error('Error registering member:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new RegistroService();
