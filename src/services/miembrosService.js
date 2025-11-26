import api from './api';

/**
 * Miembros (Members) Service
 * Handles all member-related API calls
 */
class MiembrosService {
  /**
   * Get list of members
   * @param {string} search - Optional search term (filters by nombre or dni)
   * @returns {Promise<object>} - List of members
   */
  async getAll(search = '') {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/gimnasio/miembros', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a specific member by ID
   * @param {number} id_usuario - Member ID
   * @returns {Promise<object>} - Member details with relations (membresias, asistencias, metas)
   */
  async getById(id_usuario) {
    try {
      const response = await api.get(`/gimnasio/miembros/${id_usuario}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching member:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a new member
   * @param {object} memberData - Member information
   * @param {string} memberData.nombre - Full name
   * @param {string} memberData.dni - National ID
   * @param {string} memberData.fecha_nacimiento - Birth date (YYYY-MM-DD)
   * @param {string} memberData.genero - Gender (M/F)
   * @param {string|null} memberData.foto_perfil - Profile photo URL
   * @param {string} memberData.estado - Status (Activo/Inactivo)
   * @param {string} memberData.fecha_registro - Registration date (YYYY-MM-DD)
   * @returns {Promise<object>} - Created member
   */
  async create(memberData) {
    try {
      const response = await api.post('/gimnasio/miembros', memberData);
      return response.data;
    } catch (error) {
      console.error('Error creating member:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update an existing member
   * @param {number} id_usuario - Member ID
   * @param {object} memberData - Member information to update
   * @returns {Promise<object>} - Updated member
   */
  async update(id_usuario, memberData) {
    try {
      const response = await api.put(`/gimnasio/miembros/${id_usuario}`, memberData);
      return response.data;
    } catch (error) {
      console.error('Error updating member:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete a member
   * @param {number} id_usuario - Member ID
   * @returns {Promise<object>} - Success response
   */
  async delete(id_usuario) {
    try {
      const response = await api.delete(`/gimnasio/miembros/${id_usuario}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting member:', error.response?.data || error.message);
      throw error;
    }
  }

  async hasPhotoByDni(dni) {
    try {
      const response = await api.get(`/gimnasio/usuario-tiene-foto/${dni}`);
      return response.data;
    } catch (error) {
      console.error('Error checking user photo:', error.response?.data || error.message);
      throw error;
    }
  }

  async uploadProfilePhoto(id_usuario, formData) {
    try {
      console.log('miembrosService - Starting upload for user:', id_usuario);

      // Special configuration for file upload in React Native
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      };

      console.log('miembrosService - Request config:', config);

      const response = await api.post(
        `/gimnasio/miembros/${id_usuario}/foto-perfil`,
        formData,
        config
      );

      console.log('miembrosService - Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('miembrosService - Error uploading profile photo');
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}

export default new MiembrosService();
